'use client'

import {Container} from '@chakra-ui/react'
import React from "react";
import {Provider as ChakraUiProvider} from "@/components/ui/provider";
import {Toaster} from "@/components/ui/toaster";
import Header from "@/app/Header";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <ChakraUiProvider forcedTheme='light'>
            <Container maxW='3xl'>
                <Header/>
                {children}
            </Container>
            <Toaster/>
        </ChakraUiProvider>
    )
}
