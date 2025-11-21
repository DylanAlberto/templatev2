"use client";

import { Flex as ChakraFlex, FlexProps as ChakraFlexProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface FlexProps extends ChakraFlexProps {}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraFlex ref={ref} {...props}>
        {children}
      </ChakraFlex>
    );
  }
);

Flex.displayName = "Flex";

