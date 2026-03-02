import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Atom, 
  Beaker, 
  Dna, 
  BookText, 
  Lightbulb,
  ArrowLeft,
  Stethoscope,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SubjectCard from '../components/practice/SubjectCard';
import BoardSelector from '../components/practice/BoardSelector';
import ClassSelector from '../components/practice/ClassSelector';
import ChapterList from '../components/practice/ChapterList';

const subjectIcons = {
  'Physics': Atom,
  'Chemistry': Beaker,
  'Biology': Dna,
  'English': BookText,
  'Logical Reasoning': Lightbulb
};

const subjectColors = {
  'Physics': 'from-blue-500 to-cyan-600',
  'Chemistry': 'from-green-500 to-emerald-600',
  'Biology': 'from-pink-500 to-rose-600',
  'English': 'from-purple-500 to-violet-600',
  'Logical Reasoning': 'from-amber-500 to-orange-600'
};

export default function Practice() {
  const [step, setStep] = useState('subjects'); // subjects, boards, classes, chapters
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => base44.entities.Subject.list()
  });

  const { data: books = [] } = useQuery({
    queryKey: ['books', selectedSubject?.id, selectedBoard, selectedClass],
    queryFn: () => base44.entities.Book.filter({
      subject_id: selectedSubject?.id,
      board_id: selectedBoard,
      class_id: selectedClass
    }),
    enabled: !!selectedSubject && !!selectedBoard && !!selectedClass
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', books[0]?.id],
    queryFn: () => base44.entities.Chapter.filter({ book_id: books[0]?.id }),
    enabled: books.length > 0
  });

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    if (subject.name === 'English' || subject.name === 'Logical Reasoning') {
      // These don't have boards, skip to chapters
      setStep('chapters');
    } else {
      setStep('boards');
    }
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setStep('classes');
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setStep('chapters');
  };

  const goBack = () => {
    if (step === 'chapters') {
      if (selectedClass) {
        setStep('classes');
        setSelectedClass(null);
      } else {
        setStep('subjects');
        setSelectedSubject(null);
      }
    } else if (step === 'classes') {
      setStep('boards');
      setSelectedBoard(null);
    } else if (step === 'boards') {
      setStep('subjects');
      setSelectedSubject(null);
    }
  };

  const defaultSubjects = [
    { id: '1', name: 'Physics' },
    { id: '2', name: 'Chemistry' },
    { id: '3', name: 'Biology' },
    { id: '4', name: 'English' },
    { id: '5', name: 'Logical Reasoning' }
  ];

  const displaySubjects = subjects.length > 0 ? subjects : defaultSubjects;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step !== 'subjects' && (
              <Button variant="ghost" size="icon" onClick={goBack} className="text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Practice</span>
            </Link>
          </div>

          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Subject */}
          {step === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Select a Subject</h1>
                <p className="text-gray-400">Choose what you want to practice today</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displaySubjects.map((subject, index) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    icon={subjectIcons[subject.name] || BookText}
                    color={subjectColors[subject.name] || 'from-gray-500 to-gray-600'}
                    onClick={() => handleSubjectSelect(subject)}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Board */}
          {step === 'boards' && (
            <motion.div
              key="boards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{selectedSubject?.name}</h1>
                <p className="text-gray-400">Select your board</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <BoardSelector selectedBoard={selectedBoard} onSelect={handleBoardSelect} />
              </div>
            </motion.div>
          )}

          {/* Step 3: Select Class */}
          {step === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{selectedSubject?.name}</h1>
                <p className="text-gray-400">Select your class</p>
              </div>

              <div className="max-w-md mx-auto">
                <ClassSelector selectedClass={selectedClass} onSelect={handleClassSelect} />
              </div>
            </motion.div>
          )}

          {/* Step 4: Chapter List */}
          {step === 'chapters' && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{selectedSubject?.name} Chapters</h1>
                <p className="text-gray-400">
                  {selectedBoard && `${selectedBoard.toUpperCase()} Board • `}
                  {selectedClass && `Class ${selectedClass}`}
                </p>
              </div>

              <ChapterList chapters={chapters} subjectName={selectedSubject?.name} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
