"use client";

import { Spinner as ChakraSpinner, SpinnerProps as ChakraSpinnerProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface SpinnerProps extends ChakraSpinnerProps {}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ ...props }, ref) => {
    return (
      <ChakraSpinner ref={ref} {...props} />
    );
  }
);

Spinner.displayName = "Spinner";

