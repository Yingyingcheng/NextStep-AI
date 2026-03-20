import React from "react";
import { LuPin, LuTarget } from "react-icons/lu";
import SpinnerLoader from "../../../components/Loader/SpinnerLoader";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  pinnedCount = 0,
  onAnalyzeGap,
  isGapLoading = false,
  gapScore,
}) => {
  return (
    <div className="bg-amber-200 text-black relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="min-h-[180px] md:h-[200px] flex flex-col justify-center py-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <h2 className="text-2xl md:text-4xl leading-tight font-medium">
                {role}
              </h2>
              <p className="text-sm md:text-md text-slate-700 mt-1">
                {topicsToFocus}
              </p>
            </div>

            {onAnalyzeGap && (
              <button
                onClick={onAnalyzeGap}
                disabled={isGapLoading}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 bg-white/80 hover:bg-white text-amber-800 border border-amber-300 shrink-0"
              >
                {isGapLoading ? (
                  <SpinnerLoader />
                ) : (
                  <LuTarget size={14} />
                )}
                {gapScore != null ? `Re-analyze (${gapScore}%)` : "Analyze Gap"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
            <div className="text-[10px] font-semibold text-white bg-amber-600 px-3 py-1 rounded-full">
              Experience: {experience} {experience == 1 ? "Year" : "Years"}
            </div>

            <div className="text-[10px] font-semibold text-white bg-amber-600 px-3 py-1 rounded-full">
              {questions} Q&A
            </div>

            {pinnedCount > 0 && (
              <div className="text-[10px] font-semibold text-amber-800 bg-white/70 px-3 py-1 rounded-full flex items-center gap-1">
                <LuPin size={10} />
                {pinnedCount} Pinned
              </div>
            )}

            <div className="text-[10px] font-semibold text-white bg-amber-600 px-3 py-1 rounded-full">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
