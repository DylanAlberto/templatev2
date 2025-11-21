import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import { useAuth } from "@templatev2/auth";
import type { DashboardTask } from "../types/dashboard.types";

interface UseDashboardDataResult {
  tasks: DashboardTask[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataResult {
  const { user } = useAuth();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardTask[]>({
    queryKey: ["dashboard-tasks", user?.id],
    queryFn: async (): Promise<DashboardTask[]> => {
      if (!user?.id) {
        return [];
      }

      const { data, error: fetchError } = await supabaseClient
        .from("dashboard_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(
          `Failed to fetch tasks: ${fetchError.message ?? "Unknown error"}`
        );
      }

      return (data as DashboardTask[]) ?? [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    tasks,
    isLoading,
    error: error ? (error as Error) : null,
    refetch,
  };
}



