# Kịch bản Demo Math Arena MVP v0.1

Tài liệu này hướng dẫn thực hiện buổi demo với **01 Coach** và **04 Học viên** đại diện cho các khối lớp 6, 7, 8, 9.

## 1. Chuẩn bị (Coach)

1. **Truy cập Dashboard:** Mở trình duyệt vào route `/coach/dashboard`.
2. **Đăng nhập:** Nhập mã Coach định danh: `M-123`.
3. **Kích hoạt phòng:** 
   - Chọn phòng thi (mặc định: `MATH-DEMO`).
   - Nhấn nút **"Đang mở" (Active)** để cho phép học viên vào.
   - Để màn hình Dashboard này lên máy chiếu hoặc màn hình chung để theo dõi Leaderboard.

## 2. Luồng học viên (Thực hiện bởi 4 học viên)

Mỗi học viên truy cập vào trang chủ `/` và thực hiện theo khối lớp của mình:

### Bước A: Tham gia (Join) - Áp dụng PII Guard
- **Mã phòng:** Nhập `MATH-DEMO`.
- **Tên hiển thị:** 
  - HV Lớp 6: Nhập `G6-Star` (Thử nhập email/SĐT để thấy PII Guard chặn).
  - HV Lớp 7: Nhập `MathLover-7`.
  - HV Lớp 8: Nhập `Pro-Solver`.
  - HV Lớp 9: Nhập `Champion-9`.
- **Khối lớp:** Chọn đúng khối lớp của mình (6, 7, 8 hoặc 9).
- Nhấn **"Tham gia ngay"**.

### Bước B: Chọn chủ đề
- Hệ thống sẽ hiển thị các chủ đề thuộc khối lớp đã chọn (dữ liệu từ `seed.sql`).
- **Học viên chọn 1 chủ đề bất kỳ.**
- **Chọn mức độ tự tin:** (VD: Rất tự tin, Bình thường...).
- Nhấn **"Bắt đầu làm bài"**.

### Bước C: Đấu trường (Quiz)
- Học viên lần lượt trả lời các câu hỏi trắc nghiệm (A, B, C, D).
- Quan sát Timer (thời gian làm bài) và tiến độ (Câu X/Y).
- Nhấn **"Nộp bài"** sau khi hoàn tất.

## 3. Tổng kết & Leaderboard

- **Màn hình học viên:** Hiển thị ngay điểm số, thời gian, và thưởng tốc độ. Học viên có thể kéo xuống xem lại lời giải chi tiết của từng câu.
- **Màn hình Coach:** Bảng xếp hạng (Leaderboard) sẽ tự động cập nhật mỗi 5 giây, hiển thị vị trí của cả 4 học viên dựa trên: **Điểm số cao nhất > Thời gian nhanh nhất**.

## 4. Lưu ý quan trọng cho Demo
- **SME Review:** Mọi màn hình đều có banner nhắc nhở đây là dữ liệu demo.
- **PII Protection:** Tuyệt đối không yêu cầu học viên nhập tên thật.
- **Dữ liệu mẫu:** Sử dụng Room Code `MATH-DEMO` đã được tạo sẵn trong database.
