import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { AppRole } from '../backend';

export default function LoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (identity && isFetched) {
      if (!userProfile) {
        // No profile - go to onboarding
        navigate({ to: '/onboarding', replace: true });
      } else {
        // Has profile - route to correct dashboard
        switch (userProfile.appRole) {
          case AppRole.customer:
            navigate({ to: '/dashboard/customer', replace: true });
            break;
          case AppRole.salesman:
            navigate({ to: '/dashboard/salesman', replace: true });
            break;
          case AppRole.admin:
            navigate({ to: '/dashboard/admin', replace: true });
            break;
          default:
            navigate({ to: '/onboarding', replace: true });
        }
      }
    }
  }, [identity, userProfile, isFetched, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="absolute inset-0 bg-[url('/assets/generated/aquaflow-header-bg.dim_1600x400.png')] bg-cover bg-center opacity-10"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-teal-100 dark:border-teal-900">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/assets/generated/aquaflow-icon.dim_256x256.png" 
                alt="AquaFlow" 
                className="h-20 w-20 rounded-full shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-2">
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome to AquaFlow
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Your trusted water supply management system
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Sign in securely with Internet Identity to access your dashboard
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Connecting...
                </>
              ) : (
                'Sign In with Internet Identity'
              )}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              New to AquaFlow? Sign in to create your account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
