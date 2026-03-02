import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, 
  BookOpen, 
  Layers, 
  FileText, 
  ChevronRight,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminSidebar from '../components/admin/AdminSidebar';

const MAX_CHAPTERS_PER_BOOK = 15;

export default function AdminSubjects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [error, setError] = useState('');
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);

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

  // Seed Boards + Classes if missing (runs once on admin load)
  useEffect(() => {
    if (!isAdmin) return;
    const seedIfEmpty = async () => {
      const [bds, cls] = await Promise.all([
        base44.entities.Board.list(),
        base44.entities.Class.list()
      ]);
      if (bds.length === 0) {
        await base44.entities.Board.bulkCreate([
          { name: 'KPK', code: 'KPK' },
          { name: 'Federal', code: 'FED' },
          { name: 'Punjab', code: 'PNJ' }
        ]);
        queryClient.invalidateQueries({ queryKey: ['boards'] });
      }
      if (cls.length === 0) {
        await base44.entities.Class.bulkCreate([
          { name: 'Class 11', order: 1 },
          { name: 'Class 12', order: 2 }
        ]);
        queryClient.invalidateQueries({ queryKey: ['classes'] });
      }
    };
    seedIfEmpty();
  }, [isAdmin]);

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => base44.entities.Subject.list()
  });

  const { data: boards_data = [] } = useQuery({
    queryKey: ['boards'],
    queryFn: () => base44.entities.Board.list()
  });

  const { data: classes_data = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: () => base44.entities.Class.list()
  });

  const { data: books = [], refetch: refetchBooks } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.list()
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => base44.entities.Chapter.list()
  });

  const { data: mcqs = [] } = useQuery({
    queryKey: ['mcqs'],
    queryFn: () => base44.entities.MCQ.list()
  });

  // Auto-generate a book for subject+board+class if it doesn't exist
  const ensureBookExists = async (subject, boardId, classId) => {
    const existing = books.find(b =>
      b.subject_id === subject.id &&
      b.board_id === boardId &&
      b.class_id === classId
    );
    if (existing) return existing;

    const boardObj = boards_data.find(b => b.id === boardId) || { name: boardId };
    const classObj = classes_data.find(c => c.id === classId) || { name: `Class ${classId}` };
    const bookName = `${subject.name} – ${boardObj.name} – ${classObj.name}`;

    const newBook = await base44.entities.Book.create({
      name: bookName,
      subject_id: subject.id,
      board_id: boardId,
      class_id: classId,
      chapters_count: 0,
      total_mcqs: 0
    });
    await refetchBooks();
    return newBook;
  };

  const createChapterMutation = useMutation({
    mutationFn: (data) => base44.entities.Chapter.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      setShowChapterDialog(false);
      setNewChapterName('');
      setError('');
    }
  });

  const defaultSubjects = [
    { id: '1', name: 'Physics' },
    { id: '2', name: 'Chemistry' },
    { id: '3', name: 'Biology' },
    { id: '4', name: 'English' },
    { id: '5', name: 'Logical Reasoning' }
  ];

  const displaySubjects = subjects.length > 0 ? subjects : defaultSubjects;

  // Boards and classes: use DB data or fallback to defaults
  const boardList = boards_data.length > 0 ? boards_data : [
    { id: 'kpk', name: 'KPK' },
    { id: 'federal', name: 'Federal' },
    { id: 'punjab', name: 'Punjab' }
  ];
  const classList = classes_data.length > 0 ? classes_data : [
    { id: '11', name: 'Class 11' },
    { id: '12', name: 'Class 12' }
  ];

  const getBookForSelection = () => {
    return books.find(b => 
      b.subject_id === selectedSubject?.id &&
      b.board_id === selectedBoard &&
      b.class_id === selectedClass
    );
  };

  // When subject + board + class are all selected, auto-ensure book exists
  useEffect(() => {
    if (!selectedSubject || !selectedBoard || !selectedClass) return;
    const existing = books.find(b =>
      b.subject_id === selectedSubject.id &&
      b.board_id === selectedBoard &&
      b.class_id === selectedClass
    );
    if (!existing && !isGeneratingBook) {
      setIsGeneratingBook(true);
      ensureBookExists(selectedSubject, selectedBoard, selectedClass)
        .finally(() => setIsGeneratingBook(false));
    }
  }, [selectedSubject, selectedBoard, selectedClass, books]);

  const getChaptersForBook = (bookId) => {
    return chapters.filter(c => c.book_id === bookId);
  };

  const getMCQCountForChapter = (chapterId) => {
    return mcqs.filter(m => m.chapter_id === chapterId).length;
  };

  const handleAddChapter = async () => {
    setError('');
    // Ensure book exists first (auto-create if needed)
    let book;
    try {
      book = await ensureBookExists(selectedSubject, selectedBoard, selectedClass);
    } catch (e) {
      setError('Failed to create book. Please try again.');
      return;
    }

    const bookChapters = getChaptersForBook(book.id);
    if (bookChapters.length >= MAX_CHAPTERS_PER_BOOK) {
      setError(`Maximum chapter limit (${MAX_CHAPTERS_PER_BOOK}) reached for this book.`);
      return;
    }

    await createChapterMutation.mutateAsync({
      name: newChapterName,
      book_id: book.id,
      chapter_number: bookChapters.length + 1,
      mcq_count: 0
    });
  };

  if (!isAdmin) {
    return null;
  }

  const currentBook = getBookForSelection();
  const currentChapters = currentBook ? getChaptersForBook(currentBook.id) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar activePage="Subjects" />

      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Content Structure</h1>
          <p className="text-gray-400">
            Manage subjects, boards, classes, books and chapters
          </p>
        </motion.div>

        {/* Selection Flow */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Subject Selection */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="text-gray-400 mb-2 block">Subject</Label>
            <Select value={selectedSubject?.id} onValueChange={(v) => { setSelectedSubject(displaySubjects.find(s => s.id === v)); setSelectedBoard(null); setSelectedClass(null); }}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {displaySubjects.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Board Selection */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="text-gray-400 mb-2 block">Board</Label>
            <Select
              value={selectedBoard}
              onValueChange={(v) => { setSelectedBoard(v); setSelectedClass(null); }}
              disabled={!selectedSubject}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select Board" />
              </SelectTrigger>
              <SelectContent>
                {boardList.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Selection */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="text-gray-400 mb-2 block">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass} disabled={!selectedBoard}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classList.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Info – auto-generated */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Label className="text-gray-400 mb-2 block">Book (Auto)</Label>
            {isGeneratingBook ? (
              <p className="text-blue-400 text-sm animate-pulse">Generating book…</p>
            ) : currentBook ? (
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm">{currentBook.name}</span>
              </div>
            ) : selectedClass ? (
              <p className="text-yellow-400 text-sm">Creating book…</p>
            ) : (
              <p className="text-gray-500 text-sm">Select Subject + Board + Class</p>
            )}
          </div>
        </div>

        {/* Chapters Section */}
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Chapters</h2>
                <p className="text-sm text-gray-400">
                  {currentChapters.length} / {MAX_CHAPTERS_PER_BOOK} chapters
                </p>
              </div>

              <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                    disabled={currentChapters.length >= MAX_CHAPTERS_PER_BOOK}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Chapter</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {error && (
                      <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div>
                      <Label>Chapter Name</Label>
                      <Input
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        placeholder="e.g., Kinematics"
                        className="bg-white/5 border-white/10 mt-2"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setShowChapterDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddChapter}
                        disabled={!newChapterName || createChapterMutation.isPending}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {createChapterMutation.isPending ? 'Adding...' : 'Add Chapter'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Chapter Progress Bar */}
            <div className="mb-6">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${(currentChapters.length / MAX_CHAPTERS_PER_BOOK) * 100}%` }}
                />
              </div>
            </div>

            {/* Chapters List */}
            {currentChapters.length > 0 ? (
              <div className="space-y-3">
                {currentChapters.map((chapter, index) => {
                  const mcqCount = getMCQCountForChapter(chapter.id);
                  return (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white font-bold">
                          {chapter.chapter_number || index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{chapter.name}</p>
                          <p className="text-sm text-gray-400">
                            {mcqCount} / 280 MCQs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                          onClick={() => navigate(createPageUrl(`AdminMCQs?chapter=${chapter.id}`))}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No chapters yet</p>
                <p className="text-sm">Add your first chapter to get started</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
