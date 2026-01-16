"use client"
import React, {useEffect} from 'react'
import DashboardProvider from "@/app/dashboard/provider";
import {useAuth} from "@/context/useAuth";
import {LoaderOne} from "@/components/ui/loader";
import {useRouter} from "next/navigation";
import Header from "@/components/Header";

const DashboardLayout = ({children}:any) => {
    const {user, loading}  =useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!user && !loading) {
            router.replace('/sign-up')
        }
    }, [user, loading, router]);

    if (loading && !user) {
        return  <div className='flex items-center justify-center w-screen ' style={{height: '96vh'}}>
            <LoaderOne/>
        </div>
    }
    return (
        <DashboardProvider>
            <Header/>
            {children}
        </DashboardProvider>
    )
}
export default DashboardLayout
