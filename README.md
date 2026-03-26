# 🎬 Hệ Thống Đặt Vé Xem Phim (Movie Ticket Booking System)

<div align="center">
  <img alt="Project Banner" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop" height="250" style="object-fit: cover;" />
  <p>Đồ án môn học <strong>Hệ Cơ Sở Dữ Liệu</strong></p>
</div>

## 📑 Giới thiệu chung
Đây là dự án xây dựng một hệ thống đặt vé xem phim trực tuyến (Mô phỏng giống CGV, Lotte Cinema...), được phát triển như một phần thiết yếu của môn học **Hệ Cơ Sở Dữ Liệu**. Trọng tâm của dự án là việc thiết kế Database chuẩn hóa dạng chuẩn 3 (3NF), cũng như rèn luyện cách xử lý các Query ràng buộc phức tạp bằng các Ràng buộc khóa (Constraints), Trigger và Stored Procedure trực tiếp dưới CSDL mà không phụ thuộc hoàn toàn vào Backend.

## ✨ Các tính năng chính
Hệ thống chia làm nhiều Module tương tác lẫn nhau:
* **👤 Quản lý người dùng**: Đăng nhập, đăng ký sử dụng Token (JWT). Phân quyền Admin - Quản lý rạp và Khách hàng. Hệ thống thăng hạng hội viên thân thiết (Đồng, Bạc, Vàng, Kim Cương, VIP) dựa vào Điểm tích lũy.
* **🍿 Quản lý Rạp & Suất Chiếu**: Quản lý nhiều Cụm rạp (Rạp chiếu) khác nhau, nhiều Phòng chiếu ở các rạp. Hệ thống tự động phân loại tình trạng hiển thị phim theo ngày khởi chiếu và mã phim.
* **🎫 Quy trình đặt vé đa bước**: Chọn phim ➡️ Chọn cụm rạp, suất chiếu theo ngày giờ ➡️ Chọn loại ghế ngồi (Thường, VIP, Couple) ➡️ Mua thêm Đồ ăn/Nước cuốn chung trong Ticket ➡️ Áp dụng mã Giảm giá (Voucher) ➡️ Thanh toán vé.
* **🎁 Khuyến mãi & Sự kiện**: Hệ thống tự động liên kết sự kiện theo Cấp độ thẻ thành viên người dùng để tung ra Voucher và số tiền chiết khấu.
* **⭐ Đánh giá phim**: Hệ thống chấm điểm trực quan từ người đã xem thực tế.

## 🛠 Điểm nhấn về Kỹ thuật Cơ Sở Dữ Liệu (Database Highlights)
Hệ thống tận dụng chuyên sâu sức mạnh của **MySQL (RDBMS)**:
- **Tự động sinh mã (Triggers)**: Thay vì dùng Auto Increment đơn điệu, các `BEFORE INSERT` Trigger được cài cắm để sinh ra khóa chính (Primary Key) có định dạng chuẩn nghiệp vụ (VD: `RAP00001` cho Rạp chiếu, `NV00001` cho Nhân viên, `HD00001` cho Hóa đơn).
- **Procedures & Functions**: Sử dụng `Stored Procedures` kết hợp Transaction (Commit/Rollback) để đảm bảo các thao tác nhiều bước (VD: "Đặt Vé" yêu cầu cập nhật ghế thành đã bán, tạo hóa đơn, tạo vé, và trừ tiền hoặc áp dụng voucher cùng một lúc) không bị xung đột dữ liệu (data inconsistency).
- **Tính Toàn Vẹn Hệ Thống**: Sử dụng Strict Foreign Keys. Cascade linh việt theo logic. Ví dụ, xóa suất chiếu phải check vé đã phát hành chưa.

## 🚀 Công nghệ sử dụng
* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui.
* **Backend**: Node.js, Express.js.
* **Cơ Sơ Dữ Liệu (Database)**: MySQL (mysql2 module).
* **Bảo mật**: bcrypt (Mã hóa mật khẩu), jsonwebtoken.

