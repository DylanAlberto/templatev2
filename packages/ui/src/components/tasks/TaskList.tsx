"use client";

import {
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  VStack,
  Text,
  Box,
} from "../..";
import { TaskItem } from "./TaskItem";
import type { DashboardTask } from "./TaskItem";

interface TaskListProps {
  tasks: DashboardTask[];
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  isLoading,
}: TaskListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <VStack gap={3} align="stretch">
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            p={4}
            bg={{ base: "white", _dark: "gray.800" }}
            borderRadius="md"
            borderWidth="1px"
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
          >
            <Skeleton height="20px" mb={2} />
            <SkeletonText mt="2" noOfLines={1} gap="2" />
          </Box>
        ))}
      </VStack>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box
        textAlign="center"
        py={12}
        px={4}
        bg={{ base: "gray.50", _dark: "gray.700" }}
        borderRadius="md"
        borderWidth="1px"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
        borderStyle="dashed"
      >
        <Text color={{ base: "gray.600", _dark: "gray.400" }} fontSize="md">
          {t("dashboard.noTasks")}
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3} align="stretch">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </VStack>
  );
}

