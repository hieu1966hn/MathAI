import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { DisplayNameValidationResult } from '../lib/types';

const StudentJoin: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateDisplayName = (name: string): DisplayNameValidationResult => {
    // PII Guard: No email
    if (name.includes('@')) {
      return { isValid: false, error: 'Vui lòng không sử dụng email làm tên hiển thị.' };
    }
    // PII Guard: No phone numbers (10+ consecutive digits)
    if (/\d{10,}/.test(name)) {
      return { isValid: false, error: 'Vui lòng không sử dụng số điện thoại làm tên hiển thị.' };
    }
    if (name.length < 2) {
      return { isValid: false, error: 'Tên hiển thị quá ngắn.' };
    }
    return { isValid: true, error: null };
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validation = validateDisplayName(displayName);
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      // 1. Check if room exists and is active
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('id, status')
        .eq('code', roomCode.toUpperCase())
        .single();

      if (roomError || !room) {
        throw new Error('Mã phòng không tồn tại.');
      }

      if (room.status !== 'active' && room.status !== 'waiting') {
        throw new Error('Phòng học hiện không khả dụng.');
      }

      // 2. Create participant (hardened RLS allows insert)
      const { data: participant, error: partError } = await supabase
        .from('participants')
        .insert({
          room_id: room.id,
          display_name: displayName,
          grade: grade,
          status: 'joined'
        })
        .select()
        .single();

      if (partError) throw partError;

      // 3. Navigate to topic selection
      navigate(`/room/${room.id}/topics?p=${participant.id}`);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tham gia phòng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="hero-card stack" style={{ maxWidth: '480px', margin: '60px auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px 0', background: 'linear-gradient(to right, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.4rem' }}>
            Math Arena
          </h1>
          <p className="help-text">Nhập mã phòng để bắt đầu thử thách</p>
        </div>

        <form onSubmit={handleJoin} className="stack">
          <div>
            <label className="label">Tên hiển thị (Nên dùng biệt danh)</label>
            <input 
              className="input"
              placeholder="VD: HV-001, MathWizard..."
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <p className="help-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
              🔒 Bảo mật: Không nhập tên thật, email hoặc số điện thoại.
            </p>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Mã phòng</label>
              <input 
                className="input"
                style={{ textTransform: 'uppercase' }}
                placeholder="ABC-XYZ"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Khối lớp</label>
              <select 
                className="select"
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value))}
              >
                <option value={6}>Lớp 6</option>
                <option value={7}>Lớp 7</option>
                <option value={8}>Lớp 8</option>
                <option value={9}>Lớp 9</option>
              </select>
            </div>
          </div>

          {error && <div className="error-text banner-warning" style={{ background: 'rgba(251, 113, 133, 0.1)', borderColor: 'rgba(251, 113, 133, 0.2)', color: '#fda4af' }}>{error}</div>}

          <button 
            type="submit" 
            className="button-primary" 
            style={{ marginTop: '12px', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Đang kết nối...' : 'Tham gia ngay'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', textAlign: 'center' }}>
          <p className="help-text" style={{ fontSize: '0.85rem' }}>
            Bạn là Coach? <a href="/coach/login" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>Đăng nhập bảng điều khiển</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentJoin;
