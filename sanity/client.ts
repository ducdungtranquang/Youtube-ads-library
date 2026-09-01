import { createClient } from 'next-sanity';
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';
import { apiVersion, dataset, projectId, useCdn } from './env';

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local or your environment before loading the blog pages.',
  );
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}

export async function sanityFetch<T>({
  query,
  params,
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params ?? {}, {
    next: {
      revalidate: 60,
      tags,
    },
  });
}
