"use client";

import { VStack as ChakraVStack, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface VStackProps extends StackProps {}

export const VStack = forwardRef<HTMLDivElement, VStackProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraVStack ref={ref} {...props}>
        {children}
      </ChakraVStack>
    );
  }
);

VStack.displayName = "VStack";

