import { useState } from 'react';
import { BookOpen, TrendingUp, User, Settings, ExternalLink, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: Home,
    id: 'dashboard',
    active: true
  },
  {
    title: 'Explore Courses',
    icon: ExternalLink,
    id: 'explore',
    external: true
  },
  {
    title: 'My Progress',
    icon: TrendingUp,
    id: 'progress'
  },
  {
    title: 'My Courses',
    icon: BookOpen,
    id: 'courses'
  },
  {
    title: 'Profile',
    icon: User,
    id: 'profile'
  },
  {
    title: 'Settings',
    icon: Settings,
    id: 'settings'
  }
];

export default function DashboardSidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
              {item.external && <ExternalLink className="ml-auto h-3 w-3" />}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}