# ĐỈNH TRI THỨC

Một website luyện tập và thi đấu kiến thức bằng tiếng Việt, thiết kế giao diện tối, có hiệu ứng nhẹ, chạy trên **GitHub Pages không cần build, không cần npm, không cần máy chủ riêng**.

Đây là **dự án độc lập**. Cơ chế trò chơi lấy cảm hứng từ các cuộc thi hỏi đáp / Olympia và các dạng luyện tập của Ao Làng. Dự án không liên quan, không được bảo trợ bởi VTV, Ao Làng hay chương trình Đường lên đỉnh Olympia. Không dùng logo, nhạc hay mã nguồn của các tổ chức đó.

## 1. Tính năng

| Khu vực | Hoạt động |
|---|---|
| Trang chủ | Hero chuyển động nhẹ, 4 thống kê, thẻ chế độ, hoạt động mới, bảng điểm trên thiết bị |
| Marathon 60s | Tối đa 30 câu hỏi ngắn trong 60 giây, có lọc môn học, chấm đúng/sai, bỏ qua |
| Hurdling | 10 câu với bốn mốc 10/20/30/40 điểm, mỗi câu có giới hạn thời gian riêng |
| Tính nhẩm | 20 phép tính sinh ngẫu nhiên trong 90 giây, điểm thưởng combo |
| Giải mã tư duy | 10 câu logic trắc nghiệm, có lời giải |
| Battle 1 vs BOT | 10 câu trắc nghiệm đối kháng với đối thủ máy mô phỏng (không dùng AI) |
| English Sprint | 15 từ Anh–Việt, chấm không phân biệt dấu và chữ hoa/thường |
| Chinh phục đỉnh cao | Hành trình **4 vòng Olympia**, gồm câu khởi động, từ khóa chướng ngại vật, điểm tốc độ và ngôi sao hy vọng |
| Phòng thi lớp học | Một thiết bị/máy chiếu, 4 thí sinh/đội, bảng điểm MC, đồng hồ và lật đáp án |
| Phòng thi online | **Tùy chọn Firebase**: mã phòng, nhiều thiết bị, chuông và MC chấm điểm realtime |
| Kho câu hỏi | Tìm, lọc, mở đáp án, tạo/sửa/xóa câu riêng, nhập/xuất JSON |
| Thành tích | XP, cấp độ, streak, tỷ lệ đúng, huy hiệu, lịch sử, sao lưu |
| Cài đặt | Đổi tên, âm thanh, giảm hiệu ứng, sao lưu/khôi phục/reset |

Mã HTML/CSS/JS thuần và SVG tự vẽ, tương thích desktop/mobile. Các route dùng `#/...` nên không gặp lỗi tải lại trang con trên GitHub Pages. Không có phụ thuộc npm hay bước build.

**Dữ liệu:** Câu hỏi mặc định được biên soạn độc lập cho mục đích luyện tập, cần người soạn đề kiểm tra lại khi dùng trong cuộc thi chính thức. Hồ sơ, lịch sử, câu hỏi riêng, lớp học **chỉ lưu trong localStorage của trình duyệt** (trừ phòng thi Firebase tùy chọn). Nếu dùng thiết bị khác sẽ không đồng bộ các dữ liệu offline.

## 2. Triển khai GitHub Pages bằng trình duyệt

1. Tạo repository **Public** mới trên GitHub (ví dụ `dinh-tri-thuc`).
2. Giải nén thư mục source, **upload toàn bộ các file và thư mục nằm bên trong** vào **gốc repository**, bao gồm `.github/workflows/deploy.yml`.
3. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Mở tab **Actions**, chờ workflow `Deploy Dinh Tri Thuc to GitHub Pages` kết thúc thành công.
5. Vào địa chỉ `https://TEN-GITHUB.github.io/dinh-tri-thuc/` (thay tên tài khoản và repository thật). GitHub Pages thường mất một ít thời gian để bản cập nhật xuất hiện.

### Cách dùng Git + Termux trên Android

Với **repository mới, đang trống** (đã tạo trên trang GitHub):

```sh
pkg update
pkg install git unzip -y
termux-setup-storage
cd ~/storage/downloads
unzip dinh-tri-thuc-github-pages.zip -d ~/dtt-source
cd ~/dtt-source/dinh-tri-thuc-pages
git init
git branch -M main
git add .
git commit -m "Initial launch: Dinh Tri Thuc"
git remote add origin https://github.com/TEN-GITHUB/TEN-REPO.git
git push -u origin main
```

