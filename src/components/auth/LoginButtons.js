'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

// Function to send user data to your API
const saveUserDataToDb = async (userData) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save user data to DB');
    }
    console.log("User data saved to DB:", data);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export default function LoginButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Extract user information
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      console.log("Google Sign-in successful!", userData);

      // Save user data to your own database
      await saveUserDataToDb(userData);

      router.push('/'); // Redirect to homepage or dashboard
    } catch (error) {
      console.error("Google Sign-in failed:", error.message);
      alert("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    // Keep this logic for later, as per your request
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Extract user information for Facebook
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      };

      console.log("Facebook Sign-in successful!", userData);
      await saveUserDataToDb(userData);
      router.push('/');
    } catch (error) {
      console.error("Facebook Sign-in failed:", error.message);
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("An account already exists with the same email address but different sign-in credentials.");
      } else {
        alert("Facebook Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
      >
        <FaGoogle className="h-5 w-5" />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      <button
        onClick={handleFacebookSignIn}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        <FaFacebook className="h-5 w-5" />
        {loading ? 'Signing in...' : 'Sign in with Facebook'}
      </button>
    </div>
  );
}