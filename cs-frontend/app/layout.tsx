import type { Metadata } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ContractorSelect.me',
    template: '%s · ContractorSelect.me',
  },
  description:
    'The high-trust marketplace for verified UAE contractors. Connect, compare, choose with confidence.',
  metadataBase: new URL('https://contractorselect.me'),
  applicationName: 'ContractorSelect.me',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo-monogram.png',
  },
  openGraph: {
    title: 'ContractorSelect.me — Building trust. Delivering quality.',
    description:
      'The high-trust marketplace for verified UAE contractors. Connect, compare, choose with confidence.',
    siteName: 'ContractorSelect.me',
    locale: 'en_AE',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'ContractorSelect.me — Building trust. Delivering quality.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContractorSelect.me — Building trust. Delivering quality.',
    description:
      'The high-trust marketplace for verified UAE contractors.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
