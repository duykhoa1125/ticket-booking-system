import type React from "react"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  )
}