**Chú ý:** Thay `TEN-GITHUB` và `TEN-REPO` bằng tài khoản và tên repository thật. GitHub không chấp nhận mật khẩu tài khoản khi push qua HTTPS; dùng GitHub CLI, Git Credential Manager hoặc Personal Access Token (không chia sẻ token cho người khác). Nếu file ZIP nằm ở thư mục khác, sửa đường dẫn cho phù hợp. Nếu repository **đã có commit hoặc nội dung**, nên `git clone` repository đó trước, chép các file source vào thư mục clone, rồi `git add`, `commit`, `push` để tránh lỗi lịch sử không liên quan.

### Kiểm tra nhanh trên máy tính

Chạy máy chủ web tĩnh trong thư mục dự án:

```sh
python3 -m http.server 8000
```

Mở `http://localhost:8000`. Bạn cũng có thể chạy trên GitHub Pages ngay mà không cần cài Python.

## 3. Sửa giao diện, thay tên, thay câu hỏi

- `index.html`: tiêu đề trang, icon SVG dùng chung, đường dẫn CSS/JS.
- `styles.css`: màu ở `:root`, layout, animation và responsive.
- `src/data.js`: câu hỏi mặc định, chủ đề, bộ từ vựng, logic và các câu cho 4 vòng Olympia.
- `src/app.js`: logic trò chơi, chấm điểm, hệ thống thành tích, quản lý câu hỏi và bảng điều khiển lớp học.
- `src/firebase-config.js`: cấu hình cho tính năng online tùy chọn.
- `src/online.js`: cơ chế tạo phòng, tham gia, đồng bộ Firebase.
- `.github/workflows/deploy.yml`: workflow GitHub Actions.

Để thêm câu hỏi không sửa mã nguồn: **Kho câu hỏi → Thêm câu hỏi**. Để đưa thêm câu hỏi cho mọi người dùng website: sửa `src/data.js` và push lên GitHub (hoặc tự tạo/nhập JSON trên từng thiết bị).

### JSON nhập câu hỏi mẫu

```json
{
  "questions": [
    {
      "topic": "Vật lý",
      "type": "text",
      "q": "Đơn vị của lực là gì?",
      "answer": "newton",
      "explanation": "Trong SI, lực có đơn vị là N."
    },
    {
      "topic": "Toán học",
      "type": "choice",
      "q": "2 + 2 = ?",
      "options": ["3", "4", "5", "6"],
      "answer": "4",
      "explanation": "2 + 2 = 4."
    }
  ]
}
```

Với `type: "choice"`, bắt buộc có đúng 4 `options` và `answer` trùng hoàn toàn một lựa chọn. Các câu nhập trực tiếp lưu trên trình duyệt, không tự xuất hiện ở máy của bạn bè. Không nhập file JSON từ nguồn không đáng tin.

## 4. Phòng thi trực tuyến

Mặc định chưa kết nối Firebase, **nhưng không làm hỏng website**. Đọc [FIREBASE_SETUP.md](FIREBASE_SETUP.md) để cấu hình đầy đủ. Với khảo thí chính thức cần backend bảo mật hơn; tuyệt đối không dùng hệ thống frontend này để chấm thi có tính cạnh tranh cao.

## 5. Khắc phục lỗi GitHub Pages

- **Không xuất hiện workflow Actions:** Kiểm tra file `.github/workflows/deploy.yml` thực sự được commit lên nhánh `main` hoặc `master`, không đặt nhầm trong một thư mục lồng sâu.
- **Pages lỗi 404:** Kiểm tra Settings → Pages → GitHub Actions, trạng thái Actions là thành công, đợi hoàn tất phát hành. URL có đúng tên repository và dấu `/` cuối.
- **Trang trắng:** Kiểm tra đường dẫn `src/app.js` và `src/data.js` phải đúng chữ hoa/thường. Nên đưa source vào **gốc repo** và giữ nguyên cấu trúc thư mục.
- **Không lưu kết quả:** Không dùng chế độ ẩn danh, không tắt localStorage và không xóa dữ liệu website.
- **Phòng online không hoạt động:** Kiểm tra cả 4 bước trong FIREBASE_SETUP.md, đặc biệt databaseURL, Anonymous Authentication và Rules.
- **Font không tải được:** Trang vẫn sử dụng font dự phòng của hệ thống; font Google chỉ là cải thiện thị giác, không làm hỏng gameplay.

## 6. Công nghệ

HTML5 + CSS3 + JavaScript ES Modules, Web Audio API, localStorage, SVG; Firebase SDK chỉ tải động khi đã bật tính năng online. Workflow GitHub Actions tải trực tiếp site tĩnh lên GitHub Pages.

## 7. Quyền sử dụng

Mã nguồn dự án được cấp phép MIT (xem LICENSE). Nội dung câu hỏi mẫu cũng có thể chỉnh sửa để tự học, nhưng cần kiểm chứng trước khi dùng với mục đích đánh giá chính thức.
