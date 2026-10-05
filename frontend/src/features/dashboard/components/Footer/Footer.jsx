import React from "react";

const Footer = () => {
  return (
    <footer
      id="github"
      className="
        scroll-mt-22.5
    pt-18
    pb-24
      "
    >
      <div
        className="
          mx-auto
          max-w-260
          px-7
        "
      >
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
          See it for yourself
        </p>

        {/* head */}

        <h2
          className="
            m-0
            mb-7
            font-display
            text-[clamp(30px,3.8vw,38px)]
            font-bold
            leading-[1.12]
            tracking-[-0.01em]
            text-[#0A0A0C]
          "
        >
          The write-up is only half of it.
        </h2>

        {/* cards */}

        <div
          className="
            grid
            grid-cols-2
            gap-3.5
            max-[700px]:grid-cols-1
          "
        >
          {/* githyb */}

          <a
            href="https://github.com/Darshan2211/Smart-ecom-search"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              flex
              items-center
              justify-between
              rounded-[10px]
              border-[1.5px]
              border-[#0A0A0C]
              px-5
              py-4.5
              text-[#0A0A0C]
              no-underline

              transition-all
              duration-200
              ease-out

              hover:-translate-y-0.5
              
              hover:bg-[#0A0A0C]
              hover:text-white
            "
          >
            <div>
              <div
                className="
                  font-display
                  text-[15px]
                  font-semibold
                "
              >
                View the code
              </div>

              <div
                className="
                  mt-0.75
                  font-mono
                  text-[11px]
                  opacity-60
                "
              >
                GitHub — README, architecture, setup
              </div>
            </div>

            <span
              className="
                ml-5
                text-[20px]
                font-light
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </a>

          {/* demo */}

          <a
            id="live-demo"
            href="#features"
            target="_top"
            rel="noopener noreferrer"
            className="
              group
              flex
              items-center
              justify-between
              rounded-[10px]
              border-[1.5px]
              border-[#0A0A0C]
              px-5
              py-4.5
              text-[#0A0A0C]
              no-underline

              transition-all
              duration-200
              ease-out

              hover:-translate-y-0.5
              
              hover:bg-[#0A0A0C]
              hover:text-white
            "
          >
            <div>
              <div
                className="
                  font-display
                  text-[15px]
                  font-semibold
                "
              >
                Try the live demo
              </div>

              <div
                className="
                  mt-0.75
                  font-mono
                  text-[11px]
                  opacity-60
                "
              >
                Vercel + Render — always on
              </div>
            </div>

            <span
              className="
                ml-5
                text-[20px]
                font-light
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </a>
        </div>

        {/*  */}

        <div
          className="
            mt-9
            flex
            flex-wrap
            items-center
            gap-x-5.5
            gap-y-3
            font-mono
            text-[12.5px]
          "
        >
          <a
            href="https://www.linkedin.com/in/darshanpatil-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="
              border-b
              border-[#E7E8EC]
              text-[#63666F]
              no-underline
              transition-colors
              duration-150
              hover:border-[#2954E3]
              hover:text-[#2954E3]
            "
          >
            LinkedIn
          </a>

          <a
            href="mailto:YOUR_EMAIL@example.com"
            className="
              border-b
              border-[#E7E8EC]
              text-[#63666F]
              no-underline
              transition-colors
              duration-150
              hover:border-[#2954E3]
              hover:text-[#2954E3]
            "
          >
            email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
