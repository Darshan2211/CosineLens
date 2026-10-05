import React, { useEffect, useRef, useState } from "react";

const stackItems = [
  {
    icon: "M",
    title: "MongoDB Atlas",
    description:
      "Products and embeddings live in the same document — $vectorSearch runs directly against the collection.",
  },
  {
    icon: "G",
    title: "Gemini Embeddings",
    description:
      "gemini-embedding-2 — 1536 dims, cheap enough to embed every product.",
  },
  {
    icon: "U",
    title: "Upstash Redis",
    description: "Serverless, HTTP-based — no Docker container in production.",
  },
  {
    icon: "N",
    title: "Node.js + Express",
    description:
      "Search, embedding, hybrid-search, and cache each get their own module.",
  },
  {
    icon: "R",
    title: "React",
    description:
      "Custom hooks for search, autocomplete, debounce, and signal tracking.",
  },
];

const Stack = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Run the entrance animation only once.
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
    <section
      ref={sectionRef}
      id="stack"
      className="
        scroll-mt-22.5
        py-18
      "
    >
      <div
        className={`
          mx-auto
          max-w-260
          px-7

          transition-[opacity,transform]
          duration-600
          ease-out

          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
      >
       

        <div className="mb-7">
          <p
            className="
              mb-3.5
              font-mono
              text-[11px]
              font-medium
              uppercase
              tracking-widest
              text-[#2954E3]
            "
          >
            The stack
          </p>

          <h2
            className="
              m-0
              font-display
              text-[clamp(30px,3.8vw,38px)]
              font-bold
              leading-[1.12]
              tracking-[-0.01em]
              text-[#0A0A0C]
            "
          >
            Five pieces. Each one earns its place.
          </h2>
        </div>

        {/* cards */}

        <div
          className="
            grid
            grid-cols-3
            gap-3.5
            max-[820px]:grid-cols-1
          "
        >
          {stackItems.slice(0, 3).map((item, index) => (
            <StackCard
              key={item.title}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

       {/* bottom cards */}

        <div
          className="
            mx-auto
            mt-3.5
            grid
            max-w-165
            grid-cols-2
            gap-3.5
            max-[600px]:grid-cols-1
          "
        >
          {stackItems.slice(3).map((item, index) => (
            <StackCard
              key={item.title}
              item={item}
              index={index + 3}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// stack card

const StackCard = ({ item, index, isVisible }) => {
  return (
    <article
      tabIndex={0}
      className={`
        group

        rounded-xl
        border
        border-[#E7E8EC]
        bg-white
        p-4.5

        cursor-default

        transition-all
        duration-200
        ease-out

        hover:translate-y-0.5
        hover:border-[#2954E3]
        
     ${isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
      `}
      style={{
        transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
      }}
    >
     {/* icon */}

      <div
        className="
          mb-3.5
          flex
          h-8.5
          w-8.5
          items-center
          justify-center

          rounded-lg

          bg-[#E5EBFC]

          font-mono
          text-[13px]
          font-medium
          text-[#2954E3]

          transition-[background,color] 
        "
      >
        {item.icon}
      </div>

      {/* title */}

      <h3
        className="
          mb-2

          text-[14px]
          font-semibold
          leading-tight
          text-[#0A0A0C]

          transition-colors
          duration-300

          group-hover:text-[#2954E3]
          group-focus-visible:text-[#2954E3]
        "
      >
        {item.title}
      </h3>

      {/* description */}

      <p
        className="
          m-0
          text-[12.5px]
          leading-[1.55]x
          text-[#63666F]
        "
      >
        {item.description}
      </p>
    </article>
  );
};

export default Stack;
