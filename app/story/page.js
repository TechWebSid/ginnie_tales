"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Adjust the path based on your folder structure
import StoryGenerator from '@/components/StoryGenerator';
import React from 'react';

function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there is no user, redirect to login
    if (!loading && !user) {
      router.push("/signin"); // Change this to your actual login route
    }
  }, [user, loading, router]);

  // Show a loading state while checking the session
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg animate-pulse">Loading Ginnie Tales...</p>
      </div>
    );
  }

  // Only render the component if the user is authenticated
  return user ? (
    <div>
      <StoryGenerator />
    </div>
  ) : null;
}

export default Page;