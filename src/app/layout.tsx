// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';
import { Container } from '@mui/material';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mutual Fund Explorer',
  description: 'Explore mutual funds and calculate SIP returns.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <Navbar />
          <Container component="main" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}