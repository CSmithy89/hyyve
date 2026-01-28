import { BuilderSelectionForm } from '@/components/auth';

export default function PersonalizationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#272546] bg-[#121121]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 lg:px-10 max-w-7xl mx-auto w-full">
          <div data-testid="hyyve-logo" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 text-primary">
              <span className="material-symbols-outlined text-3xl">hive</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Hyyve</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#9795c6] hover:text-primary transition-colors">
              Help &amp; Support
            </button>
            <div className="h-4 w-px bg-[#272546]"></div>
            <div
              data-testid="user-avatar"
              className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[1px]"
            >
              <div className="h-full w-full rounded-full bg-[#121121] flex items-center justify-center">
                <span className="text-xs font-bold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 w-full max-w-5xl mx-auto">
        <div className="w-full max-w-3xl mb-12" data-testid="onboarding-stepper">
          <div className="flex items-center justify-between text-sm font-medium mb-4">
            <span className="text-[#9795c6]">Step 3 of 3</span>
            <span className="text-white">Personalization</span>
          </div>
          <div className="flex w-full items-center gap-2">
            <div data-testid="progress-bar" className="h-2 flex-1 rounded-full bg-primary" />
            <div data-testid="progress-bar" className="h-2 flex-1 rounded-full bg-primary" />
            <div data-testid="progress-bar" className="h-2 flex-1 rounded-full bg-primary" />
          </div>
        </div>

        <BuilderSelectionForm />
      </main>
    </div>
  );
}
