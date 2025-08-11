import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";

const ChatContainer = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-green-50 p-4 rounded-t-lg">
        <ChatHeader />
      </div>

      <div className="flex border-b border-green-200">
        <button className="flex-1 py-2 font-medium text-green-700 hover:bg-green-50">
          Matches
        </button>
        <button className="flex-1 py-2 font-medium text-green-700 hover:bg-green-50">
          Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <MatchesDisplay />
        <ChatDisplay />
      </div>
    </div>
  );
};

export default ChatContainer;
