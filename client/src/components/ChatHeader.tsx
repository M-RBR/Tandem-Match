import { useUser } from "../contexts/UserContext";

const ChatHeader = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-center gap-3 p-1 bg-green-50 rounded-lg">
      {/* Profile Image */}
      <p className="text-lg font-semibold text-green-800">Hi,</p>
      {user?.image && (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-green-300">
          <img
            src={user.image}
            alt={`${user.first_name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* User Name */}
      <h6 className="text-lg font-semibold text-green-800">
        {user?.first_name || "My Profile"}
      </h6>
    </div>
  );
};

export default ChatHeader;

// optional to add later: online status indicator
