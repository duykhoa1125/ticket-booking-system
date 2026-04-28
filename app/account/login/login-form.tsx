"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);

    try {
      await login(identifier, password);
      // If success, auth-context will handle redirect
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.message || "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <CardTitle className="text-3xl font-bold text-slate-900">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Chào mừng bạn quay trở lại với CinemaHub
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2 font-semibold text-slate-700">
                <Mail className="h-4 w-4 text-primary" />
                Email hoặc Số điện thoại
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="user@example.com hoặc 0912345678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2 font-semibold text-slate-700">
                  <Lock className="h-4 w-4 text-primary" />
                  Mật khẩu
                </Label>
                <Link
                  href="/account/forgot-password"
                  className="text-xs text-primary hover:underline font-bold"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8">
            <Button
              type="submit"
              className="w-full h-11 text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <div className="text-center text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link
                href="/account/register"
                className="font-bold text-primary hover:underline"
              >
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
