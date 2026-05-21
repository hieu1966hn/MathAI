import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Room, LeaderboardEntry, Participant, QuizSession } from '../lib/types';

const CoachDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [coachCode, setCoachCode] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);

  // MVP v0.1 Hardcoded Coach Auth
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (coachCode === 'M-123') {
      setIsAuth(true);
      loadRooms();
    } else {
      alert('Mã Coach không đúng. Thử: M-123');
    }
  };

  useEffect(() => {
    if (!isAuth || !selectedRoom) return;
    
    // Initial load
    loadRoomData(selectedRoom.id);

    // Polling room and session data
    const interval = setInterval(() => {
      loadRoomData(selectedRoom.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuth, selectedRoom]);

  const loadRooms = async () => {
    try {
      const { data, error: rError } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (rError) throw rError;
      setRooms(data || []);
      if (data && data.length > 0) {
        setSelectedRoom(data[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomData = async (roomId: string) => {
    try {
      // 1. Load Session hiện tại
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const session = sessions?.[0] || null;
      setCurrentSession(session);

      // 2. Load Leaderboard
      const { data: lb } = await supabase
        .from('leaderboard_view')
        .select('*')
        .eq('room_id', roomId);
      setLeaderboard(lb || []);

      // 3. Load all participants
      const { data: pts } = await supabase
        .from('participants')
        .select('*')
        .eq('room_id', roomId);
      setParticipants(pts || []);
    } catch (err) {
      console.error('Error polling room data', err);
    }
  };

  const handlePrepareSession = async () => {
    if (!selectedRoom) return;
    setIsPreparing(true);
    try {
      // Logic giả lập gọi Gemini Proxy để tạo session mới
      // Trong thực tế sẽ gọi Edge Function. Ở đây ta insert trực tiếp session ready.
      const { data: session, error: sError } = await supabase
        .from('quiz_sessions')
        .insert({
          room_id: selectedRoom.id,
          topic_id: 'grade6-fractions-basic', // Topic seed có sẵn
          status: 'ready',
          duration_seconds: 25
        })
        .select()
        .single();

      if (sError) throw sError;
      setCurrentSession(session);
      alert('Đã chuẩn bị xong câu hỏi AI cho vòng thi mới!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsPreparing(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!currentSession) return;
    try {
      const { error: upError } = await supabase
        .from('quiz_sessions')
        .update({ 
          status: 'active',
          start_time: new Date().toISOString()
        })
        .eq('id', currentSession.id);
      
      if (upError) throw upError;
      loadRoomData(currentSession.room_id);
    } catch (err: any) {
      alert(err.message);
    }
  };


  if (!isAuth) {
    return (
      <div className="app-shell">
        <div className="hero-card stack" style={{ maxWidth: '400px', margin: '100px auto' }}>
          <h2>Coach Access</h2>
          <form onSubmit={handleAuth} className="stack">
            <label className="label">Nhập mã định danh Coach</label>
            <input 
              type="password" 
              className="input" 
              placeholder="VD: M-123" 
              value={coachCode}
              onChange={(e) => setCoachCode(e.target.value)}
            />
            <button type="submit" className="button-primary">Vào bảng điều khiển</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="app-shell"><div className="panel">Đang tải dữ liệu Coach...</div></div>;

  const stats = {
    total: participants.length,
    ready: participants.filter(p => p.is_ready).length,
    submitted: participants.filter(p => p.status === 'submitted').length,
  };

  return (
    <div className="app-shell stack">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Arena Dashboard</h1>
        <div className="badge" style={{ background: 'var(--accent)', color: 'white' }}>Coach Mode (M-123)</div>
      </div>

      <div className="grid-2">
        <div className="stack" style={{ gap: '20px' }}>
          {/* Room Selection */}
          <div className="panel stack">
            <label className="label">Chọn phòng thi</label>
            <select 
              className="select" 
              value={selectedRoom?.id} 
              onChange={(e) => {
                const r = rooms.find(room => room.id === e.target.value);
                if (r) setSelectedRoom(r);
              }}
            >
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.code})</option>)}
            </select>
          </div>

          {/* Session Control */}
          <div className="panel stack" style={{ border: '1px solid var(--accent)' }}>
            <h3 style={{ margin: 0 }}>Điều phối vòng thi (25s)</h3>
            
            <div className="stack" style={{ gap: '12px', marginTop: '12px' }}>
              <button 
                className="button-secondary" 
                onClick={handlePrepareSession}
                disabled={isPreparing || (currentSession?.status === 'ready' || currentSession?.status === 'active')}
              >
                {isPreparing ? '⏳ Đang tạo câu hỏi AI...' : '🔄 Chuẩn bị vòng thi mới'}
              </button>

              <button 
                className="button-primary" 
                onClick={handleStartQuiz}
                disabled={!currentSession || currentSession.status !== 'ready' || stats.ready === 0}
                style={{ fontSize: '1.2rem', padding: '16px' }}
              >
                🚀 BẮT ĐẦU NGAY ({stats.ready} HV sẵn sàng)
              </button>
            </div>

            {currentSession?.status === 'active' && (
              <div className="banner-warning" style={{ textAlign: 'center', marginTop: '12px' }}>
                🔥 TRẬN ĐẤU ĐANG DIỄN RA
              </div>
            )}

            <button 
              className="button-secondary" 
              onClick={handleClearSession}
              style={{ marginTop: '16px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              🗑️ Làm sạch phòng
            </button>
          </div>

          {/* Quick Stats */}
          <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="kpi-card">
              <div className="label">Tổng HV</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{stats.total}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Sẵn sàng</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-2)' }}>{stats.ready}</div>
            </div>
            <div className="kpi-card">
              <div className="label">Đã nộp</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.submitted}</div>
            </div>
          </div>
        </div>

        {/* Real-time Leaderboard */}
        <div className="panel stack">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Leaderboard</h2>
            <div className="help-text">Tự động cập nhật (3s)</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Học viên</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.participant_id}>
                  <td>{entry.rank}</td>
                  <td>{entry.display_name} (L{entry.grade})</td>
                  <td style={{ color: 'var(--accent-2)', fontWeight: 'bold' }}>{entry.score}</td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px' }} className="help-text">Chưa có dữ liệu bài làm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {error && <div className="banner-warning error-text">{error}</div>}
    </div>
  );
};

export default CoachDashboard;
