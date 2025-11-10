import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Snag Tracker',
  description: 'Track and manage property snags quickly.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
