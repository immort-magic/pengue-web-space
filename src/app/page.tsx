"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

const QUOTES = [
  "「我所分享的东西将通过一串串比特流流向你所在的远方，如果这些东西能让你感受到共鸣，我想这便是奇迹!」",
  "「生活中总有一些美好的事物值得记录，也值得分享。」",
  "「每一次点击，都是一次跨越时空的相遇。」",
  "「在这个数字世界里，文字是最温暖的连接。」",
  "「愿你在这里找到一些有趣的东西，或者只是片刻的宁静。」",
] as const;

const SITE_START_DATE = "2024-01-01";

function formatClock(now: Date) {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [runtimeDays, setRuntimeDays] = useState(0);
  const [currentTime, setCurrentTime] = useState("--:--:--");

  const [typewriterText, setTypewriterText] = useState("");
  const typewriterTimeoutRef = useRef<number | null>(null);
  const quoteIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

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
    const update = () => setCurrentTime(formatClock(new Date()));
    update();
    const intervalId = window.setInterval(update, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const startDate = new Date(SITE_START_DATE);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setRuntimeDays(diffDays);
  }, []);

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

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight <= 0 ? 0 : (scrollTop / docHeight) * 100;
      setReadingProgress(Math.max(0, Math.min(100, percent)));
      setShowBackToTop(scrollTop > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const step = () => {
      const currentQuote = QUOTES[quoteIndexRef.current] ?? QUOTES[0];
      const isDeleting = isDeletingRef.current;
      const typeSpeed = isDeleting ? 30 : 80;

      if (isDeleting) {
        charIndexRef.current = Math.max(0, charIndexRef.current - 1);
        setTypewriterText(currentQuote.substring(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          isDeletingRef.current = false;
          quoteIndexRef.current = (quoteIndexRef.current + 1) % QUOTES.length;
          typewriterTimeoutRef.current = window.setTimeout(step, 500);
          return;
        }
      } else {
        charIndexRef.current = Math.min(
          currentQuote.length,
          charIndexRef.current + 1,
        );
        setTypewriterText(currentQuote.substring(0, charIndexRef.current));

        if (charIndexRef.current === currentQuote.length) {
          isDeletingRef.current = true;
          typewriterTimeoutRef.current = window.setTimeout(step, 3000);
          return;
        }
      }

      typewriterTimeoutRef.current = window.setTimeout(step, typeSpeed);
    };

    step();
    return () => {
      if (typewriterTimeoutRef.current != null) {
        window.clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const openSearch = () => setSearchOpen(true);
  const closeSearch = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setSearchOpen(false);
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <header className="header">
        <div className="header-container">
          <a href="#" className="logo">
            <div className="logo-icon">J</div>
            <div className="logo-info">
              <span className="logo-text">Pengue&apos;s Space</span>
              <span className="logo-subtitle">
                To believe that hard work alone can make anything possible is a
                form of arrogance.
              </span>
            </div>
          </a>

          <div className="nav-wrapper">
            <nav>
              <ul className="nav-menu">
                <li>
                  <a href="#" className="active">
                    博文
                  </a>
                </li>
                <li>
                  <a href="#">抽屉</a>
                </li>
                <li>
                  <a href="#">说说</a>
                </li>
                <li>
                  <a href="#">相册</a>
                </li>
                <li>
                  <a href="#">关于</a>
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

      <div className="main-container">
        <main className="articles-section">
          <div className="typewriter-section">
            <div className="typewriter-quote">
              <span className="typewriter-text">{typewriterText}</span>
              <span className="typewriter-cursor" />
            </div>
          </div>

          <article className="article-item">
            <div className="article-cover">
              <img
                src="/covers/airpods.svg"
                alt="AirPods Pro 2 使用体验分享"
                loading="lazy"
              />
            </div>
            <div className="article-content">
              <div className="article-category">
                <span className="article-category-icon">📦</span>
                <span>好物</span>
              </div>
              <a href="#" className="article-title">
                AirPods Pro 2 使用体验分享
              </a>
              <p className="article-excerpt">
                深度体验苹果最新降噪耳机，从音质、降噪效果到佩戴舒适度全方位评测，分享日常使用中的真实感受。
              </p>
              <div className="article-meta">
                <span>2024年3月15日</span>
                <span className="article-meta-divider">/</span>
                <a href="#">Pengue</a>
              </div>
            </div>
          </article>

          <article className="article-item">
            <div className="article-cover">
              <img
                src="/covers/iphone.svg"
                alt="iPhone 15 Pro Max 深度评测"
                loading="lazy"
              />
            </div>
            <div className="article-content">
              <div className="article-category">
                <span className="article-category-icon">📦</span>
                <span>好物</span>
              </div>
              <a href="#" className="article-title">
                iPhone 15 Pro Max 深度评测
              </a>
              <p className="article-excerpt">
                钛金属边框、A17 Pro芯片、全新Action按钮，这款旗舰手机究竟值不值得升级？一个月深度使用后的真实体验。
              </p>
              <div className="article-meta">
                <span>2024年3月10日</span>
                <span className="article-meta-divider">/</span>
                <a href="#">Pengue</a>
              </div>
            </div>
          </article>

          <article className="article-item">
            <div className="article-cover">
              <img
                src="/covers/macbook.svg"
                alt="MacBook Pro M3 开箱体验"
                loading="lazy"
              />
            </div>
            <div className="article-content">
              <div className="article-category">
                <span className="article-category-icon">📦</span>
                <span>好物</span>
              </div>
              <a href="#" className="article-title">
                MacBook Pro M3 开箱体验
              </a>
              <p className="article-excerpt">
                M3芯片带来的性能飞跃，太空黑配色的质感，以及作为开发者日常使用的真实感受，一起来看看这台新机器。
              </p>
              <div className="article-meta">
                <span>2024年3月5日</span>
                <span className="article-meta-divider">/</span>
                <a href="#">Pengue</a>
              </div>
            </div>
          </article>

          <article className="article-item">
            <div className="article-cover">
              <img
                src="/covers/watch.svg"
                alt="Apple Watch Ultra 2 运动测评"
                loading="lazy"
              />
            </div>
            <div className="article-content">
              <div className="article-category">
                <span className="article-category-icon">📦</span>
                <span>好物</span>
              </div>
              <a href="#" className="article-title">
                Apple Watch Ultra 2 运动测评
              </a>
              <p className="article-excerpt">
                户外跑步、游泳、骑行全场景测试，看看这款专业运动手表在实际运动中的表现如何，续航能否满足需求。
              </p>
              <div className="article-meta">
                <span>2024年2月28日</span>
                <span className="article-meta-divider">/</span>
                <a href="#">Pengue</a>
              </div>
            </div>
          </article>

          <article className="article-item">
            <div className="article-cover">
              <img
                src="/covers/ipad.svg"
                alt="iPad Pro 2024 创作者视角"
                loading="lazy"
              />
            </div>
            <div className="article-content">
              <div className="article-category">
                <span className="article-category-icon">📦</span>
                <span>好物</span>
              </div>
              <a href="#" className="article-title">
                iPad Pro 2024 创作者视角
              </a>
              <p className="article-excerpt">
                作为内容创作者的生产力工具，iPad Pro配合Apple Pencil和妙控键盘，能否真正替代笔记本电脑？
              </p>
              <div className="article-meta">
                <span>2024年2月20日</span>
                <span className="article-meta-divider">/</span>
                <a href="#">Pengue</a>
              </div>
            </div>
          </article>
        </main>

        <aside className="sidebar">
            <div className="profile-section">
              <div className="profile-avatar">
              <img src="/head.png" alt="Pengue" />
              </div>
            <div className="profile-name">文思月</div>
            <div className="profile-subtitle">
              Blogger | 摄影爱好者 | 跑步 | AI Learner
            </div>
            <div className="social-links">
              <a href="#" title="GitHub">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" title="Twitter">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" title="邮箱">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <a href="#" title="RSS">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
              </a>
            </div>

            <div className="tags-section">
              <div className="tags-title">标签</div>
              <div className="tags-cloud">
                <a href="#" className="tag-item">
                  Apple
                </a>
                <a href="#" className="tag-item">
                  科技
                </a>
                <a href="#" className="tag-item">
                  评测
                </a>
                <a href="#" className="tag-item">
                  摄影
                </a>
                <a href="#" className="tag-item">
                  生活
                </a>
                <a href="#" className="tag-item">
                  编程
                </a>
                <a href="#" className="tag-item">
                  AI
                </a>
                <a href="#" className="tag-item">
                  旅行
                </a>
                <a href="#" className="tag-item">
                  读书
                </a>
                <a href="#" className="tag-item">
                  跑步
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-links">
            <a href="#">关于本站</a>
            <span className="footer-divider">|</span>
            <a href="#">友情链接</a>
            <span className="footer-divider">|</span>
            <a href="#">留言板</a>
            <span className="footer-divider">|</span>
            <a href="#">RSS订阅</a>
          </div>
          <div className="footer-info">
            <p>© 2024 Pengue&apos;s Space. All rights reserved.</p>
            <p className="footer-runtime">
              本站已运行 <span>{runtimeDays}</span> 天 · 当前时间{" "}
              <span>{currentTime}</span>
            </p>
          </div>
        </div>
      </footer>

      <button
        className={`back-to-top${showBackToTop ? " visible" : ""}`}
        onClick={scrollToTop}
        type="button"
        aria-label="Back to top"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
