import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, 
  Upload, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSidebar from '../components/admin/AdminSidebar';

const MAX_MCQS_PER_CHAPTER = 280;

export default function AdminMCQs() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedChapter = urlParams.get('chapter');

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(preselectedChapter || '');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newMCQ, setNewMCQ] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    explanation: '',
    difficulty: 'Medium'
  });

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

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => base44.entities.Chapter.list()
  });

  const { data: mcqs = [] } = useQuery({
    queryKey: ['mcqs', selectedChapter],
    queryFn: () => selectedChapter 
      ? base44.entities.MCQ.filter({ chapter_id: selectedChapter })
      : base44.entities.MCQ.list()
  });

  const chapterMCQCount = selectedChapter 
    ? mcqs.filter(m => m.chapter_id === selectedChapter).length 
    : 0;

  const remainingSlots = MAX_MCQS_PER_CHAPTER - chapterMCQCount;

  const createMCQMutation = useMutation({
    mutationFn: (data) => base44.entities.MCQ.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
      setSuccess('MCQ added successfully!');
      setNewMCQ({
        question: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: '',
        explanation: '',
        difficulty: 'Medium'
      });
      setTimeout(() => setSuccess(''), 3000);
    }
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (data) => base44.entities.MCQ.bulkCreate(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['mcqs'] });
    }
  });

  const handleAddMCQ = async () => {
    if (chapterMCQCount >= MAX_MCQS_PER_CHAPTER) {
      setError(`Maximum ${MAX_MCQS_PER_CHAPTER} MCQs allowed per chapter.`);
      return;
    }

    if (!selectedChapter || !newMCQ.question || !newMCQ.option_a || !newMCQ.option_b || 
        !newMCQ.option_c || !newMCQ.option_d || !newMCQ.correct_answer) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    await createMCQMutation.mutateAsync({
      ...newMCQ,
      chapter_id: selectedChapter,
      marks: 1
    });
  };

  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedChapter) {
      setError('Please select a chapter first');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);
    setError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const mcqsToAdd = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < 6) {
          errors.push({ row: i + 1, reason: 'Insufficient columns' });
          continue;
        }

        const mcq = {
          chapter_id: selectedChapter,
          question: values[0],
          option_a: values[1],
          option_b: values[2],
          option_c: values[3],
          option_d: values[4],
          correct_answer: values[5]?.toUpperCase(),
          explanation: values[6] || '',
          difficulty: values[7] || 'Medium',
          marks: 1
        };

        if (!['A', 'B', 'C', 'D'].includes(mcq.correct_answer)) {
          errors.push({ row: i + 1, reason: 'Invalid correct answer (must be A, B, C, or D)' });
          continue;
        }

        if (mcqsToAdd.length < remainingSlots) {
          mcqsToAdd.push(mcq);
        } else {
          errors.push({ row: i + 1, reason: 'Chapter limit reached' });
        }
      }

      if (mcqsToAdd.length > 0) {
        await bulkCreateMutation.mutateAsync(mcqsToAdd);
      }

      setUploadResult({
        total: lines.length - 1,
        success: mcqsToAdd.length,
        failed: errors.length,
        errors: errors.slice(0, 10)
      });

    } catch (e) {
      setError('Failed to parse CSV file: ' + e.message);
    }

    setIsUploading(false);
    event.target.value = '';
  };

  const handleJSONUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedChapter) {
      setError('Please select a chapter first');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);
    setError('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const mcqArray = Array.isArray(data) ? data : [data];
      
      const mcqsToAdd = [];
      const errors = [];

      mcqArray.forEach((mcq, index) => {
        if (!mcq.question || !mcq.option_a || !mcq.option_b || !mcq.option_c || !mcq.option_d || !mcq.correct_answer) {
          errors.push({ row: index + 1, reason: 'Missing required fields' });
          return;
        }

        if (!['A', 'B', 'C', 'D'].includes(mcq.correct_answer?.toUpperCase())) {
          errors.push({ row: index + 1, reason: 'Invalid correct answer' });
          return;
        }

        if (mcqsToAdd.length < remainingSlots) {
          mcqsToAdd.push({
            ...mcq,
            chapter_id: selectedChapter,
            correct_answer: mcq.correct_answer.toUpperCase(),
            marks: 1
          });
        } else {
          errors.push({ row: index + 1, reason: 'Chapter limit reached' });
        }
      });

      if (mcqsToAdd.length > 0) {
        await bulkCreateMutation.mutateAsync(mcqsToAdd);
      }

      setUploadResult({
        total: mcqArray.length,
        success: mcqsToAdd.length,
        failed: errors.length,
        errors: errors.slice(0, 10)
      });

    } catch (e) {
      setError('Failed to parse JSON file: ' + e.message);
    }

    setIsUploading(false);
    event.target.value = '';
  };

  if (!isAdmin) {
    return null;
  }

  const selectedChapterData = chapters.find(c => c.id === selectedChapter);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar activePage="MCQs" />

      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">MCQ Management</h1>
          <p className="text-gray-400">
            Add, upload, and manage MCQs for each chapter
          </p>
        </motion.div>

        {/* Chapter Selection */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-gray-400">Select Chapter</Label>
                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger className="w-64 bg-white/5 border-white/10 mt-1">
                    <SelectValue placeholder="Choose a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedChapter && (
                <div className="ml-8">
                  <p className="text-sm text-gray-400">MCQ Count</p>
                  <p className="text-2xl font-bold text-white">
                    {chapterMCQCount} <span className="text-gray-500">/ {MAX_MCQS_PER_CHAPTER}</span>
                  </p>
                </div>
              )}
            </div>

            {selectedChapter && (
              <div className="flex gap-3">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Add MCQ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {selectedChapter && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    chapterMCQCount >= MAX_MCQS_PER_CHAPTER 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${(chapterMCQCount / MAX_MCQS_PER_CHAPTER) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {remainingSlots} slots remaining
              </p>
            </div>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/20 border-red-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/20 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <Alert className="mb-6 bg-blue-500/20 border-blue-500/30">
            <FileText className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-400">
              Upload complete: {uploadResult.success} added, {uploadResult.failed} failed out of {uploadResult.total} total
              {uploadResult.errors.length > 0 && (
                <ul className="mt-2 text-sm">
                  {uploadResult.errors.map((e, i) => (
                    <li key={i}>Row {e.row}: {e.reason}</li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        {selectedChapter && (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="bg-white/5 mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="csv">CSV Upload</TabsTrigger>
              <TabsTrigger value="json">JSON Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Add MCQ Manually</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Question *</Label>
                    <Textarea
                      value={newMCQ.question}
                      onChange={(e) => setNewMCQ({ ...newMCQ, question: e.target.value })}
                      placeholder="Enter the question"
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Option A *</Label>
                      <Input
                        value={newMCQ.option_a}
                        onChange={(e) => setNewMCQ({ ...newMCQ, option_a: e.target.value })}
                        className="bg-white/5 border-white/10 mt-1"
                      />
                    </div>
                    <div>
                      <Label>Option B *</Label>
                      <Input
                        value={newMCQ.option_b}
                        onChange={(e) => setNewMCQ({ ...newMCQ, option_b: e.target.value })}
                        className="bg-white/5 border-white/10 mt-1"
                      />
                    </div>
                    <div>
                      <Label>Option C *</Label>
                      <Input
                        value={newMCQ.option_c}
                        onChange={(e) => setNewMCQ({ ...newMCQ, option_c: e.target.value })}
                        className="bg-white/5 border-white/10 mt-1"
                      />
                    </div>
                    <div>
                      <Label>Option D *</Label>
                      <Input
                        value={newMCQ.option_d}
                        onChange={(e) => setNewMCQ({ ...newMCQ, option_d: e.target.value })}
                        className="bg-white/5 border-white/10 mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Correct Answer *</Label>
                      <Select 
                        value={newMCQ.correct_answer} 
                        onValueChange={(v) => setNewMCQ({ ...newMCQ, correct_answer: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 mt-1">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select 
                        value={newMCQ.difficulty} 
                        onValueChange={(v) => setNewMCQ({ ...newMCQ, difficulty: v })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Explanation</Label>
                    <Textarea
                      value={newMCQ.explanation}
                      onChange={(e) => setNewMCQ({ ...newMCQ, explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer"
                      className="bg-white/5 border-white/10 mt-1"
                    />
                  </div>

                  <Button 
                    onClick={handleAddMCQ}
                    disabled={createMCQMutation.isPending || remainingSlots <= 0}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {createMCQMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add MCQ
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="csv">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Upload CSV File</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Format: Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Explanation, Difficulty
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || remainingSlots <= 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload CSV
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="json">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Upload JSON File</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Array of objects with: question, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJSONUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button 
                  onClick={() => document.getElementById('json-upload')?.click()}
                  disabled={isUploading || remainingSlots <= 0}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload JSON
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* MCQ List */}
        {selectedChapter && mcqs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4">Recent MCQs ({mcqs.length})</h3>
            <div className="space-y-3">
              {mcqs.slice(0, 10).map((mcq, index) => (
                <div
                  key={mcq.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <p className="text-white mb-2">{index + 1}. {mcq.question}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className={`px-2 py-1 rounded ${mcq.correct_answer === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                      A: {mcq.option_a}
                    </span>
                    <span className={`px-2 py-1 rounded ${mcq.correct_answer === 'B' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                      B: {mcq.option_b}
                    </span>
                    <span className={`px-2 py-1 rounded ${mcq.correct_answer === 'C' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                      C: {mcq.option_c}
                    </span>
                    <span className={`px-2 py-1 rounded ${mcq.correct_answer === 'D' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                      D: {mcq.option_d}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
