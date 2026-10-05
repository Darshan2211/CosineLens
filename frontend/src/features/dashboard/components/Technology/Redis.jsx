import React, { useEffect, useRef, useState } from "react";

const Redis = () => {
  const sectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // We only want the animation once.
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="
        scroll-mt-22.5
        border-b
        border-[#E7E8EC]
        py-18
      "
    >
      <div
        className={`
          mx-auto
          grid
          max-w-260
          grid-cols-2
          
          items-center
          gap-11
          px-7
          max-[820px]:grid-cols-1

          transition-[opacity,transform]
          duration-600
          ease-out

          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
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
            Redis caching
          </p>

          {/* HEADING */}

          <h2
            className="
              mb-4
              max-w-155
              font-display
              text-[clamp(28px,3.6vw,38px)]
              font-bold
              leading-[1.12]
              tracking-[-0.01em]
              text-[#0A0A0C]
            "
          >
            312ms the first time. 3ms every time after.
          </h2>

          {/* description */}

          <p
            className="
              mb-5
              max-w-140
              text-[15.5px]
              leading-normal
              text-[#63666F]
            "
          >
            The embedding call is the expensive part — caching means most
            searches never pay for it.
          </p>

          {/* sect */}

          <div className="flex max-w-145 items-start gap-3 border-l-2 border-[#2954E3] pl-3.5">
            <p
              className="
                m-0
                text-[13px]
                leading-normal
                text-[#63666F]
              "
            >
              1,000 people searching{" "}
              <span className="font-medium text-[#2954E3]">
                'gaming laptop'
              </span>{" "}
              this hour means 1 Gemini call — not 1,000.
            </p>
          </div>
        </div>

        {/* right */}

        <div>
          {/* bars */}

          <div className="mb-7">
            {/* FIRST SEARCH */}

            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="
                    font-mono
                    text-[11px]
                    text-[#63666F]
                  "
                >
                  First search
                </span>

                <span
                  className="
                    font-mono
                    text-[11px]
                    text-[#63666F]
                  "
                >
                  312ms
                </span>
              </div>

              <div
                className="
                  h-2
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-[#F6F6F9]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#9A9CA5]
                    transition-[width]
                    duration-1200
                    ease-out
                  "
                  style={{
                    width: isVisible ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="
                    font-mono
                    text-[11px]
                    text-[#63666F]
                  "
                >
                  Cached repeat
                </span>

                <span
                  className="
                    font-mono
                    text-[11px]
                    text-[#2954E3]
                  "
                >
                  3ms
                </span>
              </div>

              {/* BAR */}

              <div
                className="
                  h-2
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-[#F6F6F9]
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#2954E3]
                    transition-[width]
                    duration-1200
                    delay-150
                    ease-out
                  "
                  style={{
                    width: isVisible ? "2%" : "0%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* cards */}

          <div className="grid grid-cols-2 gap-3">
            <div
              className="
                rounded-xl
                border
                border-[#E7E8EC]
                p-3.5
              "
            >
              <p
                className="
                  mb-2
                  font-mono
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[#2954E3]
                "
              >
                Result cache
              </p>

              <p className="m-0 text-[13px] text-[#63666F]">
                Full response — 5 min TTL
              </p>
            </div>
            {/* embedding cache */}
            <div
              className="
                rounded-xl
                border
                border-[#E7E8EC]
                p-3.5
              "
            >
              <p
                className="
                  mb-2
                  font-mono
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[#2954E3]
                "
              >
                Embedding cache
              </p>

              <p className="m-0 text-[13px] text-[#63666F]">
                Query vector — 24 hr TTL
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-[#E7E8EC]
                p-3.5
              "
            >
              <p
                className="
                  mb-2
                  font-mono
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[#2954E3]
                "
              >
                Autocomplete cache
              </p>

              <p className="m-0 text-[13px] text-[#63666F]">
                Suggestions — 1 hr TTL
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Redis;
