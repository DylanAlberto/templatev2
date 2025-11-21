import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import type { AuthError } from "@supabase/supabase-js";

interface PasswordRecoveryCredentials {
  email: string;
  redirectTo?: string;
}

interface UsePasswordRecoveryMutationResult {
  sendRecoveryEmail: (credentials: PasswordRecoveryCredentials) => Promise<void>;
  isLoading: boolean;
  error: AuthError | null;
}

export function usePasswordRecoveryMutation(): UsePasswordRecoveryMutationResult {
  const {
    mutateAsync: sendRecoveryEmail,
    isPending: isLoading,
    error,
  } = useMutation<void, AuthError, PasswordRecoveryCredentials>({
    mutationFn: async (credentials: PasswordRecoveryCredentials): Promise<void> => {
      const { email, redirectTo } = credentials;

      const recoveryRedirectTo =
        redirectTo ??
        (typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000/reset-password");

      const { error: recoveryError } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: recoveryRedirectTo,
        }
      );

      if (recoveryError) {
        throw recoveryError;
      }
    },
  });

  return {
    sendRecoveryEmail: async (credentials: PasswordRecoveryCredentials): Promise<void> => {
      await sendRecoveryEmail(credentials);
    },
    isLoading,
    error: error ?? null,
  };
}



