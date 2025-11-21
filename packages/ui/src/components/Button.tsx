"use client";

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface ButtonProps extends ChakraButtonProps {
  variant?: "solid" | "outline" | "ghost" | "subtle" | "surface" | "plain";
  colorPalette?: "brand" | "success" | "warning" | "danger" | "gray";
  size?: "xs" | "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, colorPalette = "brand", ...props }, ref) => {
    return (
      <ChakraButton ref={ref} colorPalette={colorPalette} {...props}>
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";


