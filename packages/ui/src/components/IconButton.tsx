"use client";

import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface IconButtonProps extends ChakraIconButtonProps {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraIconButton ref={ref} {...props}>
        {children}
      </ChakraIconButton>
    );
  }
);

IconButton.displayName = "IconButton";


