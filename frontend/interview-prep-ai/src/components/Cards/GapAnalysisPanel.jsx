import React from "react";
import {
  LuCircleCheck,
  LuTriangleAlert,
  LuTarget,
  LuLightbulb,
  LuShield,
} from "react-icons/lu";

const IMPORTANCE_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const ScoreRing = ({ score }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
        ? "text-amber-500"
        : "text-red-500";
  const strokeColor =
    score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] text-slate-400 font-medium">READY</span>
      </div>
    </div>
  );
};

const GapAnalysisPanel = ({ data, compact = false }) => {
  if (!data) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            data.readinessScore >= 75
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : data.readinessScore >= 50
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {data.readinessScore}% Ready
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
      {/* Header with score */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
        <ScoreRing score={data.readinessScore} />
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Readiness Score
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {data.readinessScore >= 75
              ? "You're well-prepared for this role!"
              : data.readinessScore >= 50
                ? "Good foundation, but some areas need attention."
                : "Significant preparation recommended before interviewing."}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Matching Skills */}
        {data.matchingSkills?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LuCircleCheck className="text-emerald-600" size={16} />
              <h4 className="text-sm font-semibold text-slate-700">
                Matching Skills
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.matchingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps */}
        {data.gaps?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LuTriangleAlert className="text-amber-600" size={16} />
              <h4 className="text-sm font-semibold text-slate-700">
                Skill Gaps
              </h4>
            </div>
            <div className="space-y-2">
              {data.gaps.map((gap, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${IMPORTANCE_STYLES[gap.importance] || IMPORTANCE_STYLES.medium}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{gap.skill}</span>
                    <span className="text-[10px] uppercase font-bold opacity-70">
                      {gap.importance}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">
                    {gap.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {data.strengths?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LuShield className="text-blue-600" size={16} />
              <h4 className="text-sm font-semibold text-slate-700">
                Your Strengths
              </h4>
            </div>
            <ul className="space-y-1.5">
              {data.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 shrink-0">&#8226;</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LuLightbulb className="text-amber-600" size={16} />
              <h4 className="text-sm font-semibold text-slate-700">
                Recommendations
              </h4>
            </div>
            <ul className="space-y-1.5">
              {data.recommendations.map((r, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="text-amber-400 font-bold shrink-0">
                    {i + 1}.
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analyzed timestamp */}
        {data.analyzedAt && (
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Last analyzed:{" "}
            {new Date(data.analyzedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default GapAnalysisPanel;
