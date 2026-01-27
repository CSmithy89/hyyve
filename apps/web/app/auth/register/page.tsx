import { RegistrationForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden bg-[#121121] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(79,70,229,0.2)_1px,transparent_0)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <main role="main" className="relative w-full max-w-[480px] px-4 py-8">
        <RegistrationForm />
      </main>
    </div>
  );
}
