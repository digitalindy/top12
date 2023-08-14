import 'server-only'

import UsersList from "@/app/UsersList";
import Core from "@/app/core/Core";

export default async function Home() {

    const allUsers = await Core.instance.listUsers()

    return (
        <>
            <UsersList users={allUsers} />
        </>
    )
}
