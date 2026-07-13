'use client'

import {
    Box,
    Button,
    Collapsible,
    Flex,
    IconButton,
    Image,
    Link,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import {useColorModeValue} from "@/components/ui/color-mode";
import {LuMenu, LuX} from "react-icons/lu";
import NextLink from "next/link";
import React from "react";
import {FaPlus} from "react-icons/fa6";

export default function Header() {
    const {open, onToggle} = useDisclosure()

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{base: 2}}
                px={{base: 4}}
                borderBottom={1}
                borderRadius={'lg'}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <Flex
                    flex={{base: 1, md: 'auto'}}
                    ml={{base: -2}}
                    display={{base: 'flex', md: 'none'}}>
                    <IconButton
                        onClick={onToggle}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}>
                        {open ? <LuX/> : <LuMenu/>}
                    </IconButton>
                </Flex>
                <Flex flex={{base: 1}} justify={{base: 'center', md: 'start'}}>
                    <Link asChild>
                        <NextLink href="/">
                            <Image h="6" alt="Top12" src={'/logo.svg'}/>
                        </NextLink>
                    </Link>

                    <Flex display={{base: 'none', md: 'flex'}} ml={5}>
                        <DesktopNav/>
                    </Flex>
                </Flex>
                <Stack
                    flex={{base: 1, md: 0}}
                    justify={'flex-end'}
                    direction={'row'}
                    gap={6}>
                    <Button asChild fontSize='sm' fontWeight={400} aria-label='New List'>
                        <NextLink href={`/new`}>
                            <FaPlus/> New List
                        </NextLink>
                    </Button>
                </Stack>
            </Flex>

            <Collapsible.Root open={open}>
                <Collapsible.Content>
                    <MobileNav/>
                </Collapsible.Content>
            </Collapsible.Root>
        </Box>
    )
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')

    return (
        <Stack direction={'row'} gap={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Link
                        p={2}
                        href={navItem.href ?? '#'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                        }}>
                        {navItem.label}
                    </Link>
                </Box>
            ))}
        </Stack>
    )
}

const MobileNav = () => {
    const bg = useColorModeValue('white', 'gray.800')
    const labelColor = useColorModeValue('gray.600', 'gray.200')

    return (
        <Stack bg={bg} p={4} display={{md: 'none'}}>
            {NAV_ITEMS.map((navItem) => (
                <Link key={navItem.label} py={2} href={navItem.href ?? '#'}>
                    <Text as='span' fontWeight={600} color={labelColor}>
                        {navItem.label}
                    </Text>
                </Link>
            ))}
        </Stack>
    )
}

interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Friends',
        href: '/',
    },
    // {
    //     label: 'Inspiration',
    //     children: [
    //         {
    //             label: 'Popular',
    //             subLabel: 'Top 1000 popular movies',
    //             href: '#',
    //         },
    //         {
    //             label: 'Top Rated',
    //             subLabel: 'Top 1000 top rated films',
    //             href: '#',
    //         },
    //     ],
    // },
    {
        label: 'Friend Picks',
        href: '/picks',
    },
    {
        label: 'Random Pick',
        href: '/random',
    },
    {
        label: 'Top 1000',
        href: '/top',
    },
]
