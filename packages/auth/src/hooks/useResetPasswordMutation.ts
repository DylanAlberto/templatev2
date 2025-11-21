import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import type { AuthError } from "@supabase/supabase-js";

interface ResetPasswordCredentials {
  newPassword: string;
}

interface UseResetPasswordMutationResult {
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
}

export function useResetPasswordMutation(): UseResetPasswordMutationResult {
  const {
    mutateAsync: resetPassword,
    isPending: isLoading,
    error,
  } = useMutation<void, AuthError, ResetPasswordCredentials>({
    mutationFn: async (credentials: ResetPasswordCredentials): Promise<void> => {
      const { newPassword } = credentials;

      const { error: resetError } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (resetError) {
        throw resetError;
      }
    },
  });

  return {
    resetPassword: async (credentials: ResetPasswordCredentials): Promise<void> => {
      await resetPassword(credentials);
    },
    isLoading,
    error: error ?? null,
  };
}



