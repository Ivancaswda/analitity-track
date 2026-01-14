import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {liveUserTable, websitesTable} from "@/configs/schema";
import {and, eq, gt} from "drizzle-orm";
import getServerUser from "@/lib/auth-server";

export async function GET(req: NextRequest) {
    try {
        const websiteId = await req.nextUrl.searchParams.get('websiteId');
        const user = await getServerUser()
        const data = await db
            .select()
            .from(websitesTable)
            .where(
                and(
                    eq(websitesTable.userEmail, user!.email),
                    eq(websitesTable.websiteId, websiteId)
                )
            )

        return  NextResponse.json({data: data[0]})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})
    }
}