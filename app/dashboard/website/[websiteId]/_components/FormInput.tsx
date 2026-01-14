import React, {useEffect, useState} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useParams} from "next/navigation";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon, RefreshCcw, SettingsIcon} from "lucide-react";

import {format} from "date-fns";
import {ru} from "date-fns/locale";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import Link from "next/link";


const FormInput = ({website, setFormData}:any) => {
    const {websiteId} = useParams()
    const today = new Date()
    const [analyticType, setAnalyticType] = useState<"hourly" | "daily">("hourly")
    const [date, setDate] = useState<DateRange>({
        from: today
    })
    const handleDateChange = (range?: DateRange) => {
        if (!range?.from) return;
        if (range?.from && !range?.to) {
            setDate({from: range.from})
            return;
        }
        setDate({from: range.from, to:range.to})
    }

    const handleToday = () => {
        setDate({from: today})
    }

    const handleReset = () => {
        setDate({from: today})
    }


    useEffect(() => {
        setFormData({
            analyticType: analyticType,
            fromDate: date?.from,
            toDate: date?.to ?? date?.from
        })
    }, [date, analyticType]);



    return (
        <div className='flex items-center  justify-between'>
            <div className='px-10 flex items-center  gap-4'>

                <Select value={websiteId || ""}>
                    <SelectTrigger className='w-[240px]'>
                        <SelectValue placeholder='Выбрать вебсайт'/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Вебсайт</SelectLabel>


                            {website?.map((website:any) => (
                                <SelectItem value={website.websiteId} key={website.id} >
                                    {website.domain.replace("https://", "")}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild={true} >
                        <Button variant='outline' data-empty={!date} className={` ${date.to ? 'w-[380px]' : 'w-[240px]'} data-[empty=true]:text-muted-foreground flex-wrap flex-1`}>
                            <CalendarIcon/>
                            {date?.from ? (
                                date?.to ? (<>
                                    {format(date?.from, "PPP")} - {format(date?.to, "PPP")}
                                </>) : <>
                                    {format(date?.from, "PPP")}
                                </>
                            ) : <span>Выберите дату</span> }


                        </Button>

                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-8'>

                        <div className='flex justify-between my-4 items-center mx-2'>
                            <Button onClick={handleToday} variant='outline'>
                                Сегодня
                            </Button>
                            <Button onClick={handleReset} variant={'outline'}>
                                Сбросить
                            </Button>
                        </div>
                        <Calendar onSelect={handleDateChange}  mode='range' selected={date} className='w-[200px]'/>

                    </PopoverContent>
                </Popover>
                <Select value={analyticType} onValueChange={(val) => setAnalyticType(val)}>
                    <SelectTrigger className='w-[140px]'>
                        <SelectValue placeholder='Выбрать вебсайт'/>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Вебсайт</SelectLabel>

                            <SelectItem value={'hourly'}>
                                по часам
                            </SelectItem>
                            <SelectItem value={'daily'} >
                                по дням
                            </SelectItem>

                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button variant='outline'>
                    <RefreshCcw/>
                </Button>
            </div>
            <Link href={`/dashboard/website/${websiteId}/settings`} >
                <Button variant='outline'>
                    <SettingsIcon/>
                </Button>
            </Link>

        </div>

    )
}
export default FormInput
