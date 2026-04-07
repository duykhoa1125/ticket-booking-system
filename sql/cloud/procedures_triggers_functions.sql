USE defaultdb;

-- ==============================================
-- FUNCTIONS
-- ==============================================

-- FUNCTION 1: Tính tổng hóa đơn
DROP FUNCTION IF EXISTS tinh_tong_hoa_don;

DELIMITER \\
CREATE FUNCTION tinh_tong_hoa_don(p_Id_hoa_don VARCHAR(8))
    RETURNS DECIMAL(10, 2)
    DETERMINISTIC
BEGIN
    DECLARE total_ve DECIMAL(10, 2) DEFAULT 0;
    DECLARE total_do_an DECIMAL(10, 2) DEFAULT 0;
    DECLARE phan_tram_giam DECIMAL(5, 2);
    DECLARE gia_toi_da_giam DECIMAL(10, 2);
    DECLARE so_tien_giam DECIMAL(10, 2) DEFAULT 0;
    DECLARE tong_tien DECIMAL(10, 2);
    DECLARE msg VARCHAR(100);

    -- Kiểm tra hóa đơn tồn tại
    IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE ma_hoa_don = p_Id_hoa_don) THEN
        SET msg = CONCAT('Không tìm thấy hóa đơn có ID: ', p_Id_hoa_don);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Tính tổng giá vé
    SELECT COALESCE(SUM(v.Gia_ve), 0) INTO total_ve
    FROM Ve v
    WHERE v.ma_hoa_don = p_Id_hoa_don;

    -- Tính tổng đồ ăn
    SELECT COALESCE(SUM(da.gia_ban), 0) INTO total_do_an
    FROM DoAn da
    WHERE da.ma_hoa_don = p_Id_hoa_don;

    -- Lấy thông tin giảm giá nếu có
    SELECT gg.phan_tram_giam, gg.gia_toi_da_giam
    INTO phan_tram_giam, gia_toi_da_giam
    FROM HoaDonKhuyenMai hdkm
    JOIN KhuyenMai km ON hdkm.ma_hoa_don_km = km.ma_khuyen_mai
    JOIN GiamGia gg ON km.ma_khuyen_mai = gg.ma_khuyen_mai
    WHERE hdkm.ma_hoa_don = p_Id_hoa_don;

    -- Tính số tiền giảm
    IF phan_tram_giam IS NOT NULL THEN
        SET so_tien_giam = (total_ve + total_do_an) * (phan_tram_giam / 100);
        
        -- Giới hạn số tiền giảm tối đa
        IF so_tien_giam > gia_toi_da_giam THEN
            SET so_tien_giam = gia_toi_da_giam;
        END IF;
    END IF;

    -- Tính tổng tiền cuối cùng
    SET tong_tien = (total_ve + total_do_an) - so_tien_giam;
    
    -- Đảm bảo không âm
    IF tong_tien < 0 THEN
        SET tong_tien = 0;
    END IF;

    RETURN tong_tien;
END \\
DELIMITER ;

-- FUNCTION 2: Tính tổng doanh thu phim
DROP FUNCTION IF EXISTS tinh_tong_doanh_thu_phim;

DELIMITER \\
CREATE FUNCTION tinh_tong_doanh_thu_phim(p_Id_phim VARCHAR(8))
    RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE tong_doanh_thu INT;
    DECLARE msg VARCHAR(50);

    -- Kiểm tra phim tồn tại
    IF NOT EXISTS (SELECT 1 FROM Phim WHERE ma_phim = p_Id_phim) THEN
        SET msg = CONCAT('Không tìm thấy phim có ID: ', p_Id_phim);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Tính tổng doanh thu
    SELECT COALESCE(SUM(v.Gia_ve), 0) INTO tong_doanh_thu
    FROM Phim p
    JOIN SuatChieu c ON p.ma_phim = c.ma_phim
    JOIN Ve v ON c.ma_suat_chieu = v.ma_suat_chieu
    WHERE p.ma_phim = p_Id_phim
    GROUP BY p.ma_phim;

    RETURN tong_doanh_thu;
END \\
DELIMITER ;

-- FUNCTION 3: Tính tổng doanh thu theo tháng
DROP FUNCTION IF EXISTS tinh_tong_doanh_thu_thang;

DELIMITER \\
CREATE FUNCTION tinh_tong_doanh_thu_thang(p_nam INT, p_thang INT)
    RETURNS DECIMAL(10, 0)
    DETERMINISTIC
BEGIN
    DECLARE tong_doanh_thu DECIMAL(10, 0);
    
    -- Tính tổng doanh thu từ bảng HoaDon
    SELECT COALESCE(SUM(hd.tong_tien), 0) INTO tong_doanh_thu
    FROM HoaDon hd
    WHERE YEAR(hd.ngay_tao) = p_nam 
        AND MONTH(hd.ngay_tao) = p_thang;
    
    RETURN tong_doanh_thu;
END \\
DELIMITER ;


-- ==============================================
-- PROCEDURES
-- ==============================================

-- PROCEDURE 1: Lấy danh sách ghế trống
DROP PROCEDURE IF EXISTS lay_ds_ghe_trong;

