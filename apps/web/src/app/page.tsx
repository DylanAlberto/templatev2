"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ProtectedRoute, useAuth } from "@templatev2/auth";
import {
  Layout,
  LoadingSkeleton,
  TaskList,
  CreateTaskForm,
  Box,
  Heading,
  Text,
  VStack,
  Card,
  Alert,
  HStack,
  Badge,
} from "@templatev2/ui";
import {
  useDashboardData,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  type DashboardTask,
} from "@templatev2/data";

function DashboardContent() {
  const { t } = useTranslation();
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const { tasks, isLoading: tasksLoading, error: tasksError } = useDashboardData();
  const { createTask, isLoading: isCreating } = useCreateTaskMutation();
  const { updateTask, isLoading: isUpdating } = useUpdateTaskMutation();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const handleCreateTask = async (title: string) => {
    await createTask({ title });
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    await updateTask(taskId, { completed });
  };

  const sidebarItems = [
    { label: t("common.dashboard"), href: "/" },
    { label: t("common.profile"), href: "/dashboard/profile" },
    { label: t("common.settings"), href: "/dashboard/settings" },
  ];

  return (
    <Layout
      userEmail={user?.email ?? null}
      onSignOut={handleSignOut}
      sidebarItems={sidebarItems}
      showSidebar={true}
    >
      {authLoading ? (
        <LoadingSkeleton showHeader={true} showCards={true} cardCount={3} />
      ) : (
        <Box>
          <Box mb={8}>
            <HStack justify="space-between" align="center" mb={2} flexWrap="wrap" gap={2}>
              <Heading as="h1" size="xl">
                {t("dashboard.title")}
              </Heading>
              {tasks.length > 0 && (
                <Badge
                  colorPalette="warning"
                  fontSize="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {tasks.filter((task: DashboardTask) => !task.completed).length}{" "}
                  {t("dashboard.pending")}
                </Badge>
              )}
            </HStack>
            <Text color="gray.600" fontSize="sm">
              {t("dashboard.subtitle")}
            </Text>
          </Box>

          <VStack gap={6} align="stretch">
            {tasksError && (
              <Alert.Root status="error" borderRadius="md" variant="left-accent" alignItems="start">
                <Alert.Indicator mt={1} />
                <Alert.Content>
                  <Alert.Title fontWeight="medium" mb={1}>
                    {t("common.error")}: {t("dashboard.loadingTasks")}
                  </Alert.Title>
                  <Alert.Description fontSize="sm" color="gray.600">
                    {tasksError.message}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <Card.Root>
              <Card.Header>
                <Heading size="md">{t("dashboard.myTasks")}</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <CreateTaskForm
                    onSubmit={handleCreateTask}
                    isLoading={isCreating}
                  />
                  {tasksLoading ? (
                    <Box py={4}>
                      <TaskList
                        tasks={[]}
                        onToggleComplete={handleToggleComplete}
                        isLoading={true}
                      />
                    </Box>
                  ) : (
                    <TaskList
                      tasks={tasks}
                      onToggleComplete={handleToggleComplete}
                      isLoading={isUpdating}
                    />
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size="md">{t("dashboard.quickStats")}</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <HStack justify="space-between" width="full">
                    <Text fontSize="sm" color="gray.600">
                      {t("dashboard.totalTasks")}:
                    </Text>
                    <Text fontWeight="semibold" fontSize="lg">
                      {tasks.length}
                    </Text>
                  </HStack>
                  <HStack justify="space-between" width="full">
                    <Text fontSize="sm" color="gray.600">
                      {t("dashboard.completed")}:
                    </Text>
                    <Badge colorPalette="success" fontSize="sm" px={2} py={1}>
                      {tasks.filter((task: DashboardTask) => task.completed).length}
                    </Badge>
                  </HStack>
                  <HStack justify="space-between" width="full">
                    <Text fontSize="sm" color="gray.600">
                      {t("dashboard.pending")}:
                    </Text>
                    <Badge colorPalette="warning" fontSize="sm" px={2} py={1}>
                      {tasks.filter((task: DashboardTask) => !task.completed).length}
                    </Badge>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Box>
      )}
    </Layout>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
