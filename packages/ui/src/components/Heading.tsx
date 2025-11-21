"use client";

import { Heading as ChakraHeading, HeadingProps as ChakraHeadingProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface HeadingProps extends ChakraHeadingProps {}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, color, ...props }, ref) => {
    // Use semantic token 'fg' (foreground) as default color if no color is specified
    // This ensures headings are always visible and adapt to light/dark mode
    const defaultColor = color ?? "fg";
    
    return (
      <ChakraHeading ref={ref} color={defaultColor} {...props}>
        {children}
      </ChakraHeading>
    );
  }
);

Heading.displayName = "Heading";

