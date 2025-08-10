/*

import type { User } from "../@types";
interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const calculateAge = (birthDate: string) => {
    const todayDate = new Date();
    const birthDateObj = new Date(birthDate);
    let age = todayDate.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = todayDate.getMonth() - birthDateObj.getMonth(); // to check whether user's birthday has already occurred this year
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

      
        <div className="absolute top-4 left-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.first_name} ({calculateAge(user.dob_day || "")})
          </h2>
        </div>

       
        <div className="absolute bottom-4 left-4">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-green-900">
              Languages I speak:
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.spoken_languages?.map((lang, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded"
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
            <div className="flex flex-wrap gap-1 mt-1">
              {user.learning_languages?.map((lang, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-green-800 px-2 py-1 rounded"
                >
                  {lang.name} ({lang.level})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

     
      <div className="h-1/2 p-4 overflow-y-auto ">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">About me:</h3>
        <p className="text-gray-700 text-sm">{user.about}</p>
      </div>
    </div>
  );
};

export default ProfileCard;

*/

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
        {/* Profile Image - right side */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
          {user.image && (
            <img
              src={user.image}
              alt={`${user.first_name}'s profile`}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Left content container */}
        <div className="absolute top-0 left-0 w-1/2 h-full p-4 flex flex-col justify-between">
          {/* Name and Age that will stack vertically when needed */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 break-words">
              {user.first_name}
            </h2>
            <span className="text-lg font-bold text-gray-800">
              ({calculateAge(user.dob_day || "")})
            </span>
          </div>

          {/* Languages section */}
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

      {/* About Me Section */}
      <div className="h-1/2 p-4 overflow-y-auto flex flex-col">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">About me:</h3>
        <p className="text-gray-700 text-sm flex-grow">{user.about}</p>

        {/* Action buttons */}
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
