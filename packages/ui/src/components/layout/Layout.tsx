"use client";

import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { useSidebarStore } from "@templatev2/config";
import { Box, Flex, IconButton, Text } from "../..";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  userEmail?: string | null;
  onSignOut?: () => void;
  sidebarItems?: Array<{
    label: string;
    href: string;
    icon?: ReactNode;
  }>;
  showSidebar?: boolean;
}

export function Layout({
  children,
  userEmail,
  onSignOut,
  sidebarItems,
  showSidebar = true,
}: LayoutProps) {
  const { t } = useTranslation();
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  return (
    <Flex direction="column" minH="100vh" bg={{ base: "gray.50", _dark: "gray.900" }}>
      <Header userEmail={userEmail} onSignOut={onSignOut}>
        {showSidebar && (
          <IconButton
            aria-label={t("common.toggleSidebar")}
            size="sm"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <Text fontSize="lg">☰</Text>
          </IconButton>
        )}
      </Header>

      <Flex flex={1}>
        {showSidebar && <Sidebar items={sidebarItems} />}

        <Box
          as="main"
          flex={1}
          p={6}
          overflowY="auto"
          w={showSidebar && isSidebarOpen ? "calc(100% - 250px)" : "100%"}
          transition="width 0.3s ease"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}


