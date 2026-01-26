import { SignUp } from '@platform/auth';

// Force dynamic rendering to support Clerk authentication
export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
