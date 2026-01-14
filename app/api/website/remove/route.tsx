import {NextRequest, NextResponse} from "next/server";
import {websitesTable} from "@/configs/schema";
import {db} from "@/configs/db";
import {and, eq} from "drizzle-orm";
import getServerUser from "@/lib/auth-server";

export async function DELETE(req:NextRequest) {
    try {
        const {websiteId} = await req.json()
        const user = await getServerUser()

        if (!user) {
            return NextResponse.json({error: 'unauth'}, {status: 400})
        }

        const result = await db.delete(websitesTable).where(
            and(eq(websitesTable.websiteId, websiteId), eq(websitesTable.userEmail, user?.email))
        )

        return  NextResponse.json({ok: true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})
    }
}