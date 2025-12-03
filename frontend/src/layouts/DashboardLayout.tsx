import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  // Compute role directly from user data (no need for useState/useEffect)
  const userRole = user?.publicKey ? "merchant" : "user";

  // Show loading state while auth initializes
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Declarative redirect using React Router
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full min-h-screen-safe">
        <AppSidebar role={userRole} walletAddress={user.publicKey} />
        <SidebarInset className="flex-1">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
