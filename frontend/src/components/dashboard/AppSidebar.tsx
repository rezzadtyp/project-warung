import { useSidebar } from "../utils/useSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { Chat, UserRole } from "@/lib/types";
import { MessageSquare, PanelLeft, Plus, QrCode, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AppSidebarProps {
  role: UserRole;
  walletAddress: string;
  chats?: Chat[];
}

interface MenuItem {
  icon: typeof Plus;
  label: string;
  path: string;
  action?: boolean;
}

export function AppSidebar({
  role,
  walletAddress,
  chats = [],
}: AppSidebarProps) {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();

  const merchantMenuItems: MenuItem[] = [
    { icon: Plus, label: "New Chat", path: "/dashboard/chat", action: true },
    { icon: MessageSquare, label: "Chats", path: "/dashboard/chat" },
    { icon: QrCode, label: "QR Code", path: "/dashboard/qr" },
    { icon: Receipt, label: "Transactions", path: "/dashboard/transactions" },
  ];

  const userMenuItems: MenuItem[] = [
    { icon: QrCode, label: "QR Code", path: "/dashboard/qr" },
    { icon: Receipt, label: "Transactions", path: "/dashboard/transactions" },
  ];

  const menuItems = role === "merchant" ? merchantMenuItems : userMenuItems;

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r border-border 
        bg-card 
        text-foreground 
        group
      "
    >
      {/* HEADER */}
      <SidebarHeader className="px-4 py-5 border-b border-border group-data-[collapsible=icon]:px-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="h-7 w-7 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-[10px] font-bold text-background">W</span>
            </div>
            <span className="text-base font-medium tracking-tight">
              Warung AI
            </span>
          </div>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 hover:bg-accent"
          >
            <PanelLeft className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="py-4 px-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="mb-6 p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      tooltip={state === "collapsed" ? item.label : undefined}
                      isActive={isActive}
                      className={`
                        h-9 rounded-lg text-sm font-medium transition-all

                        ${
                          item.action
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-accent text-foreground"
                        }

                        ${isActive && !item.action ? "bg-accent" : ""}
                      `}
                    >
                      <Link to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* RECENT CHATS */}
        {role === "merchant" && chats.length > 0 && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0">
            <div className="px-3 py-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent
              </span>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      className="h-auto rounded-lg p-3 text-left hover:bg-accent transition-colors flex-col items-start"
                    >
                      <Link to={`/dashboard/chat/${chat.id}`}>
                        <span className="text-sm font-medium">
                          {chat.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {chat.preview}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-border py-4 px-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 ring-2 ring-card">
            <AvatarFallback className="bg-foreground text-background text-[10px] font-medium">
              {walletAddress.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-medium capitalize truncate">{role}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
