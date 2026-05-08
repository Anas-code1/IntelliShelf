import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole: 'admin' | 'librarian' | 'member';
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  userRole,
  isMobileOpen,
  onMobileToggle
}) => {
  const adminLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Book Management', icon: BookOpen },
    { id: 'members', label: 'Member Management', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const librarianLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'transactions', label: 'Transactions', icon: FileText }
  ];

  const memberLinks = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'books', label: 'Browse Books', icon: BookOpen }
  ];

  const links = userRole === 'admin' ? adminLinks : userRole === 'librarian' ? librarianLinks : memberLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">Smart Library</h1>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          <button onClick={onMobileToggle} className="lg:hidden">
            <X className="w-6 h-6 text-sidebar-foreground" />
          </button>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeView === link.id;
          return (
            <motion.button
              key={link.id}
              onClick={() => {
                onViewChange(link.id);
                if (isMobileOpen) onMobileToggle();
              }}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileToggle}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 w-64 h-screen z-50 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </>
  );
};
