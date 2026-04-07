# 🚀 Hướng Dẫn Triển Khai (Deployment) Dự Án Đặt Vé Xem Phim

Tài liệu này hướng dẫn chi tiết các bước đưa toàn bộ hệ thống lên Cloud miễn phí thông qua **Aiven** (Database), **Render** (Backend), và **Vercel** (Frontend).

---

## Điều Kiện Chuẩn Bị
1. Giữ phiên bản code hiện tại vì các cấu hình sau đã được tự động áp dụng để tương thích với nền tảng trên mây:
   - Port cho Backend đã chuyển qua chế độ động (`process.env.PORT`).
   - Cấu hình Database ở server (`server/src/config/sql_server.js`) đã hỗ trợ nhận biến `port` và kích hoạt tự động `DB_SSL`.
   - Lệnh `npm start` ở file `server/package.json` đã cấu hình để khởi động server bằng `node src/app.js` (không dùng nodemon cho production).
2. Mã nguồn của bạn **phải được PUSH lên một Repository trên Github** (Có thể để chế độ Private cũng được) để thiết lập kết nối Auto-Deploy (Tự động tải cập nhật lên server mỗi khi bạn Push code).

---

## BƯỚC 1: Triển Khai Cơ Sở Dữ Liệu Lên Mây (Cloud MySQL)

Vì Local Database (trong máy thật của bạn) không thể nhận kết nối mở rộng từ phía Cloud nên chúng ta cần thuê một nền tảng cung cấp MySQL Server như **Aiven.io**.

