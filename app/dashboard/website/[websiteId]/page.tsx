"use client"
import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {toast} from "sonner";
import axios from "axios";
import FormInput from "@/app/dashboard/website/[websiteId]/_components/FormInput";
import PageViewAnalytics from "@/app/dashboard/website/[websiteId]/_components/PageViewAnalytics";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import SourceWidget from "@/app/dashboard/website/[websiteId]/_components/SourceWidget";

const WebsitePage = () => {
    const {websiteId} = useParams()
    const today = new Date()
    const [liveUsers, setLiveUsers] = useState()
    const [formData, setFormData] = useState({
        analyticType: "hourly",
        fromDate: today,
        toDate: today,
    })
    const [websites, setWebsites] = useState([])
    const [loading,setLoading] = useState<boolean>()
    const [websiteInfo, setWebsiteInfo]  = useState<any>()
    useEffect(() => {
       getWebsiteInfo()
    }, []);
    useEffect(() => {
        if (!websiteId || !formData?.fromDate) return
        getWebsiteAnalyticalInfo()
    }, [websiteId, formData])
    console.log(formData)
    const getWebsiteInfo = async () => {
        try {
            const result = await axios.get(`/api/website/get`)
            setWebsites(result.data.websites)
        } catch (error) {
            toast.error('не удалось получить данный вебсайта')
            console.log(error)
        }
    }
    console.log(websites)
    const getWebsiteAnalyticalInfo = async () => {
        try {
            setLoading(true)
            const fromDate =  format(formData?.fromDate, "yyyy-MM-dd", {locale: ru});
            const toDate = formData?.toDate ? format(formData?.toDate, "yyyy-MM-dd", {locale: ru}) : fromDate

            const result = await axios.get(
                `/api/website/getOne?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
            )
            setWebsiteInfo(result.data.data)
            getLiveUsers()
            setLoading(false)
        } catch (error) {
toast.error('failed to get website')
            console.log(error)
            setLoading(false)
        }
    }
    const getLiveUsers =async () => {
        try {
            const result = await axios.get(`/api/live/get?websiteId=${websiteId}`)

            setLiveUsers(result.data.activeUsers)
        } catch (error) {
            console.log(error)
            toast.error('failed to get live users')
        }
    }
    console.log('liveUsers===')
    console.log(liveUsers)


    console.log('websiteInfo===')
    console.log(websiteInfo)
    return (
        <div className='px-10 md:px-14 lg:px-16 xl:px-16 mt-10 flex flex-col gap-4'>
            <FormInput setFormData={setFormData} website={websites}/>
            <PageViewAnalytics liveUserCount={liveUsers?.length} analyticType={formData?.analyticType} loading={loading} websiteInfo={websiteInfo}/>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <SourceWidget websiteInfo={websiteInfo} loading={loading}/>
            </div>
        </div>
    )
}
export default WebsitePage
