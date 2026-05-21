# Design.md — MindX Math Arena MVP v0.1

**Mục đích:** Hướng dẫn Agent thiết kế UI cho MVP `Math Arena Activity Demo v0.1` theo tinh thần nhận diện MindX, dùng cho web app React + TypeScript + Vite.

**Dùng cho:** Builder/Agent đang phát triển app tại `Du-An/math-arena/mvp-v01/frontend/`.

**Trạng thái:** Design guide cho demo nội bộ. Chưa thay thế brand guideline chính thức của MindX. Nếu có brand kit chính thức, ưu tiên brand kit.

---

## 1. Nguồn tham chiếu thương hiệu

Agent cần mở và tham chiếu trực tiếp các trang sau trước khi chỉnh UI:

- Trang chủ MindX: `https://mindx.edu.vn/`
- Trang Về MindX: `https://mindx.edu.vn/about`

Các thông điệp cần phản ánh trong UI:

- MindX là trường học công nghệ ứng dụng AI.
- Tinh thần “Little Silicon Valley”: hiện đại, công nghệ, sáng tạo, dám thử.
- Học viên tạo sản phẩm thực tế, không chỉ học lý thuyết.
- Phát triển toàn diện: tư duy sáng tạo, giải quyết vấn đề, kỹ năng mềm, làm việc nhóm.
- Học từ bất kỳ đâu: trực tiếp, online, linh hoạt.

Không được thiết kế UI như một app kiểm tra khô cứng. UI phải tạo cảm giác: **công nghệ, năng lượng, thân thiện với học sinh THCS, có tinh thần sân chơi học tập**.

---

## 2. Product Design Principle

MVP này không phải “bản sao Quizizz/Kahoot”. Đây là minh họa cho hệ thống **Tự học Toán với AI** của MindX.

### Nguyên tắc thiết kế

1. **Cá nhân hóa nhưng vẫn học chung lớp**
   - Học viên lớp 6-9 có thể cùng tham gia một room.
   - Mỗi bạn nhận topic/câu hỏi đúng lớp.
   - Bảng xếp hạng chung tạo không khí lớp học.

2. **Tự học nhưng không cô đơn**
   - UI phải có tiến độ, điểm, phản hồi nhanh, bảng xếp hạng.
   - Coach dashboard giúp giáo viên can thiệp khi cần.

3. **Mưa dầm thấm lâu**
   - UI cần khuyến khích làm lại, luyện thêm, cải thiện dần.
   - Ngôn ngữ phản hồi nên động viên, không phán xét.

4. **Demo nội bộ, không dùng với học viên thật khi chưa duyệt**
   - Luôn có banner cảnh báo: câu hỏi cần SME Toán duyệt.
   - Không nhập hoặc hiển thị dữ liệu cá nhân thật của học viên.

---

## 3. Visual Direction

### Từ khóa thiết kế

- Công nghệ
- Năng lượng
- Sạch, hiện đại
- Học tập tích cực
- Game nhẹ, không quá trẻ con
- Dễ đọc trong lớp học
- Tin cậy cho phụ huynh/BOM

### Không khí UI

UI nên giống một **learning arena**: có phòng học, người chơi, tiến độ, thử thách, điểm số, bảng xếp hạng. Tuy nhiên vẫn phải đủ nghiêm túc để BOM/R&D thấy đây là nền tảng giáo dục, không phải game giải trí đơn thuần.

---

## 4. Design Tokens

> Lưu ý: Bảng màu dưới đây là token đề xuất để app đi đúng tinh thần MindX. Nếu Agent có quyền truy cập CSS/brand kit chính thức của MindX, hãy thay bằng màu chính xác từ brand kit.

### 4.1 Color Palette

```css
:root {
  /* Brand */
  --mx-primary: #E53935;
  --mx-primary-dark: #B71C1C;
  --mx-primary-soft: #FFE8E8;

  /* Tech accent */
  --mx-accent-blue: #2563EB;
  --mx-accent-purple: #7C3AED;
  --mx-accent-cyan: #06B6D4;

  /* Success / Warning */
  --mx-success: #16A34A;
  --mx-warning: #F59E0B;
  --mx-danger: #DC2626;

  /* Neutral */
  --mx-bg: #F8FAFC;
  --mx-surface: #FFFFFF;
  --mx-surface-soft: #F1F5F9;
  --mx-text: #0F172A;
  --mx-text-muted: #64748B;
  --mx-border: #E2E8F0;

  /* Dark tech surface */
  --mx-dark: #0B1020;
  --mx-dark-card: #111827;
}
```

### 4.2 Color Usage

