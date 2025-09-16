import { useUser } from "../contexts/useUser";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../utils/authFetch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { User } from "../@types/user";

interface MatchesDisplayProps {
  onSelectMatch: (matchId: string) => void;
}

const MatchesDisplay = ({ onSelectMatch }: MatchesDisplayProps) => {
  const { user } = useUser();
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const authFetch = useAuthFetch();

  // Matches Pagination 
  const MATCHES_PER_PAGE = 6;
  const totalPages = Math.ceil(matches.length / MATCHES_PER_PAGE);
  const startIndex = currentPage * MATCHES_PER_PAGE;
  const endIndex = startIndex + MATCHES_PER_PAGE;
  const currentMatches = matches.slice(startIndex, endIndex);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

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
  }, [user?.matches, authFetch]);

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [matches.length]);

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
      <div className="flex items-center justify-between">
        {/* Left Arrow */}
        <button
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
          className={`w-8 h-16 flex items-center justify-center rounded-lg transition-all ${
            hasPreviousPage
              ? "bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-pointer"
              : "bg-transparent text-transparent cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Matches Grid */}
        <div className="flex-1 mx-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentMatches.map((match) => (
              <div
                key={match._id}
                className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => onSelectMatch(match._id)}
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

        {/* Right Arrow */}
        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className={`w-8 h-16 flex items-center justify-center rounded-lg transition-all ${
            hasNextPage
              ? "bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-pointer"
              : "bg-transparent text-transparent cursor-not-allowed"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default MatchesDisplay;
