import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Attempt, LeaderboardEntry, Answer, Question } from '../lib/types';

const StudentResult: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('a');
  const participantId = searchParams.get('p');
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<(Answer & { question: Question })[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId || !participantId) {
      setError('Không tìm thấy kết quả bài làm.');
      setLoading(false);
      return;
    }
    loadResult();
    const interval = setInterval(loadLeaderboard, 5000); // Poll leaderboard every 5s
    return () => clearInterval(interval);
  }, [attemptId, participantId]);

  const loadResult = async () => {
    try {
      // 1. Load attempt
      const { data: attData, error: attError } = await supabase
        .from('attempts')
        .select('*')
        .eq('id', attemptId)
        .single();
      if (attError) throw attError;
      setAttempt(attData);

      // 2. Load answers with questions
      const { data: ansData, error: ansError } = await supabase
        .from('answers')
        .select('*, question:questions(*)')
        .eq('attempt_id', attemptId);
      if (ansError) throw ansError;
      setAnswers(ansData || []);

      // 3. Initial leaderboard load
      await loadLeaderboard();
    } catch (err: any) {
      setError(err.message || 'Lỗi tải kết quả.');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    if (!roomId) return;
    const { data } = await supabase
      .from('leaderboard_view')
      .select('*')
      .eq('room_id', roomId)
      .limit(10);
    if (data) setLeaderboard(data);
  };

  if (loading) return <div className="app-shell"><div className="panel">Đang tổng hợp kết quả...</div></div>;
  if (error) return <div className="app-shell"><div className="panel error-text">{error}</div></div>;

  const handleReadyForNext = async () => {
    if (!participantId || !roomId) return;
    try {
      // 1. Đánh dấu sẵn sàng trở lại
      const { error: updateError } = await supabase
        .from('participants')
        .update({ is_ready: true, status: 'waiting_start' })
        .eq('id', participantId);

      if (updateError) throw updateError;

      // 2. Quay về màn hình chờ
      navigate(`/room/${roomId}/waiting?p=${participantId}`);
    } catch (err: any) {
      alert('Lỗi khi chuẩn bị vòng tiếp theo: ' + err.message);
    }
  };

  return (
    <div className="app-shell stack">
      <div className="banner-warning">
        🎯 <strong>Thông báo:</strong> Điểm số này dựa trên kết quả thi đấu thời gian thực.
      </div>

      <div className="hero-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0' }}>{attempt?.score}</h1>
        <p className="help-text" style={{ fontSize: '1.2rem' }}>Tổng điểm vòng này</p>
        
        <div className="kpi-grid" style={{ marginTop: '24px' }}>
          <div className="kpi-card">
            <div className="label">Đúng</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{attempt?.correct_count} / 5</div>
          </div>
          <div className="kpi-card">
            <div className="label">Thời gian làm</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{attempt?.time_spent}s</div>
          </div>
          <div className="kpi-card">
            <div className="label">Xếp hạng</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>#{leaderboard.find(l => l.participant_id === participantId)?.rank || '?'}</div>
          </div>
        </div>

        <button className="button-primary" style={{ marginTop: '32px', fontSize: '1.1rem' }} onClick={handleReadyForNext}>
          ✅ Sẵn sàng vòng tiếp theo
        </button>
      </div>

      <div className="grid-2">
        {/* Leaderboard Section */}
        <div className="panel stack">
          <h2 style={{ margin: '0 0 16px 0' }}>Bảng xếp hạng</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Tên</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.participant_id} style={{ background: entry.participant_id === participantId ? 'rgba(6, 182, 212, 0.1)' : 'transparent' }}>
                  <td>{entry.rank}</td>
                  <td style={{ fontWeight: entry.participant_id === participantId ? 'bold' : 'normal' }}>{entry.display_name}</td>
                  <td style={{ color: 'var(--accent-2)', fontWeight: 'bold' }}>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Review Answers */}
        <div className="panel stack" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h2 style={{ margin: '0 0 16px 0' }}>Xem lại bài</h2>
          <div className="stack" style={{ gap: '12px' }}>
            {answers.map((ans, idx) => (
              <div key={ans.id} className="panel" style={{ borderLeft: `4px solid ${ans.is_correct ? 'var(--success)' : 'var(--danger)'}`, padding: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Câu {idx + 1}: {ans.question.prompt}</p>
                <div style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: ans.is_correct ? 'var(--success)' : 'var(--danger)' }}>
                    Bạn chọn: {ans.selected_option}. {ans.is_correct ? 'Chính xác!' : `Đáp án đúng là ${ans.question.correct_option}.`}
                  </span>
                </div>
                {ans.question.explanation && (
                  <p className="help-text" style={{ fontSize: '0.85rem', marginTop: '8px', fontStyle: 'italic' }}>
                    Giải thích: {ans.question.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResult;
