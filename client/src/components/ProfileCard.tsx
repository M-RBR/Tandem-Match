import type { User } from "../@types/user";
import { Star, Ban } from "lucide-react";

interface ProfileCardProps {
  user: User;
  onMatch: () => void;
  onReject: () => void;
  swipeDirection?: "up" | "down";
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onMatch,
  onReject,
  swipeDirection,
}) => {
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const todayDate = new Date();
    const birthDateObj = new Date(birthDate);
    let age = todayDate.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = todayDate.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && todayDate.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border-2 border-green-300 overflow-hidden h-96 w-88 
        transition-all duration-300 ease-in-out
        ${swipeDirection === "up" ? "-translate-y-[150%] opacity-0" : ""}
        ${swipeDirection === "down" ? "translate-y-[150%] opacity-0" : ""}
      `}
    >
      <div className="h-1/2 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
          {user.image && (
            <img
              src={user.image}
              alt={`${user.first_name}'s profile`}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute top-0 left-0 w-1/2 h-full p-5 flex flex-col justify-start gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-1">
            <h4 className="text-xl font-bold text-gray-800 break-words">
              {user.first_name}
            </h4>
            <span className="text-xl font-bold text-gray-800">
              ({calculateAge(user.dob_day || "")})
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-sm text-gray-900 underline">
                Languages I speak:
              </h3>
              <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              {user.spoken_languages?.map((lang, index) => (
              <li key={index} className="text-xs text-gray-600 break-words">
              {lang.name} ({lang.level})
              </li>
              ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm text-gray-900 underline">
                Languages I learn:
              </h3>
              <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              {user.learning_languages?.map((lang, index) => (
              <li key={index} className="text-xs text-gray-600 break-words">
              {lang.name} ({lang.level})
              </li>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1/2 p-4 overflow-y-auto flex flex-col">
        <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center">About me:</h3>
        <p className="text-gray-700 text-sm flex-grow italic">{user.about}</p>

        <div className="flex justify-center gap-4 mt-2">
          <button
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMatch();
            }}
            aria-label="Like profile"
          >
            <Star size={24} fill="currentColor" />
          </button>
          <button
            className="text-red-500 hover:text-red-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            aria-label="Dislike profile"
          >
            <Ban size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
