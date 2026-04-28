import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactFormClient from "../../components/contact-form";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ",
      content: "123 Đường Phim, Q. 1, TP. Hồ Chí Minh, Việt Nam",
      action: "Chỉ đường",
      href: "#map",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      content: "1900 1234 (ext. 123)",
      action: "Gọi ngay",
      href: "tel:19001234",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "support@cinemahub.vn",
      action: "Gửi mail",
      href: "mailto:support@cinemahub.vn",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Zalo/Messenger",
      content: "@CinemaHub.VN",
      action: "Chat ngay",
      href: "#",
    },
  ];

  const workingHours = [
    { day: "Thứ Hai - Thứ Sáu", time: "08:00 - 22:00" },
    { day: "Thứ Bảy - Chủ Nhật", time: "09:00 - 23:00" },
    { day: "Ngày lễ", time: "10:00 - 23:00" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", color: "text-blue-600" },
    { icon: Twitter, href: "#", color: "text-sky-500" },
    { icon: Instagram, href: "#", color: "text-pink-600" },
    { icon: Youtube, href: "#", color: "text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. 
            Hãy kết nối với CinemaHub ngay hôm nay.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="p-6 border border-slate-200 bg-white shadow-sm rounded-xl"
            >
              <div className="relative flex flex-col items-center text-center gap-4 h-full justify-between">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{info.content}</p>
                  </div>
                </div>
                
                <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto font-medium" asChild>
                  <a href={info.href}>{info.action} &rarr;</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Contact Form Column */}
          <div className="lg:col-span-7 space-y-8">
             <ContactFormClient />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 space-y-6">
             {/* Map Placeholder */}
            <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm h-[300px] relative group" id="map">
              <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                 <div className="text-center p-6 space-y-4 z-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Bản đồ rạp chiếu</h3>
                    <p className="text-slate-600 text-sm max-w-[250px] mx-auto">
                      123 Đường Phim, Quận 1, TP. Hồ Chí Minh
                    </p>
                    <Button variant="outline" className="mt-2">
                      Xem trên Google Maps
                    </Button>
                 </div>
              </div>
            </Card>

            {/* Working Hours */}
            <Card className="p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Giờ làm việc
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <span className="font-medium text-slate-700 text-sm">
                      {schedule.day}
                    </span>
                    <Badge variant="secondary" className="bg-slate-50 text-slate-900 border border-slate-200">
                      {schedule.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-6 border border-slate-200 bg-white shadow-sm rounded-xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Theo dõi chúng tôi
              </h2>
              <div className="flex gap-4">
                {socialLinks.map((social, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-xl border-slate-200 hover:bg-slate-50 transition-all group`}
                    asChild
                  >
                    <a href={social.href}>
                        <social.icon className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`} />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">
                    Câu hỏi thường gặp
                </h2>
                <p className="text-slate-500 mt-2">Giải đáp những thắc mắc phổ biến nhất</p>
             </div>

            <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden rounded-xl">
              <Accordion type="single" collapsible className="w-full">
                {[ 
                    {
                        q: "Cách đặt vé phim trên CinemaHub?",
                        a: "Để đặt vé phim, bạn chỉ cần: \n1. Chọn phim và suất chiếu mong muốn \n2. Chọn ghế ngồi trên sơ đồ chỗ ngồi \n3. Chọn đồ ăn và thức uống (tùy chọn) \n4. Điền thông tin thanh toán và hoàn tất đặt vé. \nBạn sẽ nhận được mã QR để vào rạp ngay lập tức."
                    },
                    {
                        q: "Chính sách hoàn tiền như thế nào?",
                        a: "• Hoàn tiền 100% nếu hủy vé trước 2 giờ chiếu \n• Hoàn tiền 50% nếu hủy vé từ 2 giờ đến 30 phút trước chiếu \n• Không hoàn tiền nếu hủy trong vòng 30 phút trước chiếu \n• Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc"
                    },
                    {
                        q: "Thanh toán an toàn như thế nào?",
                        a: "CinemaHub sử dụng các phương thức thanh toán bảo mật cao: \n• Thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard) \n• Ví điện tử (MoMo, ZaloPay, ViettelPay) \n• Chuyển khoản ngân hàng \nTất cả giao dịch đều được mã hóa SSL 256-bit và tuân thủ PCI DSS."
                    }
                ].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`} className="border-slate-100 px-6">
                        <AccordionTrigger className="text-left py-5 hover:text-primary transition-colors font-medium text-lg text-slate-900">
                            {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 whitespace-pre-line leading-relaxed pb-6">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </Card>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center text-primary-foreground shadow-lg">
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Cần hỗ trợ ngay lập tức?</h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 font-light leading-relaxed">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn túc trực để đảm bảo bạn có trải nghiệm điện ảnh tuyệt vời nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-slate-900 hover:bg-slate-50 font-bold shadow-md h-14 px-8 rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2 text-primary" />
                Hotline: 1900 1234
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 font-bold h-14 px-8 rounded-xl backdrop-blur-sm"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat trực tuyến
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}