import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Droplets, Truck, Shield, AlertCircle } from 'lucide-react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { AppRole } from '../../backend';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const roles = [
    {
      id: AppRole.customer,
      title: 'Customer',
      description: 'Order and track water bottle deliveries',
      icon: Droplets,
      color: 'from-teal-500 to-cyan-500',
      dashboard: '/dashboard/customer',
    },
    {
      id: AppRole.salesman,
      title: 'Salesman',
      description: 'Manage deliveries and customer requests',
      icon: Truck,
      color: 'from-teal-500 to-cyan-500',
      dashboard: '/dashboard/salesman',
    },
    {
      id: AppRole.admin,
      title: 'Admin',
      description: 'Full system access and management',
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      dashboard: '/dashboard/admin',
    },
  ];

  const handleRoleSelect = async (role: AppRole) => {
    if (!name.trim()) {
      setError('Please enter your name before selecting a role');
      return;
    }

    setError(null);
    setSelectedRole(role);

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        appRole: role,
      });

      // Navigate to the correct dashboard on success
      const selectedRoleData = roles.find(r => r.id === role);
      if (selectedRoleData) {
        navigate({ to: selectedRoleData.dashboard, replace: true });
      }
    } catch (err: any) {
      // Error is already handled by the mutation's onError
      // Extract user-friendly message
      const errorMessage = err.message || 'Failed to save profile';
      if (errorMessage.includes('admin role')) {
        setError('You are not authorized to register as an admin. Please choose Customer or Salesman.');
      } else if (errorMessage.includes('Unauthorized')) {
        setError('You do not have permission to create this profile.');
      } else {
        setError('Failed to save your profile. Please try again.');
      }
      setSelectedRole(null);
    }
  };

  const isProcessing = saveProfile.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome to AquaFlow
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's set up your account
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Please enter your name to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isProcessing}
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            Choose your role
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isDisabled = isProcessing;
            
            return (
              <Card
                key={role.id}
                className={`hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
                onClick={() => !isDisabled && handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`bg-gradient-to-br ${role.color} rounded-full p-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleRoleSelect(role.id);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {isSelected && isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Setting up...
                      </>
                    ) : (
                      `Continue as ${role.title}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
