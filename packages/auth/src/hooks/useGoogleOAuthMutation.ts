import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import type { AuthError } from "@supabase/supabase-js";

interface GoogleOAuthOptions {
  redirectTo?: string;
}

interface UseGoogleOAuthMutationResult {
  signInWithGoogle: (options?: GoogleOAuthOptions) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
}

export function useGoogleOAuthMutation(): UseGoogleOAuthMutationResult {
  const {
    mutateAsync: signInWithGoogle,
    isPending: isLoading,
    error,
  } = useMutation<void, AuthError, GoogleOAuthOptions | undefined>({
    mutationFn: async (options?: GoogleOAuthOptions): Promise<void> => {
      const redirectTo =
        options?.redirectTo ??
        (typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000/auth/callback");

      const { error: oAuthError } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (oAuthError) {
        throw oAuthError;
      }
    },
  });

  return {
    signInWithGoogle: async (options?: GoogleOAuthOptions): Promise<void> => {
      await signInWithGoogle(options);
    },
    isLoading,
    error: error ?? null,
  };
}



