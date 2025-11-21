"use client";

import type { ChangeEvent, ReactNode } from "react";
import {
  Avatar,
  Menu,
  NativeSelect,
  Portal,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@templatev2/config";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
} from "../..";

interface HeaderProps {
  userEmail?: string | null;
  onSignOut?: () => void;
  children?: ReactNode;
}

export function Header({ userEmail, onSignOut, children }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang: "en" | "es") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Box
      as="header"
      bg={{ base: "white", _dark: "gray.800" }}
      borderBottom="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" justify="space-between">
        <Box>
          <Heading as="h1" size="lg" mb={0}>
            {t("common.dashboard")}
          </Heading>
        </Box>

        <Flex align="center" gap={4}>
          {children}

          <Box>
            <NativeSelect.Root size="sm" width="120px" colorPalette="brand">
              <NativeSelect.Field
                value={language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleLanguageChange(e.target.value as "en" | "es")}
                aria-label={t("common.changeLanguage")}
                color="fg"
              >
                <option value="en">{t("common.english")}</option>
                <option value="es">{t("common.spanish")}</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>

          {userEmail && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" borderRadius="full" aria-label={t("common.userMenu")}>
                  <Avatar.Root size="sm" colorPalette="brand">
                    <Avatar.Fallback name={userEmail} />
                  </Avatar.Root>
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Box px={4} py={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        {userEmail}
                      </Text>
                    </Box>
                    {onSignOut && (
                      <Menu.Item value="sign-out" onSelect={onSignOut} color="danger.500">
                        {t("common.signOut")}
                      </Menu.Item>
                    )}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}


