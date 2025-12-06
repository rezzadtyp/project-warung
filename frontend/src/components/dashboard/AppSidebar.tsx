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
import { useSidebar } from "../utils/useSidebar";

import { useNavigate } from "react-router-dom";

import type { ChatItem } from "@/lib/types/chat";
import type { UserRole } from "@/lib/types";
import { MessageSquare, PanelLeft, Plus, QrCode, Receipt, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../shared/ThemeToggle";

interface AppSidebarProps {
  role: UserRole;
  walletAddress: string;
  chats?: ChatItem[];
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
  const navigate = useNavigate();

  const merchantMenuItems: MenuItem[] = [
    {
      icon: Plus,
      label: "New Chat",
      path: "/dashboard/chat/new",
      action: true,
    },
    { icon: MessageSquare, label: "Chats", path: "/dashboard/chat" },
    { icon: QrCode, label: "QR Code", path: "/dashboard/qr" },
    { icon: Receipt, label: "Transactions", path: "/dashboard/transactions" },
    { icon: Wallet, label: "Earnings", path: "/dashboard/earnings" },
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
      <SidebarHeader className="px-3 sm:px-4 py-4 sm:py-5 border-b border-border group-data-[collapsible=icon]:px-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/icon.svg"
              alt="Warung AI Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
            />
            <span className="text-sm sm:text-base font-medium tracking-tight text-foreground">
              WARUNG AI
            </span>
          </div>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-accent"
          >
            <PanelLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="py-3 sm:py-4 px-2 sm:px-3 group-data-[collapsible=icon]:px-2">
        <SidebarGroup className="mb-4 sm:mb-6 p-0">
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
                        h-8 sm:h-9 rounded-lg text-xs sm:text-sm font-medium transition-all

                        ${
                          item.action
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-accent text-foreground"
                        }

                        ${isActive && !item.action ? "bg-accent" : ""}
                      `}
                    >
                      <Link to={item.path}>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
            <div className="px-2 sm:px-3 py-2">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recent
              </span>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.slice(0, 5).map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      asChild
                      className="h-auto rounded-lg p-2 sm:p-3 text-left hover:bg-accent transition-colors flex-col items-start"
                    >
                      <Link to={`/dashboard/chat/${chat.id}`}>
                        <span className="text-xs sm:text-sm font-medium truncate w-full">
                          {chat.title || "Untitled Chat"}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground truncate w-full">
                          {new Date(chat.updatedAt).toLocaleDateString()}
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
      <SidebarFooter className="border-t border-border py-3 sm:py-4 px-2 sm:px-3 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex items-center gap-2 sm:gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-card">
            <AvatarFallback className="bg-foreground text-background text-[9px] sm:text-[10px] font-medium">
              {walletAddress.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] sm:text-xs font-medium capitalize truncate">
              {role}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
