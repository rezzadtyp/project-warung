import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatItem } from "@/lib/types/chat";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  Menu,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";

interface ChatListProps {
  chats: ChatItem[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
  onChatClick: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onToggleSidebar: () => void;
}

export function ChatList({
  chats,
  loading,
  searchTerm,
  onSearchChange,
  onCreateNew,
  onChatClick,
  onDeleteChat,
  onToggleSidebar,
}: ChatListProps) {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden h-8 w-8 -ml-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium">Conversations</span>
        </div>
        <Button
          onClick={onCreateNew}
          size="sm"
          className="h-8 rounded-full px-4 text-xs font-medium gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9 h-9 text-sm bg-card border-border/60 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-3 sm:px-4 pb-4">
        <div className="mx-auto max-w-3xl space-y-2 sm:space-y-3 mt-2">
          {loading && chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-12 sm:mt-20">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-card flex items-center justify-center mb-4 sm:mb-6 border border-border">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-sm sm:text-base font-medium text-card-foreground mb-1">
                No conversations found
              </p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                {searchTerm
                  ? "Try a different search term"
                  : "Start a new chat to begin"}
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatClick(chat.id)}
                className="
                  group relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 
                  rounded-xl border border-border bg-card 
                  hover:bg-accent/40 hover:border-accent/60 
                  transition-all duration-200 cursor-pointer
                "
              >
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-border flex-shrink-0 mt-0.5">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    <MessageSquare className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
                      {chat.title || "Untitled Conversation"}
                    </h3>
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                      {chat.updatedAt &&
                        formatDistanceToNow(new Date(chat.updatedAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    Chat ID: {chat.id}
                  </p>
                </div>

                {/* Actions Dropdown */}
                <div
                  className="absolute right-2 bottom-2 sm:static sm:self-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-background"
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onChatClick(chat.id)}>
                        Open Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => onDeleteChat(chat.id, e)}
                      >
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
