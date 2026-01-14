import {pgTable, date, uuid, text, json, timestamp, varchar, integer, boolean, bigint} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userName: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    avatarUrl: varchar(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isPremium: integer().default(0),
});
export const websitesTable = pgTable('websites', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar({length: 255}).notNull().unique(),
    domain: varchar({length: 255}).notNull(),
    timeZone: varchar({length: 100}).notNull(),
    enableLocalhostTracking: boolean().default(false),
    userEmail: varchar().references(() => usersTable.email)
})

export const pageViewTable = pgTable('pageViews', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    visitorId: varchar({length:255}),
    websiteId: varchar({length: 255}).notNull(),
    domain: varchar({length: 255}).notNull(),
    url: varchar({length: 2048}),
    type: varchar({length: 50}).notNull(),
    referrer: varchar({ length: 2048 }),
    entryTime: varchar({length: 100}),
    exitTime: varchar({length: 100}),
    totalActiveTime: integer(),
    urlParams: varchar(),
    utm_source: varchar({length: 255}),
    utm_medium: varchar({length: 255}),
    utm_campaign: varchar({length: 255}),
    device: varchar(),
    os:varchar(),
    browser: varchar(),
    city: varchar(),
    country: varchar(),
    region: varchar(),
    ipAddress: varchar(),
    refParams: varchar(),
    countryCode: varchar()

})

export const liveUserTable = pgTable('liveUsers', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    visitorId: varchar({length:255}).unique(),
    websiteId: varchar({length:255}),
    city: varchar(),
    country: varchar(),
    region: varchar(),
    lat: varchar(),
    lng: varchar(),
    device: varchar(),
    os: varchar(),
    browser: varchar(),
    last_seen: varchar()
})