| Thành phần | Màu chính |
|---|---|
| CTA chính | `--mx-primary` |
| CTA phụ | `--mx-accent-blue` |
| Banner cảnh báo SME | `--mx-warning` nền nhạt, text đậm |
| Success submit | `--mx-success` |
| Error/PII guard | `--mx-danger` |
| Leaderboard top 1 | gradient đỏ/cam hoặc vàng nhạt |
| Background chính | `--mx-bg` |
| Card | `--mx-surface` |
| Coach dashboard dark header | `--mx-dark` |

### 4.3 Typography

Nếu dùng Google Fonts hoặc font web:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Nếu không dùng Google Fonts, dùng system font.

| Loại chữ | Kích thước |
|---|---|
| Page title | 32-40px, bold |
| Section title | 22-28px, bold |
| Card title | 18-20px, semibold |
| Body | 14-16px |
| Helper text | 12-14px |
| Quiz question | 22-28px, bold, line-height thoáng |
| Leaderboard score | 24-32px, bold |

### 4.4 Spacing / Radius / Shadow

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 20px;
--radius-xl: 28px;

--shadow-card: 0 12px 30px rgba(15, 23, 42, 0.08);
--shadow-pop: 0 18px 50px rgba(229, 57, 53, 0.16);
```

Quy tắc:
- Card chính dùng radius 20-28px.
- Button dùng radius 999px hoặc 16px.
- Khoảng cách giữa section tối thiểu 24px.
- UI cần nhiều khoảng thở, không dày chữ.

---

## 5. Layout System

### 5.1 App Shell

- Header trên cùng:
  - Logo text: `MindX Math Arena`
  - Badge: `Internal Demo`
  - Banner nhỏ: `Câu hỏi demo, cần SME Toán duyệt trước khi dùng với học viên thật`
- Main content:
  - Max width student flow: 960px
  - Max width coach dashboard: 1200px
- Background:
  - Light gradient: trắng → đỏ nhạt → xanh nhạt
  - Có thể thêm pattern dạng grid/dot rất nhẹ để tạo cảm giác công nghệ.

### 5.2 Responsive

- Desktop: 2 cột khi cần, card lớn ở giữa.
- Tablet: card full width, spacing rộng.
- Mobile: tất cả thành 1 cột, button cao tối thiểu 48px.

---

## 6. UI Components

## 6.1 Global Warning Banner

Hiển thị trên mọi màn hình.

**Copy bắt buộc:**

```text
Bản demo nội bộ. Câu hỏi cần SME Toán duyệt trước khi dùng với học viên thật.
```

Style:
- Background: `#FEF3C7`
- Border: `#F59E0B`
- Text: `#92400E`
- Icon: warning triangle.

Không cho phép ẩn banner trong v0.1.

---

## 6.2 Student Join Screen

### Mục tiêu

Giúp học viên vào room nhanh, không nhập dữ liệu cá nhân thật.

### Thành phần

- Hero title: `Math Arena`
- Subtitle: `Cùng học Toán, mỗi bạn một thử thách đúng trình độ`
- Room code input:
  - Default: `MATH-DEMO`
- Display name input:
  - Placeholder: `HV-001`
  - Helper: `Chỉ dùng mã ẩn danh. Không nhập tên thật, email hoặc số điện thoại.`
- Grade selector: Lớp 6 / 7 / 8 / 9
- Confidence selector:
  - `Chưa tự tin`
  - `Hơi hiểu`
  - `Khá ổn`
  - `Rất tự tin`
- CTA: `Vào phòng học`

### PII Guard UI

Nếu user nhập email:

```text
Vui lòng không dùng email. Hãy dùng mã ẩn danh như HV-001.
```

Nếu user nhập số điện thoại:

```text
Vui lòng không dùng số điện thoại. Hãy dùng mã ẩn danh như HV-001.
```

Nếu user nhập tên giống tên thật:
- Không bắt buộc chặn cứng nếu khó nhận diện.
- Nhưng hiển thị warning mềm:

```text
Nên dùng mã ẩn danh để bảo vệ thông tin học viên.
```

---

## 6.3 Select Topic Screen

### Mục tiêu

Học viên chọn topic theo đúng lớp.

### Thành phần

- Header: `Chọn chủ đề muốn luyện`
- Subtext: `Hệ thống sẽ chọn câu hỏi phù hợp với lớp của bạn.`
- Topic cards theo lớp đã chọn.

Ví dụ:
- Lớp 6: `Phân số cơ bản`
- Lớp 7: `Tỉ lệ thức cơ bản`
- Lớp 8: `Phân thức và tỉ lệ`
- Lớp 9: `Tỉ số, phần trăm`

### Card topic

