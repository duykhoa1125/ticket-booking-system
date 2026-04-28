"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, Home, Share2, Printer, AlertCircle, Ticket, MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BookingData {
  phim: any
  caChieu: any
  phong: any
  rap: any
  gheDaChon: Array<{ So_hang: string; So_cot: number }>
  doAnDaChon: Array<{ id: number; tenDoAn: string; soLuong: number; gia: number }>
  totalPrice: number
  discount?: number
}

export function SuccessContent() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem("lastBooking")
    if (data) {
      setBookingData(JSON.parse(data))
    }
  }, [])

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex justify-center">
            <Ticket className="h-16 w-16 text-muted-foreground/30" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy thông tin</h1>
          <p className="text-muted-foreground">Có vẻ như bạn chưa thực hiện đặt vé nào gần đây.</p>
          <Button asChild variant="outline">
            <Link href="/">Quay về trang chủ</Link>
          </Button>
        </div>
      </div>
    )
  }

  const bookingCode = `BC${Date.now().toString().slice(-8)}`
  const seatsList = bookingData.gheDaChon.map((g) => `${g.So_hang}${g.So_cot}`).join(", ")
  const subtotal =
    bookingData.doAnDaChon.reduce((sum, d) => sum + d.gia * d.soLuong, 0) + bookingData.gheDaChon.length * 100000 // Base seat price
  const discount = bookingData.discount || 0
  const finalPrice = bookingData.totalPrice

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative mx-auto max-w-3xl px-6 py-12">
        {/* Success Header */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-100">
              <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Đặt vé thành công!
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto">
            Vé của bạn đã được xác nhận. Chúc bạn có những giây phút xem phim tuyệt vời!
          </p>
        </div>

        {/* Main Booking Information Card */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md shadow-xl animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="bg-green-500/10 border-b border-border/50 p-6 flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Mã Đặt Vé</p>
            <p className="text-5xl font-black font-mono tracking-wider text-primary drop-shadow-sm">{bookingCode}</p>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Movie Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-full md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-border/50 relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <img
                  src={bookingData.phim.Hinh_anh || "/placeholder.svg"}
                  alt={bookingData.phim.Ten_phim}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div>
                  <h2 className="text-3xl font-bold mb-2 leading-tight">{bookingData.phim.Ten_phim}</h2>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1">
                    {bookingData.phim.Trang_thai}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Rạp chiếu
                    </p>
                    <p className="font-semibold">{bookingData.rap.Ten_rap}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{bookingData.rap.Dia_chi}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Ticket className="w-3 h-3" /> Phòng chiếu
                    </p>
                    <p className="font-semibold">{bookingData.phong.Ten_phong}</p>
                    <p className="text-xs text-muted-foreground">{bookingData.phong.Suc_chua} chỗ ngồi</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Ngày chiếu
                    </p>
                    <p className="font-semibold text-primary">
                      {new Date(bookingData.caChieu.Ngay_chieu).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Giờ chiếu
                    </p>
                    <p className="font-semibold text-primary">{bookingData.caChieu.Thoi_gian_bat_dau}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-border/50 border-dashed" />

            {/* Details Breakdown */}
            <div className="space-y-6">
              {/* Seats */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ghế đã chọn ({bookingData.gheDaChon.length})</p>
                  <p className="text-sm font-medium">{seatsList}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookingData.gheDaChon.map((g) => (
                    <Badge key={`${g.So_hang}-${g.So_cot}`} className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 text-base rounded-lg">
                      {g.So_hang}{g.So_cot}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Food */}
              {bookingData.doAnDaChon.length > 0 && (
                <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Combo đã chọn</p>
                  <div className="space-y-2">
                    {bookingData.doAnDaChon.map((d, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{d.tenDoAn} <span className="text-muted-foreground">x{d.soLuong}</span></span>
                        <span className="font-mono">{(d.gia * d.soLuong).toLocaleString("vi-VN")} đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 shadow-inner">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{subtotal.toLocaleString("vi-VN")} đ</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Khuyến mãi</span>
                      <span>-{discount.toLocaleString("vi-VN")} đ</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border/50">
                  <span className="font-bold text-lg">Tổng thanh toán</span>
                  <span className="text-3xl font-black text-red-600">{finalPrice.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Quét mã tại quầy vé</p>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/20">
                <svg viewBox="0 0 100 100" className="h-32 w-32">
                  <rect width="100" height="100" fill="white" />
                  <g fill="black">
                    <rect x="10" y="10" width="20" height="20" />
                    <rect x="70" y="10" width="20" height="20" />
                    <rect x="10" y="70" width="20" height="20" />
                    <circle cx="50" cy="50" r="8" />
                    <rect x="20" y="20" width="10" height="10" />
                    <rect x="80" y="20" width="10" height="10" />
                    <rect x="20" y="80" width="10" height="10" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-bottom-12 duration-700 delay-300">
          <Button asChild variant="outline" className="h-12 gap-2 bg-background/50 hover:bg-background hover:border-primary/50">
            <Link href="/">
              <Home className="h-4 w-4" /> Trang chủ
            </Link>
          </Button>
          <Button className="h-12 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Download className="h-4 w-4" /> Tải vé
          </Button>
          <Button variant="outline" className="h-12 gap-2 bg-background/50 hover:bg-background hover:border-primary/50">
            <Share2 className="h-4 w-4" /> Chia sẻ
          </Button>
          <Button variant="outline" className="h-12 gap-2 bg-background/50 hover:bg-background hover:border-primary/50">
            <Printer className="h-4 w-4" /> In vé
          </Button>
        </div>

        {/* Note */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex gap-4 items-start animate-in slide-in-from-bottom-16 duration-700 delay-500">
          <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-bold text-blue-900">Lưu ý quan trọng</p>
            <ul className="space-y-1 text-sm text-blue-800/80 list-disc list-inside">
              <li>Vui lòng đến rạp trước 15 phút để làm thủ tục.</li>
              <li>Xuất trình mã QR hoặc mã đặt vé cho nhân viên tại quầy.</li>
              <li>Vé đã mua không thể hoàn trả sau khi suất chiếu bắt đầu.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}