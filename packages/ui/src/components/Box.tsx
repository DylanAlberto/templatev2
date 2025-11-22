"use client";

import { Box as ChakraBox, BoxProps as ChakraBoxProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface BoxProps extends ChakraBoxProps {}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraBox ref={ref} {...props}>
        {children}
      </ChakraBox>
    );
  }
);

Box.displayName = "Box";


