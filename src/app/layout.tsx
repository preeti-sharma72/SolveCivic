import type { Metadata } from 'next';
import './globals.css';
import { CityPulseProvider } from '@/lib/context/CityPulseContext';

export const metadata: Metadata = {
  title: 'CityPulse: The Live Civic Health Dashboard',
  description:
    'Track B (Industry / Open Innovation) - Real-time civic health telemetry, multi-vector anomaly detection, executive operations command center, and citizen engagement portal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-slate-950">
        <CityPulseProvider>{children}</CityPulseProvider>
      </body>
    </html>
  );
}
