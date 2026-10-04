import React from "react";
import PipelineSteps from "./PipelineSteps";
import CacheHit from "./CacheHit";

const HowItWorks = ({ coldTime, cacheHitTime }) => {
  return (
    <section
      id="pipeline"
      className="scroll-mt-22.5 border-b border-[#E7E8EC] py-18"
    >
      <div className="mx-auto w-full max-w-260 px-7">
        {/* header */}
        <div>
          <p className="mb-3.5 font-mono text-[11.5px] font-semibold uppercase tracking-widest text-[#2954E3]">
            How It Works
          </p>

          <h2 className="mb-4 max-w-170 font-display text-[clamp(26px,3.6vw,38px)] font-bold leading-[1.35] tracking-[-0.01em] text-[#0A0A0C]">
            Six steps happen between your keystroke and the results on screen.
          </h2>

          <p className="mb-8 max-w-140 text-[15.5px] leading-normal text-[#63666F]">
            In production, this runs server-side against MongoDB Atlas. The
            panel above simulates the same logic client-side, live.
          </p>
        </div>

        <PipelineSteps />

        <CacheHit 
            coldTime={coldTime}
            cacheHitTime={cacheHitTime}
        />
      </div>
    </section>
  );
};

export default HowItWorks;
