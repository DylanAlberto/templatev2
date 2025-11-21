"use client";

import { HStack as ChakraHStack, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface HStackProps extends StackProps {}

export const HStack = forwardRef<HTMLDivElement, HStackProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraHStack ref={ref} {...props}>
        {children}
      </ChakraHStack>
    );
  }
);

HStack.displayName = "HStack";

