import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import { useAuth } from "@templatev2/auth";
import type { DashboardTaskUpdate, DashboardTask } from "../types/dashboard.types";

interface UseUpdateTaskMutationResult {
  updateTask: (taskId: string, updates: DashboardTaskUpdate) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useUpdateTaskMutation(): UseUpdateTaskMutationResult {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateTask,
    isPending: isLoading,
    error,
  } = useMutation<DashboardTask, Error, { taskId: string; updates: DashboardTaskUpdate }>({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: DashboardTaskUpdate;
    }): Promise<DashboardTask> => {
      if (!user?.id) {
        throw new Error("User must be authenticated to update tasks");
      }

      const { data, error: updateError } = await supabaseClient
        .from("dashboard_tasks")
        .update(updates as never)
        .eq("id", taskId)
        .eq("user_id", user.id) // Ensure user can only update their own tasks
        .select()
        .single();

      if (updateError) {
        throw new Error(
          `Failed to update task: ${updateError.message ?? "Unknown error"}`
        );
      }

      return data as DashboardTask;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks immediately
      queryClient.invalidateQueries({
        queryKey: ["dashboard-tasks", user?.id],
      });
    },
  });

  return {
    updateTask: async (taskId: string, updates: DashboardTaskUpdate): Promise<void> => {
      await updateTask({ taskId, updates });
    },
    isLoading,
    error: error ?? null,
  };
}

