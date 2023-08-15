import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React from "react";
import {Providers} from "@/app/providers";
// import {Box, Container} from "@chakra-ui/react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Top12',
    description: 'An app for friends to track our top 12 movies',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Providers>{children}</Providers>
        </body>
        </html>
    )
}