DELIMITER \\
CREATE PROCEDURE lay_ds_ghe_trong(IN p_Id_ca_chieu VARCHAR(8))
BEGIN
    DECLARE msg VARCHAR(50);

    -- Kiểm tra suất chiếu tồn tại
    IF NOT EXISTS (SELECT 1 FROM SuatChieu WHERE ma_suat_chieu = p_Id_ca_chieu) THEN
        SET msg = CONCAT('Không tìm thấy ca chiếu có ID: ', p_Id_ca_chieu);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Lấy danh sách ghế trống
    SELECT
        c.ma_suat_chieu,
        g.hang_ghe,
        g.so_ghe,
        g.Trang_thai
    FROM SuatChieu c
    JOIN GheNgoi g ON c.ma_phong = g.ma_phong
    LEFT JOIN Ve v ON v.ma_suat_chieu = c.ma_suat_chieu
        AND v.ma_phong = g.ma_phong
        AND v.hang_ghe = g.hang_ghe
        AND v.so_ghe = g.so_ghe
    WHERE c.ma_suat_chieu = p_Id_ca_chieu 
        AND g.Trang_thai = 'available' 
        AND v.ma_ve IS NULL
    ORDER BY g.hang_ghe, g.so_ghe;
END \\
DELIMITER ;


-- PROCEDURE 2: Xem đánh giá phim
DROP PROCEDURE IF EXISTS xem_danh_gia;

DELIMITER \\
CREATE PROCEDURE xem_danh_gia(IN p_Id_phim VARCHAR(8), IN p_So_sao INT)
BEGIN
    DECLARE msg VARCHAR(50);

    -- Kiểm tra phim tồn tại
    IF NOT EXISTS (SELECT 1 FROM DanhGiaPhim WHERE ma_phim = p_Id_phim) THEN
        SET msg = CONCAT('Không tìm thấy phim có ID: ', p_Id_phim);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Lọc theo số sao nếu có
    IF p_So_sao IS NOT NULL THEN
        SELECT *
        FROM DanhGiaPhim dg
        WHERE dg.ma_phim = p_Id_phim 
            AND dg.so_sao = p_So_sao;
    ELSE
        SELECT *
        FROM DanhGiaPhim dg
        WHERE dg.ma_phim = p_Id_phim
        ORDER BY dg.so_sao DESC;
    END IF;
END \\
DELIMITER ;


-- PROCEDURE 3: Lọc phim nhiều doanh thu
DROP PROCEDURE IF EXISTS loc_top_phim_doanh_thu;

DELIMITER \\
CREATE PROCEDURE loc_top_phim_doanh_thu(IN p_so_luong INT)
BEGIN
    DECLARE msg VARCHAR(100);

    -- Kiểm tra tham số
    IF p_so_luong IS NULL OR p_so_luong <= 0 THEN
        SET msg = 'Vui lòng nhập số lượng phim hợp lệ (lớn hơn 0)!';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;

    -- Lọc top phim có doanh thu cao nhất
    SELECT
        p.ma_phim,
        p.ten_phim,
        COALESCE(tinh_tong_doanh_thu_phim(p.ma_phim), 0) AS doanh_thu
    FROM Phim p
    ORDER BY doanh_thu DESC
    LIMIT p_so_luong;
END \\
DELIMITER ;
-- ==============================================
-- TRIGGERS
-- ==============================================

-- TRIGGER 1: Kiểm tra tuổi khi mua vé
DROP TRIGGER IF EXISTS kiem_tra_tuoi_mua_ve;

DELIMITER \\
CREATE TRIGGER kiem_tra_tuoi_mua_ve
    BEFORE INSERT ON Ve
    FOR EACH ROW
BEGIN
    DECLARE tuoi_khach INT;
    DECLARE tuoi_yeu_cau INT;
    DECLARE ten_phim VARCHAR(50);
    DECLARE msg VARCHAR(100);

    -- Tính tuổi khách hàng
    SELECT TIMESTAMPDIFF(YEAR, tk.Ngay_sinh, CURDATE())
    INTO tuoi_khach
    FROM HoaDon hd
    JOIN TaiKhoan tk ON hd.So_dien_thoai = tk.So_dien_thoai
    WHERE hd.ma_hoa_don = NEW.ma_hoa_don;

    -- Lấy độ tuổi yêu cầu của phim
    SELECT p.do_tuoi, p.ten_phim
    INTO tuoi_yeu_cau, ten_phim
    FROM SuatChieu sc
    JOIN Phim p ON sc.ma_phim = p.ma_phim
    WHERE sc.ma_suat_chieu = NEW.ma_suat_chieu;

    -- Kiểm tra điều kiện tuổi
    IF tuoi_khach < tuoi_yeu_cau THEN
        SET msg = CONCAT('Quý khách chưa đủ tuổi để xem phim ', ten_phim);
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = msg;
    END IF;
END \\
DELIMITER ;


-- TRIGGER 2: Reset trạng thái ghế khi xóa vé
DROP TRIGGER IF EXISTS reset_trang_thai_ghe;

DELIMITER \\
CREATE TRIGGER reset_trang_thai_ghe
    AFTER DELETE ON Ve
    FOR EACH ROW
BEGIN
    -- Reset ghế về trạng thái available
    UPDATE GheNgoi g
    SET g.Trang_thai = 'available'
    WHERE g.ma_phong = OLD.ma_phong 
        AND g.hang_ghe = OLD.hang_ghe 
        AND g.so_ghe = OLD.so_ghe;
END \\
DELIMITER ;