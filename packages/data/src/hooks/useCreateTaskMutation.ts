import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "@templatev2/config";
import { useAuth } from "@templatev2/auth";
import type { DashboardTaskInsert, DashboardTask } from "../types/dashboard.types";

interface UseCreateTaskMutationResult {
  createTask: (task: DashboardTaskInsert) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateTaskMutation(): UseCreateTaskMutationResult {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createTask,
    isPending: isLoading,
    error,
  } = useMutation<DashboardTask, Error, DashboardTaskInsert>({
    mutationFn: async (taskData: DashboardTaskInsert): Promise<DashboardTask> => {
      if (!user?.id) {
        throw new Error("User must be authenticated to create tasks");
      }

      const { data, error: insertError } = await supabaseClient
        .from("dashboard_tasks")
        .insert({
          ...taskData,
          user_id: user.id,
          completed: taskData.completed ?? false,
        } as never)
        .select()
        .single();

      if (insertError) {
        throw new Error(
          `Failed to create task: ${insertError.message ?? "Unknown error"}`
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
    createTask: async (task: DashboardTaskInsert): Promise<void> => {
      await createTask(task);
    },
    isLoading,
    error: error ?? null,
  };
}

