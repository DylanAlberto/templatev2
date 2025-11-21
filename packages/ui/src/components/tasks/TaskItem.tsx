"use client";

import {
  Checkbox,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Flex,
  Text,
  IconButton,
} from "../..";

export interface DashboardTask {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  completed: boolean;
}

export interface TaskItemProps {
  task: DashboardTask;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const { t } = useTranslation();

  return (
    <Box
      p={4}
      bg={{ base: "white", _dark: "gray.800" }}
      borderWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      borderRadius="md"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <Flex align="center" gap={3}>
        <Checkbox.Root
          checked={task.completed}
          onCheckedChange={(details) =>
            onToggleComplete?.(task.id, details.checked as boolean)
          }
          size="lg"
          colorPalette="brand"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>
        <Box flex={1}>
          <Text
            fontSize="md"
            fontWeight="medium"
            color={task.completed ? "gray.500" : { base: "gray.800", _dark: "gray.200" }}
            textDecoration={task.completed ? "line-through" : "none"}
          >
            {task.title}
          </Text>
          {task.created_at && (
            <Text fontSize="xs" color="gray.500" mt={1}>
              {new Date(task.created_at).toLocaleDateString()}
            </Text>
          )}
        </Box>
        {onDelete && (
          <IconButton
            aria-label={t("tasks.deleteTask")}
            size="sm"
            variant="ghost"
            colorPalette="danger"
            onClick={() => onDelete(task.id)}
          >
            <Text>🗑️</Text>
          </IconButton>
        )}
      </Flex>
    </Box>
  );
}