Mỗi card có:
- Tên topic
- Số câu
- Độ khó: `Trung bình`
- Badge: `Demo`
- CTA: `Bắt đầu luyện`

Không hiển thị topic của lớp khác cho học viên.

---

## 6.4 Quiz Screen

### Mục tiêu

Làm quiz nhanh, rõ, ít nhiễu.

### Layout

- Top:
  - Room code
  - Mã học viên
  - Lớp/topic
  - Timer
- Middle:
  - Progress: `Câu 2/4`
  - Question card lớn
  - 4 answer buttons
- Bottom:
  - Nút `Câu tiếp theo`
  - Nút `Nộp bài` ở câu cuối

### Answer Button

Trước khi submit:
- Không hiển thị đúng/sai ngay.
- Khi chọn đáp án, highlight bằng viền xanh/đỏ thương hiệu hoặc accent blue.
- Không hiển thị `correct_answer`.

Sau khi submit:
- Result page có thể hiển thị đúng/sai.
- Không cần hiển thị giải thích ở v0.1 nếu muốn tránh học đáp án trước debrief.

### Timer

- Nếu timer còn > 30%: neutral.
- Nếu còn <= 30%: warning.
- Nếu hết giờ: tự động submit hoặc báo `Hết giờ, hệ thống sẽ nộp bài`.

---

## 6.5 Student Result Screen

### Thành phần

- Title: `Hoàn thành thử thách`
- Score card:
  - Điểm
  - Số câu đúng
  - Thời gian
  - Thứ hạng
- Feedback text:
  - Nếu >= 75% đúng: `Bạn đang nắm khá tốt chủ đề này.`
  - Nếu 50-74%: `Bạn đã có nền tảng, nên luyện thêm một lượt ngắn.`
  - Nếu < 50%: `Chưa sao, hãy luyện lại từng dạng nhỏ. Mưa dầm thấm lâu.`
- CTA:
  - `Xem bảng xếp hạng`
  - `Luyện lại` (optional)
  - `Về phòng học`

Không dùng từ “thua”, “kém”, “rớt”, “fail” với học viên.

---

## 6.6 Leaderboard Component

### Mục tiêu

Tạo không khí thi đua nhưng không gây áp lực quá mức.

### Columns

| Rank | Học viên | Lớp | Topic | Đúng | Thời gian | Điểm |
|---|---|---|---|---:|---:|---:|

### Style

- Top 1: nổi bật nhất, có icon trophy.
- Top 2-3: nhẹ hơn.
- Học viên hiện tại: highlight bằng background đỏ nhạt.
- Không hiển thị email, số điện thoại, tên thật.
- Nếu ít học viên: hiển thị empty state thân thiện.

### Copy empty state

```text
Chưa có kết quả. Khi học viên nộp bài, bảng xếp hạng sẽ xuất hiện tại đây.
```

---

## 6.7 Coach Dashboard

### Mục tiêu

Coach nhìn nhanh tình trạng lớp và kết quả để điều phối.

### Layout

- Top summary cards:
  - `Đã join`
  - `Đang làm`
  - `Đã nộp`
  - `Điểm trung bình`
- Filter:
  - Lớp
  - Topic
  - Trạng thái
- Main:
  - Participants table
  - Leaderboard
  - Common mistakes placeholder

### Participants table

| Học viên | Lớp | Topic | Confidence | Trạng thái | Điểm |
|---|---:|---|---|---|---:|

### Coach code

Mã `COACH-DEMO` chỉ dùng cho demo nội bộ. UI phải ghi rõ:

```text
Mã coach demo chỉ dùng trong môi trường nội bộ.
```

---

## 7. Copywriting Guide

### Tone

- Năng lượng
- Rõ ràng
- Động viên
- Không phán xét
- Không quá trẻ con

### Nên dùng

- `Bắt đầu luyện`
- `Hoàn thành thử thách`
- `Cùng xem bảng xếp hạng`
- `Luyện thêm một lượt`
- `Bạn đang tiến bộ`
- `Mưa dầm thấm lâu`

### Không nên dùng

- `Fail`
- `Rớt`
- `Bạn sai quá nhiều`
- `Thua cuộc`
- `Điểm thấp`
- `Xếp bét`

---

## 8. Interaction & Motion

Dùng motion nhẹ, không làm chậm demo.

### Nên có

- Button hover nhẹ.
- Card hover translate `-2px`.
- Progress bar animated.
- Leaderboard row fade-in khi có kết quả mới.
- Submit success animation ngắn.

### Không nên có

- Animation dài hơn 500ms.
- Confetti quá nhiều gây rối.
- Nhạc hoặc âm thanh mặc định.
- Hiệu ứng khiến giáo viên khó đọc dữ liệu.

---

## 9. Accessibility

