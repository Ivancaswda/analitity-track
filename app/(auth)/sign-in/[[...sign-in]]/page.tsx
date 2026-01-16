'use client';
import { motion } from "framer-motion";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {useAuth} from "@/context/useAuth";
import { useRouter } from "next/navigation";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {FaGoogle} from "react-icons/fa";
import axios from "axios";
import {GoogleLogin} from "@react-oauth/google";
import {GoogleLoginButton} from "@/app/(auth)/_components/GoogleLoginButton";

export default function SignInPage() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post('/api/auth/login', form);
            const data = await res.data;
            localStorage.setItem("token", data.token);

            const userRes = await fetch("/api/auth/user", {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            if (!userRes.ok) throw new Error("Failed to fetch user");
            const userData = await userRes.json();
            setUser(userData?.user);
            setIsLoading(false);
            router.replace('/');
            toast.success('Добро пожаловать обратно в Analytity!');
        } catch (error) {
            toast.error('Ошибка входа! Проверьте данные.');
            console.log(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) router.replace("/");
    }, [user, router]);

    return (
        <div className='min-h-screen relative bg-primary flex items-center justify-center'>
            <div className="flex flex-col gap-12 md:flex-row items-center  px-6 md:px-20">
                {/* Левая часть с логотипом */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="hidden md:block rounded-xl bg-white"
                >
                    <Image src='/logo.png' width={500} height={500} alt="Analytity Logo"/>
                </motion.div>

                {/* Правая часть с формой */}
                <div className="w-full md:w-1/2 bg-gray-900 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-6 w-full">
                        <h2 className="text-3xl font-bold text-primary text-center md:text-left">Добро пожаловать</h2>
                        <p className="text-gray-400 text-center md:text-left">Введите ваш email и пароль для входа</p>

                        <div className="relative w-full">
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-800 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-2 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-primary"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-800 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-primary"
                            >
                                Пароль
                            </label>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full flex items-center justify-center gap-4 py-2 rounded-md font-semibold text-black bg-primary hover:bg-yellow-400 transition-all duration-200"
                        >
                            {isLoading && <Loader2Icon className='animate-spin' />}
                            Войти
                        </button>

                       <GoogleLoginButton/>

                        <p className="text-gray-400 text-center">
                            Нет аккаунта? <a href="/sign-up" className="text-primary hover:underline">Зарегистрируйтесь</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
