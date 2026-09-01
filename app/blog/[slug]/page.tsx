import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { CalendarDays, UserCircle2, ArrowLeft } from 'lucide-react';
import { client, sanityFetch, urlFor } from '@/sanity/client';
import { GET_POST_BY_SLUG_QUERY, type BlogPostDetail } from '@/sanity/queries';
import { Header } from '@/components/header';

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

const formatDate = (value?: string) => {
    if (!value) return 'Soon';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Soon';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const customComponents: PortableTextComponents = {
    block: {
        h1: ({ children }) => <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{children}</h3>,
        normal: ({ children }) => <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-indigo-500 bg-indigo-50/50 px-5 py-4 text-lg italic text-slate-700 dark:border-indigo-400 dark:bg-slate-900/70 dark:text-slate-200">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">{children}</ul>,
        number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700 dark:text-slate-300">{children}</ol>,
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-slate-700 dark:text-slate-200">{children}</em>,
        link: ({ value, children }) => {
            const href = typeof value?.href === 'string' ? value.href : '#';
            return (
                <a href={href} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300">
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
                <figure className="my-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Image src={imageUrl} alt={value.alt || 'Blog image'} width={1200} height={800} className="h-auto w-full object-fill" />
                </figure>
            );
        },
    },
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const post = await sanityFetch<BlogPostDetail | null>({
        query: GET_POST_BY_SLUG_QUERY,
        params: { slug },
    });

    if (!post) {
        notFound();
    }

    const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1400).height(900).auto('format').fit('max').url() : null;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
            {/* Tích hợp Header chung đồng bộ với HomePage */}
            <Header />

            <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 lg:px-10">
                <Link
                    href="/blog"
                    className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Quay lại danh sách bài viết
                </Link>

                <article className="overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-none">
                    {imageUrl ? (
                        <div className="relative h-72 w-full overflow-hidden sm:h-96 md:h-[420px] bg-slate-100 dark:bg-slate-800">
                            <Image src={imageUrl} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 896px" className="object-fill" priority />
                        </div>
                    ) : null}

                    <div className="space-y-8 p-6 sm:p-10 md:p-12">
                        <div className="flex flex-wrap gap-2">
                            {post.categories?.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/blog/category/${category.slug}`}
                                    className="rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                                >
                                    {category.title}
                                </Link>
                            ))}
                        </div>

                        <header className="space-y-6 border-b border-slate-100 pb-8 dark:border-slate-800">
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <UserCircle2 className="h-4 w-4" />
                                    </div>
                                    <span>{post.author?.name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <CalendarDays className="h-4 w-4" />
                                    </div>
                                    <span>{formatDate(post.publishedAt)}</span>
                                </div>
                            </div>

                            {post.excerpt ? (
                                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                                    {post.excerpt}
                                </p>
                            ) : null}
                        </header>

                        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-blockquote:rounded-r-2xl">
                            <PortableText value={post.body} components={customComponents} />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}