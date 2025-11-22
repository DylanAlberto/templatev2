"use client";

import { Separator as ChakraSeparator, SeparatorProps as ChakraSeparatorProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface SeparatorProps extends ChakraSeparatorProps {}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraSeparator ref={ref} {...props}>
        {children}
      </ChakraSeparator>
    );
  }
);

Separator.displayName = "Separator";


