import { Suspense } from "react";
import AddNewWebsiteClient from "@/app/dashboard/new/_components/AddNewWebsiteClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <AddNewWebsiteClient />
        </Suspense>
    );
}
