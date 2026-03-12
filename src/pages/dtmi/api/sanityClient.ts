import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configure your Sanity client
export const sanityClient = createClient({
  projectId: 'dnylqqoa',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Set to false for fresh data// Optional: for authenticated requests
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
