import { Menu, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../../../../public/cosinelens-nav.svg";

const Navbar = () => {
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#pipeline" },
    { label: "Architecture", href: "#embeddings" },
    { label: "Technology", href: "#stack" },
    { label: "GitHub", href: "#github" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("#features");

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo(0, 0);
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-120px 0px -10% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="
        font-navbar
        pointer-events-none
        sticky
        top-4
        z-50
        flex
        justify-center
      "
    >
      {/* NAV INNER */}

      <div
        className="
          pointer-events-auto
          mx-auto
          flex
          w-[calc(100%-32px)]
          max-w-205
          items-center
          justify-between
          rounded-full
          border
          border-[#E7E8EC]
          bg-white
          px-5
          py-2.5
          shadow-[0_8px_24px_-12px_rgba(10,10,12,0.18)]
        "
      >
        {/* LOGO */}

        <a
          href="#features"
          onClick={handleNavClick}
          className="block shrink-0 no-underline"
          aria-label="CosineLens"
        >
          <img src={logo} alt="CosineLens" />
        </a>

        {/* NAV LINKS */}

        <ul
          className="
            hidden
            list-none
            items-center
            gap-1
            rounded-full
            bg-[#F6F6F9]
            p-1
            min-[761px]:flex
          "
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={handleNavClick}
                  className={
                    isActive
                      ? `
                        inline-block
                        whitespace-nowrap
                        rounded-full
                        bg-white
                        px-3.5
                        py-2
                        font-sans
                        text-[12.5px]
                        font-medium
                        leading-none
                        text-[#2954E3]
                        no-underline
                        shadow-[0_1px_4px_rgba(10,10,12,0.08)]
                        transition-[background,color,box-shadow]
                        duration-180
                      `
                      : `
                        inline-block
                        whitespace-nowrap
                        rounded-full
                        px-3.5
                        py-2
                        font-sans
                        text-[12.5px]
                        font-medium
                        leading-none
                        text-[#63666F]
                        no-underline
                        transition-[background,color,box-shadow]
                        duration-180
                        hover:bg-white
                        hover:text-[#0A0A0C]
                        hover:shadow-[0_1px_4px_rgba(10,10,12,0.08)]
                      `
                  }
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* RIGHT ACTIONS */}

        <div className="flex shrink-0 items-center gap-2.5">
          {/* THEME */}

          {/* <button
            type="button"
            aria-label="Toggle theme"
            className="
              flex
              h-8
              w-8
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-[#E7E8EC]
              bg-[#F6F6F9]
              p-0
            "
          >
            <Sun
              size={15}
              strokeWidth={1.6}
              className="text-[#63666F]"
            />
          </button> */}

          {/* CTA */}

          <a
            href="#live-demo"
            onClick={handleNavClick}
            className="
              hidden
              whitespace-nowrap
              rounded-full
              bg-[#0A0A0C]
              px-4
              py-2.25
              font-mono
              text-[11.5px]
              font-semibold
              leading-none
              text-white
              no-underline
              transition-colors
              duration-180
              hover:bg-[#2954E3]
              min-[761px]:block
            "
          >
            Live Demo →
          </a>

          {/* MOBILE MENU */}

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="
              flex
              h-8
              w-8
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-full
              border
              border-[#E7E8EC]
              bg-[#F6F6F9]
              p-0
              min-[761px]:hidden
            "
          >
            {isMenuOpen ? (
              <X size={15} strokeWidth={1.6} className="text-[#0A0A0C]" />
            ) : (
              <Menu size={15} strokeWidth={1.6} className="text-[#0A0A0C]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {isMenuOpen && (
        <div
          className="
            pointer-events-auto
            flex
            flex-col
            gap-0.5
            rounded-2xl
            border
            border-[#E7E8EC]
            bg-white
            p-2.5
            shadow-[0_8px_24px_-12px_rgba(10,10,12,0.18)]
            min-[761px]:hidden
          "
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={
                  isActive
                    ? `
                      rounded-[10px]
                      bg-[#E5EBFC]
                      px-3.5
                      py-2.75
                      font-sans
                      text-[13.5px]
                      font-medium
                      text-[#2954E3]
                      no-underline
                    `
                    : `
                      rounded-[10px]
                      px-3.5
                      py-2.75
                      font-sans
                      text-[13.5px]
                      font-medium
                      text-[#63666F]
                      no-underline
                      hover:bg-[#E5EBFC]
                      hover:text-[#2954E3]
                    `
                }
              >
                {link.label}
              </a>
            );
          })}

          <a
            href="#live-demo"
            onClick={handleNavClick}
            className="
              mt-1
              rounded-full
              bg-[#0A0A0C]
              px-4
              py-2.25
              text-center
              font-mono
              text-[11.5px]
              font-semibold
              text-white
              no-underline
            "
          >
            Live Demo →
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
