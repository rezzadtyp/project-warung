import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import type { UserRole } from '@/lib/types';

export default function DashboardLayout() {
  // These will come from your wallet provider/context
  const userRole: UserRole = 'merchant';
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar role={userRole} walletAddress={walletAddress} />
        <SidebarInset className="flex-1">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}