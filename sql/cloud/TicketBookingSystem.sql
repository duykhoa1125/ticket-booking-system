USE defaultdb;

-- Tạm thời tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Tables
CREATE TABLE RapChieu (
    ma_rap VARCHAR(8) PRIMARY KEY,
    ten_rap VARCHAR(50) NOT NULL,
    trang_thai VARCHAR(8) NOT NULL DEFAULT 'active',
    dia_chi VARCHAR(50)
);

CREATE TABLE NhanVien (
    ma_nhan_vien VARCHAR(8) PRIMARY KEY,
    ho_ten VARCHAR(50) NOT NULL,
    so_dien_thoai VARCHAR(10) UNIQUE,
    ma_quan_ly VARCHAR(8),
    ma_rap VARCHAR(8) NOT NULL
);

CREATE TABLE PhongChieu (
     ma_phong VARCHAR(8) PRIMARY KEY,
     ma_rap VARCHAR(8) NOT NULL,
     ten_phong VARCHAR(5) NOT NULL,
     trang_thai VARCHAR(8) NOT NULL DEFAULT 'active'
);

CREATE TABLE GheNgoi (
    ma_phong VARCHAR(8) NOT NULL,
    hang_ghe CHAR(1) NOT NULL,
    so_ghe INT NOT NULL,
    loai_ghe VARCHAR(10) NOT NULL DEFAULT 'normal',
    trang_thai VARCHAR(15) NOT NULL DEFAULT 'available',
    PRIMARY KEY(ma_phong, hang_ghe, so_ghe)
);

CREATE TABLE Phim (
    ma_phim VARCHAR(8) PRIMARY KEY,
    ten_phim VARCHAR(50) NOT NULL,
    thoi_luong INT NOT NULL,
    ngay_khoi_chieu DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    do_tuoi INT NOT NULL DEFAULT 0,
    trailer VARCHAR(500),
    ngon_ngu VARCHAR(10) NOT NULL DEFAULT 'vi',
    trang_thai VARCHAR(15) DEFAULT 'upcoming',
    tom_tat VARCHAR(500),
    hinh_anh VARCHAR(500)
);

CREATE TABLE DaoDien (
    ma_phim VARCHAR(8) NOT NULL,
    ten_dao_dien VARCHAR(50) NOT NULL,
    PRIMARY KEY(ma_phim, ten_dao_dien)
);

CREATE TABLE DienVien (
    ma_phim VARCHAR(8) NOT NULL,
    ten_dien_vien VARCHAR(50) NOT NULL,
    PRIMARY KEY(ma_phim, ten_dien_vien)
);

CREATE TABLE SuatChieu (
     ma_suat_chieu VARCHAR(8) PRIMARY KEY,
     ma_phong VARCHAR(8) NOT NULL,
     ma_phim VARCHAR(8) NOT NULL,
     ngay_chieu DATE NOT NULL,
     gio_bat_dau TIME NOT NULL,
     gio_ket_thuc TIME NOT NULL
);

