'use client'

import {CacheProvider} from '@chakra-ui/next-js'

import {ChakraProvider, Container, extendTheme} from '@chakra-ui/react'

import React from "react";
import Header from "@/app/Header";

const config = {
    initialColorMode: '',
    useSystemColorMode: false,
}

const theme = extendTheme({config})

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <Container maxW='3xl'>
                    <Header/>
                    {children}
                </Container>
            </ChakraProvider>
        </CacheProvider>
    )
}