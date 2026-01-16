"use client"
import React from 'react'
import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useAuth} from "@/context/useAuth";
import {Button} from "@/components/ui/button";
import {Loader2Icon, UserIcon} from "lucide-react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {toast} from "sonner";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {LoaderOne} from "@/components/ui/loader";
import Link from "next/link";

const Header = () => {
    const {user, logout, loading} = useAuth()
    const router =useRouter()

    if (loading) {
        return  <div className='flex items-center justify-center w-full h-screen'>
            <LoaderOne/>
        </div>
    }
    return (
        <div className="flex items-center justify-between p-4">
            <div className=''>
                <Link href='/' >
                    <Image src='/logo.png' alt='lgoo' width={140} height={140}/>
                </Link>

            </div>

            <ul className='flex gap-4 text-lg items-center '>
                <Link href={"/"}>
                    <li className='hover:text-primary transtion-all cursor-pointer'>Главная страница</li>

                </Link>
                <Link href={"/dashboard"}>
                    <li className='hover:text-primary transtion-all cursor-pointer'>Панель управления</li>

                </Link>
                <Link href={'/pricing'}>
                    <li className='hover:text-primary transtion-all cursor-pointer'>Услуги</li>
                </Link>

            </ul>
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:shadow-xl shadow">
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className='bg-primary text-white hover:shadow-xl shadow'>
                            {user.userName[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="
            w-56 p-2 rounded-2xl
            bg-[var(--card)]
            border border-[var(--border)]
            shadow-2xl
            animate-in fade-in zoom-in-95
        "
                >

                    <div className="px-3 py-2 border-b border-[var(--border)] mb-2">
                        <p className="text-sm font-medium">{user.userName}</p>
                        <p className="text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>


                    <div className="flex flex-col gap-1">
                        <button
                            className="
                    w-full text-left px-3 py-2 rounded-xl text-sm
                    hover:bg-muted transition
                "
                            onClick={() => router.push('/myProjects')}
                        >
                            Мои проекты
                        </button>


                        <button
                            onClick={() => router.push('/pricing')}
                            className="
                    relative overflow-hidden
                    px-3 py-2 rounded-xl text-sm font-medium
                    text-primary-foreground
                    bg-primary
                    transition-all duration-300
                    hover:shadow-[0_0_20px_rgba(var(--primaryRgb),0.6)]
                    hover:scale-[1.02]
                    group
                "
                        >

                            <span
                                className="
                        absolute inset-0
                        bg-gradient-to-r
                        from-primary
                        via-accent
                        to-primary
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-300
                    "
                            />
                            <span className="relative flex items-center gap-2">
                    ✨ Получить Premium
                </span>
                        </button>
                    </div>

                    {/* LOGOUT */}
                    <div className="mt-2 pt-2 border-t border-[var(--border)]">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                try {
                                    logout()
                                    toast.success('Вы успешно вышли!')
                                } catch (error) {
                                    toast.error('Не удалось выйти!')
                                    console.log(error)
                                }
                            }}
                        >
                            Выйти
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>  :  <Button className='cursor-pointer'
            onClick={() => router.replace('/sign-up')}
            >
                <UserIcon/>
                Войти
            </Button>}
        </div>
    )
}
export default Header
