/* 

const MatchesDisplay = () => {
  return <div>Matches</div>;
};

export default MatchesDisplay;

*/

import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import type { User } from "../@types";

const MatchesDisplay = () => {
  const { user } = useUser();
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!user?.matches?.length) {
          setMatches([]);
          return;
        }

        const response = await authFetch("/users/matches");
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user?.matches]);

  if (loading && user?.matches?.length) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="text-center text-gray-500 py-8">No matches yet.</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div
            key={match._id}
            className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-300 mb-2">
              <img
                src={match.image}
                alt={`${match.first_name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-green-800 text-center">
              {match.first_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesDisplay;
