import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { GenreProvider } from '@/context/GenreContext';
import { RatingProvider } from '@/context/RatingContext';
import { Fetcher, getGenresURL } from '@/lib/tmdb/client';
import { Genre } from '@/lib/tmdb/types';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Movie Search',
  description: 'Web site for searching a movie',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const data: { genres: Genre[] } = await Fetcher({ url: getGenresURL() });
  const genres = data.genres;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <GenreProvider genres={genres}>
            <RatingProvider>{children}</RatingProvider>
          </GenreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
