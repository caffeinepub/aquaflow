import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface AuthProfileLoadErrorScreenProps {
  error: Error | null;
}

export default function AuthProfileLoadErrorScreen({ error }: AuthProfileLoadErrorScreenProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const errorMessage = error?.message || 'An unknown error occurred';
  const sanitizedMessage = errorMessage.includes('Unauthorized') 
    ? 'You do not have permission to access this profile.'
    : errorMessage.includes('Actor not available')
    ? 'Unable to connect to the backend service.'
    : 'Failed to load your profile.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Profile Load Error</CardTitle>
          <CardDescription>
            We encountered a problem loading your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {sanitizedMessage}
            </AlertDescription>
          </Alert>

          {error && (
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {errorMessage}
              </pre>
            </details>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Loading Profile
            </Button>
            <Button
              onClick={handleLogout}
              className="w-full"
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
