import { Outlet } from 'react-router-dom';
import { PublicFooter } from '@/components/public/PublicFooter';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicWebsiteProvider } from '@/features/website/context/PublicWebsiteContext';

export const PublicLayout = () => (
  <PublicWebsiteProvider>
    <div className="min-h-screen overflow-x-hidden bg-white text-jcst-charcoal">
      <PublicHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  </PublicWebsiteProvider>
);
