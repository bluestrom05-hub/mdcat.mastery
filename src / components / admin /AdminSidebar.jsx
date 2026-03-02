import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Settings,
  Crown,
  Upload,
  BarChart3,
  Stethoscope,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Admin' },
  { name: 'Subjects', icon: BookOpen, page: 'AdminSubjects' },
  { name: 'MCQs', icon: FileText, page: 'AdminMCQs' },
  { name: 'Users', icon: Users, page: 'AdminUsers' },
  { name: 'Analytics', icon: BarChart3, page: 'Admin' },
];

export default function AdminSidebar({ activePage }) {
  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-white/10 z-40 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link to={createPageUrl("Admin")} className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">MDCAT Pro</span>
            <p className="text-xs text-red-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={createPageUrl(item.page)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === item.name
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-white border border-red-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
            <Crown className="w-5 h-5 mr-3" />
            User Dashboard
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
