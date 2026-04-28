"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SeatSelection } from "@/components/seat-selection";
import { FoodSelection } from "@/components/food-selection";
import { VoucherInput } from "@/components/voucher-input";
import type { SeatLayoutItem, Showtime, MovieDetail } from "@/services/types";
import { type FoodMenuItem } from "@/services";
import bookingService from "@/services/bookingService";
import { getTicketPrice } from "@/lib/pricing";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Calendar, Clock, MapPin, CheckCircle2, Ticket, X } from "lucide-react";

// VoucherDetail type definition (from mock-data)
interface VoucherDetail {
  code: string;
  promotional_id: string;
  start_date: string;
  end_date: string;
  state: "active" | "used" | "expired";
  phone_number: string;
  promotional?: any;
  discount?: {
    promotional_id: string;
    percent_reduce: number;
    max_price_can_reduce: number;
  };
  gift?: {
    promotional_id: string;
    name: string;
    quantity: number;
  };
}

interface BookingContentProps {
  showtime: Showtime;
  movie: MovieDetail;
}

export function BookingContent({ showtime, movie }: BookingContentProps) {
  const searchParams = useSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<SeatLayoutItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<
    (FoodMenuItem & { quantity: number })[]
  >([]);
  const [bookingStep, setBookingStep] = useState<"seats" | "food">("seats");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherDetail | null>(
    null
  );
  const [discountAmount, setDiscountAmount] = useState(0);

  const [prefilledVoucherCode, setPrefilledVoucherCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteBooking = async () => {
    try {
      setIsProcessing(true);

      const bookingPayload = {
        showtime_id: showtime.showtime_id,
        seats: selectedSeats.map((s) => ({
          row: s.seat_row,
          col: s.seat_column,
          price: s.price ?? getTicketPrice(s.seat_type), // Use server price, fallback to local pricing
        })),
        foods: selectedFoods.map((f) => ({
          name: f.name,
          price: f.price,
          quantity: f.quantity,
        })),
        voucher_code: appliedVoucher?.code || undefined,
        phone_number: "", // Will be handled by backend via token
      };

      const response = await bookingService.createBooking(bookingPayload);

      // Lưu thông tin đặt vé vào localStorage để trang confirmation hiển thị
      const confirmationData = {
        movie_name: movie.name,
        movie_image: movie.image,
        cinema_name: showtime.cinema_name || "",
        room_name: showtime.room_name || showtime.room_id,
        start_date: showtime.start_date,
        start_time: showtime.start_time,
        seats: selectedSeats.map((s) => `${s.seat_row}${s.seat_column}`),
        foods: selectedFoods.map((f) => ({
          name: f.name,
          quantity: f.quantity,
          price: f.price,
        })),
        total: finalTotal,
        discount: discountAmount,
      };
      localStorage.setItem(
        "confirmationData",
        JSON.stringify(confirmationData)
      );

      // Redirect to confirmation with bill_id
      window.location.href = `/confirmation?bill_id=${response.bill.bill_id}&seats=${selectedSeats.length}&total=${finalTotal}&discount=${discountAmount}`;
    } catch (error: any) {
      console.error("Booking failed:", error);
      alert(`Đặt vé thất bại: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const voucherCodeUrl = searchParams.get("voucher");
    if (voucherCodeUrl) {
      setPrefilledVoucherCode(voucherCodeUrl);
    } else {
      // Check session storage
      const voucherCodeSession = sessionStorage.getItem("selectedVoucher");
      if (voucherCodeSession) {
        setPrefilledVoucherCode(voucherCodeSession);
        sessionStorage.removeItem("selectedVoucher");
      }
    }
  }, [searchParams]);

  // Format date and time from separate fields
  const formatDateTime = () => {
    const dateObj = new Date(showtime.start_date);
    const [hours, minutes] = showtime.start_time.split(":");

    return {
      date: dateObj.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      time: `${hours}:${minutes}`,
    };
  };

  const { date, time } = formatDateTime();

  // Get room name from showtime (đã có sẵn từ API)
  const roomName = showtime.room_name || showtime.room_id;

  // Calculate ticket price using server-provided price (fallback to pricing util)
  const ticketTotal = selectedSeats.reduce(
    (sum, seat) => sum + (seat.price ?? getTicketPrice(seat.seat_type)),
    0
  );
  const foodTotal = selectedFoods.reduce(
    (sum, food) => sum + food.price * food.quantity,
    0
  );
  const subtotal = ticketTotal + foodTotal;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Recalculate discount whenever subtotal or appliedVoucher changes
  useEffect(() => {
    if (appliedVoucher) {
      // Apply 10% discount to match backend logic (booking_service.js line 103: total *= 0.9)
      const calculatedDiscount = Math.round(subtotal * 0.1);
      setDiscountAmount(calculatedDiscount);
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, appliedVoucher]);

  const handleVoucherApply = (
    voucher: VoucherDetail | null,
    discount: number
  ) => {
    setAppliedVoucher(voucher);
    // Discount will be automatically recalculated by the useEffect above
  };

  const steps = [
    { id: "seats", label: "Chọn ghế" },
    { id: "food", label: "Bắp nước & Thanh toán" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Breadcrumb
            items={[
              { label: "Phim", href: "/" },
              { label: movie.name, href: `/movie/${movie.movie_id}` },
              { label: "Đặt vé" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 py-8">
        {/* Movie Header Card */}
        <div className="mb-8 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl shadow-sm border border-slate-200">
              <img
                src={movie.image}
                alt={movie.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {movie.name}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-slate-700">
                    {roomName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-slate-700 capitalize">
                    {date}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-slate-700">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="mb-12">
          <div className="relative flex justify-between max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: bookingStep === "seats" ? "0%" : "100%",
              }}
            />

            {steps.map((step, index) => {
              const isActive = bookingStep === step.id;
              const isCompleted = bookingStep === "food" && index === 0;

              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all duration-300 border-2 ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-8">
            {bookingStep === "seats" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
                <SeatSelection
                  onSeatsChange={setSelectedSeats}
                  showtimeId={showtime.showtime_id}
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 p-4 backdrop-blur-lg">
                  <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex justify-end items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-sm text-muted-foreground">
                          Ghế đang chọn
                        </p>
                        <p className="font-bold text-primary">
                          {selectedSeats.length > 0
                            ? selectedSeats
                                .map((s) => `${s.seat_row}${s.seat_column}`)
                                .join(", ")
                            : "Chưa chọn"}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          if (selectedSeats.length > 0) {
                            setBookingStep("food");
                          }
                        }}
                        disabled={selectedSeats.length === 0}
                        className="min-w-[200px] h-12 text-base rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        Tiếp tục ({selectedSeats.length} ghế)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {bookingStep === "food" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <FoodSelection onFoodChange={setSelectedFoods} />

                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" />
                    Mã khuyến mại
                  </h3>
                  <VoucherInput
                    onVoucherApply={handleVoucherApply}
                    appliedVoucher={appliedVoucher}
                    appliedDiscount={discountAmount}
                    initialCode={prefilledVoucherCode}
                  />

                  {/* Available Vouchers */}
                  <div className="mt-8 pt-6 border-t border-border/30">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        Voucher ưu đãi
                      </h4>
                      {appliedVoucher && (
                        <button
                          onClick={() => {
                            setAppliedVoucher(null);
                            setPrefilledVoucherCode("");
                            setDiscountAmount(0);
                          }}
                          className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1 bg-destructive/10 px-2 py-1 rounded-md"
                        >
                          <X className="w-3 h-3" />
                          Gỡ voucher
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["VOU00001", "VOU00002", "VOU00003", "VOU00004"].map(
                        (voucherCode) => {
                          const isApplied =
                            appliedVoucher?.code === voucherCode;

                          return (
                            <button
                              key={voucherCode}
                              onClick={() => {
                                // Clear current voucher first to allow switching
                                setAppliedVoucher(null);
                                setPrefilledVoucherCode(voucherCode);
                              }}
                              disabled={isApplied}
                              className={`group relative flex w-full overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                                isApplied
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border bg-card hover:border-primary/50"
                              }`}
                            >
                              {/* Left Stub */}
                              <div
                                className={`flex w-16 flex-col items-center justify-center border-r border-dashed p-2 transition-colors ${
                                  isApplied
                                    ? "bg-primary/10 border-primary/30"
                                    : "bg-muted/30 border-border group-hover:bg-primary/5"
                                }`}
                              >
                                <Ticket
                                  className={`h-6 w-6 transition-colors ${
                                    isApplied
                                      ? "text-primary"
                                      : "text-muted-foreground group-hover:text-primary"
                                  }`}
                                />
                                <div className="mt-2 h-full w-[1px] border-l border-dashed border-border/50" />
                              </div>

                              {/* Main Content */}
                              <div className="flex flex-1 flex-col justify-center p-4 text-left">
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider ${
                                      isApplied
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    Mã giảm giá
                                  </span>
                                  {isApplied && (
                                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Đang dùng
                                    </span>
                                  )}
                                </div>
                                <span className="text-lg font-bold font-mono tracking-wide text-foreground">
                                  {voucherCode}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Giảm 10% cho đơn hàng
                                </p>
                              </div>

                              {/* Decorative Cutouts (Perforation) */}
                              <div className="absolute top-0 bottom-0 left-[63px] w-[2px] -translate-x-1/2 flex flex-col justify-between py-1">
                                {[...Array(6)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-[2px] h-[2px] rounded-full bg-border"
                                  />
                                ))}
                              </div>
                              <div className="absolute -top-1.5 left-[63px] h-3 w-3 -translate-x-1/2 rounded-full border border-b-transparent border-border bg-background" />
                              <div className="absolute -bottom-1.5 left-[63px] h-3 w-3 -translate-x-1/2 rounded-full border border-t-transparent border-border bg-background" />

                              {/* Active Glow */}
                              {isApplied && (
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setBookingStep("seats")}
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-border/50 hover:bg-muted/50"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleCompleteBooking}
                    className="min-w-[240px] h-12 text-base rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl hover:shadow-primary/25 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Đang xử lý..." : "Hoàn thành đặt vé"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-border/50">
                <h3 className="text-lg font-bold">Thông tin đặt vé</h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ghế đang chọn</span>
                    <div className="text-right">
                      <span className="font-bold text-primary text-lg block break-all max-w-[150px]">
                        {selectedSeats.length > 0
                          ? selectedSeats
                              .map((s) => `${s.seat_row}${s.seat_column}`)
                              .join(", ")
                          : "Chưa chọn"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50 border-dashed">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Vé ({selectedSeats.length})
                      </span>
                      <span className="font-medium">
                        {ticketTotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    {selectedFoods.length > 0 && (
                      <div className="space-y-2">
                        {selectedFoods.map((food) => (
                          <div
                            key={food.food_id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {food.name} (x{food.quantity})
                            </span>
                            <span className="font-medium">
                              {(food.price * food.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 border-dashed space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">
                        {subtotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Voucher (Giảm 10%)</span>
                        <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    Đã bao gồm VAT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
