"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import WebsiteForm from "@/app/dashboard/new/_components/WebsiteForm";
import InstallScriptPage from "@/app/dashboard/new/_components/InstallScriptPage";
import { useSearchParams } from "next/navigation";

const AddNewWebsiteClient = () => {
    const searchParams = useSearchParams();
    const step = searchParams.get("step");

    if (step === "script") {
        return (
            <div className="flex items-center w-full justify-center">
                <div className="max-w-lg flex flex-col items-start mt-5 w-full">
                    <Button variant="outline">
                        <ArrowLeft />
                        На панель управления
                    </Button>
                    <InstallScriptPage />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center w-full justify-center">
            <div className="max-w-lg flex flex-col items-start mt-5 w-full">
                <Button variant="outline">
                    <ArrowLeft />
                    На панель управления
                </Button>
                <WebsiteForm />
            </div>
        </div>
    );
};

export default AddNewWebsiteClient;
