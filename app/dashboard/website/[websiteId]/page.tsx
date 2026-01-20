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
        if (!websiteId || !formData.fromDate) return
        getWebsiteAnalyticalInfo()
    }, [
        websiteId,
        formData.fromDate,
        formData.toDate,
        formData.analyticType
    ])
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
            const fromDate = formData.fromDate.getTime()

            const toDate = formData.toDate
                ? new Date(formData.toDate.getTime())
                    .setHours(23, 59, 59, 999)
                : fromDate
            const result = await axios.get(
                `/api/website/getOne?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
            )
            console.log('resultData===')
            console.log(result.data)
            setWebsiteInfo(result.data.data)

            setLoading(false)
        } catch (error) {
toast.error('failed to get website')
            console.log(error)
            setLoading(false)
        }
    }


    console.log('liveUsers===')
    console.log(liveUsers)


    console.log('websiteInfo===')
    console.log(websiteInfo)
    return (
        <div className="
  px-4
  sm:px-6
  md:px-10
  lg:px-14
  xl:px-16
  mt-6
  sm:mt-10
  flex flex-col gap-6
">
            <FormInput setFormData={setFormData} website={websites}/>
            <PageViewAnalytics liveUserCount={liveUsers?.length} analyticType={formData?.analyticType} loading={loading} websiteInfo={websiteInfo}/>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <SourceWidget websiteInfo={websiteInfo} loading={loading}/>
            </div>
        </div>
    )
}
export default WebsitePage
