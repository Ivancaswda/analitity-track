import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {liveUserTable} from "@/configs/schema";
import {and, eq, gt} from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const websiteId = await req.nextUrl.searchParams.get('websiteId');
        const now = new Date()

        const activeUsers = await db
            .select()
            .from(liveUserTable)
            .where(
                and(
                    gt(liveUserTable.last_seen, new Date(now.getTime() - 30_000)),
                    eq(liveUserTable.websiteId, websiteId)
                )
            )

        return  NextResponse.json({activeUsers: activeUsers})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})
    }
}