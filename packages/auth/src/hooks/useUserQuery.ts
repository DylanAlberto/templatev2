import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@templatev2/config";

interface UseUserQueryResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export function useUserQuery(): UseUserQueryResult {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (error) {
        throw error;
      }

      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    user: user ?? null,
    isLoading,
    error: error ? (error as Error) : null,
  };
}



