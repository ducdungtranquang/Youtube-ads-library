import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { CalendarDays, UserCircle2, ArrowLeft } from 'lucide-react';
import { client, sanityFetch, urlFor } from '@/sanity/client';
import { GET_POST_BY_SLUG_QUERY, type BlogPostDetail } from '@/sanity/queries';
import { Header } from '@/components/header';
import type { Metadata } from 'next';

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Tối ưu hàm formatDate để trả về cả định dạng hiển thị và ISO cho thẻ <time>
const formatDate = (value?: string) => {
    if (!value) return { display: 'Soon', iso: '' };

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { display: 'Soon', iso: '' };

    return {
        display: new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date),
        iso: date.toISOString(),
    };
};

const customComponents: PortableTextComponents = {
    block: {
        h1: ({ children }) => <h1 className="mt-8 text-3xl font-black tracking-tight text-white md:text-5xl">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-8 text-2xl font-bold text-white scroll-mt-20">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-6 text-xl font-bold text-white scroll-mt-20">{children}</h3>,
        normal: ({ children }) => <p className="mt-4 text-base leading-8 text-slate-300">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-indigo-500 bg-indigo-500/10 px-5 py-4 text-lg italic text-slate-200 dark:border-indigo-400 dark:bg-slate-900/70">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">{children}</ul>,
        number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-300">{olChildren(children)}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-slate-200">{children}</em>,
        link: ({ value, children }) => {
            const href = typeof value?.href === 'string' ? value.href : '#';
            const isExternal = href.startsWith('http');
            return (
                <a
                    href={href}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="font-medium text-indigo-400 underline-offset-4 hover:underline"
                >
                    {children}
                </a>
            );
        },
    },
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null;
            const imageUrl = urlFor(value).width(1200).auto('format').fit('max').url();
            return (
                <figure className="my-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
                    <Image src={imageUrl} alt={value.alt || 'Ảnh minh họa bài viết'} width={1200} height={800} className="h-auto w-full object-fill" loading="lazy" />
                    {value.alt && <figcaption className="text-center text-sm text-slate-400 p-3 bg-slate-950/50">{value.alt}</figcaption>}
                </figure>
            );
        },
    },
};

function olChildren(children: any) {
    return children;
}

/* =========================
   DYNAMIC METADATA (Next.js 14/15)
========================= */
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await sanityFetch<BlogPostDetail | null>({
        query: GET_POST_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!post) return {};

    const metaTitle = post.seoTitle?.trim() || post.title;
    const metaDescription = post.seoDescription?.trim() || post.excerpt?.trim() || `Khám phá bài viết "${post.title}" - Xu hướng và phân tích chiến lược quảng cáo tại Ads Spy Tool.`;
    const canonical = post.canonicalUrl?.trim() || `https://ads-spy-tool.tech/blog/${slug}`;
    const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).fit('crop').url() : '/marketing-video-thumbnail.png';

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: post.seoKeywords && post.seoKeywords.length > 0 ? post.seoKeywords : undefined,
        authors: [{ name: post.author?.name || 'Ads Spy Tool Expert' }],
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: canonical,
            siteName: 'Ads Spy Tool Blog',
            type: 'article',
            publishedTime: post.publishedAt,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [imageUrl],
        },
        alternates: {
            canonical: canonical,
        }
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const post = await sanityFetch<BlogPostDetail | null>({
        query: GET_POST_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!post) {
        notFound();
    }

    const metaTitle = post.seoTitle?.trim() || post.title;
    const metaDescription = post.seoDescription?.trim() || post.excerpt?.trim() || `Khám phá bài viết "${post.title}" tại Ads Spy Tool.`;
    const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1400).height(900).auto('format').fit('max').url() : null;
    const dateInfo = formatDate(post.publishedAt);

    // Schema.org cho chuẩn bài viết Blog (BlogPosting) kết hợp GEO/Organization
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://ads-spy-tool.tech/blog/${slug}`
        },
        "headline": metaTitle,
        "description": metaDescription,
        "keywords": post.seoKeywords && post.seoKeywords.length > 0 ? post.seoKeywords.join(', ') : undefined,
        "image": imageUrl || "https://ads-spy-tool.tech/marketing-video-thumbnail.png",
        "author": {
            "@type": "Person",
            "name": post.author?.name || "Ads Spy Tool Expert"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CÔNG TY TNHH CÔNG NGHỆ SỐ QUICKBLACK",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ads-spy-tool.tech/favicon.svg"
            }
        },
        "datePublished": dateInfo.iso || new Date().toISOString(),
        "dateModified": dateInfo.iso || new Date().toISOString()
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Header />

            {/* Chèn cấu trúc dữ liệu Schema */}
            <Script
                id="blog-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />

            <div className="sticky top-16 z-40 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto max-w-5xl xl:max-w-6xl px-4 py-3 md:px-8 lg:px-10">
                    <Link
                        href="/blog"
                        aria-label="Quay lại danh sách bài viết"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-all hover:text-indigo-300"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Quay lại danh sách bài viết
                    </Link>
                </div>
            </div>

            <main className="mx-auto max-w-5xl xl:max-w-6xl px-4 py-8 md:px-8 lg:px-10">
                <article className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                    {imageUrl ? (
                        <div className="relative h-72 w-full overflow-hidden sm:h-96 md:h-[450px] lg:h-[520px] bg-slate-950">
                            <Image
                                src={imageUrl}
                                alt={`Ảnh bìa cho bài viết: ${post.title}`}
                                fill
                                sizes="(max-width: 1280px) 100vw, 1152px"
                                className="object-cover opacity-90"
                                priority
                            />
                        </div>
                    ) : null}

                    <div className="space-y-8 p-6 sm:p-10 md:p-12">
                        <div className="flex flex-wrap gap-2">
                            {post.categories?.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/blog/category/${category.slug}`}
                                    title={`Xem các bài viết chuyên đề ${category.title}`}
                                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 transition-colors hover:bg-indigo-500/20"
                                >
                                    {category.title}
                                </Link>
                            ))}
                        </div>

                        <header className="space-y-6 border-b border-slate-800 pb-8">
                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        <UserCircle2 className="h-4 w-4" />
                                    </div>
                                    <span itemProp="author">{post.author?.name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    {/* Sử dụng thẻ time chuẩn ngữ nghĩa HTML5 cho ngày tháng */}
                                    <time dateTime={dateInfo.iso}>{dateInfo.display}</time>
                                </div>
                            </div>

                            {post.excerpt ? (
                                <p className="text-lg leading-relaxed text-slate-300 font-normal">
                                    {post.excerpt}
                                </p>
                            ) : null}
                        </header>

                        <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-blockquote:rounded-r-2xl prose-a:text-indigo-400 prose-img:rounded-2xl">
                            <PortableText value={post.body} components={customComponents} />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}