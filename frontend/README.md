# Math Arena MVP v0.1 Frontend

Frontend cho bản demo **MindX Math Arena MVP**.

## Mục tiêu

- Học viên vào phòng bằng mã phòng
- Dùng tên ẩn danh, không dùng email/số điện thoại
- Chọn lớp, chủ đề, mức tự tin
- Làm quiz, nộp bài, xem kết quả và leaderboard
- Coach theo dõi phòng thi qua dashboard demo

## Tech Stack

- React
- TypeScript
- Vite
- Supabase JS Client
- Vanilla CSS

## Chạy local

1. Tạo file `.env.local` từ `.env.example`
2. Điền:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Cài dependency:
   - `npm install`
4. Chạy dev server:
   - `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`

## Route chính

- `/` — học viên vào phòng
- `/room/:roomId/topics?p=:participantId` — chọn chủ đề
- `/room/:roomId/quiz/:topicId?p=:participantId` — làm bài
- `/room/:roomId/result?p=:participantId&a=:attemptId` — xem kết quả
- `/coach/dashboard` — dashboard coach

## Ràng buộc demo

- Không dùng login thật ở v0.1
- Không lưu tên thật, email, số điện thoại học viên
- Câu hỏi hiện là **demo question bank**
- Cần SME Toán duyệt trước khi dùng với học viên thật

## PII Guard

Màn hình học viên chặn:
- email trong display name
- chuỗi số điện thoại 10+ chữ số
- gợi ý format an toàn như `HV-001`

## Coach Access (demo)

- Mã coach demo: `M-123`
- Chỉ dùng cho MVP nội bộ
