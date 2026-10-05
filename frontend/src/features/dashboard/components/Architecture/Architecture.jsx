import React from "react";

const vectorExamples = [
  {
    query: '"shoes for long office hours"',
    product: "All-Day Comfort Office Sneaker",
    score: 0.91,
    result: "shown",
    high: true,
  },
  {
    query: '"shoes for long office hours"',
    product: "Ergonomic Standing Insoles",
    score: 0.84,
    result: "shown",
    high: true,
  },
  {
    query: '"shoes for long office hours"',
    product: 'Samsung 65" 4K TV',
    score: 0.08,
    result: "filtered",
    high: false,
  },
];

const Architecture = () => {
  return (
    <section
      id="embeddings"
      className="
        scroll-mt-22.5
        border-b
        border-[#E7E8EC]
        py-18
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-260
          grid-cols-2
          items-center
          gap-11
          px-7
          max-[820px]:grid-cols-1
        "
      >
        {/* left */}
        <div>
          {/* head */}

          <p
            className="
              mb-3.5
              font-mono
              text-[11.5px]
              font-semibold
              uppercase
              tracking-widest
              text-[#2954E3]
            "
          >
            What's a vector, really
          </p>

          

          <h2
            className="
              mb-4
              max-w-170
              font-display
              text-[clamp(26px,3.6vw,38px)]
              font-bold
              leading-tight
              tracking-[-0.01em]
              text-[#0A0A0C]
            "
          >
            Every product becomes a point in a 1536-dimension space.
          </h2>

          {/* description */}

          <p
            className="
              mb-3.5
              max-w-140
              text-[15.5px]
              leading-normal
              text-[#63666F]
            "
          >
            Text with similar meaning lands near each other, even without
            shared words. Search just finds the nearest points.
          </p>

          {/* embedded*/}

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {[
              "name",
              "description",
              "category",
              "brand",
              "tags",
              "attributes",
            ].map((field) => (
              <span
                key={field}
                className="
                  rounded-full
                  border
                  border-[#E7E8EC]
                  px-2.5
                  py-1
                  font-mono
                  text-[11px]
                  text-[#63666F]
                "
              >
                {field}
              </span>
            ))}
          </div>

          <p
            className="
              mt-2.5
              font-mono
              text-[12px]
              text-[#9A9CA5]
            "
          >
            ↑ what gets embedded per product
          </p>

          {/* table */}

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#E7E8EC]">
                  <th
                    className="
                      px-2.5
                      py-1.5
                      text-left
                      font-mono
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[#9A9CA5]
                    "
                  >
                    Query
                  </th>

                  <th
                    className="
                      px-2.5
                      py-1.5
                      text-left
                      font-mono
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[#9A9CA5]
                    "
                  >
                    Product
                  </th>

                  <th
                    className="
                      min-w-32.5
                      px-2.5
                      py-1.5
                      text-left
                      font-mono
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[#9A9CA5]
                    "
                  >
                    Similarity
                  </th>

                  <th
                    className="
                      px-2.5
                      py-1.5
                      text-left
                      font-mono
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.07em]
                      text-[#9A9CA5]
                    "
                  >
                    Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {vectorExamples.map((item) => (
                  <tr
                    key={item.product}
                    className="border-b border-[#F6F6F9] last:border-b-0"
                  >
                    {/* queryy */}

                    <td
                      className="
                        px-2.5
                        py-2.5
                        align-middle
                        font-normal
                        italic
                        text-[#0A0A0C]
                      "
                    >
                      {item.query}
                    </td>

                    {/* PRODUCT */}

                    <td
                      className="
                        px-2.5
                        py-2.5
                        text-[12px]
                        text-[#63666F]
                      "
                    >
                      {item.product}
                    </td>

                    {/* SCORE */}

                    <td className="px-2.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                            h-1.5
                            flex-1
                            overflow-hidden
                            rounded-full
                            border
                            border-[#E7E8EC]
                            bg-[#F6F6F9]
                          "
                        >
                          <div
                            className={`
                              h-full
                              rounded-full
                              ${
                                item.high
                                  ? "bg-[#2954E3]"
                                  : "bg-[#D1D5DB]"
                              }
                            `}
                            style={{
                              width: `${item.score * 100}%`,
                            }}
                          />
                        </div>

                        <span
                          className={`
                            whitespace-nowrap
                            font-mono
                            text-[11px]
                            font-semibold
                            ${
                              item.high
                                ? "text-[#2954E3]"
                                : "text-[#9A9CA5]"
                            }
                          `}
                        >
                          {item.score.toFixed(2)}
                        </span>
                      </div>
                    </td>

                    {/* results */}

                    <td
                      className={`
                        whitespace-nowrap
                        px-2.5
                        py-2.5
                        font-mono
                        text-[12px]
                        ${
                          item.high
                            ? "text-[#0A7A52]"
                            : "text-[#9A9CA5]"
                        }
                      `}
                    >
                      {item.high ? "✓ shown" : "✗ filtered"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* THRESHOLD NOTE */}

          <p
            className="
              mt-2
              font-mono
              text-[11px]
              text-[#9A9CA5]
            "
          >
            ↑ cosine similarity — 0.5+ threshold applied in $vectorSearch
          </p>
        </div>

        {/* rightcosine visual */}

        <div className="flex items-center justify-center">
          <svg
            viewBox="0 0 320 220"
            className="w-full max-w-150"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* line  */}

            <line
              x1="90"
              y1="70"
              x2="150"
              y2="95"
              stroke="#2954E3"
              strokeWidth="1.3"
              strokeDasharray="3 3"
            />

            {/* points */}

            <circle
              cx="90"
              cy="70"
              r="6"
              fill="#2954E3"
            />

            <circle
              cx="150"
              cy="95"
              r="6"
              fill="#2954E3"
            />

            {/* label */}

            <text
              x="70"
              y="55"
              fontFamily="IBM Plex Mono"
              fontSize="10"
              fill="#63666F"
            >
              "comfortable shoes, long walks"
            </text>

            {/* label product */}

            <text
              x="140"
              y="112"
              fontFamily="IBM Plex Mono"
              fontSize="10"
              fill="#63666F"
            >
              "ergonomic, standing all day"
            </text>

            {/* similar */}

            <text
              x="103"
              y="86"
              fontFamily="IBM Plex Mono"
              fontSize="10"
              fill="#2954E3"
              fontWeight="600"
            >
              cos 0.91
            </text>

            {/* LOW similar */}

            <circle
              cx="270"
              cy="195"
              r="5"
              fill="#0A0A0C"
            />

            <text
              x="205"
              y="212"
              fontFamily="IBM Plex Mono"
              fontSize="10"
              fill="#63666F"
            >
              "Samsung TV 65 inch"
            </text>

            <text
              x="230"
              y="175"
              fontFamily="IBM Plex Mono"
              fontSize="10"
              fill="#0A0A0C"
              fontWeight="600"
            >
              cos 0.08
            </text>

            {/*  points*/}

            <circle
              cx="40"
              cy="150"
              r="3"
              fill="#9A9CA5"
            />

            <circle
              cx="230"
              cy="35"
              r="3"
              fill="#9A9CA5"
            />

            <circle
              cx="180"
              cy="140"
              r="3"
              fill="#9A9CA5"
            />

            <circle
              cx="290"
              cy="90"
              r="3"
              fill="#9A9CA5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Architecture;