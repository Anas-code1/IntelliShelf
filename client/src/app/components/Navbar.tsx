import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Menu, User, LogOut } from 'lucide-react';
import { Button } from './Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  userName: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  darkMode,
  onDarkModeToggle,
  userName,
  onLogout
}) => {
  const [notifications] = useState([
    { id: 1, text: 'Book "The Great Gatsby" is due tomorrow', time: '2h ago' },
    { id: 2, text: 'New book recommendation available', time: '5h ago' },
    { id: 3, text: 'Fine payment reminder', time: '1d ago' }
  ]);

  return (
    <div className="h-16 border-b border-border bg-card sticky top-0 z-30 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global search hidden per user request */}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-80 bg-popover border border-border rounded-lg shadow-lg p-2 mr-4"
                sideOffset={5}
              >
                <div className="px-3 py-2 border-b border-border mb-2">
                  <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                </div>
                {notifications.map((notif) => (
                  <DropdownMenu.Item
                    key={notif.id}
                    className="px-3 py-2 rounded-md hover:bg-accent cursor-pointer outline-none"
                  >
                    <p className="text-sm text-popover-foreground">{notif.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {userName}
                </span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-48 bg-popover border border-border rounded-lg shadow-lg p-2 mr-4"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent cursor-pointer outline-none text-popover-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
};
