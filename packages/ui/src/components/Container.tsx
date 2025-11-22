"use client";

import { Container as ChakraContainer, ContainerProps as ChakraContainerProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface ContainerProps extends ChakraContainerProps {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraContainer ref={ref} {...props}>
        {children}
      </ChakraContainer>
    );
  }
);

Container.displayName = "Container";


