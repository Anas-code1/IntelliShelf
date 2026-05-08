import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { LibrarianDashboard } from './components/LibrarianDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import { BookManagement } from './components/BookManagement';
import { MemberManagement } from './components/MemberManagement';
import { TransactionsPage } from './components/TransactionsPage';
import { ReportsPage } from './components/ReportsPage';
import { AIRecommendationsPage } from './components/AIRecommendationsPage';

type UserRole = 'admin' | 'librarian' | 'member';
type View = 'dashboard' | 'books' | 'members' | 'transactions' | 'reports' | 'recommendations';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [userName, setUserName] = useState('');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUserRole(parsed.role);
      setUserName(parsed.name);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserRole('member');
    setUserName('');
    setActiveView('dashboard');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view as View);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (userRole === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'books':
          return <BookManagement />;
        case 'members':
          return <MemberManagement />;
        case 'transactions':
          return <TransactionsPage />;
        case 'reports':
          return <ReportsPage />;
        default:
          return <AdminDashboard />;
      }
    }

    if (userRole === 'librarian') {
      switch (activeView) {
        case 'dashboard':
          return <LibrarianDashboard />;
        case 'books':
          return <BookManagement />;
        case 'transactions':
          return <TransactionsPage />;
        default:
          return <LibrarianDashboard />;
      }
    }

    if (userRole === 'member') {
      switch (activeView) {
        case 'dashboard':
          return <MemberDashboard />;
        case 'recommendations':
          return <AIRecommendationsPage />;
        case 'books':
          return <BookManagement />;
        default:
          return <MemberDashboard />;
      }
    }

    return <MemberDashboard />;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        userRole={userRole}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={toggleMobileSidebar}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar
          onMobileMenuToggle={toggleMobileSidebar}
          darkMode={darkMode}
          onDarkModeToggle={toggleDarkMode}
          userName={userName}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppContent />
    </ThemeProvider>
  );
}
