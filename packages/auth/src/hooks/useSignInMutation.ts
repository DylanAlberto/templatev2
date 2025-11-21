import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import type { AuthError } from "@supabase/supabase-js";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  user: unknown;
  session: unknown;
}

interface UseSignInMutationResult {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
}

export function useSignInMutation(): UseSignInMutationResult {
  const {
    mutateAsync: signIn,
    isPending: isLoading,
    error,
  } = useMutation<SignInResponse, AuthError, SignInCredentials>({
    mutationFn: async (credentials: SignInCredentials): Promise<SignInResponse> => {
      const { email, password } = credentials;

      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user || !data.session) {
        throw new Error("Failed to sign in");
      }

      return {
        user: data.user,
        session: data.session,
      };
    },
  });

  return {
    signIn: async (credentials: SignInCredentials): Promise<void> => {
      await signIn(credentials);
    },
    isLoading,
    error: error ?? null,
  };
}



