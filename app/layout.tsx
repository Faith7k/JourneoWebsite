import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Journeo - AI Destekli Seyahat Rehberi',
  description: 'Yapay zeka destekli kişisel seyahat asistanınız',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://journeo.ai'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

