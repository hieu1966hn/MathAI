-- MindX Math Arena MVP Backend v0.1
-- Target: Supabase Postgres
-- Security: Hardened RLS for demo (local/internal only)
-- PII Protection: Không lưu tên thật, email, số điện thoại học viên

create extension if not exists "uuid-ossp";

-- Clean up existing objects
drop view if exists leaderboard_view;
drop table if exists answers cascade;
drop table if exists attempts cascade;
drop table if exists questions cascade;
drop table if exists topics cascade;
drop table if exists participants cascade;
drop table if exists rooms cascade;

-- Rooms: Demo room với mã cố định
create table rooms (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  created_at timestamptz not null default now()
);

-- Participants: Học viên tham gia (chỉ lưu mã ẩn danh)
create table participants (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  display_name text not null,
  grade int not null check (grade in (6,7,8,9)),
  confidence text check (confidence in ('low','medium','good','high')),
  status text not null default 'joined' check (status in ('joined','in_progress','submitted')),
  created_at timestamptz not null default now(),
  unique(room_id, display_name)
);

-- Topics: Chủ đề theo lớp
create table topics (
  id text primary key,
  grade int not null check (grade in (6,7,8,9)),
  name text not null,
  description text
);

-- Questions: Câu hỏi demo (cần SME duyệt)
create table questions (
  id text primary key,
  topic_id text not null references topics(id) on delete cascade,
  question_order int not null,
  type text not null default 'multiple_choice' check (type in ('multiple_choice')),
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A','B','C','D')),
  explanation text,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  sme_status text not null default 'need_review' check (sme_status in ('need_review','approved')),
  created_at timestamptz not null default now(),
  unique(topic_id, question_order)
);

-- Attempts: Lượt làm bài
create table attempts (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references rooms(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  topic_id text not null references topics(id),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds int,
  correct_count int not null default 0,
  total_questions int not null default 0,
  speed_bonus int not null default 0,
  score int not null default 0,
  unique(room_id, participant_id, topic_id)
);

-- Answers: Câu trả lời từng câu
create table answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id text not null references questions(id),
  selected_option text not null check (selected_option in ('A','B','C','D')),
  is_correct boolean not null default false,
  answered_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

-- Leaderboard view: Xếp hạng theo room
create view leaderboard_view as
select
  a.room_id,
  a.participant_id,
  p.display_name,
  p.grade,
  t.name as topic_name,
  a.correct_count,
  a.total_questions,
  a.duration_seconds,
  a.speed_bonus,
  a.score,
  rank() over (
    partition by a.room_id
    order by a.score desc, a.duration_seconds asc nulls last, a.submitted_at asc
  ) as rank
from attempts a
join participants p on p.id = a.participant_id
join topics t on t.id = a.topic_id
where a.submitted_at is not null;

-- Enable RLS
alter table rooms enable row level security;
alter table participants enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table answers enable row level security;

-- RLS Policies: Hardened for demo
-- WARNING: Local/Internal demo only. Do not deploy public without proper Authentication.

-- Rooms: Read-only
create policy "public_read_rooms" on rooms for select using (true);

-- Topics: Read-only
create policy "public_read_topics" on topics for select using (true);

-- Questions: Read-only (demo questions với sme_status='need_review')
create policy "public_read_questions" on questions for select using (true);

-- Participants: Insert + Read + Update status only
create policy "public_insert_participants" on participants for insert with check (true);
create policy "public_read_participants" on participants for select using (true);
create policy "public_update_participants_status" on participants for update using (true) with check (true);

-- Attempts: Insert + Read only (no update/delete)
create policy "public_insert_attempts" on attempts for insert with check (true);
create policy "public_read_attempts" on attempts for select using (true);

-- Answers: Insert + Read only
create policy "public_insert_answers" on answers for insert with check (true);
create policy "public_read_answers" on answers for select using (true);

-- Security Notes:
-- 1. Không có policy cho UPDATE/DELETE trên rooms/topics/questions → Client không thể phá hoại dữ liệu gốc.
-- 2. Participants chỉ cho update status (joined → in_progress → submitted).
-- 3. Attempts và Answers chỉ cho insert, không cho update/delete sau khi submit.
-- 4. Nếu deploy public, cần thêm Authentication và tighten policies theo user_id.
