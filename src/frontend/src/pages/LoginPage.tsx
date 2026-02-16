import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { AppRole } from '../backend';
import { BRANDING } from '../config/branding';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/generated/aquaflow-header-bg.dim_1600x400.png')] bg-cover bg-center opacity-5 dark:opacity-10"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-teal-100 dark:border-teal-900">
        <CardHeader className="text-center space-y-6 pb-4">
          <div className="flex justify-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center shadow-lg border border-teal-100 dark:border-teal-800">
                <img 
                  src="/assets/generated/aquaflow-icon.dim_256x256.png" 
                  alt={BRANDING.appName}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                <Droplets className="h-3 w-3" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {BRANDING.appName}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {BRANDING.tagline}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Secure login with Internet Identity
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-6 text-lg shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Connecting...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
