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
    useColorModeValue,
    useToast,
    VStack
} from '@chakra-ui/react'
import {FiPlus} from "react-icons/fi";
import {BsPerson} from "react-icons/bs";
import {useRouter} from "next/navigation";

export default function New() {

    const [name, setName] = useState<string>("")

    const toast = useToast()
    const router = useRouter()

    const create = () => {
        createUser(name)
            .then((user) => {
                toast({
                    title: 'New Top12 created.',
                    description: "Redirecting to your new edit page",
                    status: 'success',
                    duration: 9000,
                })

                console.log(user)

                router.replace(`/${user.id}/edit`)
            })
    }

    return (
        <VStack>
            <Heading my={4}>
                New Top12
            </Heading>
            <Box
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
                    <Button
                        onClick={create}
                        as='a'
                        fontSize='sm'
                        fontWeight={400}
                        aria-label='New'
                        leftIcon={<FiPlus/>}>
                        Create
                    </Button>
                </VStack>
            </Box>
        </VStack>
    )
}


