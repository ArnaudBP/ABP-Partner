import { Metadata } from "next";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Administration | ABP Partner",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return <AdminLogin />;
}
