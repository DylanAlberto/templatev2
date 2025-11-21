import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import type { AuthError } from "@supabase/supabase-js";

interface SignUpCredentials {
  email: string;
  password: string;
  options?: {
    data?: Record<string, unknown>;
    emailRedirectTo?: string;
  };
}

interface SignUpResponse {
  user: unknown;
  session: unknown;
}

interface UseSignUpMutationResult {
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
}

export function useSignUpMutation(): UseSignUpMutationResult {
  const {
    mutateAsync: signUp,
    isPending: isLoading,
    error,
  } = useMutation<SignUpResponse, AuthError, SignUpCredentials>({
    mutationFn: async (credentials: SignUpCredentials): Promise<SignUpResponse> => {
      const { email, password, options } = credentials;

      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: options?.emailRedirectTo,
          data: options?.data,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error("Failed to create user");
      }

      return {
        user: data.user,
        session: data.session,
      };
    },
  });

  return {
    signUp: async (credentials: SignUpCredentials): Promise<void> => {
      await signUp(credentials);
    },
    isLoading,
    error: error ?? null,
  };
}



