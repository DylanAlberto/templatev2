"use client";

import { Text as ChakraText, TextProps as ChakraTextProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface TextProps extends ChakraTextProps {}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraText ref={ref} {...props}>
        {children}
      </ChakraText>
    );
  }
);

Text.displayName = "Text";


