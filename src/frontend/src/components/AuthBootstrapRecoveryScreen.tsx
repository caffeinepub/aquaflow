import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, RefreshCw, LogOut } from 'lucide-react';
import { BRANDING } from '../config/branding';

interface AuthBootstrapRecoveryScreenProps {
  onRetry: () => void;
}

export default function AuthBootstrapRecoveryScreen({ onRetry }: AuthBootstrapRecoveryScreenProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleRetry = () => {
    onRetry();
  };

  const handleClearSession = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login', replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-warning/10 rounded-full p-4">
              <Clock className="h-12 w-12 text-warning" />
            </div>
          </div>
          <CardTitle className="text-2xl">Loading Timeout</CardTitle>
          <CardDescription>
            {BRANDING.appName} is taking longer than expected to load
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="ml-2">
              The application bootstrap process has exceeded the expected time limit. This may be due to network issues or backend unavailability.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleRetry}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button
              onClick={handleClearSession}
              className="w-full"
              variant="outline"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Clear Session & Log Out
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            If the problem persists, please try again later or contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
