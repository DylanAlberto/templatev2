"use client";

import { useState } from "react";
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
} from "@templatev2/ui";
import { useSignUpMutation } from "@templatev2/auth";

export default function SignUpPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { signUp, isLoading } = useSignUpMutation();

  const validateForm = (): boolean => {
    setError(null);

    if (!email || !email.includes("@")) {
      setError(t("auth.errors.invalidEmail"));
      return false;
    }

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

    try {
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000/auth/callback";

      await signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message ?? t("auth.errors.signUpFailed"));
    }
  };

  if (success) {
    return (
      <Container maxW="md" py={16}>
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="md"
          textAlign="center"
        >
          <Alert.Root status="success" mb={4}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {t("auth.emailVerificationSuccess")}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <Link href="/sign-in">
            <ChakraLink color="brand.500">{t("common.goToSignIn")}</ChakraLink>
          </Link>
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
            {t("auth.signUpTitle")}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {t("auth.signUpSubtitle")}
          </Text>
        </Box>

        {error && (
          <Alert.Root status="error" mb={6} borderRadius="md" >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description fontSize="sm">{error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Field.Root
              required
              invalid={!!error && (!email || !email.includes("@"))}
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

            <Field.Root
              required
              invalid={!!error && (!password || password.length < 6)}
            >
              <Field.Label fontSize="sm" fontWeight="medium">
                {t("common.password")}
              </Field.Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.enterPasswordMin")}
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
                !!error && password !== confirmPassword && confirmPassword.length > 0
              }
            >
              <Field.Label fontSize="sm" fontWeight="medium">
                {t("common.confirmPassword")}
              </Field.Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("auth.confirmYourPassword")}
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
              disabled={isLoading}
              mt={2}
            >
              {t("common.signUp")}
            </Button>
          </VStack>
        </form>

        <Text mt={6} textAlign="center" color="gray.600" fontSize="sm">
          {t("auth.alreadyHaveAccount")}{" "}
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
      </Box>
    </Container>
  );
}
