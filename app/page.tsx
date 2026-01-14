'use client'
import React from 'react'
import {useAuth} from "@/context/useAuth";

const HomePage = () => {

    const {user}  =useAuth()
    console.log(user)
    return (
        <div>HomePage</div>
    )
}
export default HomePage
