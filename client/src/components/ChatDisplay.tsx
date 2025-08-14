import Chat from "./Chat";
import ChatInput from "./ChatInput";
import { useAuthFetch } from "../utils/authFetch";
import { useEffect, useState } from "react";
import type { User } from "../@types/user";

interface ChatDisplayProps {
  selectedMatch: string | null;
}

const ChatDisplay = ({ selectedMatch }: ChatDisplayProps) => {
  const authFetch = useAuthFetch();
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  useEffect(() => {
    const fetchMatchedUser = async () => {
      if (!selectedMatch) return;

      try {
        const response = await authFetch(`/users/${selectedMatch}`);
        const data = await response.json();
        setMatchedUser(data);
      } catch (error) {
        console.error("Failed to fetch matched user:", error);
      }
    };

    fetchMatchedUser();
  }, [selectedMatch]);

  const handleMessageSent = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  if (!selectedMatch) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a match to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {matchedUser && (
        <div className="p-4 border-b border-green-200 text-center">
          <span className="italic text-green-800 font-medium">
            Chat with {matchedUser.first_name}
          </span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <Chat
          selectedMatch={selectedMatch}
          key={`${selectedMatch}-${refreshCounter}`}
        />
      </div>
      <ChatInput
        selectedMatch={selectedMatch}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default ChatDisplay;
