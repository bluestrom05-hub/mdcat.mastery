import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Users, 
  Crown, 
  Search,
  Shield,
  UserCheck,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAdmin(currentUser?.role === 'admin');
      } catch (e) {
        navigate(createPageUrl('Dashboard'));
      }
    };
    checkAdmin();
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: isAdmin
  });

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const premiumCount = users.filter(u => u.premium_status).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar activePage="Users" />

      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-gray-400">
            View and manage all registered users
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-gray-400">Total Users</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-white/10">
            <Crown className="w-6 h-6 text-amber-400 mb-2" />
            <p className="text-2xl font-bold">{premiumCount}</p>
            <p className="text-sm text-gray-400">Premium Users</p>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10">
            <Shield className="w-6 h-6 text-red-400 mb-2" />
            <p className="text-2xl font-bold">{adminCount}</p>
            <p className="text-sm text-gray-400">Admins</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{user.full_name || 'No name'}</p>
                    {user.role === 'admin' && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {user.premium_status && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Score</p>
                  <p className="text-lg font-bold text-white">{user.total_score || 0}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
