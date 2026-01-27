import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding - Hyyve',
  description: 'Complete your organization onboarding and personalization.',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <style jsx global>{`
        body {
          background-color: #121121;
        }
      `}</style>
      <div className="min-h-screen bg-[#121121] text-white">{children}</div>
    </>
  );
}
