import React, { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: 1,
    title: "Query in",
    description: "Raw text hits the search service.",
    time: "0ms",
  },
  {
    number: 2,
    title: "Cache check",
    description: "Redis checked for this exact query.",
    time: "miss",
  },
  {
    number: 3,
    title: "Embed",
    description: "OpenAI turns the query into 1536 numbers.",
    time: "198ms",
  },
  {
    number: 4,
    title: "Search in parallel",
    description: "$vectorSearch and $search run together.",
    time: "52 / 35ms",
  },
  {
    number: 5,
    title: "Merge (RRF)",
    description: "Reciprocal rank fusion blends both sets.",
    time: "<1ms",
  },
  {
    number: 6,
    title: "Cache & return",
    description: "Response stored in Redis, then sent.",
    time: "312ms total",
  },
];

const PipelineSteps = () => {
  const pipelineRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = pipelineRef.current;

    if (!element) return;

    const observer = new IntersectionObserver( //watches element
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pipelineRef} className="relative">
      {/* base line */}
      <div
        className={`absolute
          left-5.75
          right-5.75
          top-5.75
          h-px
          bg-[#E7E8EC]
          max-[820px]:hidden
          `}
      />

      {/* blue line */}
      <div
        className="
          absolute
          left-5.75
          top-5.75
          h-0.5
          bg-[#073ae0]
          transition-[width]
          duration-2000
          ease-out
          max-[820px]:hidden
        "
        style={{
          width: isVisible ? "calc(100% - 46px)" : "0%",
        }}
      />

      <div className="relative grid grid-cols-6 gap-5 max-[820px]:grid-cols-1">
        {steps.map((step) => (
          <div key={step.number} className="relative">
            {/* NUMBER */}
            <div
              className="
                relative
                z-10
                mb-3
                flex
                h-11.5
                w-11.5
                items-center
                justify-center
                rounded-full
                border
                border-[#2954E3]
                bg-[#E5EBFC]
                font-mono
                text-[12px]
                font-bold
                text-[#2954E3]
              "
            >
              {step.number}
            </div>

            <h3 className="mb-1 text-[13.5px] font-bold text-[#0A0A0C]">
              {step.title}
            </h3>

            <p className="mb-2 text-xs leading-normal text-[#63666F]">
              {step.description}
            </p>

            <span className="font-mono text-[11px] text-[#2954E3]">
              {step.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineSteps;
