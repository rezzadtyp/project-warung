import { ChatArea } from '@/components/dashboard/ChatArea';
import { useParams } from 'react-router-dom';

export default function ChatAreaPage() {
  const {chatId} = useParams();
  return <ChatArea chatId={chatId ?? null} />;
}