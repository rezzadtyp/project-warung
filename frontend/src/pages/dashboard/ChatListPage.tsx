import { ChatList } from "@/components/dashboard/ChatList";
import { useChats } from "@/hooks/useGetChatList";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/utils/useSidebar";
import { useMobileViewport } from "@/hooks/useMobileViewport";

export default function ChatListPage() {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  // Use ref to prevent initial empty search update
  const isInitialMount = useRef(true);

  // Use the hook you provided
  const {
    data: chats,
    loading,
    updateParams,
  } = useChats({
    page: 1,
    take: 20,
  });

  useMobileViewport();

  // Debounce search
  useEffect(() => {
    // Skip initial mount to prevent unnecessary API call
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm) {
        updateParams({ search: searchTerm, page: 1 });
      } else {
        updateParams({ search: undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, updateParams]);

  const handleCreateNew = () => {
    navigate("/dashboard/chat/new");
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/dashboard/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log("Delete chat:", chatId);
    // After successful delete, call refetch() to update the list
  };

  return (
    <ChatList
      chats={chats}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onCreateNew={handleCreateNew}
      onChatClick={handleChatClick}
      onDeleteChat={handleDeleteChat}
      onToggleSidebar={toggleSidebar}
    />
  );
}
