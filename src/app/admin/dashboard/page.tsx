import { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard | Administration ABP Partner",
  robots: "noindex, nofollow",
};

export default function DashboardPage() {
  return <AdminDashboard />;
}
