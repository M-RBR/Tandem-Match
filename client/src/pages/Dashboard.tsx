import React, { useState, useEffect } from "react";
import { useAuthFetch } from "../utils/authFetch";
import { useUser } from "../contexts/UserContext";
import type { User } from "../@types/user";
import ProfileCard from "../components/ProfileCard";
import ChatContainer from "../components/ChatContainer";

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipingCards, setSwipingCards] = useState<
    { id: string; direction: "up" | "down" }[]
  >([]);
  const authFetch = useAuthFetch();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchProfiles = async () => {

      try {
        setLoading(true);
        const response = await authFetch("/users");
        const data = await response.json();

        const currentUserResponse = await authFetch("/users/me");
        const currentUser = await currentUserResponse.json();

        const likedIds = currentUser.likedUsers || [];
        const dislikedIds = currentUser.dislikedUsers || [];
        const seenIds = [...likedIds, ...dislikedIds];

        const filteredProfiles = data.filter(
          (profile: User) =>
            profile._id !== user?._id && !seenIds.includes(profile._id)
        );

        setProfiles(filteredProfiles);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user?._id, authFetch]);

  const handleMatch = async (profileId: string) => {
    try {
      setSwipingCards((prev) => [...prev, { id: profileId, direction: "up" }]);

      const response = await authFetch("/users/add-like", {
        method: "POST",
        body: JSON.stringify({ likedUserId: profileId }),
      });

      const data = await response.json();

      if (data.isMatch) {
        alert(
          `It's a match with ${
            profiles.find((p) => p._id === profileId)?.first_name
          }!`
        );

        setUser(
          {
            ...user!,
            matches: [...(user?.matches || []), profileId],
          },
          localStorage.getItem("token") || undefined
        );
      }

      setProfiles((prev) => prev.filter((p) => p._id !== profileId));
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
    } catch (error) {
      console.error("Failed to add like:", error);
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
    }
  };

  const handleReject = async (profileId: string) => {
    try {
      setSwipingCards((prev) => [
        ...prev,
        { id: profileId, direction: "down" },
      ]);

      await authFetch("/users/add-dislike", {
        method: "POST",
        body: JSON.stringify({ dislikedUserId: profileId }),
      });

      setProfiles((prev) => prev.filter((p) => p._id !== profileId));
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
    } catch (error) {
      console.error("Failed to add dislike:", error);
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h5 className="text-3xl italic font-bold text-center mt-5 mb-16 text-green-700">
        FIND YOUR TANDEM MATCH
      </h5>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center">
          <div className="relative w-full h-96">
            {profiles.length > 0 ? (
              profiles.slice(0, 2).map((profile, index) => (
                <div
                  key={profile._id}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    zIndex: profiles.length - index,
                    transform:
                      index === 1 ? "scale(0.98) translateY(8px)" : undefined,
                    opacity: index === 1 ? 0.9 : 1,
                  }}
                >
                  <ProfileCard
                    user={profile}
                    onMatch={() => handleMatch(profile._id)}
                    onReject={() => handleReject(profile._id)}
                    swipeDirection={
                      swipingCards.find((c) => c.id === profile._id)?.direction
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No profiles available.
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-md p-4">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
