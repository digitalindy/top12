'use client'

import {CacheProvider} from '@chakra-ui/next-js'

import {ChakraProvider, Container} from '@chakra-ui/react'

import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider>
                <Container maxW='3xl'>
                    {children}
                </Container>
            </ChakraProvider>
        </CacheProvider>
    )
}