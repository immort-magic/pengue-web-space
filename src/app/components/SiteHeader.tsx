"use client";

import Link from "next/link";
import {
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const BLOG_NAV_ITEMS = ["首页", "生活", "技术", "摄影"] as const;

export type ActiveTopNav = "blog" | "drawer" | null;

export default function SiteHeader({
  activeTop,
  activeBlogNav,
}: {
  activeTop: ActiveTopNav;
  activeBlogNav?: (typeof BLOG_NAV_ITEMS)[number];
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const blogLinks = useMemo(
    () =>
      BLOG_NAV_ITEMS.map((nav) => ({
        nav,
        href: nav === "首页" ? "/" : `/?cat=${encodeURIComponent(nav)}`,
      })),
    [],
  );

  useEffect(() => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      setTheme("dark");
      return;
    }
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") setTheme("dark");
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");

    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const focusId = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusId);
  }, [searchOpen]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const openSearch = () => setSearchOpen(true);
  const closeSearch = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setSearchOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link href="/" className="logo">
            <div className="logo-icon">J</div>
            <div className="logo-info">
              <span className="logo-text">Pengue&apos;s Space</span>
              <span className="logo-subtitle">
                To believe that hard work alone can make anything possible is a
                form of arrogance.
              </span>
            </div>
          </Link>

          <div className="nav-wrapper">
            <nav>
              <ul className="nav-menu">
                <li className="has-submenu">
                  <Link
                    href="/"
                    className={`nav-link${activeTop === "blog" ? " active" : ""}`}
                  >
                    博文 <span className="nav-caret">▾</span>
                  </Link>
                  <ul className="nav-submenu" aria-label="文章分类">
                    {blogLinks.map((item) => (
                      <li key={item.nav}>
                        <Link
                          href={item.href}
                          className={`nav-submenu-link${
                            activeBlogNav === item.nav ? " active" : ""
                          }`}
                        >
                          {item.nav}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="has-submenu">
                  <Link
                    href="/goodies"
                    className={`nav-link${
                      activeTop === "drawer" ? " active" : ""
                    }`}
                  >
                    抽屉 <span className="nav-caret">▾</span>
                  </Link>
                  <ul className="nav-submenu" aria-label="抽屉">
                    <li>
                      <Link href="/goodies" className="nav-submenu-link">
                        好东西
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="nav-submenu-link">
                        关于我
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#" className="nav-link">
                    说说
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link">
                    相册
                  </a>
                </li>
                <li>
                  <Link href="/about" className="nav-link">
                    关于
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="nav-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                type="button"
              >
                <span
                  className="sun-icon"
                  style={{ display: theme === "dark" ? "none" : "inline" }}
                >
                  ◐
                </span>
                <span
                  className="moon-icon"
                  style={{ display: theme === "dark" ? "inline" : "none" }}
                >
                  ◑
                </span>
              </button>
              <button
                className="search-btn"
                onClick={openSearch}
                aria-label="Open search"
                type="button"
              >
                ⌕
              </button>
              <button className="mobile-menu-btn" type="button">
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`search-modal${searchOpen ? " active" : ""}`}
        onClick={closeSearch}
      >
        <div className="search-box">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="搜索文章..."
          />
        </div>
      </div>
    </>
  );
}
