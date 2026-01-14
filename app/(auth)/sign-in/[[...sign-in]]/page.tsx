'use client';
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {useAction, useMutation} from "convex/react";
import {toast} from "sonner";
import { api } from "../../../../../convex/_generated/api";
import {useAuth} from "@/context/useAuth";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {useTheme} from "next-themes";


import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {FaGithub, FaGoogle} from "react-icons/fa";
import axios from "axios";


export default function SignInPage() {
    const { user, setUser } = useAuth()
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const res = await axios.post('/api/auth/login', form)
            const data = await res.data
            localStorage.setItem("token", data.token)

            const userRes = await fetch("/api/auth/user", {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });

            if (!userRes.ok) throw new Error("Failed to fetch user")

            const userData = await userRes.json()
            setUser(userData?.user)

            setIsLoading(false)
            router.replace('/')
            toast.success('Добро пожаловать обратно в Wireframify!')
        } catch (error) {
            toast.error('Ошибка входа! Проверьте данные.')
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {}

    useEffect(() => {
        if (user) {
            router.replace("/")
        }
    }, [user, router])


    return (
        <div className='min-h-screen relative'>

            <div className=" flex flex-col  md:flex-row items-center px-10 justify-between ">
                {/* Левая часть с изображением */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="bg-cover hidden md:block bg-center"
                >
                    <Image src={'/logo.png'} width={500} height={500} alt="Educatify Logo"/>
                </motion.div>

                {/* Правая часть с формой */}
                <div className="w-[90%] md:w-1/2 flex items-center justify-center  text-white px-2 md:px-8">
                    <form onSubmit={handleLogin} className="space-y-5 w-full max-w-md">
                        <h2 className=" text-xl md:text-3xl font-bold text-blue-600 text-center md:text-start">Добро пожаловать</h2>
                        <p className="text-sm text-gray-400 text-center md:text-start">Введите ваш email и пароль для входа</p>

                        <div className="relative w-full">
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) =>setForm({...form, email: e.target.value})}
                                required={true}
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor={'email'}
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                {'Email'}
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required={true}
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor={'password'}
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                {'Пароль'}
                            </label>
                        </div>



                        <button disabled={isLoading}
                            type="submit"
                            className="w-full hover:scale-105 transition bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            {isLoading && <Loader2Icon className='animate-spin'/>}
                            Войти
                        </button>
                        <div className='flex items-center gap-2 justify-center'>
                            <Button onClick={handleGoogleSignIn}
                                type="button"
                                className=" text-sm hover:scale-105 border border-gray-500 cursor-pointer w-full py-6  hover:bg-gray-500 transition  flex items-center justify-center gap-4   text-center font-semibold py-3 bg-white text-black rounded-md transition duration-200"
                            >

                                <FaGoogle width={30} height={30} />
                                <p className='lg:flex hidden'>С помощью Google</p>
                            </Button>

                        </div>

                        <p className="text-sm text-gray-500 text-center">
                            Нет аккаунта? <a href="/sign-up"
                                             className="text-blue-500 hover:underline">Зарегистрируйтесь</a>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    );
}
