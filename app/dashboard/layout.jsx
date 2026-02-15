'use client';

import Sidebar from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import '../globals.css';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-black">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}