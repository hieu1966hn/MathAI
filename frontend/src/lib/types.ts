export type RoomStatus = 'waiting' | 'active' | 'finished'
export type ParticipantStatus = 'joined' | 'in_progress' | 'submitted' | 'waiting_start'
export type QuizSessionStatus = 'preparing' | 'ready' | 'active' | 'finished'
export type ConfidenceLevel = 'low' | 'medium' | 'good' | 'high'
export type QuestionType = 'multiple_choice'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type SmeStatus = 'need_review' | 'approved'
export type QuizOption = 'A' | 'B' | 'C' | 'D'

export interface Room {
  id: string
  code: string
  name: string
  status: RoomStatus
  created_at: string
}

export interface Participant {
  id: string
  room_id: string
  display_name: string
  grade: 6 | 7 | 8 | 9
  confidence: ConfidenceLevel | null
  status: ParticipantStatus
  current_session_id: string | null
  is_ready: boolean
  created_at: string
}

export interface Topic {
  id: string
  grade: 6 | 7 | 8 | 9
  name: string
  description: string | null
}

export interface Question {
  id: string
  topic_id: string
  question_order: number
  type: QuestionType
  prompt: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: QuizOption
  explanation: string | null
  difficulty: DifficultyLevel
  sme_status: SmeStatus
  session_id: string | null
  ai_generated: boolean
  created_at: string
}

export interface QuizSession {
  id: string
  room_id: string
  topic_id: string
  session_number: number
  status: QuizSessionStatus
  start_time: string | null
  duration_seconds: number
  created_at: string
}

export interface Attempt {
  id: string
  room_id: string
  participant_id: string
  topic_id: string
  started_at: string
  submitted_at: string | null
  duration_seconds: number | null
  correct_count: number
  total_questions: number
  speed_bonus: number
  score: number
}

export interface Answer {
  id: string
  attempt_id: string
  question_id: string
  selected_option: QuizOption
  is_correct: boolean
  answered_at: string
}

export interface LeaderboardEntry {
  room_id: string
  participant_id: string
  display_name: string
  grade: 6 | 7 | 8 | 9
  topic_name: string
  correct_count: number
  total_questions: number
  duration_seconds: number | null
  speed_bonus: number
  score: number
  rank: number
}

export interface DisplayNameValidationResult {
  isValid: boolean
  error: string | null
}

export interface QuizAnswerInput {
  question_id: string
  selected_option: QuizOption
}

export interface QuizSubmissionPayload {
  room_id: string
  participant_id: string
  topic_id: string
  duration_seconds: number
  answers: QuizAnswerInput[]
}
