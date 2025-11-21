"use client";

import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface BadgeProps extends ChakraBadgeProps {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraBadge ref={ref} {...props}>
        {children}
      </ChakraBadge>
    );
  }
);

Badge.displayName = "Badge";

