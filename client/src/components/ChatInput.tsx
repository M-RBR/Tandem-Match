/*

import { useState } from "react";

interface ChatInputProps {
  selectedMatch: string | null;
}

const ChatInput = ({ selectedMatch }: ChatInputProps) => {
  const [textArea, setTextArea] = useState("");

  const handleSubmit = () => {
    if (!textArea.trim() || !selectedMatch) return;

    // TODO: Implement message sending
    console.log("Sending message to", selectedMatch, ":", textArea);
    setTextArea("");
  };

  return (
    <div className="p-4 border-t border-green-200">
      <textarea
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
        placeholder="Type your message here..."
        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
        rows={3}
      />
      <button
        onClick={handleSubmit}
        disabled={!textArea.trim() || !selectedMatch}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;

*/

import { useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import { useUser } from "../contexts/UserContext";

interface ChatInputProps {
  selectedMatch: string | null;
  onMessageSent: () => void;
}

const ChatInput = ({ selectedMatch, onMessageSent }: ChatInputProps) => {
  const [textArea, setTextArea] = useState("");
  const authFetch = useAuthFetch();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!textArea.trim() || !selectedMatch || !user?._id) return;

    try {
      const response = await authFetch("/messages/send", {
        method: "POST",
        body: JSON.stringify({
          toUserId: selectedMatch,
          message: textArea,
        }),
      });

      const data = await response.json();
      console.log("Message sent successfully:", data);

      setTextArea("");
      onMessageSent();
    } catch (error) {
      console.error(
        "Failed to send message:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  return (
    <div className="p-4 border-t border-green-200">
      <textarea
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
        placeholder="Type your message here..."
        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
        rows={3}
      />
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!textArea.trim() || !selectedMatch}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
