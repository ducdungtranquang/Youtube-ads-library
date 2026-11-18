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
    id: "tai-video-fb-ads",
    youtubeId: "pMbKwUx_YOc",
    step: 1,
    badge: "Bài 1 • Kỹ Thuật",
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-300/60 dark:text-indigo-300",
    title: "Hướng dẫn tải video từ Meta Ads Library",
    subtitle: "Lấy video gốc chất lượng cao từ thư viện quảng cáo Meta về máy tính",
    category: "Kỹ năng Creative",
    duration: "Thao tác nhanh",
    author: "QUICKBLACK DIGITAL",
    description:
      "Cách trích xuất và tải trực tiếp video quảng cáo MP4 sắc nét từ Facebook Ads Library về máy tính mà không cần cài phần mềm thứ ba độc hại, phục vụ nghiên cứu và biên tập creative mới.",
    keyTakeaways: [
      "Cách bóc tách đường dẫn video stream gốc từ mã nguồn thư viện quảng cáo Meta.",
      "Lưu video ở độ phân giải cao nhất để soi rõ từng khung hình và hiệu ứng hình ảnh.",
      "Mẹo tổ chức kho creative đối thủ theo ngành hàng và mùa vụ kinh doanh.",
      "Lưu ý bản quyền và cách remake kịch bản (Hook, Body, CTA) thành sản phẩm độc quyền."
    ],
    actionLabel: "Mở Facebook Ads Search",
    actionHref: "/facebook-ads-search"
  },
  {
    id: "danh-gia-hang-win",
    youtubeId: "_1fQ5PaLzEs",
    step: 2,
    badge: "Bài 2 • Cốt Lõi",
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-300/60 dark:text-amber-300",
    title: "Cách đánh giá hàng win Facebook Ads Spy Cơ Bản",
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
    id: "cross-platform-arbitrage",
    youtubeId: "8kBBtSf4L5c",
    step: 3,
    badge: "Bài 3 • Scale Doanh Thu",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-300/60 dark:text-emerald-300",
    title: "Đem Hàng Win Facebook lên nền tảng khác chạy",
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
  },
  {
    id: "chi-so-chi-tiet-fb-spy",
    youtubeId: "Y6qtYkuHqDs",
    step: 4,
    badge: "Bài 4 • Phân Tích",
    badgeColor: "bg-sky-500/10 text-sky-700 border-sky-300/60 dark:text-sky-300",
    title: "Các Chỉ Số Chi Tiết Cơ Bản Trong Facebook Ads Spy",
    subtitle: "Nắm vững ý nghĩa Spend ước tính, Clones, Scaling level và Audience distribution",
    category: "Đọc chỉ số",
    duration: "Kiến thức trọng tâm",
    author: "QUICKBLACK DIGITAL",
    description:
      "Giải mã chi tiết các thông số kỹ thuật then chốt trên hệ thống Ads Spy: Số lượng nhân bản (Clones), Ngân sách ước tính (Estimated Spend), Cấp độ vít hàng (Scaling Level), Tuổi thọ quảng cáo (Duration Days) và Phân phối quốc gia.",
    keyTakeaways: [
      "Ý nghĩa chỉ số Clones/Duplicates: Nhận biết ngưỡng vít ngân sách thực tế của nhà quảng cáo.",
      "Ước tính ngân sách chi tiêu (Estimated Spend) và cách dự đoán doanh số đối thủ.",
      "Cấp độ Scaling (Normal, Scaling, Scaling Hard): Lọc ra các chiến dịch đang đổ tiền ồ ạt.",
      "Kết hợp bộ lọc quốc gia, ngành hàng và thời gian để bắt trọn xu hướng mới."
    ],
    actionLabel: "Lọc theo chỉ số ngay",
    actionHref: "/facebook-ads-search"
  },
  {
    id: "luu-ten-page-spy",
    youtubeId: "wn2SmgK5WYY",
    step: 5,
    badge: "Bài 5 • Theo Dõi Đối Thủ",
    badgeColor: "bg-purple-500/10 text-purple-700 border-purple-300/60 dark:text-purple-300",
    title: "Hướng Dẫn - Lưu tên page để spy",
    subtitle: "Xây dựng danh sách Fanpage đối thủ đầu ngành để cập nhật mẫu ad mới mỗi ngày",
    category: "Chiến thuật Spy",
    duration: "Mẹo thực chiến",
    author: "QUICKBLACK DIGITAL",
    description:
      "Phương pháp gom nhóm, lưu trữ và theo dõi liên tục các Fanpage bán chạy hàng đầu theo từng ngách sản phẩm. Tự động nắm bắt khi đối thủ tung video mới, test angle mới hoặc đổi trang đích.",
    keyTakeaways: [
      "Cách tìm ra các Fanpage gốc chuyên test hàng win và vít camp lớn.",
      "Kỹ thuật lọc theo Page Name trên hệ thống Spy để gom toàn bộ ads cùng một Fanpage.",
      "Theo dõi chu kỳ ra mắt sản phẩm mới và tần suất đổi content của đối thủ.",
      "Lưu lại danh sách Fanpage mục tiêu vào Favorites để tra cứu định kỳ hàng tuần."
    ],
    actionLabel: "Spy theo Fanpage",
    actionHref: "/facebook-ads-search"
  },
  {
    id: "spy-hang-nuoc-ngoai-viet-nam",
    youtubeId: "BdrtTiHNeJk",
    step: 6,
    badge: "Bài 6 • Tư Duy Đỉnh Cao",
    badgeColor: "bg-rose-500/10 text-rose-700 border-rose-300/60 dark:text-rose-300",
    title: "Tư duy SPY Hàng Nước Ngoài Đem Về VN chạy và ngược lại !",
    subtitle: "Khai thác độ trễ xu hướng thị trường (Market Lag Arbitrage) giữa Global và Việt Nam",
    category: "Tư duy Chiến lược",
    duration: "Bài học độc quyền",
    author: "QUICKBLACK DIGITAL",
    description:
      "Tư duy khai thác độ trễ xu hướng (Market Lag): Tìm các sản phẩm đang bùng nổ tại thị trường nước ngoài (US, UK, EU, Đông Nam Á) để đem về Việt Nam triển khai sớm trước khi bão hòa, hoặc xuất khẩu các mô hình win tại VN ra toàn cầu.",
    keyTakeaways: [
      "Khái niệm Market Lag: Xu hướng sản phẩm thường bùng nổ ở US/EU trước khi lan sang các thị trường khác từ 1 - 3 tháng.",
      "Cách spy bộ lọc US/Global để phát hiện sản phẩm đang win mạnh ở thị trường quốc tế.",
      "Địa phương hóa (Localize) content, hình ảnh và cách đóng gói giá trị phù hợp với người tiêu dùng Việt.",
      "Quy trình đảo chiều: Đem sản phẩm win tại Việt Nam scale sang thị trường Đông Nam Á hoặc Global."
    ],
    actionLabel: "Khám phá Winning Products Quốc Tế",
    actionHref: "/winning-products"
  }
];
