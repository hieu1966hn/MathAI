# Backend Setup Guide — Math Arena MVP v0.1

## Mục tiêu

Thiết lập backend Supabase cho ứng dụng demo Math Arena.

> [!WARNING]
> **Chỉ dùng cho demo nội bộ / local demo**
>
> Bản v0.1 chưa có authentication production-grade. Không nên deploy public nếu chưa bổ sung auth và siết chặt RLS theo user identity.

## Thành phần

- [schema.sql](file:///Users/hieu1966hn/Documents/Personal/MindX_Agent_Workspace/mindx-agent_v1/Du-An/math-arena/mvp-v01/backend/schema.sql)
- [seed.sql](file:///Users/hieu1966hn/Documents/Personal/MindX_Agent_Workspace/mindx-agent_v1/Du-An/math-arena/mvp-v01/backend/seed.sql)

## Bước thiết lập

1. Tạo Supabase project mới tại https://supabase.com
2. Mở SQL Editor trong Supabase dashboard
3. Chạy nội dung từ [schema.sql](file:///Users/hieu1966hn/Documents/Personal/MindX_Agent_Workspace/mindx-agent_v1/Du-An/math-arena/mvp-v01/backend/schema.sql)
4. Chạy nội dung từ [seed.sql](file:///Users/hieu1966hn/Documents/Personal/MindX_Agent_Workspace/mindx-agent_v1/Du-An/math-arena/mvp-v01/backend/seed.sql)
5. Kiểm tra các bảng:
   - `rooms`
   - `participants`
   - `topics`
   - `questions`
   - `attempts`
   - `answers`
6. Kiểm tra view `leaderboard_view`

## Dữ liệu demo mặc định

- Room code: `MATH-DEMO`
- 4 topics cho lớp 6-9
- 16 câu hỏi demo
- Tất cả câu hỏi có `sme_status = 'need_review'`

## Chính sách an toàn

### PII
- Không lưu email học viên
- Không lưu số điện thoại học viên
- Không lưu tên thật học viên nếu operator tuân thủ hướng dẫn UI
- `display_name` chỉ nên dùng dạng `HV-001`, `HV-002`, ...

### Nội dung học thuật
- Tất cả câu hỏi hiện là **demo question bank**
- Chưa được coi là nội dung production-ready
- Chỉ dùng với học viên thật khi SME Toán duyệt toàn bộ câu hỏi

### RLS
- `rooms`, `topics`, `questions`: client chỉ đọc
- `participants`, `attempts`, `answers`: client chỉ đọc/ghi theo flow demo
- Client không thể update/delete `questions` hoặc `topics`

## Verify nhanh trong Supabase

### Query 1: Check room
```sql
select * from rooms where code = 'MATH-DEMO';
```

### Query 2: Check questions by grade 6 topic
```sql
select id, prompt, sme_status
from questions
where topic_id = 'grade6-fractions-basic'
order by question_order;
```

### Query 3: Check leaderboard view
```sql
select * from leaderboard_view;
```

## Ghi chú

Nếu muốn nâng cấp lên pilot public:
1. Bổ sung auth cho coach/admin
2. Siết RLS theo user role
3. Dùng Edge Functions hoặc backend API để validate attempt submit
4. Thêm rate limit và logging
