import React from "react";

const CacheHit = ({ coldTime, cacheHitTime }) => {
  const cacheTime =
    cacheHitTime !== null && cacheHitTime !== undefined
      ? `${cacheHitTime}ms`
      : "—";

  const coldTimeLabel =
    coldTime !== null && coldTime !== undefined ? `${coldTime}ms` : "—";

  return (
    <div className="mt-12.5">
      {/* path */}
      <div className="flex items-center justify-between gap-6 rounded-xl border border-[#E7E8EC] bg-[#F6F6F9] px-5 py-4.5 max-[640px]:flex-col max-[640px]:items-start">
        <p className="max-w-145 text-[13px] leading-normal text-[#63666F]">
          <strong className="font-semibold text-[#0A0A0C]">
            Second search, same query:
          </strong>{" "}
          the pipeline never leaves step 2 — full <br /> response comes straight
          out of Redis.
        </p>

        <div className="shrink-0">
          <div className="font-mono text-[25px] font-semibold leading-none text-[#2954E3]">
            {cacheTime}
          </div>

          <span className="mt-1 block font-mono text-[10px] text-[#9A9CA5]">
            cache hit path
          </span>
        </div>
      </div>

      {/* hit */}
      <div className="mt-4 flex items-center gap-4 rounded-[10px] border border-[#A3DFC9] bg-[#F0FDF8] px-4.5 py-3.5 text-[13px] text-[#0A7A52] max-[640px]:flex-wrap">
        <span className="shrink-0 text-base">⚡</span>

        <p className="flex-1 leading-normal">
          <strong className="font-semibold">Try it:</strong> search the same
          query twice in the panel above. The pipeline card skips steps 3–5
          entirely — embedding, vector search, and keyword search are all
          bypassed.
        </p>

        <div className="shrink-0">
          <div className="font-mono text-[22px] font-semibold leading-none text-[#0A7A52]">
            ~{cacheTime}
          </div>

          <span className="mt-1 block font-mono text-[10px] text-[#2D8F6A]">
            vs {coldTimeLabel} cold
          </span>
        </div>
      </div>
    </div>
  );
};

export default CacheHit;
