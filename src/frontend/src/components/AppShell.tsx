import { Outlet, useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Droplets, Home, FileText, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import NotificationsBell from './NotificationsBell';
import { BRANDING } from '../config/branding';

export default function AppShell() {
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const navigation = [
    { name: 'Dashboard', to: '/', icon: Home },
    { name: 'Reports', to: '/reports', icon: FileText },
  ];

  const NavContent = () => (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          <item.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <img 
                      src="/assets/generated/aquaflow-icon.dim_256x256.png" 
                      alt={BRANDING.appName}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {BRANDING.appName}
                  </span>
                </div>
                <NavContent />
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <img 
                  src="/assets/generated/aquaflow-icon.dim_256x256.png" 
                  alt={BRANDING.appName}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent hidden sm:inline leading-none">
                {BRANDING.appName}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <NavContent />
          </div>

          <div className="flex items-center gap-3">
            <NotificationsBell />
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="text-right">
                <p className="font-medium">{userProfile?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{userProfile?.appRole}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-teal-600" />
              <span>© {new Date().getFullYear()} {BRANDING.appName}. All rights reserved.</span>
            </div>
            <div>
              Built with <span className="text-red-500">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
