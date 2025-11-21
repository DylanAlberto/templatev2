"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import { useSidebarStore } from "@templatev2/config";
import {
  Box,
  VStack,
  Link as ChakraLink,
  IconButton,
  Text,
} from "../..";

interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface SidebarProps {
  items?: SidebarItem[];
  children?: ReactNode;
}

export function Sidebar({ items, children }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  const defaultItems: SidebarItem[] = [
    { label: t("common.dashboard"), href: "/dashboard" },
    { label: t("common.profile"), href: "/dashboard/profile" },
    { label: t("common.settings"), href: "/dashboard/settings" },
  ];

  const sidebarItems = items ?? defaultItems;

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <Box
      as="aside"
      w="250px"
      h="100vh"
      bg={{ base: "gray.50", _dark: "gray.900" }}
      borderRight="1px"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
      position="sticky"
      top={0}
      overflowY="auto"
    >
      <VStack align="stretch" gap={0} p={4}>
        <Box mb={2} display="flex" justifyContent="flex-end">
          <IconButton
            aria-label={t("common.closeSidebar")}
            size="sm"
            variant="ghost"
            onClick={closeSidebar}
          >
            <Text>✕</Text>
          </IconButton>
        </Box>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} passHref>
              <ChakraLink
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="md"
                color={isActive ? { base: "brand.600", _dark: "brand.300" } : { base: "gray.700", _dark: "gray.200" }}
                bg={isActive ? { base: "brand.50", _dark: "brand.900" } : "transparent"}
                fontWeight={isActive ? "semibold" : "normal"}
                _hover={{
                  bg: isActive ? { base: "brand.50", _dark: "brand.900" } : { base: "gray.100", _dark: "gray.800" },
                  textDecoration: "none",
                }}
              >
                {item.icon && <Box>{item.icon}</Box>}
                {item.label}
              </ChakraLink>
            </Link>
          );
        })}

        {children && <Box mt={4}>{children}</Box>}
      </VStack>
    </Box>
  );
}

