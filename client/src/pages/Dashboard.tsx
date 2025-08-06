import React, { useState, useEffect } from "react";
import { useAuthFetch } from "../utils/authFetch";
import ProfileCard from "../components/ProfileCard";
import { useUser } from "../contexts/UserContext";
import type { User } from "../@types";

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          profiles.map((profile) => (
            <ProfileCard key={profile._id} user={profile} />
          ))
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
