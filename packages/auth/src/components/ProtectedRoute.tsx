"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/sign-in",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        gap={4}
      >
        <Spinner size="xl" borderWidth="4px" color="brand.500" />
        <Text color="gray.600">Loading...</Text>
      </Box>
    );
  }

  // Don't render children if user is not authenticated
  // (will redirect in useEffect)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}


