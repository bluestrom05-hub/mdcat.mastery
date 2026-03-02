import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatsOverview from '../components/admin/StatsOverview';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAdmin(currentUser?.role === 'admin');
      } catch (e) {
        console.log('User not logged in');
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    enabled: isAdmin
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => base44.entities.Subject.list(),
    enabled: isAdmin
  });

  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.list(),
    enabled: isAdmin
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => base44.entities.Chapter.list(),
    enabled: isAdmin
  });

  const { data: mcqs = [] } = useQuery({
    queryKey: ['mcqs'],
    queryFn: () => base44.entities.MCQ.list(),
    enabled: isAdmin
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['allSessions'],
    queryFn: () => base44.entities.QuizSession.filter({ is_public: true }),
    enabled: isAdmin
  });

  const now = new Date();
  const currentWeek = Math.ceil(now.getDate() / 7);

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter(u => u.premium_status).length,
    totalSubjects: subjects.length || 5,
    totalBooks: books.length,
    totalChapters: chapters.length,
    totalMCQs: mcqs.length,
    weeklyParticipants: sessions.filter(s => s.week_number === currentWeek).length,
    revenue: users.filter(u => u.premium_status).length * 2500
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="p-6 rounded-full bg-red-500/20 inline-block mb-6">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <Button onClick={() => navigate(createPageUrl('Dashboard'))}>
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar activePage="Dashboard" />

      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Welcome back, {user?.full_name || 'Admin'}. Here's your platform overview.
          </p>
        </motion.div>

        <StatsOverview stats={stats} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          <Button
            onClick={() => navigate(createPageUrl('AdminMCQs'))}
            className="h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50"
            variant="ghost"
          >
            <div className="text-left">
              <p className="font-semibold text-white">Add MCQs</p>
              <p className="text-sm text-gray-400">Upload or create new questions</p>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate(createPageUrl('AdminSubjects'))}
            className="h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50"
            variant="ghost"
          >
            <div className="text-left">
              <p className="font-semibold text-white">Manage Structure</p>
              <p className="text-sm text-gray-400">Subjects, books & chapters</p>
            </div>
          </Button>

          <Button
            onClick={() => navigate(createPageUrl('AdminUsers'))}
            className="h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/50"
            variant="ghost"
          >
            <div className="text-left">
              <p className="font-semibold text-white">Manage Users</p>
              <p className="text-sm text-gray-400">View and manage user accounts</p>
            </div>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
