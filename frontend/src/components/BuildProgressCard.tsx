import { useEffect, useState } from "react";

/**
 * BuildProgressCard
 *
 * Displays a mock Fabrix 3D print job with progress.
 * Purely UI-focused (no backend dependency).
 */
function BuildProgressCard() {
  const [progress, setProgress] = useState(65);

  // Optional subtle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="
      p-6
      rounded-2xl
      shadow-md
      bg-white/80
      backdrop-blur
      border border-gray-200
      w-[780px]
    ">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-heading text-lg">
          Active Print Job
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Status:</span>
          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
        </div>
      </div>

      {/* Project Name */}
      <p className="text-sm text-gray-600">
        TinyHome Unit A-12
      </p>

      {/* Status */}
      <p className="text-sm mt-3">
        Printing structural walls...
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-accent h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{progress}% complete</span>
        <span>ETA: 2h 14m</span>
      </div>
    </div>
  );
}

export default BuildProgressCard;