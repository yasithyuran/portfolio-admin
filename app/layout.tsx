import { AuthProvider } from './lib/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Portfolio Admin Panel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}