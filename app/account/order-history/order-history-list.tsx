"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/services";
import { Ticket, Calendar, Clock, QrCode } from "lucide-react";

export function OrderHistoryList() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [userBills, setUserBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (currentUser) {
      bookingService
        .getMyBookings()
        .then((response) => {
          // Extract bills from response
          const bills = response.map((r) => r.bill);
          setUserBills(bills);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load bills:", error);
          setLoading(false);
        });
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Lịch sử đơn hàng
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Danh sách các vé đã đặt và lịch sử giao dịch.
          </p>
        </div>

        {userBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-200">
              <Ticket className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-slate-500">
              Bạn chưa thực hiện giao dịch đặt vé nào.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {userBills.map((bill) => (
              <div
                key={bill.bill_id}
                className="group relative flex flex-col md:flex-row w-full bg-white transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden"
              >
                {/* Left Part: Ticket Info */}
                <div className="flex-1 p-6 md:p-8 relative">
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Mã đơn hàng
                        </p>
                        <h3 className="text-2xl font-mono font-bold text-primary">
                          #{bill.bill_id}
                        </h3>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                      >
                        Đã thanh toán
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Ngày đặt</span>
                        </div>
                        <p className="font-bold text-slate-900">
                          {new Date(bill.creation_date).toLocaleDateString(
                            "vi-VN",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Thời gian</span>
                        </div>
                        <p className="font-bold text-slate-900">
                          {new Date(bill.creation_date).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="relative flex md:flex-col items-center justify-center px-4 md:px-0">
                  <div className="w-full h-[1px] md:w-[1px] md:h-full border-t md:border-t-0 md:border-l border-dashed border-slate-200" />
                </div>

                {/* Right Part: Price & QR */}
                <div className="md:w-64 p-6 md:p-8 bg-slate-50 flex flex-col items-center justify-center text-center gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tổng thanh toán
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                      {bill.total_price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="w-full h-px bg-slate-200 my-2" />

                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-16 h-16 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest">
                      CINEMAHUB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
