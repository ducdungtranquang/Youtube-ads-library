export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Ads Spy Tool ước tính ngân sách chi tiêu (Spend) và lượt tiếp cận (Reach) như thế nào?",
    answer:
      "Hệ thống của chúng tôi áp dụng thuật toán phân tích kết hợp giữa dữ liệu minh bạch theo Đạo luật Dịch vụ Kỹ thuật số EU (DSA), phạm vi hiển thị thực tế (Impression Intervals) và hệ số chi phí CPM trung bình theo từng ngành hàng & phân vùng quốc gia (Tier 1 Mỹ/Anh, Châu Âu, Việt Nam & SEA). Dữ liệu này giúp ước lượng ngân sách đối thủ đã chi tiêu với độ chuẩn xác cao, loại bỏ tình trạng phỏng đoán cảm tính.",
  },
  {
    question: "Tôi có thể xem và phân tích các video quảng cáo ẩn (Unlisted) trên YouTube không?",
    answer:
      "Chắc chắn có. Phần lớn các nhà quảng cáo YouTube đều đặt video quảng cáo dưới dạng Không công khai (Unlisted) để tránh hiển thị trên trang chủ kênh. Ads Spy Tool tự động trích xuất các luồng quảng cáo thực tế, cho phép bạn xem trực tiếp video, phân tích cấu trúc kịch bản Hook 3 giây đầu, bóc tách trang đích (Landing Page) và tải về file MP4 để phục vụ nghiên cứu thị trường.",
  },
  {
    question: "Chỉ số Duplicates (Nhân nhóm quảng cáo) có ý nghĩa gì đối với việc tìm Winning Ads?",
    answer:
      "Trong quy trình tối ưu quảng cáo Facebook & TikTok, khi tìm ra một creative chuyển đổi có lời, các Media Buyer chuyên nghiệp sẽ nhân bản (duplicate) nhóm quảng cáo từ 10 - 50 bản để vít ngân sách nhanh chóng. Ads Spy Tool tự động phát hiện số lượng nhóm quảng cáo trùng lặp; khi một mẫu quảng cáo vừa có số Duplicates cao vừa có thời gian chạy dài (Duration > 30 ngày), đó chắc chắn là một Winning Ad đang mang lại doanh thu lớn.",
  },
  {
    question: "Công cụ có hỗ trợ tìm sản phẩm cho Dropshipping và E-commerce quốc tế không?",
    answer:
      "Có. Bạn có thể lọc chiến dịch theo nền tảng website như Shopify, WooCommerce, ShopBase, ClickFunnels... Điều này giúp các nhà bán hàng Dropshipping và Cross-border E-commerce nhanh chóng phát hiện sản phẩm đang 'hot trend', phân tích góc bán hàng (Angle), giá bán và chiến lược khuyến mãi của đối thủ tại Mỹ, Châu Âu hoặc Đông Nam Á.",
  },
  {
    question: "Dữ liệu quảng cáo trên hệ thống được cập nhật theo tần suất nào?",
    answer:
      "Hệ thống Big Data của chúng tôi vận hành 24/7 theo thời gian thực. Hàng ngày, hàng trăm nghìn mẫu quảng cáo mới trên YouTube và Facebook được tự động lập chỉ mục, đồng thời hệ thống liên tục kiểm tra và cập nhật trạng thái đang chạy (Active) hoặc đã dừng (Inactive) của các chiến dịch trên toàn cầu.",
  },
];
