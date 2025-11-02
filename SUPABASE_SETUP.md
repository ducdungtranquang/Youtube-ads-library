# YouTube ADS Library - Supabase Integration Guide

Dự án này đã được tích hợp với Supabase để xử lý authentication và database. Dưới đây là hướng dẫn chi tiết để cấu hình Supabase.

## 🚀 Cấu hình Supabase

### Bước 1: Tạo dự án Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Đăng nhập hoặc tạo tài khoản mới
3. Nhấp "New Project"
4. Điền thông tin dự án:
   - **Name**: YouTube ADS Library
   - **Database Password**: Tạo mật khẩu mạnh
   - **Region**: Chọn region gần nhất
5. Nhấp "Create new project"

### Bước 2: Lấy thông tin kết nối

1. Sau khi dự án được tạo, vào **Settings** > **API**
2. Sao chép các thông tin sau:
   - **Project URL** (URL)
   - **anon public** key (API Key)

### Bước 3: Cấu hình biến môi trường

1. Mở file `.env.local` trong thư mục gốc dự án
2. Thay thế các giá trị placeholder:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Bước 4: Thiết lập Authentication

1. Trong Supabase Dashboard, vào **Authentication** > **Settings**
2. Cấu hình **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

3. Cấu hình **Redirect URLs**:
   - `http://localhost:3000/dashboard` (development)
   - `https://your-domain.com/dashboard` (production)

### Bước 5: Cấu hình OAuth Providers (Tùy chọn)

#### Google OAuth:
1. Vào **Authentication** > **Providers**
2. Bật **Google** provider
3. Nhập **Client ID** và **Client Secret** từ Google Cloud Console

#### GitHub OAuth:
1. Bật **GitHub** provider
2. Nhập **Client ID** và **Client Secret** từ GitHub OAuth App

### Bước 6: Tạo bảng profiles (Tùy chọn)

Chạy SQL này trong **SQL Editor** để tạo bảng profiles:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policy for users to see their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- Create policy for users to update their own profile
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 🔧 Các tính năng đã tích hợp

### ✅ Authentication
- ✅ Email/Password đăng ký & đăng nhập
- ✅ Google OAuth (cần cấu hình)
- ✅ GitHub OAuth (cần cấu hình) 
- ✅ Đăng xuất
- ✅ Reset password
- ✅ Auto redirect sau đăng nhập

### ✅ UI Components
- ✅ Auth Context Provider
- ✅ Responsive Login/Register forms
- ✅ User avatar & dropdown menu
- ✅ Toast notifications
- ✅ Loading states

### ✅ Security
- ✅ Row Level Security (RLS)
- ✅ Protected routes
- ✅ Secure session management

## 🚦 Cách sử dụng

### Khởi chạy development server:
```bash
npm run dev
```

### Các route chính:
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/dashboard` - Dashboard (cần đăng nhập)
- `/mkt` - Marketing tools
- `/aff` - Affiliate tools

### Authentication Hook:
```typescript
import { useAuth } from '@/contexts/auth-context'

const { user, loading, signIn, signUp, signOut } = useAuth()
```

## 🔍 Troubleshooting

### Lỗi thường gặp:

1. **"Missing Supabase environment variables"**
   - Kiểm tra file `.env.local` có đúng format
   - Restart development server sau khi cập nhật env

2. **OAuth không hoạt động**
   - Kiểm tra Site URL và Redirect URLs
   - Đảm bảo OAuth app được cấu hình đúng

3. **RLS Policy errors**
   - Kiểm tra policies trong Supabase Dashboard
   - Đảm bảo user có quyền truy cập dữ liệu

## 📧 Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra Supabase logs trong Dashboard
2. Kiểm tra browser console để tìm lỗi JavaScript
3. Đảm bảo tất cả environment variables đã được cấu hình đúng

---

🎉 **Congratulations!** Dự án của bạn đã được tích hợp hoàn chỉnh với Supabase authentication!