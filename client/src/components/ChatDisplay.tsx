import Chat from "./Chat";
import ChatInput from "./ChatInput";
import ProfileCard from "./ProfileCard";
import { useAuthFetch } from "../utils/authFetch";
import { useEffect, useState, useRef } from "react";
import type { User } from "../@types/user";
import { CircleUserRound } from "lucide-react";

interface ChatDisplayProps {
  selectedMatch: string | null;
}

const ChatDisplay = ({ selectedMatch }: ChatDisplayProps) => {
  const authFetch = useAuthFetch();
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
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
  }, [selectedMatch, authFetch]);

  const handleMessageSent = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      setShowProfileModal(false);
    }
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
          <span className="flex items-center justify-center gap-2 italic text-green-800 font-medium">
            Chat with {matchedUser.first_name}
            <button
              onClick={() => setShowProfileModal(true)}
              title="View profile"
              className="hover:bg-green-100 rounded-full p-1 transition-colors"
            >
              <CircleUserRound className="text-green-800" size={20} />
            </button>
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

      {showProfileModal && matchedUser && (
        <div
          ref={modalRef}
          onClick={closeModal}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div className="max-w-md w-full mx-4">
            <ProfileCard
              user={matchedUser}
              onMatch={() => {}}
              onReject={() => {}}
              viewOnly={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDisplay;
