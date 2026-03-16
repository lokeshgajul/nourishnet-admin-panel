import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/admin/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NourishNet | Admin Panel',
  description: 'Manage NGO applications for NourishNet',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-72 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

