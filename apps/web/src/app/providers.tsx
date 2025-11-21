"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@templatev2/auth";
import { I18nProvider } from "@templatev2/i18n";
import { system } from "@templatev2/ui";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ChakraProvider value={system}>
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

