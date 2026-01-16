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
            if (error.response?.data?.error === "WEBSITE_LIMIT_REACHED") {
                toast.error("Доступно только 3 сайта. Перейдите на Premium 🚀");
                router.push("/pricing");
                return;
            }
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
                        <div className="mt-5">
                            <Label className="text-sm mb-2">Часовой пояс</Label>

                            <Select value={timeZone} onValueChange={setTimeZone} required>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Выберите часовой пояс" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Северная Америка</SelectLabel>
                                        <SelectItem value="est">Восточное время (EST)</SelectItem>
                                        <SelectItem value="cst">Центральное время (CST)</SelectItem>
                                        <SelectItem value="mst">Горное время (MST)</SelectItem>
                                        <SelectItem value="pst">Тихоокеанское время (PST)</SelectItem>
                                        <SelectItem value="akst">Аляскинское время (AKST)</SelectItem>
                                        <SelectItem value="hst">Гавайское время (HST)</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel>Европа и Африка</SelectLabel>
                                        <SelectItem value="gmt">Время по Гринвичу (GMT)</SelectItem>
                                        <SelectItem value="cet">Центрально-европейское время (CET)</SelectItem>
                                        <SelectItem value="eet">Восточно-европейское время (EET)</SelectItem>
                                        <SelectItem value="west">
                                            Западно-европейское летнее время (WEST)
                                        </SelectItem>
                                        <SelectItem value="cat">Центральноафриканское время (CAT)</SelectItem>
                                        <SelectItem value="eat">Восточноафриканское время (EAT)</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel>Азия</SelectLabel>
                                        <SelectItem value="msk">Московское время (MSK)</SelectItem>
                                        <SelectItem value="ist">Индийское стандартное время (IST)</SelectItem>
                                        <SelectItem value="cst_china">Китайское стандартное время (CST)</SelectItem>
                                        <SelectItem value="jst">Японское стандартное время (JST)</SelectItem>
                                        <SelectItem value="kst">Корейское стандартное время (KST)</SelectItem>
                                        <SelectItem value="ist_indonesia">
                                            Центральное время Индонезии (WITA)
                                        </SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel>Австралия и Океания</SelectLabel>
                                        <SelectItem value="awst">
                                            Западно-австралийское время (AWST)
                                        </SelectItem>
                                        <SelectItem value="acst">
                                            Центрально-австралийское время (ACST)
                                        </SelectItem>
                                        <SelectItem value="aest">
                                            Восточно-австралийское время (AEST)
                                        </SelectItem>
                                        <SelectItem value="nzst">
                                            Новозеландское стандартное время (NZST)
                                        </SelectItem>
                                        <SelectItem value="fjt">Время Фиджи (FJT)</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel>Южная Америка</SelectLabel>
                                        <SelectItem value="art">Аргентинское время (ART)</SelectItem>
                                        <SelectItem value="bot">Время Боливии (BOT)</SelectItem>
                                        <SelectItem value="brt">Бразильское время (BRT)</SelectItem>
                                        <SelectItem value="clt">Чилийское стандартное время (CLT)</SelectItem>
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
