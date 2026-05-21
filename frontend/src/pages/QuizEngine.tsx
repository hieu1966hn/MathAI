import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Question, QuizAnswerInput, QuizSession } from '../lib/types';

const QuizEngine: React.FC = () => {
  const { roomId, topicId } = useParams<{ roomId: string; topicId: string }>();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('p');
  const sessionId = searchParams.get('session');
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerInput[]>([]);
  const [remaining, setRemaining] = useState(25);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<QuizSession | null>(null);

  useEffect(() => {
    if (!roomId || !topicId || !participantId || !sessionId) {
      setError('Thiếu thông tin phiên thi.');
      setLoading(false);
      return;
    }

    loadQuizContent();
  }, [roomId, topicId, participantId, sessionId]);

  useEffect(() => {
    if (!sessionInfo?.start_time) return;

    const timer = setInterval(() => {
      const start = new Date(sessionInfo.start_time!).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const timeLeft = Math.max(0, sessionInfo.duration_seconds - elapsed);

      setRemaining(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        if (!submitting) {
          console.log('Hết giờ! Tự động nộp bài...');
          handleSubmit();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionInfo, submitting]);

  const loadQuizContent = async () => {
    try {
      // 1. Load Session info
      const { data: sData, error: sError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sError) throw sError;
      setSessionInfo(sData);

      // 2. Load Questions (ưu tiên câu hỏi của session này)
      let { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('session_id', sessionId);
      
      // Fallback: Nếu session chưa có câu hỏi riêng, lấy câu hỏi seed theo topic
      if (!qData || qData.length === 0) {
        const { data: seedData } = await supabase
          .from('questions')
          .select('*')
          .eq('topic_id', topicId)
          .limit(5);
        qData = seedData;
      }

      if (qError) throw qError;
      setQuestions(qData || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải nội dung thi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question_id === questionId);
      if (existing) {
        return prev.map(a => a.question_id === questionId ? { ...a, selected_option: option } : a);
      }
      return [...prev, { question_id: questionId, selected_option: option }];
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Logic tính điểm
      const correctCount = answers.filter(a => {
        const q = questions.find(que => que.id === a.question_id);
        return q?.correct_option === a.selected_option;
      }).length;

      // Speed bonus: 1 điểm mỗi giây còn lại
      const speedBonus = remaining;
      const finalScore = (correctCount * 100) + speedBonus;

      // 1. Tạo attempt
      const { data: attempt, error: aError } = await supabase
        .from('attempts')
        .insert({
          participant_id: participantId,
          room_id: roomId,
          topic_id: topicId,
          score: finalScore,
          correct_count: correctCount,
          duration_seconds: sessionInfo ? sessionInfo.duration_seconds - remaining : 0
        })
        .select()
        .single();

      if (aError) throw aError;

      // 2. Lưu chi tiết answers
      if (answers.length > 0) {
        await supabase.from('answers').insert(
          answers.map(a => ({
            attempt_id: attempt.id,
            question_id: a.question_id,
            selected_option: a.selected_option,
            is_correct: questions.find(q => q.id === a.question_id)?.correct_option === a.selected_option
          }))
        );
      }

      // 3. Update participant status
      await supabase
        .from('participants')
        .update({ status: 'submitted', is_ready: false })
        .eq('id', participantId);

      navigate(`/room/${roomId}/result?p=${participantId}`);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi nộp bài.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="app-shell"><div className="panel">Đang chuẩn bị đấu trường...</div></div>;
  if (error) return <div className="app-shell"><div className="panel error-text">{error}</div></div>;

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers.find(a => a.question_id === currentQuestion.id)?.selected_option;

  return (
    <div className="app-shell">
      {/* Header Info */}
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 24px' }}>
        <div className="badge">Câu {currentIndex + 1} / {questions.length}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: remaining <= 5 ? 'var(--warning)' : 'var(--accent-2)' }}>
          ⏱️ 00:{remaining.toString().padStart(2, '0')}
        </div>
        <button className="button-secondary" onClick={handleSubmit} disabled={submitting}>Nộp bài</button>
      </div>

      {/* Question Card */}
      <div className="hero-card stack" style={{ minHeight: '400px' }}>
        <div className="badge" style={{ alignSelf: 'flex-start', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-2)' }}>
          {currentQuestion.difficulty.toUpperCase()}
        </div>
        
        <h2 style={{ fontSize: '1.4rem', lineHeight: '1.5', margin: '10px 0 20px 0' }}>{currentQuestion.prompt}</h2>

        <div className="stack" style={{ gap: '12px' }}>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <button
              key={opt}
              className={`input ${selectedOption === opt ? 'selected' : ''}`}
              onClick={() => handleSelectOption(currentQuestion.id, opt as 'A' | 'B' | 'C' | 'D')}
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                background: selectedOption === opt ? 'rgba(124, 58, 237, 0.15)' : undefined,
                borderColor: selectedOption === opt ? 'var(--accent)' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: selectedOption === opt ? 'var(--accent)' : 'rgba(148, 163, 184, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>{opt}</span>
              <span>{(currentQuestion as any)[`option_${opt.toLowerCase()}`]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button className="button-secondary" onClick={prevQuestion} disabled={currentIndex === 0}>Câu trước</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%', 
                background: idx === currentIndex ? 'var(--accent-2)' : (answers.some(a => a.question_id === questions[idx].id) ? 'var(--accent)' : 'var(--border)'),
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>
        <button 
          className={currentIndex === questions.length - 1 ? 'button-primary' : 'button-secondary'} 
          onClick={currentIndex === questions.length - 1 ? handleSubmit : nextQuestion}
          disabled={submitting}
        >
          {currentIndex === questions.length - 1 ? 'Kết thúc' : 'Câu tiếp'}
        </button>
      </div>
    </div>
  );
};

export default QuizEngine;