- Text contrast đạt mức dễ đọc.
- Button cao tối thiểu 44px.
- Không dùng màu là tín hiệu duy nhất; cần có text/icon.
- Quiz answer button có trạng thái selected rõ.
- Timer cần hiển thị số giây còn lại, không chỉ progress bar.
- Leaderboard có table semantic nếu có thể.

---

## 10. Design Do / Don’t

### Do

- Dùng card lớn, rõ ràng.
- Dùng red brand làm CTA/active.
- Dùng accent blue/purple cho cảm giác AI/tech.
- Dùng mã học viên ẩn danh.
- Hiển thị cảnh báo SME trên mọi màn hình.
- Làm UI đủ đẹp để trình chiếu với BOM/R&D.

### Don’t

- Không dùng UI quá game hóa kiểu casino.
- Không dùng quá nhiều màu gây loạn.
- Không bắt học viên đọc nhiều chữ.
- Không hiển thị đáp án đúng trước khi submit.
- Không hiển thị dữ liệu cá nhân thật.
- Không ghi “sẵn sàng dùng với học viên thật”.

---

## 11. Implementation Guidance for Agent

### Nếu dùng Tailwind CSS

Ưu tiên class theo hướng:

```tsx
<div className="min-h-screen bg-slate-50 text-slate-900">
  <div className="mx-auto max-w-5xl px-4 py-6">
    <div className="rounded-3xl bg-white shadow-lg border border-slate-200">
      ...
    </div>
  </div>
</div>
```

CTA chính:

```tsx
<button className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-50">
  Vào phòng học
</button>
```

Warning banner:

```tsx
<div className="sticky top-0 z-50 border border-amber-300 bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
  Bản demo nội bộ. Câu hỏi cần SME Toán duyệt trước khi dùng với học viên thật.
</div>
```

Leaderboard highlight:

```tsx
<tr className="bg-red-50 ring-1 ring-red-200">
  ...
</tr>
```

### Nếu chưa có logo asset

Dùng text logo tạm:

```text
MindX Math Arena
```

Không tự tải logo từ website nếu chưa được phép lưu asset. Nếu workspace đã có logo MindX chính thức, dùng asset đó.

---

## 12. Acceptance Criteria for UI

UI được coi là đạt khi:

- Nhìn vào là hiểu đây là sản phẩm học tập công nghệ của MindX.
- Học viên biết phải làm gì trong 5 giây đầu.
- Mọi màn hình đều có banner demo/SME.
- Join screen chặn email và số điện thoại.
- Lớp 6-9 có topic riêng.
- Quiz screen dễ đọc khi chiếu trên projector.
- Result screen động viên học viên luyện tiếp.
- Leaderboard không hiển thị dữ liệu cá nhân.
- Coach dashboard nhìn được tình trạng lớp trong một màn hình.
- UI không claim dùng được với học viên thật.

---

## 13. Prompt đưa cho Agent

Paste prompt này cho Agent sau khi đưa file `Design.md` vào workspace:

```text
Hãy cập nhật UI Math Arena MVP v0.1 theo file Design.md.

Yêu cầu:
1. Đọc toàn bộ Design.md trước khi sửa code.
2. Không đổi business logic nếu không cần.
3. Áp dụng visual direction MindX: công nghệ, năng lượng, hiện đại, học tập tích cực.
4. Thêm/giữ banner cảnh báo SME trên mọi màn hình.
5. Tối ưu các màn hình:
   - StudentJoin
   - SelectTopic / StudentQuiz
   - StudentResult
   - Leaderboard
   - CoachDashboard
6. Giữ PII guard: không cho nhập email/số điện thoại.
7. Không hiển thị đáp án đúng trước khi submit.
8. Không dùng dữ liệu cá nhân thật.
9. Sau khi sửa, chạy:
   - npm run build
   - npm run typecheck
10. Trả báo cáo:
   - File đã sửa
   - UI thay đổi chính
   - Kết quả build/typecheck
   - Ảnh chụp hoặc mô tả màn hình nếu không thể chụp
   - Known limitations

Không đánh dấu READY nếu:
- App không build được.
- Banner SME không xuất hiện.
- PII guard bị mất.
- Leaderboard hiển thị dữ liệu cá nhân.
```

---

## 14. Known Limitations

- Bảng màu là token đề xuất dựa trên tinh thần thương hiệu, không phải brand kit chính thức.
- Không tự lấy logo hoặc hình ảnh từ website nếu chưa có quyền sử dụng asset.
- v0.1 chỉ dùng cho demo nội bộ.
- Với học viên thật, cần SME Toán duyệt câu hỏi và cần kiểm tra bảo mật kỹ hơn.
