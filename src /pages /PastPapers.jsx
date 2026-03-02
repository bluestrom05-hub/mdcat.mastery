import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  FileText, 
  Calendar, 
  Clock, 
  ArrowLeft,
  PlayCircle,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockPapers = [
  { id: 1, title: 'MDCAT 2024 - Federal Board', year: 2024, board: 'Federal', duration: 120, totalMarks: 200 },
  { id: 2, title: 'MDCAT 2024 - Punjab Board', year: 2024, board: 'Punjab', duration: 120, totalMarks: 200 },
  { id: 3, title: 'MDCAT 2024 - KPK Board', year: 2024, board: 'KPK', duration: 120, totalMarks: 200 },
  { id: 4, title: 'MDCAT 2023 - Federal Board', year: 2023, board: 'Federal', duration: 120, totalMarks: 200 },
  { id: 5, title: 'MDCAT 2023 - Punjab Board', year: 2023, board: 'Punjab', duration: 120, totalMarks: 200 },
  { id: 6, title: 'MDCAT 2022 - Federal Board', year: 2022, board: 'Federal', duration: 120, totalMarks: 200 },
];

export default function PastPapers() {
  const [yearFilter, setYearFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');

  const { data: papers = [] } = useQuery({
    queryKey: ['pastPapers'],
    queryFn: () => base44.entities.PastPaper.list(),
    initialData: []
  });

  const displayPapers = papers.length > 0 ? papers : mockPapers;

  const filteredPapers = displayPapers.filter(paper => {
    const yearMatch = yearFilter === 'all' || paper.year === parseInt(yearFilter);
    const boardMatch = boardFilter === 'all' || paper.board?.toLowerCase() === boardFilter.toLowerCase();
    return yearMatch && boardMatch;
  });

  const years = [...new Set(displayPapers.map(p => p.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold">Past Papers</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Practice with Real Papers</h1>
          <p className="text-gray-400">
            Attempt actual MDCAT past papers with timed mock tests
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Filter by:</span>
          </div>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={boardFilter} onValueChange={setBoardFilter}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10">
              <SelectValue placeholder="Board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="federal">Federal</SelectItem>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="kpk">KPK</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Papers Grid */}
        <div className="space-y-4">
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{paper.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {paper.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {paper.duration || 120} mins
                      </span>
                      <span>{paper.totalMarks || 200} marks</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-white/20">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Link to={createPageUrl(`Quiz?paper=${paper.id}`)}>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPapers.length === 0 && (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No papers found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
