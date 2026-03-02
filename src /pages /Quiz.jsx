import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizResult from '../components/quiz/QuizResult';

export default function Quiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const chapterId = urlParams.get('chapter');
  const subjectName = urlParams.get('subject') || 'Practice';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        console.log('User not logged in');
      }
    };
    loadUser();
  }, []);

  // All MCQs loaded once upfront – no per-question API calls
  const { data: mcqs = [], isLoading } = useQuery({
    queryKey: ['mcqs', chapterId],
    queryFn: () => chapterId 
      ? base44.entities.MCQ.filter({ chapter_id: chapterId }, '-created_date', 280)
      : base44.entities.MCQ.list('-created_date', 20),
    staleTime: 5 * 60 * 1000, // cache 5 min – no refetch on focus
    gcTime: 10 * 60 * 1000,
    enabled: true
  });

  // Timer
  useEffect(() => {
    if (quizComplete) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setQuizComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizComplete]);

  const currentQuestion = mcqs[currentIndex];

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion?.correct_answer;
    setAnswers([...answers, { 
      questionId: currentQuestion?.id, 
      selected: selectedAnswer, 
      correct: isCorrect 
    }]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate(createPageUrl('Practice'));
    }
  };

  const createSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.QuizSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizSessions'] });
    }
  });

  const handlePublishScore = async () => {
    const now = new Date();
    const weekNumber = Math.ceil((now.getDate()) / 7);
    
    await createSessionMutation.mutateAsync({
      user_id: user?.id || 'anonymous',
      chapter_id: chapterId,
      subject_name: subjectName,
      total_questions: mcqs.length,
      correct_answers: answers.filter(a => a.correct).length,
      wrong_answers: answers.filter(a => !a.correct).length,
      score: answers.filter(a => a.correct).length * 10,
      accuracy: (answers.filter(a => a.correct).length / mcqs.length) * 100,
      time_taken: Math.floor((Date.now() - startTime) / 1000),
      is_public: true,
      week_number: weekNumber,
      month_number: now.getMonth() + 1,
      year: now.getFullYear()
    });
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizComplete(false);
    setTimeRemaining(3600);
  };

  const getResult = () => {
    const correctAnswers = answers.filter(a => a.correct).length;
    const wrongAnswers = answers.filter(a => !a.correct).length;
    return {
      totalQuestions: mcqs.length,
      correctAnswers,
      wrongAnswers,
      score: correctAnswers * 10,
      accuracy: mcqs.length > 0 ? (correctAnswers / mcqs.length) * 100 : 0,
      timeTaken: Math.floor((Date.now() - startTime) / 1000)
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">No questions available</p>
          <p className="text-gray-400 mb-8">This chapter doesn't have any MCQs yet.</p>
          <Button
            onClick={() => navigate(createPageUrl('Practice'))}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Go Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
        <QuizResult 
          result={getResult()}
          onRetry={handleRetry}
          onPublishScore={handlePublishScore}
          isPublishing={createSessionMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
      
      <QuizHeader
        currentQuestion={currentIndex + 1}
        totalQuestions={mcqs.length}
        timeRemaining={timeRemaining}
        onExit={handleExit}
      />

      <main className="px-4 py-8">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentIndex}
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
            isCorrect={selectedAnswer === currentQuestion?.correct_answer}
          />
        </AnimatePresence>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mt-8"
        >
          {!showResult ? (
            <Button
              onClick={handleConfirmAnswer}
              disabled={!selectedAnswer}
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
            >
              Confirm Answer
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {currentIndex < mcqs.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                'View Results'
              )}
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
