import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUserName: string;
}

const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  matchedUserName,
}) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={[
            "#10b981",
            "#059669",
            "#047857",
            "#065f46",
            "#fbbf24",
            "#f59e0b",
          ]}
        />
      )}

      <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative transform animate-pulse">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-700">
              It's a match with {matchedUserName}! 🎉
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchModal;
