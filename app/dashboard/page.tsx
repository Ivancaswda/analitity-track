"use client"
import React, {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button";
import {PictureInPictureIcon, PlusIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useAuth} from "@/context/useAuth";
import {useRouter} from "next/navigation";
import {LoaderOne} from "@/components/ui/loader";
import axios from "axios";
import {toast} from "sonner";
import WebsiteForm from "@/app/dashboard/new/_components/WebsiteForm";
import WebsiteCard from "@/app/dashboard/_components/WebsiteCard";
import {Skeleton} from "@/components/ui/skeleton";

const DashboardPage = () => {
    const [websiteList, setWebsiteList] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>()
    const {user, loading}  =useAuth()
    const router = useRouter()

    useEffect(() => {
        getUserWebsites()
    }, []);

    const getUserWebsites = async () => {
        try {
            setIsLoading(true)
            const result = await axios.get('/api/website/getAll')

            setWebsiteList(result.data.data ?? [])

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            toast.error('Не удалось получить вебсайты')
        }
    }
    console.log('websitelIST===')
    console.log(websiteList)




    return (
        <div className='mt-8 px-10 flex flex-col gap-6'>
            <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-xl">Мой вебсайт</h2>
                <Link href="/dashboard/new" >
                    <Button className='px-8 py-4 text-lg transition-all hover:scale-105'>
                        <PlusIcon/> вебсайт
                    </Button>
                </Link>
            </div>
            <div>
                {websiteList?.length === 0 ?
                <div className='p-8 border border-dashed gap-4 flex flex-col justify-center items-center'>
                   <PictureInPictureIcon className='w-[100px] h-[100px]'/>
                    <h2 className='font-bold'>У вас нету пока вебсайтов для отслеживания</h2>
                    <Link href="/dashboard/new" >
                        <Button className='px-6! cursor-pointer hover:scale-105 transition py-6! text-lg'>
                            <PlusIcon/> вебсайт
                        </Button>
                    </Link>

                </div> : isLoading ? <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>

                        {[1,2,3,4,5].map((website, index) => (
                            <div key={index} className='p-4'>
                                <div className='flex gap-2 items-center'>
                                    <Skeleton className='w-8 h-8 rounded-sm'/>
                                    <Skeleton className='w-1/2 rounded-sm h-8'/>
                                </div>

                                <Skeleton className='h-[80px] w-full mt-4'/>
                            </div>
                        ))}
                    </div> : <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                        {websiteList.map((website, index) => (
                            <WebsiteCard website={website} key={index} />
                        ))}
                    </div>}
            </div>
        </div>
    )
}
export default DashboardPage
