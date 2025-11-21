"use client";

import { useState } from "react";
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
} from "@templatev2/ui";
import { usePasswordRecoveryMutation } from "@templatev2/auth";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { sendRecoveryEmail, isLoading } = usePasswordRecoveryMutation();

  const validateForm = (): boolean => {
    setError(null);

    if (!email || !email.includes("@")) {
      setError(t("auth.errors.invalidEmail"));
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

    try {
      await sendRecoveryEmail({
        email,
      });

      setSuccess(true);
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message ?? t("auth.errors.recoveryEmailFailed"));
    }
  };

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
            {t("auth.forgotPassword")}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {t("auth.forgotPasswordSubtitle")}
          </Text>
        </Box>

        {success ? (
          <>
            <Alert.Root status="success" mb={6} borderRadius="md" variant="left-accent">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">
                  {t("auth.recoveryEmailSent")}
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
                  {t("common.backToSignIn")}
                </ChakraLink>
              </Link>
            </Box>
          </>
        ) : (
          <>
            {error && (
              <Alert.Root status="error" mb={6} borderRadius="md" variant="left-accent">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description fontSize="sm">{error}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <form onSubmit={handleSubmit}>
              <Field.Root
                required
                invalid={!!error && (!email || !email.includes("@"))}
                mb={6}
              >
                <Field.Label fontSize="sm" fontWeight="medium">
                  {t("common.email")}
                </Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.enterEmail")}
                  disabled={isLoading}
                  size="lg"
                  autoComplete="email"
                />
              </Field.Root>

              <Button
                type="submit"
                colorPalette="brand"
                variant="solid"
                width="full"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                {t("auth.sendRecoveryEmail")}
              </Button>
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
