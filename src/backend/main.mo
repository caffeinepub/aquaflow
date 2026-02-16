import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Option "mo:core/Option";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";

actor {
  // STRUCTURE DEFINITIONS

  // Custom application roles (on top of base access control)
  public type AppRole = {
    #customer;
    #salesman;
    #admin;
  };

  public type UserProfile = {
    name : Text;
    appRole : AppRole;
  };

  module Customer {
    public type Customer = {
      principal : Principal;
      name : Text;
      address : Text;
    };

    public func compare(a : Customer, b : Customer) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // STATE MANAGEMENT
  let accessControlState = AccessControl.initState();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let customersState = Set.empty<Customer.Customer>();

  var bottleRate = 0;

  // Authorization
  include MixinAuthorization(accessControlState);

  // AUTHORIZATION HELPERS

  func getAppRole(caller : Principal) : ?AppRole {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.appRole };
      case null { null };
    };
  };

  func isCustomer(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#customer) { true };
      case _ { false };
    };
  };

  func isSalesman(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#salesman) { true };
      case _ { false };
    };
  };

  func isAppAdmin(caller : Principal) : Bool {
    switch (getAppRole(caller)) {
      case (?#admin) { true };
      case _ { false };
    };
  };

  func requireCustomer(caller : Principal) {
    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can perform this action");
    };
  };

  func requireSalesman(caller : Principal) {
    if (not isSalesman(caller) and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only salesmen can perform this action");
    };
  };

  func requireAppAdmin(caller : Principal) {
    if (not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func requireAuthenticated(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Authentication required");
    };
  };

  // Check if the principal is anonymous
  func isAnonymous(caller : Principal) : Bool {
    caller.isAnonymous();
  };

  // USER PROFILE MANAGEMENT

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (isAnonymous(caller)) { return null };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not isAppAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Block anonymous users
    if (isAnonymous(caller)) {
      Runtime.trap("Unauthorized: Anonymous users cannot create profiles");
    };

    // Check if this is a new profile or an update
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // Updating existing profile - must have user permission
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
          Runtime.trap("Unauthorized: Only users can update profiles");
        };

        // Prevent users from self-assigning or changing to admin role
        if (profile.appRole == #admin and not isAppAdmin(caller)) {
          Runtime.trap("Unauthorized: Cannot self-assign admin role");
        };
      };
      case null {
        // Creating new profile - authenticated principal can create first profile
        // but cannot self-assign admin role
        if (profile.appRole == #admin) {
          Runtime.trap("Unauthorized: Cannot self-assign admin role on profile creation");
        };
      };
    };

    userProfiles.add(caller, profile);
  };
};
