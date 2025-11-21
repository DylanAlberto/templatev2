"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ProtectedRoute, useAuth } from "@templatev2/auth";
import {
  Layout,
  LoadingSkeleton,
  Box,
  Heading,
  Text,
  VStack,
  Card,
} from "@templatev2/ui";

function DashboardContent() {
  const { t } = useTranslation();
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [authLoading, user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const sidebarItems = [
    { label: t("common.dashboard"), href: "/dashboard" },
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
      {isLoading || authLoading ? (
        <LoadingSkeleton showHeader={true} showCards={true} cardCount={3} />
      ) : (
        <Box>
          <Box mb={8}>
            <Heading as="h1" size="xl" mb={2}>
              {t("dashboard.title")}
            </Heading>
            <Text color="gray.600">
              {t("dashboard.subtitle")}
            </Text>
          </Box>

          <VStack gap={6} align="stretch">
            <Card.Root>
              <Card.Header>
                <Heading size="md">{t("dashboard.quickStats")}</Heading>
              </Card.Header>
              <Card.Body>
                <Text mb={4}>
                  {t("dashboard.dashboardDescription")}
                </Text>
                <Text color="gray.600">
                  {t("dashboard.accountInfoDescription")}
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size="md">{t("dashboard.userInformation")}</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text>
                    <strong>{t("dashboard.emailLabel")}:</strong> {user?.email ?? "N/A"}
                  </Text>
                  <Text>
                    <strong>{t("dashboard.userId")}:</strong> {user?.id ?? "N/A"}
                  </Text>
                  <Text>
                    <strong>{t("dashboard.emailVerified")}:</strong>{" "}
                    {user?.email_confirmed_at ? t("dashboard.yes") : t("dashboard.no")}
                  </Text>
                  <Text>
                    <strong>{t("dashboard.accountCreated")}:</strong>{" "}
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Header>
                <Heading size="md">{t("dashboard.gettingStarted")}</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Text>
                    ✅ {t("dashboard.gettingStarted1")}
                  </Text>
                  <Text>
                    ✅ {t("dashboard.gettingStarted2")}
                  </Text>
                  <Text>
                    ✅ {t("dashboard.gettingStarted3")}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </VStack>
        </Box>
      )}
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
