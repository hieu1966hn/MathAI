import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Participant, QuizSession } from '../lib/types';

const StudentWaiting: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('p');
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !participantId) {
      setError('Thiếu thông tin học viên hoặc phòng.');
      setLoading(false);
      return;
    }

    loadWaitingState();
  }, [roomId, participantId]);

  useEffect(() => {
    if (!roomId || !participant?.current_session_id) return;

    const channel = supabase
      .channel(`session-start-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quiz_sessions',
          filter: `id=eq.${participant.current_session_id}`
        },
        (payload) => {
          const nextSession = payload.new as QuizSession;
          setSession(nextSession);
          if (nextSession.status === 'active') {
            navigate(`/room/${roomId}/quiz/${nextSession.topic_id}?p=${participantId}&session=${nextSession.id}`);
          }
        }
      )
      .subscribe();

    const fallback = setInterval(checkSessionStatus, 2000);

    return () => {
      channel.unsubscribe();
      clearInterval(fallback);
    };
  }, [roomId, participant?.current_session_id]);

  const loadWaitingState = async () => {
    try {
      const { data: participantData, error: participantError } = await supabase
        .from('participants')
        .select('*')
        .eq('id', participantId)
        .single();

      if (participantError) throw participantError;
      setParticipant(participantData);

      if (participantData.current_session_id) {
        const { data: sessionData, error: sessionError } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('id', participantData.current_session_id)
          .single();

        if (sessionError) throw sessionError;
        setSession(sessionData);

        if (sessionData.status === 'active') {
          navigate(`/room/${roomId}/quiz/${sessionData.topic_id}?p=${participantId}&session=${sessionData.id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải trạng thái chờ.');
    } finally {
      setLoading(false);
    }
  };

  const checkSessionStatus = async () => {
    if (!participant?.current_session_id) return;

    const { data } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('id', participant.current_session_id)
      .single();

    if (data) {
      setSession(data);
      if (data.status === 'active') {
        navigate(`/room/${roomId}/quiz/${data.topic_id}?p=${participantId}&session=${data.id}`);
      }
    }
  };

  if (loading) {
    return <div className="app-shell"><div className="panel">Đang vào phòng chờ...</div></div>;
  }

  if (error) {
    return <div className="app-shell"><div className="panel error-text">{error}</div></div>;
  }

  return (
    <div className="app-shell">
      <div className="hero-card stack" style={{ textAlign: 'center' }}>
        <div className="badge" style={{ alignSelf: 'center', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-2)' }}>
          Đã sẵn sàng
        </div>
        <h1 style={{ margin: '0' }}>⏳ Chờ Coach bắt đầu</h1>
        <p className="help-text" style={{ fontSize: '1.1rem' }}>
          {participant?.display_name} đã chọn xong chủ đề và mức độ tự tin. Vòng thi sẽ bắt đầu đồng thời khi Coach bấm Start.
        </p>
        <div className="panel" style={{ maxWidth: '420px', margin: '20px auto', textAlign: 'left' }}>
          <div className="label">Trạng thái phiên</div>
          <h3 style={{ margin: '8px 0 0 0' }}>{session?.status === 'ready' ? 'Sẵn sàng bắt đầu' : 'Đang chuẩn bị'}</h3>
          <p className="help-text" style={{ marginBottom: 0 }}>Thời gian thi: {session?.duration_seconds || 25} giây • 05 câu trắc nghiệm</p>
        </div>
        <div className="help-text">Không đóng tab này. Hệ thống sẽ tự chuyển sang màn hình làm bài.</div>
      </div>
    </div>
  );
};

export default StudentWaiting;
