'use client'

import React, {useState} from "react";
import {createUser} from "@/app/server/bridge";
import {
    Box,
    Button,
    Field,
    Heading,
    Input,
    InputGroup,
    Textarea,
    VStack
} from '@chakra-ui/react'
import {useColorModeValue} from "@/components/ui/color-mode";
import {toaster} from "@/components/ui/toaster";
import {BsPerson} from "react-icons/bs";
import {useRouter} from "next/navigation";
import {FaPlus} from "react-icons/fa6";
import {PHILOSOPHY_PLACEHOLDER} from "@/app/server/etc";

export default function New() {

    const [name, setName] = useState<string>("")
    const [philosophy, setPhilosophy] = useState<string>("")

    const router = useRouter()

    const create = () => {
        if (!name) {
            return
        }
        createUser(name, philosophy)
            .then((user) => {
                toaster.create({
                    title: 'New Top12 created.',
                    description: "Redirecting to your new edit page",
                    type: 'success',
                    duration: 9000,
                })

                router.replace(`/${user.id}/edit`)
            })
    }

    return (
        <VStack>
            <Heading my={4}>
                New Top12
            </Heading>
            <Box
                w={'100%'}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
                p={8}
                color={useColorModeValue('gray.700', 'whiteAlpha.900')}
                shadow="base">
                <VStack gap={5}>
                    <Field.Root required>
                        <Field.Label>Name</Field.Label>

                        <InputGroup startElement={<BsPerson/>}>
                            <Input type="text" name="name" placeholder="Your Name"
                                   onChange={(event) => setName(event.target.value)}/>
                        </InputGroup>
                    </Field.Root>

                    <Field.Root required>
                        <Field.Label>Philosophy</Field.Label>

                        <Textarea
                            h={150}
                            onChange={(event) => setPhilosophy(event.target.value)}
                            placeholder={PHILOSOPHY_PLACEHOLDER}/>
                    </Field.Root>
                    <Button
                        onClick={create}
                        alignSelf='flex-end'
                        fontSize='sm'
                        fontWeight={400}
                        aria-label='New'>
                        <FaPlus/> Create
                    </Button>
                </VStack>
            </Box>
        </VStack>
    )
}
