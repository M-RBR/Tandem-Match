import React from "react";

interface StarBackgroundProps {
  starCount?: number;
  colors?: string[];
}

const StarBackground: React.FC<StarBackgroundProps> = ({
  starCount = 15,
  colors = [
    "#22c55e", // green-500
    "#16a34a", // green-600
    "#15803d", // green-700
    "#166534", // green-800
    "#86efac", // green-300
    "#4ade80", // green-400
  ],
}) => {
  // Generate stars with green theme colors
  const stars = Array.from({ length: starCount }, (_, i) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 3 + 2; // 2-5vmin
    const duration = Math.random() * 15 + 10; // 20-50s
    const delay = Math.random() * duration * -1;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const moveX = (Math.random() - 0.5) * 200; // -100 to 100vw
    const moveY = (Math.random() - 0.5) * 200; // -100 to 100vh

    return {
      id: i,
      color: randomColor,
      size,
      duration,
      delay,
      startX,
      startY,
      moveX,
      moveY,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>
        {`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          33% {
            transform: translate3d(30px, -30px, 0) rotate(120deg);
          }
          66% {
            transform: translate3d(-20px, 20px, 0) rotate(240deg);
          }
        }

        .star {
          position: absolute;
          border-radius: 50%;
          animation: float linear infinite;
          opacity: 0.7;
        }

        .star::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: currentColor;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 20px currentColor, 0 0 40px currentColor,
            0 0 60px currentColor;
        }
        `}
      </style>

      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            color: star.color,
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: `${star.size}vmin`,
            height: `${star.size}vmin`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            transform: `translate3d(${star.moveX}px, ${star.moveY}px, 0)`,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
