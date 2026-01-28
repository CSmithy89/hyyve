import { OnboardingStepper, OrganizationSetupForm } from '@/components/auth';
import { ONBOARDING_STEPS } from '@/lib/constants/onboarding';

const steps = ONBOARDING_STEPS.map((label) => ({ label }));

export default function OrganizationSetupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-6 sm:px-8 flex items-center justify-between">
        <div data-testid="hyyve-logo" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            H
          </div>
          <span className="text-xl font-bold tracking-tight">Hyyve</span>
        </div>
        <a
          href="/support"
          className="text-sm font-medium text-[#9795c6] hover:text-primary transition-colors"
        >
          Help
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-[640px] mb-8">
          <OnboardingStepper currentStep={1} steps={steps} />
        </div>

        <div className="w-full max-w-[640px] rounded-xl border border-[#383663] bg-[#1c1b32] shadow-2xl px-6 sm:px-8 py-8">
          <OrganizationSetupForm />
        </div>
      </main>
    </div>
  );
}
