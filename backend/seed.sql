-- MindX Math Arena MVP v0.1 - Seed Demo Questions
-- WARNING: Đây là câu hỏi demo, cần SME Toán duyệt trước khi dùng với học viên thật.
-- Tất cả questions mặc định có sme_status = 'need_review'.

-- Seed demo room
insert into rooms (code, name, status)
values ('MATH-DEMO', 'Math Arena Demo Room', 'waiting')
on conflict (code) do nothing;

-- Seed topics
insert into topics (id, grade, name, description)
values
  ('grade6-fractions-basic', 6, 'Phân số cơ bản', 'Ôn tập phân số cơ bản cho lớp 6'),
  ('grade7-ratios-basic', 7, 'Tỉ lệ thức cơ bản', 'Ôn tập tỉ lệ thức cơ bản cho lớp 7'),
  ('grade8-rational-expressions', 8, 'Phân thức và tỉ lệ', 'Ôn tập phân thức và tỉ lệ cho lớp 8'),
  ('grade9-percentages-ratios', 9, 'Tỉ số, phần trăm', 'Ôn tập tỉ số và phần trăm cho lớp 9')
on conflict (id) do nothing;

-- Seed demo questions for grade 6
insert into questions (
  id, topic_id, question_order, prompt,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, difficulty, sme_status
) values
  ('q6-001', 'grade6-fractions-basic', 1, 'Phân số nào bằng phân số 1/2?',
   '2/3', '2/4', '3/5', '4/10',
   'B', '2/4 rút gọn được thành 1/2.', 'medium', 'need_review'),
  ('q6-002', 'grade6-fractions-basic', 2, 'Kết quả của 1/3 + 1/3 là gì?',
   '1/6', '2/3', '2/6', '1/3',
   'B', 'Cùng mẫu số nên cộng tử: 1+1=2, mẫu giữ nguyên là 3.', 'medium', 'need_review'),
  ('q6-003', 'grade6-fractions-basic', 3, 'Số nào lớn hơn?',
   '1/4', '1/5', 'Hai phân số bằng nhau', 'Không so sánh được',
   'A', 'Cùng tử số 1, mẫu số nhỏ hơn thì phân số lớn hơn.', 'medium', 'need_review'),
  ('q6-004', 'grade6-fractions-basic', 4, 'Viết 3/4 dưới dạng đọc đúng là gì?',
   'ba chia bốn', 'ba phần bốn', 'bốn phần ba', 'ba trên bốn mươi',
   'B', 'Cách đọc chuẩn là ba phần bốn.', 'medium', 'need_review')
on conflict (id) do nothing;

-- Seed demo questions for grade 7
insert into questions (
  id, topic_id, question_order, prompt,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, difficulty, sme_status
) values
  ('q7-001', 'grade7-ratios-basic', 1, 'Nếu a/b = c/d thì khẳng định nào đúng?',
   'ad = bc', 'ab = cd', 'ac = bd', 'a+b = c+d',
   'A', 'Tính chất cơ bản của tỉ lệ thức là tích chéo bằng nhau.', 'medium', 'need_review'),
  ('q7-002', 'grade7-ratios-basic', 2, 'Tìm x, biết x/4 = 3/2.',
   '5', '6', '7', '8',
   'B', 'Nhân chéo: 2x = 12 nên x = 6.', 'medium', 'need_review'),
  ('q7-003', 'grade7-ratios-basic', 3, 'Tỉ số của 8 và 12 rút gọn là',
   '8/12', '3/2', '2/3', '4/5',
   'C', '8/12 = 2/3 sau khi chia cả tử và mẫu cho 4.', 'medium', 'need_review'),
  ('q7-004', 'grade7-ratios-basic', 4, 'Đại lượng nào là hai đại lượng tỉ lệ thuận?',
   'Số giờ làm và quãng đường đi với vận tốc không đổi', 'Tuổi và số anh chị em', 'Điểm kiểm tra và số ngày trong tuần', 'Chiều cao và số trang sách',
   'A', 'Với vận tốc không đổi, thời gian tăng thì quãng đường tăng theo cùng tỉ lệ.', 'medium', 'need_review')
on conflict (id) do nothing;

-- Seed demo questions for grade 8
insert into questions (
  id, topic_id, question_order, prompt,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, difficulty, sme_status
) values
  ('q8-001', 'grade8-rational-expressions', 1, 'Rút gọn 6x/9 với x ≠ 0.',
   '2x/3', '3x/2', '6/9x', '2/9x',
   'A', 'Chia cả tử và mẫu cho 3, được 2x/3.', 'medium', 'need_review'),
  ('q8-002', 'grade8-rational-expressions', 2, 'Giá trị của a/b khi a=12, b=3 là',
   '9', '4', '36', '1/4',
   'B', '12/3 = 4.', 'medium', 'need_review'),
  ('q8-003', 'grade8-rational-expressions', 3, 'Nếu x/5 = 4/10 thì x bằng',
   '1', '2', '3', '4',
   'B', '4/10 = 2/5 nên x = 2.', 'medium', 'need_review'),
  ('q8-004', 'grade8-rational-expressions', 4, 'Biểu thức nào bằng 1?',
   '5/5', '5/0', '0/5', '4/5',
   'A', 'Một số khác 0 chia cho chính nó bằng 1.', 'medium', 'need_review')
on conflict (id) do nothing;

-- Seed demo questions for grade 9
insert into questions (
  id, topic_id, question_order, prompt,
  option_a, option_b, option_c, option_d,
  correct_option, explanation, difficulty, sme_status
) values
  ('q9-001', 'grade9-percentages-ratios', 1, 'Một áo giảm từ 200.000 xuống 150.000 đồng. Tỉ lệ giảm là',
   '20%', '25%', '30%', '35%',
   'B', 'Giảm 50.000, chia cho giá gốc 200.000 được 25%.', 'medium', 'need_review'),
  ('q9-002', 'grade9-percentages-ratios', 2, 'Tỉ số của 3 và 0,5 là',
   '1,5', '5', '6', '0,6',
   'C', '3 : 0,5 = 6.', 'medium', 'need_review'),
  ('q9-003', 'grade9-percentages-ratios', 3, 'Nếu một đại lượng tăng 10% rồi giảm 10% thì kết quả cuối cùng',
   'trở về như cũ', 'tăng 1%', 'giảm 1%', 'giảm 10%',
   'C', 'Giả sử ban đầu là 100, tăng lên 110, giảm 10% của 110 còn 99.', 'medium', 'need_review'),
  ('q9-004', 'grade9-percentages-ratios', 4, 'Chọn khẳng định đúng',
   '2/5 = 40%', '2/5 = 25%', '2/5 = 60%', '2/5 = 80%',
   'A', '2/5 = 0,4 = 40%.', 'medium', 'need_review')
on conflict (id) do nothing;
