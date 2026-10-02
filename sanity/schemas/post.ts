import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'Tối ưu SEO & Chia sẻ Mạng Xã Hội',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    // ============================================
    // CẤU HÌNH TỐI ƯU SEO & META TAGS TÙY CHỈNH
    // ============================================
    defineField({
      name: 'seoTitle',
      title: 'Tiêu đề SEO (Meta Title)',
      type: 'string',
      fieldset: 'seo',
      description:
        'Tối ưu hiển thị trên Google & công cụ tìm kiếm (50-60 ký tự). Nếu để trống, hệ thống tự động sử dụng Title bài viết.',
      validation: (Rule) =>
        Rule.max(70).warning('Tiêu đề nên dưới 70 ký tự để không bị cắt trên Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Mô tả SEO (Meta Description)',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      description:
        'Mô tả xuất hiện trên kết quả tìm kiếm (150-160 ký tự). Nếu để trống, hệ thống tự động sử dụng Excerpt.',
      validation: (Rule) =>
        Rule.max(160).warning('Mô tả nên dưới 160 ký tự để tối ưu trên Google Search.'),
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Từ khóa SEO (Keywords)',
      type: 'array',
      fieldset: 'seo',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Nhập các từ khóa chính liên quan đến bài viết (bấm Enter sau mỗi từ).',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL (Tùy chọn)',
      type: 'url',
      fieldset: 'seo',
      description: 'Đường dẫn gốc nếu bài viết được đăng lại từ một website khác.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, author } = selection;
      return {
        title,
        subtitle: author ? `by ${author}` : '',
      };
    },
  },
});
