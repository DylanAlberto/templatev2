"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Field,
  Input,
  Button,
} from "../..";

interface CreateTaskFormProps {
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export function CreateTaskForm({
  onSubmit,
  isLoading,
}: CreateTaskFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    await onSubmit(title.trim());
    setTitle("");
  };

  return (
    <Box
      p={4}
      bg={{ base: "white", _dark: "gray.800" }}
      borderWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      borderRadius="md"
    >
      <form onSubmit={handleSubmit}>
        <Field.Root required>
          <Box display="flex" gap={2}>
            <Input
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder={t("tasks.taskTitle")}
              disabled={isLoading}
              size="lg"
            />
            <Button
              type="submit"
              colorPalette="brand"
              size="lg"
              loading={isLoading}
              disabled={isLoading || !title.trim()}
            >
              {t("tasks.addTask")}
            </Button>
          </Box>
        </Field.Root>
      </form>
    </Box>
  );
}

