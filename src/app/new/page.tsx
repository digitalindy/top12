'use client'

import React, {useState} from "react";
import {createUser} from "@/app/server/bridge";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    useColorModeValue,
    useToast,
    VStack
} from '@chakra-ui/react'
import {BsPerson} from "react-icons/bs";
import {useRouter} from "next/navigation";
import {FaPlus} from "react-icons/fa6";
import {PHILOSOPHY_PLACEHOLDER} from "@/app/server/etc";

export default function New() {

    const [name, setName] = useState<string>("")
    const [philosophy, setPhilosophy] = useState<string>("")

    const toast = useToast()
    const router = useRouter()

    const create = () => {
        if (!name) {
            return
        }
        createUser(name, philosophy)
            .then((user) => {
                toast({
                    title: 'New Top12 created.',
                    description: "Redirecting to your new edit page",
                    status: 'success',
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
                <VStack spacing={5}>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>

                        <InputGroup>
                            <InputLeftElement>
                                <BsPerson/>
                            </InputLeftElement>
                            <Input type="text" name="name" placeholder="Your Name"
                                   onChange={(event) => setName(event.target.value)}/>
                        </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Philosophy</FormLabel>

                        <InputGroup>
                            <Textarea
                                h={150}
                                onChange={(event) => setPhilosophy(event.target.value)}
                                placeholder={PHILOSOPHY_PLACEHOLDER}/>
                        </InputGroup>
                    </FormControl>
                    <Button
                        onClick={create}
                        alignSelf='right'
                        as='a'
                        fontSize='sm'
                        fontWeight={400}
                        aria-label='New'
                        leftIcon={<FaPlus/>}>
                        Create
                    </Button>
                </VStack>
            </Box>
        </VStack>
    )
}


