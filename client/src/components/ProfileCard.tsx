/*

import type { User } from "../@types";
import { Star, X } from "lucide-react";

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const calculateAge = (birthDate: string) => {
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96 w-80 mx-auto">
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

        <div className="absolute top-0 left-0 w-1/2 h-full p-4 flex flex-col justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 break-words">
              {user.first_name}
            </h2>
            <span className="text-lg font-bold text-gray-800">
              ({calculateAge(user.dob_day || "")})
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-green-900">
                Languages I speak:
              </h3>
              <div className="flex flex-col gap-1 mt-1">
                {user.spoken_languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded w-full break-words"
                  >
                    {lang.name} ({lang.level})
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-green-900">
                Languages I learn:
              </h3>
              <div className="flex flex-col gap-1 mt-1">
                {user.learning_languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded w-full break-words"
                  >
                    {lang.name} ({lang.level})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1/2 p-4 overflow-y-auto flex flex-col">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">About me:</h3>
        <p className="text-gray-700 text-sm flex-grow">{user.about}</p>

        <div className="flex justify-center gap-8 mt-2">
          <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
            <Star size={24} fill="currentColor" />
          </button>
          <button className="text-red-500 hover:text-red-600 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

*/
import type { User } from "../@types/user";
import { Star, X } from "lucide-react";

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
      className={`bg-white rounded-lg shadow-lg overflow-hidden h-96 w-80 mx-auto 
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

        <div className="absolute top-0 left-0 w-1/2 h-full p-4 flex flex-col justify-between">
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold text-gray-800 break-words">
              {user.first_name}
            </h4>
            <span className="text-lg font-bold text-gray-800">
              ({calculateAge(user.dob_day || "")})
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-green-900">
                Languages I speak:
              </h3>
              <div className="flex flex-col gap-1 mt-1">
                {user.spoken_languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded w-full break-words"
                  >
                    {lang.name} ({lang.level})
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-green-900">
                Languages I learn:
              </h3>
              <div className="flex flex-col gap-1 mt-1">
                {user.learning_languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded w-full break-words"
                  >
                    {lang.name} ({lang.level})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1/2 p-4 overflow-y-auto flex flex-col">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">About me:</h3>
        <p className="text-gray-700 text-sm flex-grow">{user.about}</p>

        <div className="flex justify-center gap-8 mt-2">
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
            className="text-red-500 hover:text-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            aria-label="Dislike profile"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
