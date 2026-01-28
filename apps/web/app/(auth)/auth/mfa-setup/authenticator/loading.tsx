/**
 * Loading State for TOTP Authenticator Setup Page
 *
 * Story: 1-1-8 MFA Setup - TOTP Authenticator
 * Displays a loading skeleton while the page is loading.
 */

export default function TotpSetupLoading() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-text-secondary text-sm">Loading authenticator setup...</p>
      </div>
    </div>
  );
}
