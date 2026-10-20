---
description: UI/UX Design, Styling & Quality Audit Workflow
---

# UI/UX Design & Audit Workflow

Quy trình chuẩn để thiết kế, refactor hoặc kiểm tra (audit) giao diện UI/UX cho ứng dụng Next.js 15, React 19, Tailwind CSS v4 và Radix UI / shadcn/ui.

## 1. Nguyên tắc cốt lõi (Core Principles)
- **Zero Python**: Sử dụng hoàn toàn TypeScript, React, Tailwind CSS và tài liệu hướng dẫn trực tiếp.
- **Thẩm mỹ cao cấp (Rich Aesthetics)**: Sử dụng dark/light mode tinh tế, glassmorphism nhẹ nhàng, gradient có chủ đích, typography chuẩn (Geist / Inter), không dùng màu thô/mặc định.
- **Micro-animations & Feedback**: Mọi phần tử tương tác (button, card, input) đều phải có phản hồi thị giác (hover, focus-visible, active pressed) và thời lượng chuyển động hợp lý (150-250ms), tôn trọng `prefers-reduced-motion`.
- **Accessibility & Touch-Friendly**: Độ tương phản tối thiểu 4.5:1 (AA), diện tích chạm tối thiểu 44×44px, vòng focus 2px rõ ràng khi dùng bàn phím.
- **Không dùng Emoji làm icon**: Luôn dùng SVG vectors qua Lucide React (`lucide-react`).

## 2. Quy trình thiết kế & triển khai (Step-by-step)

### Bước 1: Xác định phong cách & Bảng màu (Style & Palette)
1. Xác định loại sản phẩm (SaaS, Analytics/Ads Spy Tool, Dashboard, E-commerce).
2. Tra cứu quy chuẩn trong [quick-reference.md](file:///d:/Projects/Youtube-ads-library/Youtube-ads-library/.agents/skills/ui-ux-pro-max/references/quick-reference.md) mục §4 (Style) và §6 (Typography & Color).
3. Áp dụng bảng màu semantic tokens qua CSS variables:
   - Primary, Secondary, Background, Foreground, Muted, Border, Accent, Destructive.

### Bước 2: Xây dựng Layout Responsive (Mobile-First)
1. Thiết kế từ màn hình di động (375px) trước khi mở rộng lên tablet (768px), desktop (1024px) và wide (1280px+).
2. Tuyệt đối không để xảy ra cuộn ngang không chủ ý (`overflow-x-hidden`, text wrap hợp lý).
3. Sử dụng hệ thống lưới khoảng cách chuẩn 4px/8px (`gap-2`, `gap-4`, `p-4`, `p-6`).

### Bước 3: Triển khai Component (shadcn/ui + Radix UI)
1. Tận dụng các component sẵn có trong `@/components/ui/` (Button, Card, Dialog, Popover, DropdownMenu, Tabs, ScrollArea, Tooltip, v.v.).
2. Tham khảo [shadcn-components.md](file:///d:/Projects/Youtube-ads-library/Youtube-ads-library/.agents/skills/ui-styling/references/shadcn-components.md) và [shadcn-accessibility.md](file:///d:/Projects/Youtube-ads-library/Youtube-ads-library/.agents/skills/ui-styling/references/shadcn-accessibility.md).
3. Quản lý trạng thái form với `react-hook-form` + `zod`, hiển thị thông báo lỗi ngay dưới input.

### Bước 4: Kiểm tra trước bàn giao (Pre-Delivery Checklist)
Trước khi hoàn thành code, đối soát với checklist trong [pro-rules.md](file:///d:/Projects/Youtube-ads-library/Youtube-ads-library/.agents/skills/ui-ux-pro-max/references/pro-rules.md):
- [ ] Không có emoji làm icon (sử dụng `lucide-react`).
- [ ] Có `cursor-pointer` và hiệu ứng hover/active cho tất cả phần tử click được.
- [ ] Vòng focus hiển thị sắc nét khi duyệt bằng phím Tab (`focus-visible:ring-2`).
- [ ] Độ tương phản chữ đạt tối thiểu 4.5:1 ở cả Dark và Light mode.
- [ ] Touch targets ≥ 44×44px trên thiết bị di động.
- [ ] Đã thêm skeleton loading cho các vùng dữ liệu bất đồng bộ để tránh nhảy layout (CLS < 0.1).
