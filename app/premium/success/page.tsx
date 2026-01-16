'use client'

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";

export default function PremiumSuccess() {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <div className='px-4'>
                <Image src='/logo.png' width={120} height={120} alt='logo'/>
            </div>

            <CheckCircle className="w-16 h-16 text-primary mb-4" />
            <h1 className="text-2xl font-semibold">Premium активирован 🎉</h1>
            <p className="text-muted-foreground mt-2">
                Спасибо за поддержку!
            </p>



            <Link href="/" className="mt-6 underline">
                <Button>
                  Перейти к проектам
                </Button>
            </Link>
        </div>
    );
}
