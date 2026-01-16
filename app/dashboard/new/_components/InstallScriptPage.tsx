"use client"
import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy } from "lucide-react"
import { toast } from "sonner"

export default function InstallScriptPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const websiteId = searchParams.get("websiteId")
    const domain = searchParams.get("domain")

    const script = `<script defer\n  data-website-id=\"${websiteId}\"\n  data-domain=\"https://${domain}\"\n  src=\"http://localhost:3000/analytics.js\">\n</script>`

    const copyScript = async () => {
        await navigator.clipboard.writeText(script)
        toast.success("Скрипт скопирован")
    }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <Button
                variant="ghost"
                className="mb-4 flex items-center gap-2"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="w-4 h-4" /> Панель управления
            </Button>

            <Card className="rounded-xl">
                <CardHeader>
                    <CardTitle>Установка WebTrack Script</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Скопируйте и вставьте этот скрипт в <code>&lt;head&gt;</code> вашего сайта
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className=" bg-primary/10 text-black rounded-lg p-4 text-sm font-mono">
                        <pre className="whitespace-pre-wrap">{script}</pre>

                        <Button

                            variant="secondary"
                            className="mt-2"
                            onClick={copyScript}
                        >
                            Скопировать
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button className="w-full" onClick={() => router.push("/dashboard")}>
                        Ок, я установил скрипт
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
