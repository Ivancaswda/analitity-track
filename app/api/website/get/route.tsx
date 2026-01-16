import {toast} from "sonner";
import {NextResponse} from "next/server";
import {db} from "@/configs/db";
import {websitesTable} from "@/configs/schema";
import {eq,desc} from "drizzle-orm";
import getServerUser from "@/lib/auth-server";

export async function GET(req: Request) {
    try {

        const user = await getServerUser()
        if (!user) {
            return NextResponse.json({error: 'unauth'}, {status: 400})
        }

        const websites  =await db.select().from(websitesTable)
            .where(eq(websitesTable?.userEmail, user?.email)).orderBy(desc(websitesTable.id))

        return  NextResponse.json({websites:websites})


    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error})
    }
}