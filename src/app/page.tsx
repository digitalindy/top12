import 'server-only'

import Core from "@/app/server/Core";
import Home from "@/app/Home";

export default async function Index() {

    const allUsers = await Core.instance.listUsers()

    return (
        <>
            <Home users={allUsers} />
        </>
    )
}