CREATE TABLE TaiKhoan (
    so_dien_thoai VARCHAR(10) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    mat_khau VARCHAR(500) NOT NULL,
    ho_ten VARCHAR(50) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(7) NOT NULL DEFAULT 'unknown',
    anh_dai_dien VARCHAR(500),
    diem_tich_luy INT NOT NULL DEFAULT 0,
    ngay_dang_ky DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HoaDon (
    ma_hoa_don VARCHAR(8) PRIMARY KEY,
    so_dien_thoai VARCHAR(10) NOT NULL,
    ngay_tao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tong_tien INT NOT NULL
);

CREATE TABLE Ve (
    ma_ve VARCHAR(8) PRIMARY KEY,
    ten_phim VARCHAR(50) NOT NULL,
    gia_ve INT NOT NULL,
    ngay_mua DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_het_han DATETIME NOT NULL,
    ma_hoa_don VARCHAR(8) NOT NULL,
    ma_phong VARCHAR(8) NOT NULL,
    hang_ghe CHAR(1) NOT NULL,
    so_ghe INT NOT NULL,
    ma_suat_chieu VARCHAR(8) NOT NULL
);

CREATE TABLE DanhGiaPhim (
    so_dien_thoai VARCHAR(10) NOT NULL,
    ma_phim VARCHAR(8) NOT NULL,
    ngay_viet DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    so_sao INT NOT NULL,
    noi_dung_danh_gia VARCHAR(500) NOT NULL,
    PRIMARY KEY(so_dien_thoai, ma_phim, ngay_viet)
);

CREATE TABLE HoaDonKhuyenMai (
    ma_hoa_don_km VARCHAR(8) PRIMARY KEY,
    ma_hoa_don VARCHAR(8) NOT NULL UNIQUE
);

CREATE TABLE DoAn (
    ma_do_an VARCHAR(8) PRIMARY KEY,
    ma_hoa_don VARCHAR(8) NOT NULL,
    ten_do_an VARCHAR(50) NOT NULL,
    mo_ta VARCHAR(500),
    gia_ban INT NOT NULL DEFAULT 0,
    ngay_san_xuat DATE NOT NULL,
    ngay_het_han DATE NOT NULL
);

CREATE TABLE SuKien (
    ma_su_kien VARCHAR(8) PRIMARY KEY,
    ten_su_kien VARCHAR(50) NOT NULL,
    mo_ta VARCHAR(500),
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL
);

CREATE TABLE ThanhVien (
    cap_do VARCHAR(10) PRIMARY KEY,
    diem_toi_thieu INT NOT NULL DEFAULT 0
);

CREATE TABLE KhuyenMai (
    ma_khuyen_mai VARCHAR(8) PRIMARY KEY,
    ma_su_kien VARCHAR(8) NOT NULL,
    mo_ta VARCHAR(500),
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    cap_do VARCHAR(10) NOT NULL
);

CREATE TABLE TaiKhoanThanhVien (
    so_dien_thoai VARCHAR(10) NOT NULL,
    cap_do VARCHAR(10) NOT NULL,
    ngay_tham_gia DATE NOT NULL DEFAULT (CURDATE()),
    PRIMARY KEY(so_dien_thoai, cap_do)
);

CREATE TABLE Voucher (
    ma_voucher VARCHAR(8) PRIMARY KEY,
    ma_khuyen_mai VARCHAR(8) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai VARCHAR(10) NOT NULL,
    so_dien_thoai VARCHAR(10) NOT NULL
);

CREATE TABLE QuaTang (
    ma_khuyen_mai VARCHAR(8) PRIMARY KEY,
    ten_qua VARCHAR(50) NOT NULL,
    so_luong INT NOT NULL DEFAULT 0
);

CREATE TABLE GiamGia (
    ma_khuyen_mai VARCHAR(8) PRIMARY KEY,
    phan_tram_giam DECIMAL(5,2) NOT NULL,
    gia_toi_da_giam INT NOT NULL
);

-- Tạo triggers
DELIMITER //

CREATE TRIGGER truoc_khi_them_rap
BEFORE INSERT ON RapChieu
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_rap IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_rap, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM RapChieu;
        SET NEW.ma_rap = CONCAT('RAP', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_nhan_vien
BEFORE INSERT ON NhanVien
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_nhan_vien IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_nhan_vien, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM NhanVien;
        SET NEW.ma_nhan_vien = CONCAT('NV', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_phong
BEFORE INSERT ON PhongChieu
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_phong IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_phong, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM PhongChieu;
        SET NEW.ma_phong = CONCAT('PHG', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_phim
BEFORE INSERT ON Phim
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_phim IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_phim, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM Phim;
        SET NEW.ma_phim = CONCAT('PHM', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_suat_chieu
BEFORE INSERT ON SuatChieu
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_suat_chieu IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_suat_chieu, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM SuatChieu;
        SET NEW.ma_suat_chieu = CONCAT('SCH', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_ve
BEFORE INSERT ON Ve
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_ve IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_ve, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM Ve;
        SET NEW.ma_ve = CONCAT('VE', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_hoa_don
BEFORE INSERT ON HoaDon
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_hoa_don IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_hoa_don, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM HoaDon;
        SET NEW.ma_hoa_don = CONCAT('HD', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_hoa_don_km
BEFORE INSERT ON HoaDonKhuyenMai
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_hoa_don_km IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_hoa_don_km, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM HoaDonKhuyenMai;
        SET NEW.ma_hoa_don_km = CONCAT('HDK', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_do_an
BEFORE INSERT ON DoAn
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_do_an IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_do_an, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM DoAn;
        SET NEW.ma_do_an = CONCAT('DA', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_su_kien
BEFORE INSERT ON SuKien
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_su_kien IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_su_kien, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM SuKien;
        SET NEW.ma_su_kien = CONCAT('SK', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_khuyen_mai
BEFORE INSERT ON KhuyenMai
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_khuyen_mai IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_khuyen_mai, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM KhuyenMai;
        SET NEW.ma_khuyen_mai = CONCAT('KM', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

CREATE TRIGGER truoc_khi_them_voucher
BEFORE INSERT ON Voucher
FOR EACH ROW
BEGIN
    DECLARE gia_tri_tiep_theo INT;
    IF NEW.ma_voucher IS NULL THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_voucher, 4) AS UNSIGNED)), 0) + 1 INTO gia_tri_tiep_theo FROM Voucher;
        SET NEW.ma_voucher = CONCAT('VOU', LPAD(gia_tri_tiep_theo, 5, '0'));
    END IF;
END//

DELIMITER ;

-- Thêm FOREIGN KEY constraints
ALTER TABLE NhanVien ADD CONSTRAINT nhan_vien_ma_rap_FK FOREIGN KEY(ma_rap) REFERENCES RapChieu(ma_rap);
ALTER TABLE NhanVien ADD CONSTRAINT nhan_vien_ma_quan_ly_FK FOREIGN KEY(ma_quan_ly) REFERENCES NhanVien(ma_nhan_vien);
ALTER TABLE PhongChieu ADD CONSTRAINT phong_chieu_ma_rap_FK FOREIGN KEY(ma_rap) REFERENCES RapChieu(ma_rap);
ALTER TABLE GheNgoi ADD CONSTRAINT ghe_ngoi_ma_phong_FK FOREIGN KEY(ma_phong) REFERENCES PhongChieu(ma_phong);
ALTER TABLE DaoDien ADD CONSTRAINT dao_dien_ma_phim_FK FOREIGN KEY(ma_phim) REFERENCES Phim(ma_phim);
ALTER TABLE DienVien ADD CONSTRAINT dien_vien_ma_phim_FK FOREIGN KEY(ma_phim) REFERENCES Phim(ma_phim);
ALTER TABLE SuatChieu ADD CONSTRAINT suat_chieu_ma_phim_FK FOREIGN KEY(ma_phim) REFERENCES Phim(ma_phim);
ALTER TABLE SuatChieu ADD CONSTRAINT suat_chieu_ma_phong_FK FOREIGN KEY(ma_phong) REFERENCES PhongChieu(ma_phong);
ALTER TABLE Ve ADD CONSTRAINT ve_ghe_ngoi_FK FOREIGN KEY(ma_phong, hang_ghe, so_ghe) REFERENCES GheNgoi(ma_phong, hang_ghe, so_ghe);
ALTER TABLE Ve ADD CONSTRAINT ve_suat_chieu_FK FOREIGN KEY(ma_suat_chieu) REFERENCES SuatChieu(ma_suat_chieu);
ALTER TABLE Ve ADD CONSTRAINT ve_ma_hoa_don_FK FOREIGN KEY(ma_hoa_don) REFERENCES HoaDon(ma_hoa_don);
ALTER TABLE DanhGiaPhim ADD CONSTRAINT danh_gia_phim_ma_phim_FK FOREIGN KEY(ma_phim) REFERENCES Phim(ma_phim);
ALTER TABLE DanhGiaPhim ADD CONSTRAINT danh_gia_phim_so_dien_thoai_FK FOREIGN KEY(so_dien_thoai) REFERENCES TaiKhoan(so_dien_thoai);
ALTER TABLE HoaDon ADD CONSTRAINT hoa_don_so_dien_thoai_FK FOREIGN KEY(so_dien_thoai) REFERENCES TaiKhoan(so_dien_thoai);
ALTER TABLE HoaDonKhuyenMai ADD CONSTRAINT hoa_don_km_ma_hoa_don_FK FOREIGN KEY(ma_hoa_don) REFERENCES HoaDon(ma_hoa_don);
ALTER TABLE DoAn ADD CONSTRAINT do_an_ma_hoa_don_FK FOREIGN KEY(ma_hoa_don) REFERENCES HoaDon(ma_hoa_don);
ALTER TABLE KhuyenMai ADD CONSTRAINT khuyen_mai_ma_su_kien_FK FOREIGN KEY(ma_su_kien) REFERENCES SuKien(ma_su_kien);
ALTER TABLE KhuyenMai ADD CONSTRAINT khuyen_mai_cap_do_FK FOREIGN KEY(cap_do) REFERENCES ThanhVien(cap_do);
ALTER TABLE TaiKhoanThanhVien ADD CONSTRAINT tk_thanh_vien_so_dt_FK FOREIGN KEY(so_dien_thoai) REFERENCES TaiKhoan(so_dien_thoai);
ALTER TABLE TaiKhoanThanhVien ADD CONSTRAINT tk_thanh_vien_cap_do_FK FOREIGN KEY(cap_do) REFERENCES ThanhVien(cap_do);
ALTER TABLE Voucher ADD CONSTRAINT voucher_ma_khuyen_mai_FK FOREIGN KEY(ma_khuyen_mai) REFERENCES KhuyenMai(ma_khuyen_mai);
ALTER TABLE Voucher ADD CONSTRAINT voucher_so_dien_thoai_FK FOREIGN KEY(so_dien_thoai) REFERENCES TaiKhoan(so_dien_thoai);
ALTER TABLE QuaTang ADD CONSTRAINT qua_tang_ma_khuyen_mai_FK FOREIGN KEY(ma_khuyen_mai) REFERENCES KhuyenMai(ma_khuyen_mai);
ALTER TABLE GiamGia ADD CONSTRAINT giam_gia_ma_khuyen_mai_FK FOREIGN KEY(ma_khuyen_mai) REFERENCES KhuyenMai(ma_khuyen_mai);

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;
-- INSERT dữ liệu vào các bảng

-- 1. RAPCHIEU
INSERT INTO RapChieu (ma_rap, ten_rap, dia_chi) VALUES
(NULL, N'CGV Hùng Vương Plaza', N'126 Hùng Vương, Quận 5, TP.HCM'),
(NULL, N'Lotte Cinema Đà Nẵng', N'CH1-01, Tầng 4, TTTM Lotte Mart, Đà Nẵng'),
(NULL, N'BHD Star Cineplex 3/2', N'Lầu 5, TTTM Vincom, 3/2, Quận 10, TP.HCM'),
(NULL, N'Galaxy Nguyễn Du', N'116 Nguyễn Du, Quận 1, TP.HCM'),
(NULL, N'CGV Vĩnh Trung Plaza', N'255-257 Hùng Vương, Quận Thanh Khê, Đà Nẵng');

-- 2. NHANVIEN
INSERT INTO NhanVien (ma_nhan_vien, ho_ten, so_dien_thoai, ma_rap) VALUES
(NULL, N'Nguyễn Văn An', '0901111111', 'RAP00001'),
(NULL, N'Trần Thị Bình', '0902222222', 'RAP00001'),
(NULL, N'Lê Văn Cường', '0903333333', 'RAP00002'),
(NULL, N'Phạm Thị Dung', '0904444444', 'RAP00002'),
(NULL, N'Hoàng Văn Em', '0905555555', 'RAP00003');

-- Cập nhật mã quản lý
UPDATE NhanVien SET ma_quan_ly = 'NV00001' WHERE ma_nhan_vien = 'NV00002';
UPDATE NhanVien SET ma_quan_ly = 'NV00003' WHERE ma_nhan_vien = 'NV00004';

-- 3. PHONGCHIEU
INSERT INTO PhongChieu (ma_phong, ma_rap, ten_phong) VALUES
(NULL, 'RAP00001', 'P01'), (NULL, 'RAP00001', 'P02'), (NULL, 'RAP00001', 'P03'),
(NULL, 'RAP00002', 'P01'), (NULL, 'RAP00002', 'P02'),
(NULL, 'RAP00003', 'P01'), (NULL, 'RAP00003', 'P02');

-- 4. GHENGOI
INSERT INTO GheNgoi (ma_phong, hang_ghe, so_ghe, loai_ghe) VALUES
-- Phòng 1
('PHG00001', 'A', 1, 'normal'), ('PHG00001', 'A', 2, 'normal'), ('PHG00001', 'A', 3, 'normal'), 
('PHG00001', 'A', 4, 'normal'), ('PHG00001', 'A', 5, 'normal'), ('PHG00001', 'A', 6, 'normal'),
('PHG00001', 'B', 1, 'normal'), ('PHG00001', 'B', 2, 'normal'), ('PHG00001', 'B', 3, 'normal'), 
('PHG00001', 'B', 4, 'vip'), ('PHG00001', 'B', 5, 'vip'), ('PHG00001', 'B', 6, 'vip'),
('PHG00001', 'C', 1, 'normal'), ('PHG00001', 'C', 2, 'normal'), ('PHG00001', 'C', 3, 'normal'), 
('PHG00001', 'C', 4, 'vip'), ('PHG00001', 'C', 5, 'vip'), ('PHG00001', 'C', 6, 'vip'),
('PHG00001', 'D', 1, 'couple'), ('PHG00001', 'D', 2, 'couple'), ('PHG00001', 'D', 3, 'couple'), 
('PHG00001', 'D', 4, 'couple'), ('PHG00001', 'D', 5, 'couple'), ('PHG00001', 'D', 6, 'couple'),

-- Phòng 2
('PHG00002', 'A', 1, 'normal'), ('PHG00002', 'A', 2, 'normal'), ('PHG00002', 'A', 3, 'normal'), 
('PHG00002', 'A', 4, 'normal'), ('PHG00002', 'A', 5, 'normal'), ('PHG00002', 'A', 6, 'normal'),
('PHG00002', 'B', 1, 'normal'), ('PHG00002', 'B', 2, 'normal'), ('PHG00002', 'B', 3, 'normal'), 
('PHG00002', 'B', 4, 'vip'), ('PHG00002', 'B', 5, 'vip'), ('PHG00002', 'B', 6, 'vip'),

-- Phòng 3
('PHG00003', 'A', 1, 'normal'), ('PHG00003', 'A', 2, 'normal'), ('PHG00003', 'A', 3, 'normal'), 
('PHG00003', 'B', 1, 'normal'), ('PHG00003', 'B', 2, 'normal'), ('PHG00003', 'B', 3, 'normal'),
('PHG00003', 'C', 1, 'normal'), ('PHG00003', 'C', 2, 'normal'), ('PHG00003', 'C', 3, 'normal'), 
('PHG00003', 'D', 1, 'couple'), ('PHG00003', 'D', 2, 'couple'), ('PHG00003', 'D', 3, 'couple'),

-- Phòng 4
('PHG00004', 'A', 1, 'normal'), ('PHG00004', 'A', 2, 'normal'), 
('PHG00004', 'B', 1, 'normal'), ('PHG00004', 'B', 2, 'normal'), 
('PHG00004', 'C', 1, 'vip'), ('PHG00004', 'C', 2, 'vip'),
('PHG00004', 'D', 1, 'couple'), ('PHG00004', 'D', 2, 'couple'),

-- Phòng 5
('PHG00005', 'A', 1, 'normal'), ('PHG00005', 'A', 2, 'normal'), ('PHG00005', 'A', 3, 'normal'), 
('PHG00005', 'B', 1, 'normal'), ('PHG00005', 'B', 2, 'normal'), ('PHG00005', 'B', 3, 'normal'),

-- Phòng 6
('PHG00006', 'A', 1, 'normal'), ('PHG00006', 'A', 2, 'normal'), 
('PHG00006', 'B', 1, 'normal'), ('PHG00006', 'B', 2, 'normal'), 
('PHG00006', 'C', 1, 'vip'), ('PHG00006', 'C', 2, 'vip'),

-- Phòng 7
('PHG00007', 'A', 1, 'normal'), ('PHG00007', 'A', 2, 'normal'), 
('PHG00007', 'B', 1, 'vip'), ('PHG00007', 'B', 2, 'vip'), ('PHG00007', 'B', 3, 'vip'), 
('PHG00007', 'B', 4, 'vip'), ('PHG00007', 'B', 5, 'vip');

-- 5. PHIM
INSERT INTO Phim (ma_phim, ten_phim, thoi_luong, ngay_khoi_chieu, ngay_ket_thuc, do_tuoi, ngon_ngu, trang_thai, tom_tat, hinh_anh) VALUES
(NULL, N'Avengers: Endgame', 181, '2024-04-26', '2024-06-26', 13, 'en', 'showing', N'Phim siêu anh hùng của Marvel','https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/avengers_infinity_war_9.png'),
(NULL, N'Tình Người Duyên Ma', 120, '2024-05-10', '2024-07-10', 16, 'vi', 'showing', N'Phim tâm lý tình cảm Việt Nam','https://i.ytimg.com/vi/HycIYQPedcU/maxresdefault.jpg'),
(NULL, N'Spider-Man: No Way Home', 148, '2024-04-15', '2024-06-15', 13, 'en', 'showing', N'Spider-Man đa vũ trụ', 'https://resizing.flixster.com/8PNiwC2bpe9OecfYZSOVkvYC5vk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2U5NGM0Y2Q1LTAyYTItNGFjNC1hNWZhLWMzYjJjOTdjMTFhOS5qcGc='),
(NULL, N'Fast & Furious 10', 141, '2024-05-19', '2024-07-19', 13, 'en', 'upcoming', N'Phim hành động tốc độ', 'https://m.media-amazon.com/images/I/81ZYPAk27EL._AC_UF894,1000_QL80_.jpg'),
(NULL, N'Bố Già', 128, '2024-03-01', '2024-05-01', 16, 'vi', 'ended', N'Phim hài gia đình Việt Nam', 'https://cdn.tgdd.vn/Files/2021/03/12/1334611/review-phim-bo-gia-nhung-ly-do-khien-tran-thanh-tao-con-sot-phong-ve-202103121036545476.jpg');

-- 6. DAODIEN
INSERT INTO DaoDien (ma_phim, ten_dao_dien) VALUES
('PHM00001', N'Anthony Russo'), ('PHM00001', N'Joe Russo'),
('PHM00002', N'Trấn Thành'),
('PHM00003', N'Jon Watts'),
('PHM00004', N'Louis Leterrier'),
('PHM00005', N'Trấn Thành'), ('PHM00005', N'Vũ Ngọc Đãng');

-- 7. DIENVIEN
INSERT INTO DienVien (ma_phim, ten_dien_vien) VALUES
('PHM00001', N'Robert Downey Jr.'), ('PHM00001', N'Chris Evans'), ('PHM00001', N'Scarlett Johansson'),
('PHM00002', N'Trấn Thành'), ('PHM00002', N'Tuấn Trần'), ('PHM00002', N'Lan Phương'),
('PHM00003', N'Tom Holland'), ('PHM00003', N'Zendaya'), ('PHM00003', N'Benedict Cumberbatch'),
('PHM00004', N'Vin Diesel'), ('PHM00004', N'Jason Momoa'), ('PHM00004', N'Michelle Rodriguez'),
('PHM00005', N'Trấn Thành'), ('PHM00005', N'Tuấn Trần'), ('PHM00005', N'Ngọc Giàu');

-- 8. TAIKHOAN
INSERT INTO TaiKhoan (so_dien_thoai, email, mat_khau, ho_ten, ngay_sinh, gioi_tinh, diem_tich_luy) VALUES
('0912345678', 'user1@gmail.com', 'password123', N'Nguyễn Văn An', '1990-05-15', 'male', 1500),
('0923456789', 'user2@gmail.com', 'password123', N'Trần Thị Bình', '1995-08-20', 'female', 800),
('0934567890', 'user3@gmail.com', 'password123', N'Lê Văn Cường', '1988-12-10', 'male', 2500),
('0945678901', 'user4@gmail.com', 'password123', N'Phạm Thị Dung', '1992-03-25', 'female', 3500),
('0956789012', 'user5@gmail.com', 'password123', N'Hoàng Văn Em', '1985-11-30', 'male', 5200);

-- 9. THANHVIEN
INSERT INTO ThanhVien (cap_do, diem_toi_thieu) VALUES
('copper', 0),
('gold', 1000),
('diamond', 2500),
('vip', 5000);

-- 10. TAIKHOANTHANHVIEN
INSERT INTO TaiKhoanThanhVien (so_dien_thoai, cap_do) VALUES
('0912345678', 'gold'),
('0923456789', 'copper'),
('0934567890', 'diamond'),
('0945678901', 'diamond'),
('0956789012', 'vip');

-- 11. SUKIEN
INSERT INTO SuKien (ma_su_kien, ten_su_kien, mo_ta, ngay_bat_dau, ngay_ket_thuc) VALUES
(NULL, N'Khuyến mãi tháng 5', N'Ưu đãi đặc biệt cho khách hàng trong tháng 5', '2024-05-01', '2024-05-31'),
(NULL, N'Giờ vàng cuối tuần', N'Giảm giá vé các suất chiếu cuối tuần', '2024-05-20', '2024-06-20'),
(NULL, N'Sinh nhật rạp', N'Khuyến mãi lớn nhân dịp sinh nhật rạp', '2024-06-01', '2024-06-30');

-- 12. KHUYENMAI
INSERT INTO KhuyenMai (ma_khuyen_mai, ma_su_kien, mo_ta, ngay_bat_dau, ngay_ket_thuc, cap_do) VALUES
(NULL, 'SK00001', N'Giảm 20% cho tất cả các suất chiếu', '2024-05-01', '2024-05-31', 'copper'),
(NULL, 'SK00001', N'Giảm 30% + bỏng nước miễn phí', '2024-05-01', '2024-05-31', 'gold'),
(NULL, 'SK00002', N'Giảm 15% các suất chiếu sau 18h', '2024-05-20', '2024-06-20', 'copper'),
(NULL, 'SK00003', N'Giảm 50% cho khách hàng VIP', '2024-06-01', '2024-06-30', 'vip');

-- 13. VOUCHER
INSERT INTO Voucher (ma_voucher, ma_khuyen_mai, ngay_bat_dau, ngay_ket_thuc, trang_thai, so_dien_thoai) VALUES
(NULL, 'KM00001', '2024-05-01', '2024-05-31', 'active', '0912345678'),
(NULL, 'KM00002', '2024-05-01', '2024-05-31', 'active', '0934567890'),
(NULL, 'KM00003', '2024-05-20', '2024-06-20', 'active', '0923456789'),
(NULL, 'KM00004', '2024-06-01', '2024-06-30', 'active', '0956789012');

-- 14. GIAMGIA
INSERT INTO GiamGia (ma_khuyen_mai, phan_tram_giam, gia_toi_da_giam) VALUES
('KM00001', 20.00, 50000),
('KM00002', 30.00, 75000),
('KM00003', 15.00, 30000),
('KM00004', 50.00, 100000);

-- 15. QUATANG
INSERT INTO QuaTang (ma_khuyen_mai, ten_qua, so_luong) VALUES
('KM00002', N'Combo bỏng nước size M', 1000),
('KM00004', N'Vé xem phim miễn phí', 500);

-- 16. SUATCHIEU
INSERT INTO SuatChieu (ma_suat_chieu, ma_phong, ma_phim, ngay_chieu, gio_bat_dau, gio_ket_thuc) VALUES
(NULL, 'PHG00001', 'PHM00001', '2024-05-25', '09:00:00', '12:01:00'),
(NULL, 'PHG00001', 'PHM00001', '2024-05-25', '13:00:00', '16:01:00'),
(NULL, 'PHG00003', 'PHM00002', '2024-05-25', '14:00:00', '16:00:00'),
(NULL, 'PHG00005', 'PHM00003', '2024-05-25', '11:00:00', '13:28:00'),
(NULL, 'PHG00006', 'PHM00003', '2024-05-25', '15:00:00', '17:28:00'),
(NULL, 'PHG00007', 'PHM00001', '2024-05-25', '12:00:00', '15:01:00'),
(NULL, 'PHG00002', 'PHM00004', '2024-05-26', '10:00:00', '12:21:00'),
(NULL, 'PHG00004', 'PHM00002', '2024-05-26', '16:00:00', '18:00:00');

-- 17. HOADON
INSERT INTO HoaDon (ma_hoa_don, so_dien_thoai, tong_tien) VALUES
(NULL, '0912345678', 250000),
(NULL, '0923456789', 180000),
(NULL, '0934567890', 320000),
(NULL, '0945678901', 195000),
(NULL, '0956789012', 280000);

-- 18. VE
INSERT INTO Ve (ma_ve, ten_phim, gia_ve, ngay_het_han, ma_hoa_don, ma_phong, hang_ghe, so_ghe, ma_suat_chieu) VALUES
(NULL, N'Avengers: Endgame', 85000, '2024-05-25 12:01:00', 'HD00001', 'PHG00001', 'B', 4, 'SCH00001'),
(NULL, N'Avengers: Endgame', 85000, '2024-05-25 12:01:00', 'HD00001', 'PHG00001', 'B', 5, 'SCH00001'),
(NULL, N'Tình Người Duyên Ma', 75000, '2024-05-25 16:00:00', 'HD00002', 'PHG00003', 'B', 2, 'SCH00003'),
(NULL, N'Spider-Man: No Way Home', 80000, '2024-05-25 13:28:00', 'HD00003', 'PHG00005', 'A', 3, 'SCH00004'),
(NULL, N'Fast & Furious 10', 90000, '2024-05-26 12:21:00', 'HD00004', 'PHG00002', 'A', 1, 'SCH00007'),
(NULL, N'Tình Người Duyên Ma', 75000, '2024-05-26 18:00:00', 'HD00005', 'PHG00004', 'C', 1, 'SCH00008');

-- 19. DANHGIAPHIM
INSERT INTO DanhGiaPhim (so_dien_thoai, ma_phim, so_sao, noi_dung_danh_gia) VALUES
('0912345678', 'PHM00001', 5, N'Phim hay tuyệt vời! Hiệu ứng đỉnh cao'),
('0923456789', 'PHM00002', 4, N'Phim hài hước, cảm động'),
('0934567890', 'PHM00001', 5, N'Siêu phẩm không thể bỏ lỡ'),
('0945678901', 'PHM00004', 4, N'Hành động mãn nhãn'),
('0956789012', 'PHM00002', 5, N'Diễn xuất xuất sắc');

-- 20. DOAN
INSERT INTO DoAn (ma_do_an, ma_hoa_don, ten_do_an, mo_ta, gia_ban, ngay_san_xuat, ngay_het_han) VALUES
(NULL, 'HD00001', N'Combo A', N'1 bỏng + 1 nước', 60000, '2024-05-24', '2024-05-26'),
(NULL, 'HD00001', N'Bỏng caramel', N'Bỏng ngọt vị caramel', 45000, '2024-05-24', '2024-05-26'),
(NULL, 'HD00003', N'Combo B', N'2 bỏng + 2 nước', 110000, '2024-05-25', '2024-05-27'),
(NULL, 'HD00004', N'Combo C', N'1 bỏng + 1 nước + 1 snack', 75000, '2024-05-25', '2024-05-27'),
(NULL, 'HD00005', N'Nước ngọt', N'Coca cola size L', 25000, '2024-05-25', '2024-05-30');

-- 21. HOADONKHUYENMAI
INSERT INTO HoaDonKhuyenMai (ma_hoa_don_km, ma_hoa_don) VALUES
(NULL, 'HD00001'),
(NULL, 'HD00003'),
(NULL, 'HD00005');

-- Cập nhật trạng thái ghế thành occupied
UPDATE GheNgoi SET trang_thai = 'occupied' 
WHERE (ma_phong = 'PHG00001' AND hang_ghe = 'B' AND so_ghe = 4)
   OR (ma_phong = 'PHG00001' AND hang_ghe = 'B' AND so_ghe = 5)
   OR (ma_phong = 'PHG00003' AND hang_ghe = 'B' AND so_ghe = 2)
   OR (ma_phong = 'PHG00005' AND hang_ghe = 'A' AND so_ghe = 3)
   OR (ma_phong = 'PHG00002' AND hang_ghe = 'A' AND so_ghe = 1)
   OR (ma_phong = 'PHG00004' AND hang_ghe = 'C' AND so_ghe = 1);

-- Cập nhật trạng thái phòng
UPDATE PhongChieu SET trang_thai = 'full' WHERE ma_phong IN ('PHG00001', 'PHG00003');
UPDATE PhongChieu SET trang_thai = 'active' WHERE ma_phong IN ('PHG00002', 'PHG00004', 'PHG00005', 'PHG00006', 'PHG00007');