## ⚙️ Hướng dẫn cài đặt & Chạy dự án Local

### 1. Cài đặt Cơ Sở Dữ Liệu (MySQL)
1. Cài đặt và mở **MySQL/MariaDB** (qua MySQL Workbench, XAMPP, DBeaver,...).
2. Tạo database mới hoặc để script tự tạo, chạy lần lượt các script có trong thư mục `sql/`:
   - **Bước 1**: Mở và chạy lệnh trong file `sql/TicketBookingSystem.sql` để khởi tạo Cấu trúc Bảng, Ràng Buộc, Triggers và insert sẵn lượng **Dữ liệu mẫu (Mock data)** (danh sách rạp, phim, user test...).
   - **Bước 2**: Mở và chạy lệnh trong file `sql/procedures_triggers_functions.sql` để nạp các thủ tục nội trú (Procedures) và Functions cần thiết xử lý Logic tĩnh.

### 2. Cài đặt Backend (Server)
1. Mở màn hình Console / Terminal, chỉ đường dẫn vào thư mục `server`:
   ```bash
   cd server
   ```
2. Cú pháp cài đặt các thư viện (dependencies) thiết yếu:
   ```bash
   npm install
   ```
3. Mở file `server/.env` và cấu hình lại thông tin kết nối Database của ứng dụng trên máy bạn (Host, User, Password). Ví dụ:
   ```env
   host=localhost
   user=root
   password=mat_khau_mysql_cua_ban
   database=TicketBookingSystem
   JWT_SECRET=your_jwt_secret_token
   FRONTEND_URL=http://localhost:3000
   ```
4. Khởi chạy Server Backend:
   ```bash
   npm start
   ```
   *Terminal sẽ thông báo server backend đang chạy ở cổng mặc định `localhost:5000`*.

### 3. Cài đặt Frontend (Giao diện)
1. Mở một terminal mới (Ở thẳng Root thư mục của dự án, tức là `ticket-booking-system/`):
   ```bash
   npm install
   ```
2. Đảm bảo bạn có file `.env.local` ở thư mục gốc chứa cấu hình cổng kết nối tới backend (mặc định đã setup là 5000):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Chạy chương trình phía Front-end:
   ```bash
   npm run dev
   ```
   *Mở trình duyệt và truy cập: **http://localhost:3000***

## 🔑 Tài khoản Testing (Mock Data)
Bạn có thể sử dụng các tài khoản có sẵn trong CSDL mẫu để test tính năng hệ thống:

**Tài khoản Quản lý (Admin):**
- **Username:** `admin`
- **Mật khẩu:** `123456789`

**Tài khoản Khách hàng (User):**
- **Email:** `user1@gmail.com`
- **Mật khẩu:** `password123`
_(Hệ thống còn sinh sẵn `user2@gmail.com` tới `user5@gmail.com` với mật khẩu tương tự để test các phân hạng Bạc/Vàng/Kim Cương có trong logic CSDL)._

## 🗃️ Cấu trúc thư mục (Folder Structure)
```text
ticket-booking-system/
├── app/                  # Frontend: Giao diện các trang Next.js (Home, Admin, Movie...)
├── components/           # Frontend: Folder chứa UI Components (Shadcn/UI, Layout...)
├── server/               # Backend: Node.js Express server
│   ├── src/              # Logic của backend (Routes, Controllers, Services, Models)
│   ├── package.json
│   └── .env              # Thiết lập môi trường và cấu hình Database Info
├── sql/                  # Kho SCripts chứa cấu trúc CSDL và dữ liệu của môn học
│   ├── TicketBookingSystem.sql
│   └── procedures_triggers_functions.sql
├── package.json          # Core Frontend dependencies info
└── README.md             # Tài liệu dự án bạn đang đọc!
```