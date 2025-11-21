"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  Button,
  Box,
  Container,
  Field,
  Input,
  Heading,
  Text,
  Link as ChakraLink,
  Alert,
  VStack,
  Spinner,
} from "@templatev2/ui";
import { useResetPasswordMutation } from "@templatev2/auth";
import { supabaseClient } from "@templatev2/config";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const { resetPassword, isLoading } = useResetPasswordMutation();

  useEffect(() => {
    const checkSession = async () => {
      if (typeof window === "undefined") return;
      
      try {
        const {
          data: { session: currentSession },
        } = await supabaseClient.auth.getSession();

        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const type = hashParams.get("type");

        if (accessToken && type === "recovery") {
          const { data, error: exchangeError } =
            await supabaseClient.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get("refresh_token") ?? "",
            });

          if (exchangeError) {
            setError(t("auth.errors.invalidResetLink"));
            setIsValidSession(false);
            return;
          }

          if (data.session) {
            setIsValidSession(true);
          }
        } else if (currentSession) {
          setIsValidSession(true);
        } else {
          setError(t("auth.errors.noValidSession"));
          setIsValidSession(false);
        }
      } catch (err) {
        setError(t("auth.errors.sessionValidationFailed"));
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [t]);

  const validateForm = (): boolean => {
    setError(null);

    if (!password || password.length < 6) {
      setError(t("auth.errors.passwordTooShort"));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordsDoNotMatch"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (!isValidSession) {
      setError(t("auth.errors.noSession"));
      return;
    }

    try {
      await resetPassword({
        newPassword: password,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message ?? t("auth.errors.resetPasswordFailed"));
    }
  };

  if (!isValidSession && !error) {
    return (
      <Container maxW="md" py={{ base: 8, md: 16 }}>
      <Box
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="lg"
        boxShadow="xl"
        borderWidth="1px"
        borderColor="gray.200"
        textAlign="center"
      >
        <Box mb={4}>
          <Spinner size="xl" color="brand.500" borderWidth="4px" />
        </Box>
          <Text color="gray.600" fontSize="sm">
            {t("auth.validatingResetLink")}
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={{ base: 8, md: 16 }}>
      <Box
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="lg"
        boxShadow="xl"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Box mb={6} textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            {t("auth.resetPassword")}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {t("auth.resetPasswordSubtitle")}
          </Text>
        </Box>

        {error && (
          <Alert.Root status="error" mb={6} borderRadius="md" variant="left-accent">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description fontSize="sm">{error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {success ? (
          <>
            <Alert.Root status="success" mb={6} borderRadius="md" variant="left-accent">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">
                  {t("auth.passwordResetSuccess")}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Box textAlign="center">
              <Link href="/sign-in">
                <ChakraLink
                  color="brand.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: "underline" }}
                >
                  {t("common.goToSignIn")}
                </ChakraLink>
              </Link>
            </Box>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <Field.Root
                  required
                  invalid={
                    !!error && (!password || password.length < 6) && password.length > 0
                  }
                >
                  <Field.Label fontSize="sm" fontWeight="medium">
                    {t("common.newPassword")}
                  </Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("auth.enterNewPassword")}
                    disabled={isLoading}
                    size="lg"
                    autoComplete="new-password"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {t("auth.passwordMinLength") || "Minimum 6 characters"}
                  </Text>
                </Field.Root>

                <Field.Root
                  required
                  invalid={
                    !!error &&
                    password !== confirmPassword &&
                    confirmPassword.length > 0
                  }
                >
                  <Field.Label fontSize="sm" fontWeight="medium">
                    {t("common.confirmNewPassword")}
                  </Field.Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("auth.confirmNewPasswordPlaceholder")}
                    disabled={isLoading}
                    size="lg"
                    autoComplete="new-password"
                  />
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="brand"
                  variant="solid"
                  width="full"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading || !isValidSession}
                  mt={2}
                >
                  {t("auth.resetPassword")}
                </Button>
              </VStack>
            </form>

            <Text mt={6} textAlign="center" color="gray.600" fontSize="sm">
              {t("auth.rememberPassword")}{" "}
              <Link href="/sign-in">
                <ChakraLink
                  color="brand.500"
                  fontWeight="medium"
                  _hover={{ textDecoration: "underline" }}
                >
                  {t("common.signIn")}
                </ChakraLink>
              </Link>
            </Text>
          </>
        )}
      </Box>
    </Container>
  );
}
