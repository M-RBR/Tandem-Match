import { useEffect, useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import { useUser } from "../contexts/UserContext";
import type { PopulatedMessage } from "../@types/message";

interface ChatProps {
  selectedMatch: string | null;
}

const Chat = ({ selectedMatch }: ChatProps) => {
  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();
  const { user } = useUser();

  const fetchMessages = async () => {
    if (!selectedMatch || !user?._id) return;

    try {
      setLoading(true);
      const response = await authFetch(
        `/messages/chat/${user._id}/${selectedMatch}?populate=true`
      );
      const data = await response.json();
      console.log("API Response:", data);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedMatch, user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No messages yet.</div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.fromUserId._id === user?._id;
          return (
            <div
              key={message._id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isCurrentUser && (
                  <img
                    src={message.fromUserId.image}
                    alt={message.fromUserId.first_name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-green-300 text-black"
                        : "bg-green-100 text-green-900"
                    }`}
                  >
                    <p className="break-words">{message.message}</p>
                  </div>
                  <span className={`text-xs text-gray-500 italic mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                    {new Date(message.createdAt).toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Chat;