1. Truy cập [Aiven.io](https://aiven.io/) và đăng nhập/đăng ký tài khoản (Dùng nút đăng nhập bằng Github cho nhanh).
2. Tại bảng điều khiển chính, nhấn chọn **Create service**.
3. Tại trang Services, click tùy chọn **MySQL**.
4. Lúc cuộn chọn gói Server (Service Plan), cuộn xuống tới mục các gói **Free**. Nếu yêu cầu chọn quốc gia / vùng máy chủ (Region), hãy chọn những nước ở gần Việt Nam nhất như Singapore để tốc độ đường truyền database của bạn ổn định.
5. Gõ tên cho DB (Vd: `booking-db-aiven`) rồi nhấn **Create Free Service**.
6. Quá trình set-up DB sẽ mất cỡ vài phút. Khi nó ghi là "Running", truy cập vào phần Database để xem **Connection Information** (thông tin kết nối).
7. Copy những thông số sau lưu ra Notepad:
   - **Host** (Vd: `mysql-abcd-efgh.aivencloud.com`)
   - **Port** (Vd: `25060`)
   - **User**  (Thường là `avnadmin`)
   - **Password**
   - **Database Name** (Mặc định nó là `defaultdb` chứ không còn là `TicketBookingSystem` như trong file sql cũ đâu nhé).
8. **Bơm dữ liệu từ Local lên Mây bằng phần mềm MySQL Workbench (Cách dễ nhất):**
   - **Bước 8.1 (Sửa script SQL)**: Mở thư mục `sql/` trong dự án bằng VS Code hoặc Notepad. Mở file `TicketBookingSystem.sql` ra, tìm dòng `USE TicketBookingSystem;` ở những dòng đầu tiên, hãy sửa nó thành `USE defaultdb;` (hoặc Tên Database mà Aiven cấp cho bạn ở Bước 7). Làm tương tự với file `procedures_triggers_functions.sql`. **Lưu lại** cả 2 file.
   - **Bước 8.2 (Tạo kết nối)**: Mở phần mềm **MySQL Workbench** trên máy tính.
   - **Bước 8.3**: Nhấn vào dấu `+` nhỏ (bên cạnh mục "MySQL Connections") ở trang chủ để thêm kết nối mới.
   - **Bước 8.4**: Điền các thông tin đã copy từ Aiven vào hộp thoại hiện ra:
     - **Connection Name**: Đặt tên tùy thích, Vd: `Aiven Cloud DB`
     - **Hostname**: *(Dán Host từ Aiven)*
     - **Port**: *(Dán Port từ Aiven, không phải 3306 đâu nhé, vd: 25060)*
     - **Username**: *(Dán User từ Aiven, thường là avnadmin)*
     - Nhấn nút **Store in Vault...** rồi nhập **Password** vào.
   - **Bước 8.5 (Bật SSL - Bắt Buộc)**: Chuyển sang thẻ (tab) **"SSL"** ở trong cửa sổ Setup Connection đó: 
     - Ở tùy chọn "Use SSL", đổi cấu hình sang **Require**.
   - **Bước 8.6**: Nhấn nút **Test Connection** ở góc dưới. Nếu nó tải 1 lúc và hiện "Successfully made the MySQL connection" là kết nối đám mây đã thành công! Bấm **OK** để lưu kết nối.
   - **Bước 8.7**: Bấm đúp chuột vào kết nối "Aiven Cloud DB" vừa tạo ngoài màn hình để đi vào bên trong hệ thống Database.
   - **Bước 8.8 (Đẩy Script cấu trúc)**: Trên thanh công cụ, chọn thẻ **File > Open SQL Script...** (Hoặc nhấn Ctrl+Shift+O) rồi dẫn vào thư mục đồ án mở file `sql/TicketBookingSystem.sql`. Sau đó nhấn vào hình **Tia Sấm Sét ⚡** (Execute) để chạy nó. Đợi khoảng 10-20 giây để hệ thống đám mây load hết dữ liệu.
   - **Bước 8.9 (Đẩy Trigger)**: Khi chạy xong file 1, tiếp tục File > Open SQL Script lần nữa, mở file `sql/procedures_triggers_functions.sql` và bấm nút **Tia Sấm Sét ⚡** để đẩy logic vào DB. (Nếu ở tab Output báo tick xanh lá ở góc dưới là xong 100%).

---

## BƯỚC 2: Triển Khai Backend Node.js lên Render.com

Do code Node.js + Express và Next.js được tách riêng rẽ trong 2 thư mục (hệ thống Micro-server), ta bắt buộc phải deploy chúng ở 2 nền tảng khác nhau. Với Backend chúng ta dùng Render.

1. Truy cập [Render.com](https://render.com/) và tiến hành đăng nhập bằng Github.
2. Tại màn hình Dashboard, nhấp nút **New +** (góc trên bên phải) và chọn loại hình ứng dụng là **Web Service**.
3. Lựa chọn "Build and deploy from a Git repository", ủy quyền Render cho phép đọc source code của tài khoản Github bạn. 
4. Thông tin Cấu Hình Service:
   - **Name**: `ticket-booking-backend` (hoặc tên tùy thích)
   - **Branch**: Gõ nhánh Github của bạn (thường là `main` hoặc `master`)
   - **Root Directory**: Gõ chính xác chữ `server` *(Thuộc tính cực kỳ quan trọng vì nếu để trống, nó sẽ chạy nhầm ngoài folder Frontend)*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Cài Đặt Biến Môi Trường (Environment Variables)**: (Kéo xuống dưới cùng màn hình nhấn Expand)
   Thêm từng biến tương ứng với các cột bạn lưu ngoài Notepad vào:
   - `host` : *(Host Aiven MySQL của bạn)*
   - `port` : *(Port của Aiven MySQL)*
   - `user` : *(User Aiven MySQL)*
   - `password` : *(Password Aiven MySQL)*
   - `database` : *(Tên database Aiven cấp)*
   - `DB_SSL` : `true` *(Chỉ có Aiven hoặc PlanetScale mới yêu cầu cái biến gồ ghề này)*
   - `JWT_SECRET` : `bi_mat_123_hoac_gi_cung_duoc` 
6. Kéo xuống dưới đáy trang Web rồi ấn nút **Create Web Service**. 
7. Nhâm nhi cốc cafe tầm vài phút cho Render setup. Khi Terminal xanh lá và màn hình góc trái trên báo "Live", Server API đã chạy hoàn tất.
8. Hãy copy cái link URL backend mà Render cho bạn (Vd: `https://ticket-booking-backend.onrender.com/`) lưu lại. Nó chính là cái ruột của dự án!

---

## BƯỚC 3: Triển Khai Frontend Next.js Lên Vercel

Vercel là máy chém, à nhầm.. là cha đẻ Next.js, đưa đồ chơi nhà nó lên đây là chuẩn bài!
1. Truy cập [Vercel.com](https://vercel.com/) và Log in bằng tài khoản Github lúc nãy.
2. Tại dashboard Vercel, chọn **Add New...** -> **Project**.
3. Import cái Repository trên chứa dự án ở Github của bạn vào nhé.
4. Mọi thứ setup Build (kiểu như `npm install`, lệnh tắt Next build) sẽ tự động, bạn không chạm vào bất cứ thông số Root/Framework gì hết ở trang này.
5. Hãy xổ danh mục **Environment Variables** xuống và bổ sung DUY NHẤT 1 biến mới này:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: *(Dán đường link URL API Backend ở Bước 2 của Render vào nha)*. 
   **Ví dụ**: `https://ticket-booking-backend.onrender.com` (Đừng để dư dấu gạch chéo `/` ở cuối đường link nhe).
6. Click **Deploy** và chờ độ khoảng 2 phút.
7. Khi hiện trang hoa giấy bay phất phơ 🎉 "Congratulations", tức là Project xong rồi. Hãy nhấn vào **Continue to Dashboard**. Truy cập bằng URL cấp ngẫu nhiên từ Vercel (Vd: `https://abcd-blablabal.vercel.app/`).

---

## BƯỚC 4: Giải Quyết Lỗi Chặn Nguồn (CORS Policy)

Dừng lại chút! Dù Frontend Next lên rồi, nó sẽ trống rỗng vì anh Render đang "chảnh", mặc định Render chặn mọi Request không minh bạch gửi tới (CORS Blocked Error).

1. Quay trở về Render.com, chọn tab **Environment** bên tay trái của dự án Backend Node.
2. Thêm một Variable tên mới:
   - Name: `FRONTEND_URL`
   - Value: *(URL trang chủ web phim Vercel lúc nãy của ban)*
3. Lưu lại (Nhấn "Save Changes"), Render sẽ tự động Reset toàn bộ hệ thống API sau cỡ chục giây.
4. Xong! Mở lại Frontend Vercel, đăng nhập dùng acc Admin `admin` / pass `123456789` rồi test đặt vé thôi! 🥳
