import { useState } from 'react';
import PropTypes from 'prop-types';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import Breadcrumbs from './Breadcrumbs';
import { useIsMobile } from '@/hooks/useIsMobile';

const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`hidden lg:flex ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <AppSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <AppSidebar isCollapsed={false} onToggle={toggleSidebar} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={toggleSidebar} />
        <div className="border-b bg-background px-4 py-2 lg:px-6">
          <Breadcrumbs />
        </div>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/30">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;

AppLayout.propTypes = {
  children: PropTypes.node,
};


