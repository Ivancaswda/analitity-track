import {NextRequest, NextResponse} from "next/server";
import {db} from "@/configs/db";
import {websitesTable} from "@/configs/schema";
import getServerUser from "@/lib/auth-server";
import {and, eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const user = await getServerUser()
        const {websiteId, domain, timeZone, enableLocalhostTracking} = await req.json()


        if (!user) {
            return NextResponse.json({error: 'unauth'}, {status: 400})
        }



        const userWebsites = await db
            .select()
            .from(websitesTable)
            .where(eq(websitesTable.userEmail, user.email));


        if (user.isPremium === 0 && userWebsites.length >= 3) {
            return NextResponse.json(
                { error: "WEBSITE_LIMIT_REACHED" },
                { status: 403 }
            );
        }


        const existingDomain = await db.select().from(websitesTable).where(
           and(eq(websitesTable.domain, domain), eq(websitesTable.userEmail, user?.email)))

        if (existingDomain.length > 0) {
            return NextResponse.json({
                message: 'Domain already exists!',
                website: existingDomain[0]
            }, { status: 200 })
        }

        const result = await db.insert(websitesTable).values({
            domain: domain,
            websiteId: websiteId,
            timeZone: timeZone,
            enableLocalhostTracking: enableLocalhostTracking,
            userEmail: user?.email
        }).returning()

        return NextResponse.json({website: result})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, {status: 500})
    }
}