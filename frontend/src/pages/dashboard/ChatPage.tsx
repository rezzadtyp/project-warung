import ChatComponent from "@/components/shared/Chat";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const data = JSON.parse(localStorage.getItem("user") || "{}");
  const { chatId } = useParams();

  if (!data.id)
    return (
      <motion.div
        className="w-full h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Loader className="w-10 h-10 animate-spin" />
      </motion.div>
    );

  return (
    <AnimatePresence mode="wait">
      {!data.id ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* <WelcomePage /> */}
        </motion.div>
      ) : (
        <div
          key="app"
          className="flex md:flex-row flex-col h-screen overflow-hidden"
        >
          <div className="flex-1 px-6 mt-22 md:mt-0">
            <div className="w-full h-full flex flex-col gap-4">
              <div className="w-full justify-between items-center px-2 py-4 hidden md:flex">
                <p className="text-xl font-semibold">Chat</p>
              </div>
              <ChatComponent chatId={chatId} />
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatPage;
