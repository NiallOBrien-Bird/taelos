import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import './globals.css';

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

const outfit = localFont({
  src: './fonts/outfit-latin.woff2',
  variable: '--font-outfit',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

const unbounded = localFont({
  src: './fonts/unbounded-600.ttf',
  variable: '--font-unbounded',
  weight: '600',
  style: 'normal',
  display: 'swap',
});

const jetBrainsMono = localFont({
  src: './fonts/jetbrains-mono-latin.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.taelos.xyz'),
  applicationName: 'TÆLOS',
  title: 'TÆLOS — personal task manager',
  description:
    'A calm, private task manager for making progress visible one next step at a time.',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/icon-192.png?v=3', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=3', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.svg?v=3', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png?v=3', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TÆLOS',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
  themeColor: '#06091a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${unbounded.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
