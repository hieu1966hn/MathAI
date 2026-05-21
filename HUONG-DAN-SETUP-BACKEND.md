# Hướng dẫn Setup Backend Supabase cho Math Arena MVP

## Lỗi hiện tại
```
Could not find the table 'public.rooms' in the schema cache
```

Nghĩa là database Supabase chưa có cấu trúc bảng.

## Các bước thực hiện (5 phút)

### Bước 1: Vào Supabase Dashboard

1. Mở trình duyệt
2. Vào: https://supabase.com/dashboard
3. Đăng nhập tài khoản Supabase
4. Chọn project: `yujrqabkcsywdkiubbqz`

### Bước 2: Mở SQL Editor

Trong Dashboard, tìm menu bên trái:

```
🔧 SQL Editor
```

Click vào đó.

### Bước 3: Chạy Schema (Tạo cấu trúc bảng)

1. Click nút **"New query"** hoặc **"+"**
2. Copy toàn bộ nội dung file: `backend/schema.sql`
3. Paste vào SQL Editor
4. Click nút **"Run"** (hoặc Cmd+Enter)
5. Đợi ~2-3 giây
6. Thấy thông báo: ✅ Success

### Bước 4: Chạy Seed (Nạp dữ liệu mẫu)

1. Click nút **"New query"** lần nữa
2. Copy toàn bộ nội dung file: `backend/seed.sql`
3. Paste vào SQL Editor
4. Click nút **"Run"**
5. Đợi ~1-2 giây
6. Thấy thông báo: ✅ Success

### Bước 5: Kiểm tra dữ liệu

Trong Supabase Dashboard, vào:

```
📊 Table Editor
```

Anh/Chị sẽ thấy các bảng:
- `rooms` (có 1 dòng: MATH-DEMO)
- `topics` (có 4 topics cho 4 lớp)
- `questions` (có 16 câu hỏi demo)
- `participants` (trống)
- `attempts` (trống)
- `answers` (trống)

### Bước 6: Quay lại App

1. Refresh trang Coach Dashboard: `http://localhost:5173/coach/dashboard`
2. Dropdown "Chọn phòng thi" sẽ hiển thị: **MATH-DEMO**
3. Lỗi "Could not find table" sẽ biến mất

---

## Nếu vẫn gặp lỗi

### Lỗi: "permission denied"

Có thể RLS (Row Level Security) đang chặn. Kiểm tra:

1. Vào SQL Editor
2. Chạy lệnh:
```sql
SELECT * FROM rooms;
```
3. Nếu thấy dữ liệu → OK
4. Nếu không thấy → RLS có vấn đề, cần disable tạm:
```sql
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
```

### Lỗi: "relation already exists"

Nghĩa là đã chạy schema rồi. Bỏ qua và chạy seed.sql thôi.

---

## File cần dùng

- Schema: `Du-An/math-arena/mvp-v01/backend/schema.sql`
- Seed: `Du-An/math-arena/mvp-v01/backend/seed.sql`
