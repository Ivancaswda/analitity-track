'use client';
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Loader2Icon } from "lucide-react";
import axios from "axios";
import {GoogleLoginButton} from "@/app/(auth)/_components/GoogleLoginButton";

export default function SignUpForm() {
    const { user, loading, setUser } = useAuth();
    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', form);
            const data = await res.data;
            localStorage.setItem("token", data.token);

            const userRes = await fetch("/api/auth/user", {
                headers: { Authorization: `Bearer ${data.token}` },
            });
            if (!userRes.ok) throw new Error("Failed to fetch user");

            const userData = await userRes.json();
            setUser(userData.user);

            router.push('/');
            toast.success('Добро пожаловать в Analytity!');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Ошибка при регистрации");
            } else {
                toast.error("Непредвиденная ошибка");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && user) router.replace('/');
    }, [user, loading]);

    return (
        <div className='min-h-screen relative bg-[var(--background)] flex items-center justify-center'>
            <div className="flex flex-col md:flex-row items-center gap-12 px-6 md:px-20">
                {/* Левая часть с логотипом */}
                <motion.div
                    initial={{opacity: 0, x: -50}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="hidden md:block rounded-xl bg-white"
                >
                    <Image src={'/logo.png'} width={800} height={800} alt="Analytity Logo"/>
                </motion.div>


                <div className="w-full md:w-2/3 bg-gray-900 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleRegister} className="space-y-6 w-full">
                        <h2 className="text-3xl font-bold text-primary text-center md:text-left">Регистрация</h2>
                        <p className="text-gray-400 text-center md:text-left">Создайте аккаунт Analytity</p>

                        <div className="relative w-full">
                            <input
                                id="name"
                                type="text"
                                value={form.userName}
                                onChange={(e) => setForm({...form, userName: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-800 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-2 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] px-2 rounded-lg peer-focus:bg-gray-800 peer-focus:text-sm peer-focus:text-primary"
                            >
                                Имя
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                                placeholder=" "
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-800 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-primary"
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
                                className="peer w-full px-4 pt-5 pb-2 text-white bg-gray-800 border border-gray-700 rounded-md placeholder-transparent focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-primary"
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
                            Зарегистрироваться
                        </button>

                        <GoogleLoginButton/>

                        <p className="text-gray-400 text-center">
                            Уже есть аккаунт? <a href="/sign-in" className="text-primary hover:underline">Войти</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
