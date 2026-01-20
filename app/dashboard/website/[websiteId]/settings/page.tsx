"use client"
import React, {useEffect, useState} from 'react'
import {ArrowLeft, Copy, Loader2Icon, TrashIcon} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useAuth} from "@/context/useAuth";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";


const SettingsPage = () => {
    const {websiteId} = useParams()
    const {user} = useAuth()
    const router = useRouter()
    const [websiteDomain, setWebsiteDomain] = useState<string>()
    const [websiteDetail, setWebsiteDetail] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        websiteId && getWebsiteDomain()
    }, [websiteId]);
    const getWebsiteDomain =  async () => {
        try {
            const result  = await axios.get(`/api/website/getOneDomain?websiteId=${websiteId}`)
            setWebsiteDetail(result.data.data)
            setWebsiteDomain(result.data.data.domain)
        } catch (error) {
            console.log(error)
            toast.error('failed to get website domain')
        }
    }
    console.log(user)
    const script = `<script defer\n  data-website-id=\"${websiteId}\"\n  data-domain=\"https://${websiteDetail?.domain}\"\n
  src=\"https://analytity-track.vercel.app/analytics.js\">\n
</script>`
    const copyScript = async () => {
        await navigator.clipboard.writeText(script)
        toast.success("Скрипт скопирован")
    }
    console.log(websiteDetail)
    const onDeleteWebsite = async () => {
        try {
            setLoading(true)
            const result = await axios.delete(`/api/website/remove?websiteId=${websiteId}`,
                )
            if (result.data.ok) {
                toast.success('Вебсайт успешно удалён!')
                router.replace('/dashboard')
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            toast.error("Не удалось удалить вебсайт!")
            console.log(error)
        }
    }
    if (!websiteDetail) {
        return
    }
    return (
        <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 space-y-5">
            <Button onClick={() => router.replace(`/dashboard/website/${websiteId}`)} className=''>
                <ArrowLeft/> Назад
            </Button>
            <h2 className='text-3xl font-semibold '>Настройки для </h2>
            <Tabs
                defaultValue="general"
                className="w-full max-w-full md:max-w-[800px]"
            >
                <TabsList className="flex w-full overflow-x-auto">
                    <TabsTrigger className="flex-1" value="general">Главные</TabsTrigger>
                    <TabsTrigger className="flex-1" value="other">Другие</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Script
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-primary/10 rounded-lg p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-x-auto">
  <pre className="whitespace-pre-wrap break-all">
    {script}
  </pre>

                                <Button
                                    variant="secondary"
                                    className="mt-2 w-full sm:w-auto flex gap-2"
                                    onClick={copyScript}
                                >
                                    Скопировать
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>URL</CardTitle>
                            <CardDescription>
                                Ваш главный вебсайт для отслеживания аналитики
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input value={websiteDomain} onChange={(e) => setWebsiteDomain(e.target.value)} placeholder='website.com'/>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-2 text-sm">
                                <h2 className="break-all">
                                    Публичный ID: {websiteId}
                                </h2>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="other">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Осторожно!
                            </CardTitle>
                            <CardDescription>
                                Это действия нельзя будет вернуть! Это действия нельзя будет вернуть!
                            </CardDescription>
                        </CardHeader>
                        <Separator/>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full sm:w-auto flex gap-2">
                                        <TrashIcon className="w-4 h-4" />
                                        Удалить
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Вы уверены что хотите удалить?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Это действия нельзя будет вернуть! Это действия нельзя будет вернуть!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Отменить</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDeleteWebsite()} >
                                            {loading ? <Loader2Icon className='animate-spin'/> : <TrashIcon/>}
                                            {loading ? "Подождите..." : 'Удалить'}
                                            </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>


                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default SettingsPage
