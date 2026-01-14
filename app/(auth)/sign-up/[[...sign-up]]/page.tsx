'use client';

import { useState, useEffect } from "react";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion";
import Image from "next/image";

import {useAuth} from "@/context/useAuth";
import {Button} from "@/components/ui/button";

import {FaGoogle} from "react-icons/fa";
import axios from "axios";
import {Loader2Icon} from "lucide-react";

export default function SignUpForm() {
    const { user, loading, setUser } = useAuth()
    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await axios.post('/api/auth/register', form)
            const data = await res.data

            localStorage.setItem("token", data.token)
            const userRes = await fetch("/api/auth/user", {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            if (!userRes.ok) throw new Error("Failed to fetch user");

            const userData = await userRes.json();
            setUser(userData.user);

            router.push('/')
            toast.success('Добро пожаловать в Wireframify!')
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при регистрации")
            } else {
                toast.error("Непредвиденная ошибка")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {}

    useEffect(() => {
        if (!loading && user) {
            router.replace('/')
        }
    }, [user, loading])
    return (
        <div className='min-h-screen relative'>

            <div className="  md:flex items-center mt-10 justify-between px-10 gap-2 md:gap-20">
                {/* Левая часть с изображением */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="bg-cover bg-center hidden md:block"
                >
                    <Image src={'/logo.png'} width={500} height={500} alt="Educatify Logo"/>
                </motion.div>

                {/* Правая часть с формой */}
                <div className=" w-full md:w-1/2 flex items-center justify-center   text-white md:px-3 lg:px-8">
                    <form onSubmit={handleRegister} className="space-y-5 w-full max-w-md">
                        <h2 className="text-3xl font-bold text-blue-600">Добро пожаловать</h2>
                        <p className="text-sm text-gray-400">Введите ваше имя, email и пароль для регистрации</p>

                        <div className="relative w-full">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({...form, userName: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Имя
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-900 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-blue-500"
                            >
                                Пароль
                            </label>
                        </div>



                        <button disabled={loading}
                            type="submit"
                            className="w-full hover:scale-105 transition bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        >
                            {loading && <Loader2Icon className='animate-spin'/>}
                            Зарегистрироваться
                        </button>
                        <div className='flex items-center gap-2 justify-center'>
                            <Button
                                type="button"
                                className=" text-sm hover:scale-105 border border-gray-500 cursor-pointer w-full py-6  hover:bg-gray-200 transition  flex items-center justify-center gap-4   text-center font-semibold py-3 bg-white text-black rounded-md transition duration-200"
                            >

                                <FaGoogle width={30} height={30} />
                                <p className='lg:flex hidden'>С помощью Google</p>
                            </Button>
                        </div>



                        <p className="text-sm text-gray-500 text-center">
                            Уже есть аккаунт? <a href="/sign-in" className="text-blue-500 hover:underline">Войти</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
