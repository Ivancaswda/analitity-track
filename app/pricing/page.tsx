'use client'

import React from "react"
import { CheckIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/useAuth";


const PricingPage = () => {
    const router =useRouter()
    const {user}  = useAuth()
    return (
        <div className="relative min-h-screen w-full   overflow-hidden">

            <div className="absolute h-[500px] w-[500px] bg-purple-500/30 blur-[140px] rounded-full -top-40 -left-40"/>
            <div className="absolute h-[400px] w-[400px] bg-blue-500/30 blur-[140px] rounded-full top-20 right-[-200px]"/>
            <div className="absolute h-[500px] w-[500px] bg-pink-500/30 blur-[140px] rounded-full bottom-[-200px] left-1/3"/>
            <div className="absolute h-[400px] w-[400px] bg-indigo-500/30 blur-[140px] rounded-full top-[300px] left-1/2"/>
            <Image className='absolute top-2 z-20 cursor-pointer ' onClick={() => router.push('/')} src='/logo.png' alt='logo' width={200} height={200} />
            <div className="min-h-screen bg-primary/10 text-[var(--foreground)] px-6 py-20">


                <div className="max-w-5xl mx-auto">

                    <div className="text-center " style={{marginBottom: '70px', paddingTop: '30px'}}>
                        <h1 className="text-4xl font-bold mb-4">
                            Выберите тариф
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Начните бесплатно или получите максимум возможностей с Premium
                        </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
                            <h2 className="text-xl font-semibold mb-2">
                                Standard
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Бесплатный старт для знакомства с продуктом
                            </p>

                            <div className="text-4xl font-bold mb-4">
                                0 ₽
                            </div>

                            <ul className="space-y-3 mb-4">
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-[var(--accent)]" />
                                    Бесплатная Аналитика
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-[var(--accent)]" />
                                    Консультация
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-[var(--accent)]" />
                                    Инструкция
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    Ограниченное количество аналитики сайтов
                                </li>
                            </ul>
                            {user?.isPremium ?   <Button variant="outline" className="w-full">
                                Прошлый тариф
                            </Button> :   <Button variant="outline" className="w-full">
                                Текущий тариф
                            </Button>}

                        </div>

                        {/* PREMIUM */}
                        <div className="relative rounded-2xl border border-primary bg-[var(--card)] p-8 shadow-2xl">

                            <div className="absolute -top-3 right-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                <SparklesIcon className="w-3 h-3" />
                                Рекомендуем
                            </div>

                            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                Premium
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                Максимум возможностей для продакшена
                            </p>

                            <div className="text-4xl font-bold mb-2">
                                199 ₽
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                единоразово
                            </p>

                            <ul className="space-y-3 mb-4">
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                    Безлимитная аналитика
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                    Поддержка отвечает в 2 раза быстрее
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                    Качественная аналитика
                                </li>

                                <li className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-primary" />
                                    Уважение к нам
                                </li>
                            </ul>


                            {user?.isPremium ?   <Button variant="outline" className="w-full ">
                                текущий тариф
                            </Button> :    <Button
                                onClick={async () => {
                                    const res = await fetch("/api/stripe/create-checkout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ userEmail: user?.email }),
                                    });

                                    const data = await res.json();

                                    if (!data.url) {
                                        alert("Stripe session error");
                                        return;
                                    }

                                    window.location.href = data.url;
                                }}
                                className="bg-primary text-primary-foreground"
                            >
                                ✨ Получить Premium — 199 ₽
                            </Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PricingPage
