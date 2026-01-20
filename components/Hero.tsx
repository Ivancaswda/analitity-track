'use client'
import React, {JSX, useState} from 'react'

import {v4 as uuidv4} from 'uuid'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton, InputGroupInput, InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Briefcase, ChartBarIcon,
    ChevronRight, GlobeIcon, Laptop,
    Layers,
    LayoutTemplate, Loader2Icon, Newspaper,
    Palette, PlusIcon,
    SendIcon,
    ShoppingCart,
    Smartphone
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {AnimatedGradientText} from "@/components/ui/animated-gradient-text";
import {cn} from "@/lib/utils";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "sonner";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import WebsiteForm from "@/app/dashboard/new/_components/WebsiteForm";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
type Suggestion = {
    name: string
    prompt: string
    icon: JSX.Element
}
export const suggestions: Suggestion[] = [
    {
        name: "Лендинг",
        icon: <LayoutTemplate className="w-5 h-5" />,
        prompt: "Создай современный лендинг для стартапа с hero-блоком, CTA и минималистичным дизайном",
    },
    {
        name: "Интернет-магазин",
        icon: <ShoppingCart className="w-5 h-5" />,
        prompt: "Спроектируй UI интернет-магазина с каталогом, карточкой товара и корзиной",
    },
    {
        name: "Корпоративный сайт",
        icon: <Briefcase className="w-5 h-5" />,
        prompt: "Создай корпоративный сайт для IT-компании с разделами О нас, Услуги и Контакты",
    },
    {
        name: "Дашборд",
        icon: <Layers className="w-5 h-5" />,
        prompt: "Разработай аналитический dashboard с графиками, таблицами и фильтрами",
    },

    {
        name: "Портфолио",
        icon: <Palette className="w-5 h-5" />,
        prompt: "Сделай персональное портфолио дизайнера в современном стиле",
    },
    {
        name: "Новостной сайт",
        icon: <Newspaper className="w-5 h-5" />,
        prompt: "Спроектируй новостной сайт с лентой, категориями и карточками статей",
    },

]

const Hero = () => {
    const {user} = useAuth()
    const [showKeyDialog, setShowKeyDialog] = useState(false)
    const [key, setKey] = useState("")
    const [domain, setDomain] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false);
    const [loading, setLoading] = useState<boolean>()
    const router = useRouter()
    const onFormSubmit = async (e) => {
        try {
            e.preventDefault()
            if (!user) {
                router.replace('/sign-up')
                return
            }

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
        <section className="flex justify-center mt-32 px-4">


            <div className=" w-full text-center">
                <div className='flex items-center justify-center '>
                    <div className="group relative max-w-sm flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
                  <span
                      className={cn(
                          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[oklch(0.7109 0.1385 171.5194)]/50 via-[oklch(0.7109 0.1385 171.5194)]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                      )}
                      style={{
                          WebkitMask:
                              "linear-gradient(oklch(0.7109 0.1385 171.5194) 0 0) content-box, linear-gradient(oklch(0.7109 0.1385 171.5194) 0 0)",
                          WebkitMaskComposite: "destination-out",
                          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          maskComposite: "subtract",
                          WebkitClipPath: "padding-box",
                      }}
                  />
                        <ChartBarIcon className='size-sm text-primary font-medium'/>  <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                        <AnimatedGradientText className="text-sm font-medium">
                            Встречайте Analytity
                        </AnimatedGradientText>
                        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                    </div>

                </div>
                <div className='flex items-center justify-center'>
                    <h1 className="text-5xl  w-[80%] font-bold  leading-tight">
                        Analytity - Бесплатная аналитика
                        <span className="text-primary"> трафика сайтов</span>
                    </h1>
                </div>


                <p className="mt-4 text-gray-400 text-base">
                    Вставьте ссылку на сайт, добавьте 4 строки кода и получите подробную аналитику:
                    источники трафика, устройства, посетители и многое другое.
                </p>

                <div className='mt-5 max-w-[850px] mx-auto'>
                    <Card>

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
                                    <div className='mt-5 flex items-center justify-between '>
                <div className=' flex items-center gap-1 '>
                    <Checkbox onCheckedChange={(val:boolean) => setEnableLocalhostTracking(val)} required={true}/>
                    <span className='text-sm'>Разрешить localhost отслеживание в дев моде</span>
                </div>
                                        <Button disabled={loading} size='icon' className=' mt-5'>
                                            {loading ? <Loader2Icon className='animate-spin' /> :
                                                <PlusIcon/>
                                            }



                                        </Button>
                                    </div>

                                </div>


                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>




        </section>
    )
}

export default Hero
