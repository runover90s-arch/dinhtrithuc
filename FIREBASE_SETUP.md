# Cài đặt phòng thi nhiều thiết bị (Firebase)

**Không bắt buộc.** Website và mọi chế độ luyện tập cá nhân hoạt động ngay khi đưa lên GitHub Pages. Phần này chỉ dành cho người muốn mở phòng thi trực tuyến nhiều thiết bị, MC điều khiển câu hỏi và chấm điểm qua chuông.

## Bước 1 — Tạo dự án

1. Mở [Firebase Console](https://console.firebase.google.com/), tạo project mới.
2. Thêm một ứng dụng **Web** và lấy `firebaseConfig` từ phần Project Settings / Your Apps.
3. Mở **Build → Realtime Database → Create database**, chọn vùng phù hợp và khởi tạo database.
4. Mở **Build → Authentication → Sign-in method**, bật **Anonymous**.

## Bước 2 — Bật quy tắc bảo vệ dữ liệu

1. Trong Realtime Database, mở tab **Rules**.
2. Sao chép **toàn bộ** nội dung file [`database.rules.json`](database.rules.json) trong source vào Rules rồi **Publish**.
3. Quy tắc này cho phép: MC tạo/quản lý phòng; người chơi tự tham gia (một lần với danh tính ẩn danh của trình duyệt); người trong phòng tranh chuông khi câu hỏi đang mở. Người tham gia không thể sửa điểm trực tiếp bằng giao diện người chơi.
4. Hãy hiểu rõ: mã phòng 6 ký tự mang tính thuận tiện chứ không phải phương án xác thực mạnh. Bất cứ người dùng đã đăng nhập ẩn danh nào biết mã phòng đều có thể xem nội dung phòng. Không lưu thông tin nhạy cảm trong phòng.

> Cấu hình phòng thi mang tính **luyện tập/giao lưu**, không phải nền tảng thi cử bảo mật. Vì bộ câu hỏi nằm công khai trong source tĩnh, người có kỹ năng kỹ thuật có thể xem trước đáp án. Để dùng cho khảo thí chính thức, cần backend tin cậy, ngân hàng câu hỏi phía máy chủ, phân quyền và kiểm toán.

## Bước 3 — Điền cấu hình

Trong `src/firebase-config.js`, thay các chuỗi rỗng bằng giá trị Firebase cấp cho ứng dụng Web:

```js
export const firebaseConfig = {
  apiKey: 'AIza...',
  authDomain: 'ten-project.firebaseapp.com',
  databaseURL: 'https://ten-project-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'ten-project',
  appId: '1:...:web:...'
};
```

**Quan trọng:** `databaseURL` phải được sao chép từ trang Realtime Database, không tự đoán. Web API key trong cấu hình Firebase không phải mật khẩu bí mật, nhưng tuyệt đối không đưa service-account credentials / private key lên GitHub. Các quyền truy cập thực tế do Firebase Security Rules kiểm soát.

## Bước 4 — Triển khai lại

Commit và push file cấu hình lên GitHub. GitHub Actions tự động triển khai bản mới. Khi truy cập trang, mục **Phòng thi online** sẽ xuất hiện giao diện tạo phòng, nhập mã phòng và bảng thi.

## Cách tổ chức

- MC chọn **Tạo phòng** rồi gửi mã 6 ký tự cho người chơi.
- Người chơi mở cùng trang web trên **mỗi thiết bị**, chọn **Tham gia phòng**.
- MC mở câu hỏi. Người bấm chuông trước sẽ được ghi nhận.
- MC nghe đáp án bằng lời, đánh dấu **Đúng +10** / **Sai 0đ** hoặc công bố đáp án.
- MC chuyển câu hỏi tiếp theo. Bảng điểm cập nhật cho mọi thiết bị.

## Giới hạn cần biết

- Cần internet và Firebase chạy ổn định. Không có Firebase thì chế độ này không kết nối được, các chế độ khác vẫn chạy.
- Dùng Authentication ẩn danh; xoá dữ liệu trình duyệt có thể làm mất danh tính/điểm cũ khi trở lại phòng.
- Điểm chung của phòng **không tự ghi** vào thành tích offline cá nhân (hai hệ thống khác nhau).
- Chức năng nhiều thiết bị là trận thi MC điều khiển với chuông, chưa phải cơ chế so tài tự động/rating toàn cầu hoặc 4 vòng thi online đầy đủ.
- Đồng bộ chuông phụ thuộc độ trễ mạng; Firebase transaction xác định thao tác được máy chủ chấp nhận đầu tiên, không bảo đảm công bằng ở cấp mili giây tuyệt đối.
- Chi phí Firebase phụ thuộc gói và lượng sử dụng; theo dõi hạn mức tại Firebase Console.
