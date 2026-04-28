import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ustaad.ai - Your Personal Pakistani AI Tutor',
    short_name: 'Ustaad.ai',
    description: 'Personalized AI tutoring for Pakistani students in Roman Urdu & English.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D1A',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
