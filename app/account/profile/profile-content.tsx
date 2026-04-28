"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Star, Mail, Phone, Calendar } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { AccountWithRole, MemberLevel } from "@/services/types";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Membership tier configuration based on points
const MEMBERSHIP_TIERS: {
  level: MemberLevel;
  minPoints: number;
  color: string;
  icon: string;
}[] = [
  { level: "copper", minPoints: 0, color: "#CD7F32", icon: "🥉" },
  { level: "gold", minPoints: 500, color: "#FFD700", icon: "🥇" },
  { level: "diamond", minPoints: 2000, color: "#B9F2FF", icon: "💎" },
  { level: "vip", minPoints: 5000, color: "#E0B0FF", icon: "👑" },
];

function getMembershipTier(points: number) {
  let current = MEMBERSHIP_TIERS[0];
  let next: typeof current | null = null;

  for (let i = 0; i < MEMBERSHIP_TIERS.length; i++) {
    if (points >= MEMBERSHIP_TIERS[i].minPoints) {
      current = MEMBERSHIP_TIERS[i];
      next = MEMBERSHIP_TIERS[i + 1] || null;
    }
  }

  return { current, next };
}

export function ProfileContent() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Derived user
  const user =
    currentUser && currentUser.role === "user"
      ? (currentUser as AccountWithRole)
      : null;

  // Redirect admin to admin dashboard, or redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/account/login");
    } else if (!authLoading && currentUser && currentUser.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const membershipPoints = user.membership_points || 0;
  const { current: currentTier, next: nextTier } =
    getMembershipTier(membershipPoints);

  // Calculate progress percentage for next tier
  const progressPercent = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((membershipPoints - currentTier.minPoints) /
            (nextTier.minPoints - currentTier.minPoints)) *
            100
        )
      )
    : 100;

  const pointsNeeded = nextTier ? nextTier.minPoints - membershipPoints : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb
            items={[{ label: "Tài khoản", href: "/" }, { label: "Hồ sơ" }]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-8">
          {/* Profile Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm bg-white rounded-2xl">
            <div className="relative h-32 bg-slate-100 border-b border-slate-200">
            </div>

            <div className="px-6 pb-6 -mt-16 relative flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage
                  src={user.avatar || ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-400">
                  {(user.fullname || "U").charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="mt-4 space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {user.fullname}
                </h1>
                <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
              </div>

              <div className="mt-6 w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Hạng thành viên
                    </span>
                    <div
                      className="flex items-center gap-1.5 font-black text-lg capitalize"
                      style={{ color: currentTier.color }}
                    >
                      <span>{currentTier.icon}</span>
                      {currentTier.level}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Điểm tích lũy
                    </span>
                    <div className="flex items-center gap-1.5 text-primary font-black text-lg">
                      <Star className="w-4 h-4 fill-primary" />
                      {membershipPoints}
                    </div>
                  </div>
                </div>

                {nextTier && (
                  <div className="space-y-3 text-left p-5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 uppercase tracking-wider">
                        Tiến độ lên hạng{" "}
                        <span
                          className="capitalize text-slate-900"
                        >
                          {nextTier.icon} {nextTier.level}
                        </span>
                      </span>
                      <span className="text-primary">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-slate-200" />
                    <p className="text-xs text-slate-500 text-center">
                      Cần thêm{" "}
                      <span className="font-bold text-slate-900">
                        {pointsNeeded}
                      </span>{" "}
                      điểm để thăng hạng
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Account Details */}
          <Card className="border border-slate-200 shadow-sm bg-white p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Thông tin cá nhân</h2>
                <p className="text-sm text-slate-500">
                  Quản lý thông tin tài khoản của bạn
                </p>
              </div>
            </div>

            <Separator className="mb-8 bg-slate-100" />

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Họ và tên
                </label>
                <p className="text-slate-900 font-bold text-lg">{user.fullname}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Số điện thoại
                </label>
                <p className="text-slate-900 font-bold text-lg">
                  {user.phone_number}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Email
                </label>
                <p className="text-slate-900 font-bold text-lg">{user.email}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Ngày sinh
                </label>
                <p className="text-slate-900 font-bold text-lg">
                  {user.birth_date
                    ? new Date(user.birth_date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Chưa cập nhật"}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Giới tính
                </label>
                <p className="text-slate-900 font-bold text-lg">
                  {user.gender === "male"
                    ? "Nam"
                    : user.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Ngày đăng ký
                </label>
                <p className="text-slate-900 font-bold text-lg">
                  {user.registration_date
                    ? new Date(user.registration_date).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </Card>

          {/* Membership Tiers */}
          <Card className="border border-slate-200 shadow-sm bg-white p-6 md:p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hạng thành viên</h2>
                <p className="text-sm text-slate-500">
                  Tích lũy điểm để thăng hạng và nhận ưu đãi
                </p>
              </div>
            </div>

            <Separator className="mb-8 bg-slate-100" />

            <div className="grid gap-4 md:grid-cols-2">
              {MEMBERSHIP_TIERS.map((tier) => {
                const isCurrentTier = tier.level === currentTier.level;
                const isLocked = membershipPoints < tier.minPoints;

                return (
                  <div
                    key={tier.level}
                    className={`relative p-5 rounded-xl border transition-all ${
                      isCurrentTier
                        ? "bg-slate-50 border-primary"
                        : isLocked
                        ? "opacity-50 bg-slate-50/50 border-slate-100"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {isCurrentTier && (
                      <div
                        className="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-black uppercase text-white rounded-full bg-primary"
                      >
                        Hạng hiện tại
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{tier.icon}</span>
                      <div>
                        <h4
                          className="font-black capitalize text-lg"
                          style={{ color: tier.color }}
                        >
                          {tier.level}
                        </h4>
                        <p className="text-xs font-bold text-slate-400">
                          {tier.minPoints.toLocaleString()} ĐIỂM
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
