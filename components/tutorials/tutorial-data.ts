export interface VideoTutorial {
  id: string;
  youtubeId: string;
  step: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  author: string;
  description: string;
  keyTakeaways: string[];
  actionLabel: string;
  actionHref: string;
}

export const TUTORIAL_VIDEOS: VideoTutorial[] = [
  {
    id: "danh-gia-hang-win",
    youtubeId: "_1fQ5PaLzEs",
    step: 1,
    badge: "Bài 1 • Cốt Lõi",
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-300/60 dark:text-amber-300",
    title: "Cách đánh giá Hàng WIN cơ bản qua Ads Spy Tool & Meta Library",
    subtitle: "Xác thực độ hot, số ngày chạy và dấu hiệu nhân bản ad set thực chiến",
    category: "Quy trình tìm hàng Win",
    duration: "Video thực chiến",
    author: "QUICKBLACK DIGITAL",
    description:
      "Hướng dẫn chi tiết quy trình đọc chỉ số trên Ads Spy Tool kết hợp với Facebook Ad Library để kiểm chứng sản phẩm có thực sự đang mang lại lợi nhuận hay chỉ là quảng cáo đang test thử.",
    keyTakeaways: [
      "Nhận diện ad set nhân bản (Duplicates > 10): Tín hiệu rõ ràng nhà quảng cáo đang vít ngân sách lớn.",
      "Thời gian chạy liên tục (Duration > 14–30 ngày): Chứng minh sản phẩm có ROI dương và chuyển đổi ổn định.",
      "Phân tích kịch bản Hook 3s đầu và góc tiếp cận (Angle) của video quảng cáo.",
      "Kiểm tra store, độ hoàn thiện trang đích (Landing Page) và chính sách giá bán của đối thủ."
    ],
    actionLabel: "Thực hành trên Facebook Ads Search",
    actionHref: "/facebook-ads-search"
  },
  {
    id: "tai-video-fb-ads",
    youtubeId: "pMbKwUx_YOc",
    step: 2,
    badge: "Bài 2 • Kỹ Thuật",
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-300/60 dark:text-indigo-300",
    title: "Hướng dẫn tải video từ Facebook Ads Library về máy tính",
    subtitle: "Lấy video gốc chất lượng cao phục vụ nghiên cứu và biên tập creative mới",
    category: "Kỹ năng Creative",
    duration: "Thao tác nhanh",
    author: "QUICKBLACK DIGITAL",
    description:
      "Cách trích xuất và tải trực tiếp video quảng cáo MP4 sắc nét từ Facebook Ads Library về máy tính mà không cần cài phần mềm thứ ba độc hại, phục vụ lưu trữ kho tài nguyên nghiên cứu.",
    keyTakeaways: [
      "Cách bóc tách đường dẫn video stream gốc từ mã nguồn thư viện quảng cáo Meta.",
      "Lưu video ở độ phân giải cao nhất để soi rõ từng khung hình và hiệu ứng hình ảnh.",
      "Mẹo tổ chức kho creative đối thủ theo ngành hàng và mùa vụ kinh doanh.",
      "Lưu ý bản quyền và cách remake kịch bản (Hook, Body, CTA) thành sản phẩm độc quyền."
    ],
    actionLabel: "Mở kho Winning Products",
    actionHref: "/winning-products"
  },
  {
    id: "cross-platform-arbitrage",
    youtubeId: "8kBBtSf4L5c",
    step: 3,
    badge: "Bài 3 • Scale Doanh Thu",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-300/60 dark:text-emerald-300",
    title: "Đem hàng Win Facebook lên nền tảng khác chạy (Cross-Platform)",
    subtitle: "Nhân đôi, nhân ba doanh số bằng cách mở rộng sang TikTok Ads & YouTube Ads",
    category: "Chiến lược Scale",
    duration: "Chiến lược nâng cao",
    author: "QUICKBLACK DIGITAL",
    description:
      "Chiến lược kinh điển của các Media Buyer hàng đầu: Phát hiện sản phẩm win trên Facebook Ads và đón đầu thị trường bằng cách triển khai ngay trên TikTok Ads, YouTube Ads hoặc Google Shopping.",
    keyTakeaways: [
      "Chiến lược Arbitrage: Tận dụng sự chênh lệch CPM và tệp khách hàng tiềm năng giữa các kênh.",
      "Chuyển thể kịch bản Facebook Ads sang dạng video ngắn chân thực của TikTok & YouTube Shorts.",
      "Tối ưu lại trang đích (Landing Page) mượt mà cho trải nghiệm mobile traffic.",
      "Bảo vệ biên độ lợi nhuận khi mở rộng quy mô ngân sách đa nền tảng."
    ],
    actionLabel: "Nghiên cứu thêm YouTube Ads",
    actionHref: "/mkt"
  }
];

