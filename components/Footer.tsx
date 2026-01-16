import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaDiscord, FaGithub, FaTelegram, FaVk, FaGoogle, FaYandex, FaStripe, FaSlack, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    const socialLinks = [
        { icon: FaTwitter, url: "https://twitter.com" },
        { icon: FaDiscord, url: "https://discord.com" },
        { icon: FaGithub, url: "https://github.com" },
        { icon: FaTelegram, url: "https://t.me" },
    ];

    const partnerLogos = [
        FaGoogle, FaYandex, FaStripe, FaDiscord, FaSlack, FaWhatsapp, FaVk
    ];

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-48 bg-yellow-500/10 -z-10 rounded-b-full" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand / About */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Analytity Logo" width={160} height={160} />

                    </div>
                    <p className="text-gray-400">
                        Автоматизация анализа сайтов и управление данными в одном месте.
                    </p>
                    <div className="flex gap-3 mt-2">
                        {socialLinks.map((s, idx) => {
                            const Icon = s.icon;
                            return (
                                <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="hover:text-primary transition text-2xl">
                                    <Icon />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Useful Links */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-white mb-2">Полезные ссылки</h3>
                    <Link href="#"><p className="hover:text-primary transition">Документация</p></Link>
                    <Link href="#"><p className="hover:text-primary transition">Тарифы</p></Link>
                    <Link href="#"><p className="hover:text-primary transition">Поддержка</p></Link>
                    <Link href="#"><p className="hover:text-primary transition">Блог</p></Link>
                    <Link href="#"><p className="hover:text-primary transition">FAQ</p></Link>
                </div>

                {/* Contacts */}
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-white mb-2">Контакты</h3>
                    <p>Email: <a href="mailto:support@analytity.com" className="hover:text-primary transition">support@analytity.com</a></p>
                    <p>Телефон: <a href="tel:+79521637168" className="hover:text-primary transition">+7 952 163-71-68</a></p>
                    <p>Адрес: Томск, Россия</p>
                    <p>График работы: Пн-Пт, 9:00-18:00</p>
                </div>

                {/* Partners / Logos */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-white mb-2">Наши партнеры</h3>
                    <div className="flex flex-wrap gap-4 text-3xl">
                        {partnerLogos.map((Logo, idx) => (
                            <div key={idx} className="hover:text-primary transition">
                                <Logo />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t  border-gray-700 mt-4 mb-4 pt-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Analytity. Все права защищены.
            </div>
        </footer>
    );
}
