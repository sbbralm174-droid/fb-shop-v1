import LoginButtons from '@/components/auth/LoginButtons';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Sign In</h1>
        <LoginButtons />
      </div>
    </div>
  );
}