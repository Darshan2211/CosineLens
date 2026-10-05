import React, { useState } from "react";

const steps = [
  {
    title: "Both searches run in parallel",
    description:
      "Vector search finds products by meaning. Keyword search finds exact word matches. Each returns an independent ranked list.",
  },
  {
    title: "Position becomes a rank score",
    description:
      "The formula converts each position into a small comparable number. Raw scores from either search are never mixed.",
    example: "position 1 → 1 / (60 + 1) = 0.01639",
  },
  {
    title: "Contributions are added per product",
    description:
      "A product found by both methods collects two contributions. Agreement naturally earns a stronger combined score.",
    example: "both lists → 0.01639 + 0.01613 = 0.03252",
  },
  {
    title: "The highest combined score wins",
    description:
      "Products are sorted by their total RRF score, so cross-method agreement rises above a strong result from only one list.",
  },
];

const checks = [
  ["Throws raw scores away", "Only rank position is used."],
  ["No manual weights", "Nothing needs constant retuning."],
  ["Agreement wins", "Products found by both methods rise."],
  [
    "Works on any query",
    "Natural language and exact terms behave consistently.",
  ],
];

const baseResults = [
  {
    name: "Asus ROG Strix G15",
    source: "both",
    foundIn: "vector & keyword",
    positions: "vec #1 · kw #2",
    score: "0.03213",
    width: "88%",
  },
  {
    name: "Lenovo Legion 5 Pro",
    source: "keyword",
    foundIn: "keyword only",
    positions: "kw #1 only",
    score: "0.01639",
    width: "50%",
  },
  {
    name: "Dell G15 RTX 4060",
    source: "vector",
    foundIn: "vector only",
    positions: "vec #2 only",
    score: "0.01613",
    width: "48%",
  },
];

const SourceBadge = ({ source }) => {
  const styles = {
    both: "border-[#22C55E]/25 bg-[#F0FDF4] text-[#16A34A]",
    keyword: "border-[#EAB308]/30 bg-[#FEF9C3] text-[#A16207]",
    vector: "border-[#2954E3]/20 bg-[#E5EBFC] text-[#2954E3]",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-normal ${styles[source]}`}
    >
      {source}
    </span>
  );
};

const MethodBadge = ({ children, type }) => {
  const styles =
    type === "vector"
      ? "border-[#2954E3]/20 bg-[#E5EBFC] text-[#2954E3]"
      : "border-[#EAB308]/30 bg-[#FEF9C3] text-[#A16207]";

  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-full border px-2 py-0.5 font-mono text-[10px] ${styles}`}
    >
      {children}
    </span>
  );
};

