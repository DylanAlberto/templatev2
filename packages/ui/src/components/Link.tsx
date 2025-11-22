"use client";

import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface LinkProps extends ChakraLinkProps {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraLink ref={ref} {...props}>
        {children}
      </ChakraLink>
    );
  }
);

Link.displayName = "Link";


