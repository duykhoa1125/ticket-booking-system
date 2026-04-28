"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, QrCode, Share2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";

interface ConfirmationData {
  movie_name: string;
  movie_image: string;
  cinema_name: string;
  room_name: string;
  start_date: string;
  start_time: string;
  seats: string[];
  foods: { name: string; quantity: number; price: number }[];
  total: number;
  discount: number;
}

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats") || "0";
  const total = searchParams.get("total") || "0";
  const discount = searchParams.get("discount") || "0";
  const billId = searchParams.get("bill_id");

  const [data, setData] = useState<ConfirmationData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("confirmationData");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  // Generate booking reference or use bill_id
  const bookingRef = billId
    ? `#${billId}`
    : `CH${Date.now().toString(36).toUpperCase().slice(-8)}`;
  const bookingTime = new Date().toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format showtime from data
  const formatShowTime = () => {
    if (!data) return "";
    const dateObj = new Date(data.start_date);
    const [hours, minutes] = data.start_time.split(":");
    return `${dateObj.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })} - ${hours}:${minutes}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <Breadcrumb
            items={[{ label: "Đặt vé", href: "/" }, { label: "Xác nhận" }]}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-16">
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
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Cảm ơn bạn đã chọn CinemaHub. Vé điện tử đã được gửi đến email của
            bạn.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Booking Details Card */}
            <div className="overflow-hidden rounded-3xl border border-green-500/20 bg-card/50 backdrop-blur-sm shadow-xl">
              {/* Header */}
              <div className="border-b border-green-500/10 bg-green-500/5 px-8 py-8 text-center">
                <p className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Mã đặt vé
                </p>
                <p className="font-mono text-4xl font-black tracking-tight text-green-600 drop-shadow-sm">
                  {bookingRef}
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 p-8">
                {/* Movie Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    Thông tin phim
                  </h3>
                  <div className="grid gap-4 rounded-2xl bg-background/50 border border-border/50 p-5">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phim</span>
                      <span className="font-bold text-lg text-right">
                        {data?.movie_name || "Đang tải..."}
                      </span>
                    </div>
                    <div className="h-px w-full bg-border/50 border-dashed" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rạp</span>
                      <span className="font-medium text-right">
                        {data?.cinema_name || "Đang tải..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phòng</span>
                      <span className="font-medium text-right">
                        {data?.room_name || "Đang tải..."}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Suất chiếu</span>
                      <span className="font-medium text-right text-primary">
                        {formatShowTime() || "Đang tải..."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    Chi tiết thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
                      <span className="text-muted-foreground">Số vé</span>
                      <span className="font-bold">
                        {seats} vé{" "}
                        <span className="font-normal text-muted-foreground text-sm">
                          ({data?.seats?.join(", ") || "..."})
                        </span>
                      </span>
                    </div>
                    {data?.foods && data.foods.length > 0 && (
                      <div className="rounded-xl bg-muted/30 p-4 space-y-2">
                        <span className="text-muted-foreground text-sm">
                          Đồ ăn & Nước
                        </span>
                        {data.foods.map((f, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>
                              {f.name} x{f.quantity}
                            </span>
                            <span>
                              {(f.price * f.quantity).toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {Number(discount) > 0 && (
                      <div className="flex items-center justify-between rounded-xl bg-green-500/10 p-4 border border-green-500/20">
                        <span className="text-green-700 font-medium">
                          Khuyến mãi
                        </span>
                        <span className="font-bold text-green-700">
                          −{Number(discount).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between rounded-xl bg-primary/10 p-5 border border-primary/20">
                      <span className="text-lg font-bold">Tổng thanh toán</span>
                      <span className="text-3xl font-black text-primary">
                        {Number(total).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="rounded-xl bg-muted/30 p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Thời gian đặt:
                    </span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-bold text-green-600 border border-green-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      ĐÃ XÁC NHẬN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">Thẻ tín dụng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="rounded-3xl border border-blue-200/50 bg-blue-50/30 backdrop-blur-sm p-8">
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-blue-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-md">
                  i
                </div>
                Hướng dẫn sử dụng vé
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 mt-0.5">
                    1
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900/80 font-medium">
                    Email xác nhận đã được gửi đến địa chỉ email của bạn. Vui
                    lòng kiểm tra cả hộp thư spam.
                  </span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 mt-0.5">
                    2
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900/80 font-medium">
                    Vui lòng đến rạp trước 15 phút để làm thủ tục in vé (nếu
                    cần) hoặc mua bắp nước.
                  </span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 mt-0.5">
                    3
                  </div>
                  <span className="text-sm leading-relaxed text-blue-900/80 font-medium">
                    Xuất trình mã QR hoặc mã đặt vé tại quầy soát vé để vào
                    phòng chiếu.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* QR Code */}
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <div className="border-b border-border/50 bg-muted/30 px-6 py-4">
                <p className="text-center font-bold text-foreground">
                  Vé Điện Tử (QR)
                </p>
              </div>
              <div className="p-8 flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/20">
                  <QrCode className="w-40 h-40 text-black" />
                </div>
                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  Đưa mã này cho nhân viên tại quầy soát vé
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 rounded-xl border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4" />
                <span>Tải vé PDF</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 rounded-xl border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all shadow-sm"
              >
                <Share2 className="h-4 w-4" />
                <span>Chia sẻ vé</span>
              </Button>
            </div>

            {/* Help */}
            <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              <h4 className="mb-3 font-bold">Cần hỗ trợ?</h4>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                Liên hệ với chúng tôi nếu bạn cần trợ giúp hoặc muốn thay đổi
                lịch đặt.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                  <span className="text-muted-foreground">Hotline:</span>
                  <span className="font-bold text-primary ml-auto">
                    1900-1234
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-bold text-primary ml-auto truncate max-w-[120px]">
                    support@cinemahub.vn
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
