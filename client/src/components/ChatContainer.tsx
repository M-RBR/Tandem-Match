import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";

const ChatContainer = () => {
  const [activeTab, setActiveTab] = useState<"matches" | "chat">("matches");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-green-50 p-4 rounded-t-lg">
        <ChatHeader />
      </div>

      <div className="flex border-b border-green-200">
        <button
          className={`flex-1 py-2 font-medium text-green-700 ${
            activeTab === "matches" ? "bg-gray-50" : "hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("matches")}
        >
          Your Matches
        </button>
        <button
          className={`flex-1 py-2 font-medium text-green-700 ${
            activeTab === "chat" ? "bg-gray-50" : "hover:bg-gray-50"
          }`}
          onClick={() => {
            if (selectedMatch) setActiveTab("chat");
          }}
          disabled={!selectedMatch}
        >
          Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {activeTab === "matches" ? (
          <MatchesDisplay
            onSelectMatch={(matchId) => {
              setSelectedMatch(matchId);
              setActiveTab("chat");
            }}
          />
        ) : (
          <ChatDisplay selectedMatch={selectedMatch} />
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
