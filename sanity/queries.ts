export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface SanityImage {
  _type?: 'image';
  asset?: {
    _ref?: string;
    _type?: 'reference';
    _weak?: boolean;
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  slug: string;
  image?: SanityImage;
  bio?: Array<Record<string, unknown>>;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt: string;
  mainImage?: SanityImage;
  author?: BlogAuthor;
  categories?: BlogCategory[];
}

export interface BlogPostDetail extends BlogPostSummary {
  body: Array<Record<string, unknown>>;
}

export const GET_CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description
}`;

export const GET_TOTAL_POSTS_COUNT_QUERY = `count(*[_type == "post" && defined(slug.current)])`;

export const GET_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  author->{
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current,
    description
  }
}`;

export const GET_POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  author->{
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current,
    description
  }
}`;

export const GET_TOTAL_POSTS_BY_CATEGORY_QUERY = `count(*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)])`;

export const GET_POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  mainImage,
  body,
  author->{
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current,
    description
  }
}`;

export const GET_CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description
}`;
