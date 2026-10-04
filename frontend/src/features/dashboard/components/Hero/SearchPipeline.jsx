import React from "react";

const pipelineStages = [
  {
    id: "understand-query",
    label: "Understand Query",
    icon: "search",
  },
  {
    id: "check-cache",
    label: "Check Cache",
    icon: "cache",
  },
  {
    id: "generate-embedding",
    label: "Generate Embedding",
    icon: "embedding",
  },
  {
    id: "rank-results",
    label: "Search Product",
    icon: "rank",
  },
  {
    id: "merge-results",
    label: "Merge via RRF",
    icon: "merge",
  },
  {
    id: "return-results",
    label: "Display Results",
    icon: "display",
  },
];

const StageIcon = ({ type }) => {
  if (type === "search") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-3.75 w-3.75"
      >
        <circle cx="10.8" cy="10.8" r="5.8" />
        <path d="m15.2 15.2 4.2 4.2" />
      </svg>
    );
  }

  if (type === "cache") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-3.75 w-3.75"
      >
        <ellipse cx="12" cy="6" rx="6" ry="2.8" />
        <path d="M6 6v5c0 1.55 2.7 2.8 6 2.8s6-1.25 6-2.8V6" />
        <path d="M6 11v5c0 1.55 2.7 2.8 6 2.8s6-1.25 6-2.8v-5" />
      </svg>
    );
  }

  if (type === "embedding") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-3.75 w-3.75"
      >
        <path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3Z" />
        <path d="m18.5 15 .55 2.45L21.5 18l-2.45.55L18.5 21l-.55-2.45L15.5 18l2.45-.55L18.5 15Z" />
      </svg>
    );
  }

  if (type === "rank") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="h-3.75 w-3.75"
      >
        <path d="M6 17v-4" />
        <path d="M12 17V9" />
        <path d="M18 17V6" />
      </svg>
    );
  }

  if (type === "merge") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="h-3.75 w-3.75"
      >
        <path d="M6 7h3c3 0 3 10 6 10h3" />
        <path d="M6 17h3c3 0 3-10 6-10h3" />
        <path d="m16 5 2 2-2 2" />
        <path d="m16 15 2 2-2 2" />
      </svg>
    );
  }

  if (type === "display") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-3.75 w-3.75"
      >
        <rect x="4" y="5" width="16" height="11" rx="1.5" />
        <path d="M9 20h6" />
        <path d="M12 16v4" />
      </svg>
    );
  }

  return null;
};

const SearchPipeline = ({
  status = "ready",
  stages = {},
  totalTime = null,
}) => {
  return (
    <div className="max-[900px]:order-1">
      <div className="rounded-2xl border border-[#E7E8EC] bg-[#F6F6F9] p-5.5">
        {/* header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-[13px] font-bold text-[#0A0A0C]">
            Behind the Search
          </span>
          <span
            className={`rounded-[20px] border px-2.5 py-0.75 font-mono text-[10.5px] transition-all duration-300
            ${
              status === "active"
                ? "border-[#AFC1F5] bg-[#E5EBFC] text-[#2954E3]"
                : status === "complete"
                  ? "border-[#E7E8EC] bg-white text-[#63666F]"
                  : "border-[#E7E8EC] bg-white text-[#9A9CA5]"
            } 
          `}
          >
            {status === "active"
              ? "searching..."
              : status === "complete"
                ? totalTime
                  ? "done"
                  : "done"
                : "ready"}
          </span>
        </div>
        {/* pipeline */}
        <div className="relative">
          {/* base connector */}
          <div
            className="absolute
              left-4
              top-4
              bottom-4
              w-px
            bg-[#E5E6EA]"
          />
          {pipelineStages.map((stage, index) => {
            const stageState = stages[stage.id] ?? {
              status: "idle",
              detail: "—",
            };
            const isActive = stageState.status === "active";
            const isComplete = stageState.status === "complete";
            const isSkipped = stageState.status === "skipped";

            const connectorActive = isComplete;

            return (
              <div
                key={stage.id}
                className="relative flex min-h-11 items-center gap-3"
              >
                {/* connector line */}
                {index < pipelineStages.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 h-5 w-px transition-all duration-500
                          ${connectorActive ? "bg-[#6482da]" : "bg-transparent"}
                          `}
                  />
                )}

                {/* icon */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-[#F6F6F9] transition-all duration-300
                    ${
                      isActive
                        ? `border-[#2954E3]
                          bg-[#F0F4FF]
                          text-[#2954E3]
                          shadow-[0_0_0_3px_#E5EBFC]`
                        : isComplete
                          ? `
                            border-[#AFC1F5]
                            bg-[#F0F4FF]
                            text-[#2954E3]
                          `
                          : isSkipped
                            ? `
                              border-[#EEEEF0]
                              bg-[#FAFAFB]
                              text-[#D3D4D8]
                            `
                            : `
                              border-[#E7E8EC]
                              bg-white
                              text-[#C7C8CE]
                            `
                    }
                    `}
                >
                  <StageIcon type={stage.icon} />
                </div>
                {/* stage contend */}
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span
                    className={`text-[12px] font-semibold transition-colors duration-300
                        ${
                          isActive || isComplete
                            ? "text-[#070707]"
                            : isSkipped
                              ? "text-[#B9BAC0]"
                              : "text-[#63666F]"
                        }
                        `}
                  >
                    {stage.label}
                  </span>

                  <span
                    className={`
                      shrink-0
                      font-mono
                      text-[10.5px]
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? "text-[#2954E3]"
                          : isComplete
                            ? "text-[#63666F]"
                            : isSkipped
                              ? "text-[#D0D1D5]"
                              : "text-[#9A9CA5]"
                      }
                    `}
                  >
                    {stageState.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* total */}
        <div className="mt-3 flex items-end justify-between border-t  border-[#E5E6EA] pt-4">
          <span
            className="
              font-mono
              text-[10.5px]
              text-[#9A9CA5]
            "
          >
            estimated total
          </span>
          <span
            className="
              font-bold
              text-[17px]
              text-[#2954E3]
            "
          >
            {totalTime ? `~${totalTime}` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchPipeline;
