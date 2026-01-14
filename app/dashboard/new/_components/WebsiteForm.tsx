"use client"
import React, {useState} from 'react'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {GlobeIcon, Loader2Icon, PlusIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Select, SelectItem, SelectGroup, SelectTrigger, SelectLabel, SelectContent, SelectValue, } from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {v4 as uuidv4} from 'uuid'
import {toast} from "sonner";
import {LoaderOne} from "@/components/ui/loader";
import {useRouter} from "next/navigation";
const WebsiteForm = () => {
    const [domain, setDomain] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false);
    const [loading, setLoading] = useState<boolean>()
    const router = useRouter()
    const onFormSubmit = async (e) => {
        try {
            e.preventDefault()

            setLoading(true)

            const websiteId = uuidv4()

            const result = await axios.post('/api/website/create', {
                websiteId,
                domain,
                timeZone,
                enableLocalhostTracking
            })

            if (result.data.message) {
                router.push(`/dashboard/new?step=script&websiteId=${result?.data?.website?.websiteId}&domain=${result?.data?.website?.domain}`)
                toast.success('Вы уже добавляли этот сайт, перенаправляем...')
            } else if(!result?.data.message) {
                router.push(`/dashboard/new?step=script&websiteId=${websiteId}&domain=${domain}`)
                toast.success('Сайт успешно добавлен для отслеживания')
            }


            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error('Ошибка при создании!')
            console.log(error)
        }
    }

    return (
        <div className='mt-5'>
            <Card>
                <CardHeader>
                    Создать новый вебсайт
                </CardHeader>
                <Separator/>
                <CardContent>
                    <form className='mt-5' onSubmit={(e) => onFormSubmit(e)}>
                        <Label className="mb-2">URL вебсайта</Label>

                        <InputGroup>
                            <InputGroupAddon>
                                https://
                            </InputGroupAddon>

                            <InputGroupInput
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\//, ""))}
                                required
                                placeholder="mywebsite.ru"
                            />

                            <InputGroupAddon>
                                <GlobeIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <div className='mt-5'>
                            <Label  className='text-sm mb-2'>Часовый полюс</Label>
                            <Select value={timeZone} onValueChange={(value) => setTimeZone(value)} required={true}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>North America</SelectLabel>
                                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Europe & Africa</SelectLabel>
                                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                                        <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                                        <SelectItem value="west">
                                            Western European Summer Time (WEST)
                                        </SelectItem>
                                        <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                                        <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Asia</SelectLabel>
                                        <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                        <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                                        <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                                        <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                                        <SelectItem value="ist_indonesia">
                                            Indonesia Central Standard Time (WITA)
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>Australia & Pacific</SelectLabel>
                                        <SelectItem value="awst">
                                            Australian Western Standard Time (AWST)
                                        </SelectItem>
                                        <SelectItem value="acst">
                                            Australian Central Standard Time (ACST)
                                        </SelectItem>
                                        <SelectItem value="aest">
                                            Australian Eastern Standard Time (AEST)
                                        </SelectItem>
                                        <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                                        <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                        <SelectLabel>South America</SelectLabel>
                                        <SelectItem value="art">Argentina Time (ART)</SelectItem>
                                        <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                                        <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                                        <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className='mt-5 flex gap-2 items-center'>
                                <Checkbox onCheckedChange={(val:boolean) => setEnableLocalhostTracking(val)} required={true}/> <span>Разрешить localhost отслеживание в дев моде</span>
                            </div>
                            <Button className='w-full mt-5'>
                                {loading ? <Loader2Icon className='animate-spin' /> :
                                    <PlusIcon/>
                                 }
                                {loading ? 'Подождите...' : 'Вебсайт'}


                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
export default WebsiteForm
