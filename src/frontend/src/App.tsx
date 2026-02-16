import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/onboarding/RoleSelectionPage';
import CustomerOnboardingPage from './pages/onboarding/CustomerOnboardingPage';
import SalesmanOnboardingPage from './pages/onboarding/SalesmanOnboardingPage';
import AdminOnboardingPage from './pages/onboarding/AdminOnboardingPage';
import CustomerDashboardPage from './pages/dashboards/CustomerDashboardPage';
import SalesmanDashboardPage from './pages/dashboards/SalesmanDashboardPage';
import AdminDashboardPage from './pages/dashboards/AdminDashboardPage';
import ReportsPage from './pages/ReportsPage';
import AppShell from './components/AppShell';
import AuthProfileLoadErrorScreen from './components/AuthProfileLoadErrorScreen';
import { Toaster } from '@/components/ui/sonner';
import { AppRole } from './backend';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, error } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  // Handle profile fetch errors
  useEffect(() => {
    if (isAuthenticated && isFetched && error) {
      // Profile fetch failed - show error screen
      console.error('Profile fetch error:', error);
    }
  }, [isAuthenticated, isFetched, error]);

  // Route authenticated users without profiles to onboarding
  useEffect(() => {
    if (isAuthenticated && isFetched && !userProfile && !error) {
      navigate({ to: '/onboarding', replace: true });
    }
  }, [isAuthenticated, isFetched, userProfile, error, navigate]);

  // Show loading only during initialization or initial profile fetch
  if (isInitializing || (isAuthenticated && profileLoading && !isFetched)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading AquaFlow...</p>
        </div>
      </div>
    );
  }

  // Show error screen if profile fetch failed
  if (isAuthenticated && isFetched && error) {
    return <AuthProfileLoadErrorScreen error={error} />;
  }

  // Show app shell if user has a profile
  if (isFetched && userProfile) {
    return <AppShell />;
  }

  return <Outlet />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/login', replace: true });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return <>{children}</>;
}

function ProfileRequiredRoute({ children }: { children: React.ReactNode }) {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && !userProfile) {
      navigate({ to: '/onboarding', replace: true });
    }
  }, [userProfile, isFetched, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return <>{children}</>;
}

function IndexComponent() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && !userProfile) {
      navigate({ to: '/onboarding', replace: true });
    }
  }, [isFetched, userProfile, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  // Use enum comparison instead of string literals
  switch (userProfile.appRole) {
    case AppRole.customer:
      return <CustomerDashboardPage />;
    case AppRole.salesman:
      return <SalesmanDashboardPage />;
    case AppRole.admin:
      return <AdminDashboardPage />;
    default:
      // Explicit error state for unknown roles
      return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unknown Role</AlertTitle>
            <AlertDescription>
              Your account has an unrecognized role. Please contact support for assistance.
            </AlertDescription>
          </Alert>
        </div>
      );
  }
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <IndexComponent />
    </ProtectedRoute>
  )
});

const roleSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: () => (
    <ProtectedRoute>
      <RoleSelectionPage />
    </ProtectedRoute>
  )
});

const customerOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding/customer',
  component: () => (
    <ProtectedRoute>
      <CustomerOnboardingPage />
    </ProtectedRoute>
  )
});

const salesmanOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding/salesman',
  component: () => (
    <ProtectedRoute>
      <SalesmanOnboardingPage />
    </ProtectedRoute>
  )
});

const adminOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding/admin',
  component: () => (
    <ProtectedRoute>
      <AdminOnboardingPage />
    </ProtectedRoute>
  )
});

const customerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/customer',
  component: () => (
    <ProtectedRoute>
      <ProfileRequiredRoute>
        <CustomerDashboardPage />
      </ProfileRequiredRoute>
    </ProtectedRoute>
  )
});

const salesmanDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/salesman',
  component: () => (
    <ProtectedRoute>
      <ProfileRequiredRoute>
        <SalesmanDashboardPage />
      </ProfileRequiredRoute>
    </ProtectedRoute>
  )
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/admin',
  component: () => (
    <ProtectedRoute>
      <ProfileRequiredRoute>
        <AdminDashboardPage />
      </ProfileRequiredRoute>
    </ProtectedRoute>
  )
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => (
    <ProtectedRoute>
      <ProfileRequiredRoute>
        <ReportsPage />
      </ProfileRequiredRoute>
    </ProtectedRoute>
  )
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  roleSelectionRoute,
  customerOnboardingRoute,
  salesmanOnboardingRoute,
  adminOnboardingRoute,
  customerDashboardRoute,
  salesmanDashboardRoute,
  adminDashboardRoute,
  reportsRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
