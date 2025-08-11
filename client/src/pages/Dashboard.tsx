/*

import React, { useState, useEffect } from "react";
import { useAuthFetch } from "../utils/authFetch";
import ProfileCard from "../components/ProfileCard";
import { useUser } from "../contexts/UserContext";
import type { User } from "../@types";

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipingCards, setSwipingCards] = useState<
    { id: string; direction: "up" | "down" }[]
  >([]);
  const authFetch = useAuthFetch();
  const { user } = useUser();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await authFetch("/users");
        const data = await response.json();
        setProfiles(data.filter((profile: User) => profile._id !== user?._id));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleSwipe = (id: string, direction: "up" | "down") => {
    setSwipingCards((prev) => [...prev, { id, direction }]);
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      setSwipingCards((prev) => prev.filter((c) => c.id !== id));
    }, 500); // Match animation duration
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profiles...
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
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        Find your tandem match
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => {
            const swipeState = swipingCards.find((c) => c.id === profile._id);
            return (
              <ProfileCard
                key={profile._id}
                user={profile}
                onMatch={() => handleSwipe(profile._id, "up")}
                onReject={() => handleSwipe(profile._id, "down")}
                swipeDirection={swipeState?.direction}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No profiles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

*/

/* 

SECOND

import React, { useState, useEffect } from "react";
import { useAuthFetch } from "../utils/authFetch";
import ProfileCard from "../components/ProfileCard";
import { useUser } from "../contexts/UserContext";
import type { User } from "../@types";

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipingCards, setSwipingCards] = useState<
    { id: string; direction: "up" | "down" }[]
  >([]);
  const authFetch = useAuthFetch();
  const { user } = useUser();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await authFetch("/users");
        const data = await response.json();
        setProfiles(data.filter((profile: User) => profile._id !== user?._id));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleSwipe = (id: string, direction: "up" | "down") => {
    setSwipingCards((prev) => [...prev, { id, direction }]);
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p._id !== id));
      setSwipingCards((prev) => prev.filter((c) => c.id !== id));
    }, 500); // Match animation duration in ProfileCard
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profiles...
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
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        Find your tandem match
      </h2>

      <div className="relative w-80 h-96 mx-auto">
        {profiles.length > 0 ? (
          profiles
            .slice(0, 2) // Show only top card and the next one for performance
            .map((profile, index) => {
              const swipeState = swipingCards.find((c) => c.id === profile._id);
              return (
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
                    onMatch={() => handleSwipe(profile._id, "up")}
                    onReject={() => handleSwipe(profile._id, "down")}
                    swipeDirection={swipeState?.direction}
                  />
                </div>
              );
            })
        ) : (
          <div className="text-center text-gray-500">
            No profiles available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

*/

import React, { useState, useEffect } from "react";
import { useAuthFetch } from "../utils/authFetch";
import ProfileCard from "../components/ProfileCard";
import { useUser } from "../contexts/UserContext";
import type { User } from "../@types";

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swipingCards, setSwipingCards] = useState<
    { id: string; direction: "up" | "down" }[]
  >([]);
  const authFetch = useAuthFetch();
  const { user } = useUser();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await authFetch("/users");
        const data = await response.json();
        setProfiles(data.filter((profile: User) => profile._id !== user?._id));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [user?._id]);

  const handleMatch = async (profileId: string) => {
    try {
      // Optimistically update UI
      setSwipingCards((prev) => [...prev, { id: profileId, direction: "up" }]);

      // Send match to server
      await authFetch("/users/add-match", {
        method: "POST",
        body: JSON.stringify({ matchId: profileId }),
      });

      // Check for mutual match (optional)
      const matchedProfile = profiles.find((p) => p._id === profileId);
      if (matchedProfile?.matches?.includes(user?._id || "")) {
        // This is where you could show a match notification
        console.log("It's a match!");
      }
    } catch (error) {
      console.error("Failed to add match:", error);
      // Revert UI if API call fails
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
      return; // Don't remove the card if the API call failed
    }

    // Remove the profile from view after successful API call
    setProfiles((prev) => prev.filter((p) => p._id !== profileId));
    setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
  };

  const handleReject = (profileId: string) => {
    // Just remove from view for rejects
    setSwipingCards((prev) => [...prev, { id: profileId, direction: "down" }]);
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p._id !== profileId));
      setSwipingCards((prev) => prev.filter((c) => c.id !== profileId));
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profiles...
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
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        Find your tandem match
      </h2>

      <div className="relative w-80 h-96 mx-auto">
        {profiles.length > 0 ? (
          profiles
            .slice(0, 2) // Show only top card and the next one for performance
            .map((profile, index) => {
              const swipeState = swipingCards.find((c) => c.id === profile._id);
              return (
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
                    swipeDirection={swipeState?.direction}
                  />
                </div>
              );
            })
        ) : (
          <div className="text-center text-gray-500">
            No profiles available. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
