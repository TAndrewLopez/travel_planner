import { Sidebar } from "@/components/admin/sidebar";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
    children,
}) => {
    return (
        <section className="bg-[#f5f5fe] flex">
            <Sidebar />
            <section className="flex-1 flex flex-col">
                <div className="h-48 bg-[#0e1428] text-white flex justify-center flex-col px-10 gap-3">
                    <h1 className="text-5xl">Dashboard</h1>
                    <p>The scripting is powered by Bright Data.</p>
                </div>
                {children}
            </section>
        </section>
    );
};

export default AdminDashboardLayout;