const RrfArchitecture = () => {
  const [simulated, setSimulated] = useState(false);

  const results = simulated
    ? baseResults.map((result) =>
        result.name.startsWith("Lenovo")
          ? {
              ...result,
              source: "both",
              foundIn: "vector & keyword",
              positions: "vec #3 · kw #1",
              score: "0.03202",
              width: "87%",
            }
          : result,
      )
    : baseResults;

  return (
    <section className="border-b border-[#E7E8EC] bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-260">
        {/* header */}

        <header className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#2954E3]">
            How results get ranked
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-normal text-[#0A0A0C] sm:text-4xl">
            Rank position, not score magnitude
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#63666F] sm:text-[15px]">
            Semantic and keyword search use different scoring scales. Reciprocal
            Rank Fusion merges both lists fairly—without manual weights or
            comparing incompatible raw scores.
          </p>
        </header>

        {/* problem and solution */}

        <div className="mt-9 grid gap-4 lg:grid-cols-2">
          {/* problem */}

          <article className="rounded-lg border border-[#DC2626]/25 bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#B91C1C]">
              The problem without RRF
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <MethodBadge type="vector">VECTOR</MethodBadge>

                <div>
                  <p className="font-mono text-sm font-medium text-[#0A0A0C]">
                    0.91, 0.87, 0.84
                  </p>

                  <p className="mt-0.5 text-xs text-[#63666F]">
                    Cosine similarity · fixed 0–1 scale
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MethodBadge type="keyword">KEYWORD</MethodBadge>

                <div>
                  <p className="font-mono text-sm font-medium text-[#0A0A0C]">
                    8.4, 6.1, 4.3
                  </p>

                  <p className="mt-0.5 text-xs text-[#63666F]">
                    Atlas relevance · no fixed range
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-[#B91C1C]">
              0.91 + 8.4 = 9.31 — meaningless
            </p>

            <p className="mt-1 text-xs leading-5 text-[#63666F]">
              The values measure different things and cannot be added or
              averaged.
            </p>
          </article>

          {/* solution */}

          <article className="rounded-lg border border-[#E7E8EC] bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#15803D]">
              Why RRF solves it
            </p>

            <div className="mt-4 space-y-3">
              {checks.map(([title, description]) => (
                <div key={title} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    <span className="text-[10px] font-bold leading-none">
                      ✓
                    </span>
                  </span>

                  <p className="text-xs leading-5 text-[#63666F]">
                    <strong className="font-semibold text-[#0A0A0C]">
                      {title}
                    </strong>{" "}
                    — {description}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* how it work */}

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          {/* left side */}

          <div className="flex min-h-full flex-col">
            <h3 className="text-lg font-semibold tracking-normal text-[#0A0A0C]">
              How it works
            </h3>

            <div className="mt-4 overflow-hidden rounded-lg border border-[#E7E8EC] bg-white">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="flex gap-4 border-b border-[#E7E8EC] p-4 last:border-b-0"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#2954E3]/20 bg-[#E5EBFC] font-mono text-[11px] font-semibold text-[#2954E3]">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-[#0A0A0C]">
                      {step.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-[#63666F]">
                      {step.description}
                    </p>

                    {step.example && (
                      <code className="mt-2 inline-flex rounded-full border border-[#2954E3]/20 bg-[#E5EBFC] px-2.5 py-1 font-mono text-[10px] text-[#2954E3]">
                        {step.example}
                      </code>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* right sidde*/}

          <div>
            <div className="overflow-hidden rounded-lg border border-[#E7E8EC] bg-white">
              <div className="border-b border-[#E7E8EC] bg-[#F8F9FC] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#63666F]">
                  Live example · query “gaming laptop”
                </p>
              </div>

              <div className="hidden grid-cols-[1fr_7rem_6.5rem] gap-4 border-b border-[#E7E8EC] px-4 py-2.5 font-mono text-[9px] uppercase text-[#63666F] sm:grid">
                <span>Product</span>
                <span>Rank positions</span>
                <span className="text-right">RRF score</span>
              </div>

              {/* rresults */}

              {results.map((result, index) => (
                <article
                  key={result.name}
                  className={`border-b border-[#E7E8EC] px-4 py-4 last:border-b-0 transition-colors duration-200 ${
                    index === 0 ? "bg-[#F5F7FF]" : "bg-white"
                  }`}
                >
                  <div className="grid items-center gap-3 sm:grid-cols-[1fr_7rem_6.5rem] sm:gap-4">
                    {/* Product */}

                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`font-mono text-[11px] ${
                          index === 0 ? "text-[#2954E3]" : "text-[#63666F]"
                        }`}
                      >
                        #{index + 1}
                      </span>

                      <span className="truncate text-sm font-semibold text-[#0A0A0C]">
                        {result.name}
                      </span>

                      <SourceBadge source={result.source} />
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:block">
                      <span className="font-mono text-[10px] text-[#63666F] sm:hidden">
                        RANKS
                      </span>

                      <span className="font-mono text-[10px] text-[#63666F]">
                        {result.positions}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] text-[#63666F] sm:hidden">
                          SCORE
                        </span>

                        <span
                          className={`ml-auto font-mono text-xs ${
                            index === 0 || result.source === "both"
                              ? "font-semibold text-[#2954E3]"
                              : "text-[#63666F]"
                          }`}
                        >
                          {result.score}
                        </span>
                      </div>

                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#EEF0F4]">
                        <div
                          className="h-full rounded-full bg-[#3147C7] transition-[width] duration-300"
                          style={{ width: result.width }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 font-mono text-[9px] uppercase text-[#63666F] sm:hidden">
                    {result.foundIn}
                  </p>
                </article>
              ))}
            </div>

            {/* sect */}

            <aside className="mt-4 flex gap-3 rounded-lg border border-[#2954E3]/25 bg-white p-4">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3147C7]" />

              <p className="text-xs leading-6 text-[#63666F]">
                <strong className="font-semibold text-[#0A0A0C]">
                  Asus stays first because both methods agree.
                </strong>{" "}
                Two independent contributions are stronger evidence than
                Lenovo’s single keyword win.
              </p>
            </aside>

            {/* sim */}

            <button
              type="button"
              onClick={() => setSimulated((current) => !current)}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#2954E3]/35 bg-[#F5F7FF] px-4 py-3 font-mono text-[11px] leading-5 text-[#2954E3] transition-[background,border-color] duration-200 hover:border-[#2954E3]/50 hover:bg-[#EEF2FF]"
            >
              {simulated ? (
                <>
                  <span className="text-sm">↶</span>
                  <span>Reset the ranking</span>
                </>
              ) : (
                "What if Lenovo also appears in vector results at position 3? →"
              )}
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                simulated
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-3 pt-3 text-center font-mono text-[10px] leading-5 text-[#2954E3]">
                  Lenovo now appears in both lists: 1/61 + 1/63 = 0.03202. Asus
                  still leads by 0.00011.
                </p>
              </div>
            </div>
            <aside className="mt-4 rounded-lg border border-[#2954E3]/25 bg-[#F5F7FF] p-4">
              <p className="text-xs leading-6 text-[#63666F]">
                <strong className="font-semibold text-[#0A0A0C]">
                  Why the formula uses 60.
                </strong>{" "}
                It dampens the gap between positions, preventing the first
                result from overpowering useful lower-ranked matches from the
                other list.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RrfArchitecture;
