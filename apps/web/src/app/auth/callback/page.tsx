"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { supabaseClient } from "@templatev2/config";
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Alert,
  Link as ChakraLink,
} from "@templatev2/ui";

export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState(t("auth.verifyingEmail"));

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (typeof window === "undefined") return;
      
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setStatus("error");
            setMessage(t("auth.errors.signInError"));
            return;
          }

          if (data.session) {
            setStatus("success");
            setMessage(t("auth.signedInSuccess"));
            setTimeout(() => {
              router.push("/");
            }, 2000);
            return;
          }
        }

        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage(t("auth.errors.sessionError"));
          return;
        }

        if (data.session) {
          setStatus("success");
          const messageText = type === "recovery" 
            ? t("auth.passwordResetLinkVerified")
            : t("auth.emailVerifiedSuccess");
          setMessage(messageText);
          setTimeout(() => {
            if (type === "recovery") {
              router.push("/reset-password");
            } else {
              router.push("/");
            }
          }, 2000);
        } else {
          setStatus("error");
          setMessage(t("auth.errors.noSessionFound"));
        }
      } catch (err) {
        setStatus("error");
        setMessage(t("auth.errors.unexpectedError"));
      }
    };

    handleAuthCallback();
  }, [router, t]);

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
        {status === "loading" && (
          <>
            <Box mb={4}>
              <Spinner
                size="xl"
                color="brand.500"
                borderWidth="4px"
              />
            </Box>
            <Heading as="h1" size="lg" mb={2}>
              {t("auth.verifying")}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {message}
            </Text>
          </>
        )}

        {status === "success" && (
          <>
            <Alert.Root status="success" mb={6} borderRadius="md" colorPalette="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">{message}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Link href="/">
              <ChakraLink
                color="brand.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                {t("common.goToHome")}
              </ChakraLink>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <Alert.Root status="error" mb={6} borderRadius="md" colorPalette="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description fontSize="sm">{message}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <Link href="/sign-in">
              <ChakraLink
                color="brand.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                {t("common.goToSignIn")}
              </ChakraLink>
            </Link>
          </>
        )}
      </Box>
    </Container>
  );
}
