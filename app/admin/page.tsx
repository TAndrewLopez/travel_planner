"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminPageProps { }

const AdminPage: React.FC<AdminPageProps> = ({ }) => {
    const router = useRouter();

    useEffect(() => {
        router.push("/admin/dashboard");
    }, [router]);
    return null;
};

export default AdminPage;
