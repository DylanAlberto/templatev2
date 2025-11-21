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
  Separator,
  VStack,
} from "@templatev2/ui";
import {
  useSignInMutation,
  useAuth,
  useGoogleOAuthMutation,
} from "@templatev2/auth";

export default function SignInPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { signIn, isLoading } = useSignInMutation();
  const { signInWithGoogle, isLoading: isGoogleLoading } =
    useGoogleOAuthMutation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = (): boolean => {
    setError(null);

    if (!email || !email.includes("@")) {
      setError(t("auth.errors.invalidEmail"));
      return false;
    }

    if (!password) {
      setError(t("auth.errors.invalidPassword"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signIn({
        email,
        password,
      });

      // Success - AuthProvider will update the user state
      router.push("/");
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message ?? t("auth.errors.invalidCredentials"));
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      // OAuth will redirect to callback page
    } catch (err) {
      const authError = err as { message?: string };
      setError(authError.message ?? t("auth.errors.googleSignInFailed"));
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
            {t("auth.signInTitle")}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {t("auth.signInSubtitle")}
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

        <VStack gap={4} align="stretch">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            colorPalette="brand"
            variant="outline"
            width="full"
            size="lg"
            loading={isGoogleLoading}
            disabled={isGoogleLoading || isLoading}
          >
            <Box as="span" fontSize="lg" mr={2}>
              🔍
            </Box>
            {t("auth.continueWithGoogle")}
          </Button>

          <Separator>
            <Text fontSize="xs" color="gray.500" px={2}>
              {t("common.or") || "OR"}
            </Text>
          </Separator>

          <Box as="form" onSubmit={handleSubmit} width="full">
            <VStack gap={4} align="stretch">
              <Field.Root required invalid={!!error && !email.includes("@")}>
                <Field.Label fontSize="sm" fontWeight="medium">
                  {t("common.email")}
                </Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.enterEmail")}
                  disabled={isLoading || isGoogleLoading}
                  size="lg"
                  autoComplete="email"
                />
              </Field.Root>

              <Field.Root required invalid={!!error && !password}>
                <Field.Label fontSize="sm" fontWeight="medium">
                  {t("common.password")}
                </Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.enterPassword")}
                  disabled={isLoading || isGoogleLoading}
                  size="lg"
                  autoComplete="current-password"
                />
              </Field.Root>

              <Box textAlign="right">
                <Link href="/forgot-password">
                  <ChakraLink
                    fontSize="sm"
                    color="brand.500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {t("auth.forgotPasswordLink")}
                  </ChakraLink>
                </Link>
              </Box>

              <Button
                type="submit"
                colorPalette="brand"
                variant="solid"
                width="full"
                size="lg"
                loading={isLoading}
                disabled={isLoading || isGoogleLoading}
              >
                {t("common.signIn")}
              </Button>
            </VStack>
          </Box>
        </VStack>

        <Text mt={6} textAlign="center" color="gray.600" fontSize="sm">
          {t("auth.dontHaveAccount")}{" "}
          <Link href="/sign-up">
            <ChakraLink
              color="brand.500"
              fontWeight="medium"
              _hover={{ textDecoration: "underline" }}
            >
              {t("common.signUp")}
            </ChakraLink>
          </Link>
        </Text>
      </Box>
    </Container>
  );
}

