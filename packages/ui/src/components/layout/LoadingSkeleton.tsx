"use client";

import {
  Box,
  VStack,
  HStack,
  Card,
} from "../..";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

interface LoadingSkeletonProps {
  showHeader?: boolean;
  showCards?: boolean;
  cardCount?: number;
}

export function LoadingSkeleton({
  showHeader = true,
  showCards = true,
  cardCount = 3,
}: LoadingSkeletonProps) {
  return (
    <VStack align="stretch" gap={6}>
      {showHeader && (
        <Box>
          <Skeleton height="40px" width="300px" mb={2} />
          <Skeleton height="20px" width="200px" />
        </Box>
      )}

      {showCards && (
        <VStack align="stretch" gap={4}>
          {Array.from({ length: cardCount }).map((_, index) => (
            <Card.Root key={index}>
              <Card.Header>
                <HStack gap={3}>
                  <SkeletonCircle size="10" />
                  <Skeleton height="20px" width="150px" />
                </HStack>
              </Card.Header>
              <Card.Body>
                <SkeletonText
                  mt="4"
                  noOfLines={3}
                  gap="4"
                />
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      )}

      <Box>
        <Skeleton height="200px" borderRadius="md" />
      </Box>
    </VStack>
  );
}


