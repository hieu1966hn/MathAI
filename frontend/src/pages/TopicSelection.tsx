import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Topic, ConfidenceLevel, Participant } from '../lib/types';

const TopicSelection: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('p');
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || !participantId) {
      setError('Thiếu thông tin phòng hoặc học viên.');
      setLoading(false);
      return;
    }
    loadData();
  }, [roomId, participantId]);

  const loadData = async () => {
    try {
      // Load participant info
      const { data: partData, error: partError } = await supabase
        .from('participants')
        .select('*')
        .eq('id', participantId)
        .single();

      if (partError) throw partError;
      setParticipant(partData);

      // Load topics for participant's grade
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('grade', partData.grade)
        .order('name');

      if (topicsError) throw topicsError;
      setTopics(topicsData || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!selectedTopic || !participantId) return;

    try {
      // Tìm session hiện tại của room
      const { data: sessions, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('room_id', roomId)
        .eq('topic_id', selectedTopic)
        .in('status', ['preparing', 'ready'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (sessionError) throw sessionError;

      const currentSession = sessions?.[0];
      if (!currentSession) {
        throw new Error('Chưa có phiên thi nào được chuẩn bị. Vui lòng chờ Coach.');
      }

      // Update participant: mark ready and link to session
      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          confidence, 
          status: 'waiting_start',
          is_ready: true,
          current_session_id: currentSession.id
        })
        .eq('id', participantId);

      if (updateError) throw updateError;

      // Navigate to waiting room
      navigate(`/room/${roomId}/waiting?p=${participantId}`);
    } catch (err: any) {
      setError(err.message || 'Không thể sẵn sàng cho quiz.');
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="panel error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* SME Warning Banner */}
      <div className="banner-warning">
        ⚠️ <strong>Lưu ý:</strong> Câu hỏi demo, cần SME Toán duyệt trước khi dùng với học viên thật.
      </div>

      <div className="hero-card stack">
        <div>
          <h2 style={{ margin: '0 0 8px 0' }}>Chào {participant?.display_name}!</h2>
          <p className="help-text">Chọn chủ đề ôn tập phù hợp với lớp {participant?.grade}</p>
        </div>

        {topics.length === 0 ? (
          <div className="panel">
            <p className="help-text">Chưa có chủ đề nào cho lớp {participant?.grade}.</p>
          </div>
        ) : (
          <div className="stack">
            <label className="label">Chủ đề ôn tập</label>
            <div className="stack" style={{ gap: '12px' }}>
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`panel ${selectedTopic === topic.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    cursor: 'pointer',
                    border: selectedTopic === topic.id ? '2px solid var(--accent-2)' : '1px solid var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{topic.name}</h3>
                  {topic.description && <p className="help-text" style={{ margin: 0 }}>{topic.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTopic && (
          <div className="stack">
            <label className="label">Mức độ tự tin của bạn với chủ đề này?</label>
            <div className="grid-2">
              {[
                { value: 'low', label: '😰 Chưa tự tin', color: '#fb7185' },
                { value: 'medium', label: '😐 Bình thường', color: '#f59e0b' },
                { value: 'good', label: '😊 Khá tự tin', color: '#22c55e' },
                { value: 'high', label: '😎 Rất tự tin', color: '#06b6d4' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={confidence === opt.value ? 'button-primary' : 'button-secondary'}
                  onClick={() => setConfidence(opt.value as ConfidenceLevel)}
                  style={{
                    borderColor: confidence === opt.value ? opt.color : undefined,
                    boxShadow: confidence === opt.value ? `0 0 0 3px ${opt.color}22` : undefined
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="button-primary"
          onClick={handleStartQuiz}
          disabled={!selectedTopic}
          style={{ marginTop: '12px', fontSize: '1.1rem' }}
        >
          ✅ Sẵn sàng thi
        </button>
      </div>
    </div>
  );
};

export default TopicSelection;
