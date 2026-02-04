"use client";

import {
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import SiteSidebar from "./components/SiteSidebar";

const QUOTES = [
  "「我所分享的东西将通过一串串比特流流向你所在的远方，如果这些东西能让你感受到共鸣，我想这便是奇迹!」",
  "「生活中总有一些美好的事物值得记录，也值得分享。」",
  "「每一次点击，都是一次跨越时空的相遇。」",
  "「在这个数字世界里，文字是最温暖的连接。」",
  "「愿你在这里找到一些有趣的东西，或者只是片刻的宁静。」",
] as const;

const ARTICLE_REVEAL_DURATION_MS = 650;
const ARTICLE_REVEAL_FALLBACK_MS = 1200;

const ARTICLE_NAV_ITEMS = ["首页", "生活", "技术", "摄影"] as const;

type ArticleNavItem = (typeof ARTICLE_NAV_ITEMS)[number];
type ArticleCategory = Exclude<ArticleNavItem, "首页">;

type ArticleEntry = {
  id: string;
  title: string;
  excerpt: string;
  coverSrc: string;
  coverAlt: string;
  category: ArticleCategory;
  dateISO: string;
  dateLabel: string;
  author: string;
};

const ARTICLES: ArticleEntry[] = [
  {
    id: "airpods-pro-2",
    title: "AirPods Pro 2 使用体验分享",
    excerpt:
      "深度体验苹果最新降噪耳机，从音质、降噪效果到佩戴舒适度全方位评测，分享日常使用中的真实感受。",
    coverSrc: "/covers/airpods.svg",
    coverAlt: "AirPods Pro 2 使用体验分享",
    category: "技术",
    dateISO: "2024-03-15",
    dateLabel: "2024年3月15日",
    author: "Pengue",
  },
  {
    id: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max 深度评测",
    excerpt:
      "钛金属边框、A17 Pro芯片、全新Action按钮，这款旗舰手机究竟值不值得升级？一个月深度使用后的真实体验。",
    coverSrc: "/covers/iphone.svg",
    coverAlt: "iPhone 15 Pro Max 深度评测",
    category: "技术",
    dateISO: "2024-03-10",
    dateLabel: "2024年3月10日",
    author: "Pengue",
  },
  {
    id: "macbook-pro-m3",
    title: "MacBook Pro M3 开箱体验",
    excerpt:
      "M3芯片带来的性能飞跃，太空黑配色的质感，以及作为开发者日常使用的真实感受，一起来看看这台新机器。",
    coverSrc: "/covers/macbook.svg",
    coverAlt: "MacBook Pro M3 开箱体验",
    category: "技术",
    dateISO: "2024-03-05",
    dateLabel: "2024年3月5日",
    author: "Pengue",
  },
  {
    id: "apple-watch-ultra-2",
    title: "Apple Watch Ultra 2 运动测评",
    excerpt:
      "户外跑步、游泳、骑行全场景测试，看看这款专业运动手表在实际运动中的表现如何，续航能否满足需求。",
    coverSrc: "/covers/watch.svg",
    coverAlt: "Apple Watch Ultra 2 运动测评",
    category: "技术",
    dateISO: "2024-02-28",
    dateLabel: "2024年2月28日",
    author: "Pengue",
  },
  {
    id: "ipad-pro-2024",
    title: "iPad Pro 2024 创作者视角",
    excerpt:
      "作为内容创作者的生产力工具，iPad Pro配合Apple Pencil和妙控键盘，能否真正替代笔记本电脑？",
    coverSrc: "/covers/ipad.svg",
    coverAlt: "iPad Pro 2024 创作者视角",
    category: "技术",
    dateISO: "2024-02-20",
    dateLabel: "2024年2月20日",
    author: "Pengue",
  },
];

type ArticleRevealState = "hidden" | "revealing" | "revealed";

function QueuedArticle({
  index,
  state,
  register,
  children,
}: {
  index: number;
  state: ArticleRevealState;
  register: (index: number) => (node: HTMLElement | null) => void;
  children: ReactNode;
}) {
  return (
    <article
      ref={register(index)}
      className="article-item"
      data-reveal={state}
      data-article-index={index}
    >
      {children}
    </article>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const catParamRaw = searchParams.get("cat");
  const activeArticleNav: ArticleNavItem =
    catParamRaw != null &&
    (ARTICLE_NAV_ITEMS as readonly string[]).includes(catParamRaw)
      ? (catParamRaw as ArticleNavItem)
      : "首页";

  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [typewriterText, setTypewriterText] = useState("");
  const typewriterTimeoutRef = useRef<number | null>(null);
  const quoteIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [renderedArticles, setRenderedArticles] = useState(1);
  const [revealedArticles, setRevealedArticles] = useState(0);
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null);
  const [sentinelInView, setSentinelInView] = useState(false);
  const renderedArticlesRef = useRef(renderedArticles);
  const revealedArticlesRef = useRef(revealedArticles);
  const revealingIndexRef = useRef<number | null>(revealingIndex);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const renderPendingRef = useRef(false);
  const revealCleanupRef = useRef<(() => void) | null>(null);
  const revealLockRef = useRef(false);

  const articleRefs = useRef<Array<HTMLElement | null>>([]);
  const registerArticle = (index: number) => (node: HTMLElement | null) => {
    articleRefs.current[index] = node;
  };

  const filteredArticles =
    activeArticleNav === "首页"
      ? [...ARTICLES].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
      : ARTICLES.filter((article) => article.category === activeArticleNav).sort(
          (a, b) => b.dateISO.localeCompare(a.dateISO),
        );

  const totalArticles = filteredArticles.length;

  useEffect(() => {
    revealCleanupRef.current?.();
    revealCleanupRef.current = null;
    revealLockRef.current = false;
    renderPendingRef.current = false;
    setRevealingIndex(null);
    setRevealedArticles(0);
    setRenderedArticles(totalArticles > 0 ? 1 : 0);
    articleRefs.current = [];
  }, [activeArticleNav, totalArticles]);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;

    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
    renderedArticlesRef.current = renderedArticles;
    revealedArticlesRef.current = revealedArticles;
    revealingIndexRef.current = revealingIndex;
    renderPendingRef.current = false;
  }, [renderedArticles, revealedArticles, revealingIndex]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const inView = Boolean(entry?.isIntersecting);
        setSentinelInView(inView);
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sentinelInView) return;
    if (renderPendingRef.current) return;
    if (revealLockRef.current) return;
    if (revealingIndex !== null) return;
    if (revealedArticles !== renderedArticles) return;
    if (renderedArticles >= totalArticles) return;
    renderPendingRef.current = true;
    setRenderedArticles((count) => Math.min(totalArticles, count + 1));
  }, [
    sentinelInView,
    renderedArticles,
    revealedArticles,
    revealingIndex,
    totalArticles,
  ]);

  useEffect(() => {
    return () => {
      revealCleanupRef.current?.();
      revealCleanupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealedArticles(renderedArticles);
      setRevealingIndex(null);
      revealCleanupRef.current?.();
      revealCleanupRef.current = null;
      revealLockRef.current = false;
      return;
    }

    if (revealLockRef.current || revealingIndex !== null) return;
    if (revealedArticles >= renderedArticles) return;

    const nextIndex = revealedArticles;
    const element = articleRefs.current[nextIndex];
    if (!element) {
      setRevealedArticles((count) => Math.min(renderedArticles, count + 1));
      return;
    }

    revealLockRef.current = true;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      revealCleanupRef.current?.();
      revealCleanupRef.current = null;
      revealLockRef.current = false;
      setRevealingIndex(null);
      setRevealedArticles((count) => Math.min(renderedArticles, count + 1));
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== element) return;
      if (event.animationName !== "articleEnter") return;
      finish();
    };

    element.addEventListener("animationend", onAnimationEnd);
    const timeoutId = window.setTimeout(
      finish,
      ARTICLE_REVEAL_FALLBACK_MS + ARTICLE_REVEAL_DURATION_MS,
    );

    revealCleanupRef.current = () => {
      window.clearTimeout(timeoutId);
      element.removeEventListener("animationend", onAnimationEnd);
    };

    setRevealingIndex(nextIndex);
  }, [prefersReducedMotion, renderedArticles, revealedArticles, revealingIndex]);

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  useEffect(() => {
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeArticleNav]);

  return (
    <>
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <SiteHeader activeTop="blog" activeBlogNav={activeArticleNav} />

      <div className="main-container">
        <main className="articles-section">
          <div className="typewriter-section">
            <div className="typewriter-quote">
              <span className="typewriter-text">{typewriterText}</span>
              <span className="typewriter-cursor" />
            </div>
          </div>

          {totalArticles === 0 ? (
            <div className="article-empty">
              暂无内容（{activeArticleNav}）
            </div>
          ) : (
            filteredArticles
              .slice(0, renderedArticles)
              .map((article, index) => (
                <QueuedArticle
                  key={article.id}
                  index={index}
                  register={registerArticle}
                  state={
                    index < revealedArticles
                      ? "revealed"
                      : revealingIndex === index
                        ? "revealing"
                        : "hidden"
                  }
                >
                  <div className="article-cover">
                    <img
                      src={article.coverSrc}
                      alt={article.coverAlt}
                      loading="lazy"
                    />
                  </div>
                  <div className="article-content">
                    <div className="article-category">
                      <span className="article-category-icon">📦</span>
                      <span>{article.category}</span>
                    </div>
                    <a href="#" className="article-title">
                      {article.title}
                    </a>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <div className="article-meta">
                      <span>{article.dateLabel}</span>
                      <span className="article-meta-divider">/</span>
                      <a href="#">{article.author}</a>
                    </div>
                  </div>
                </QueuedArticle>
              ))
          )}

          <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />
        </main>
        <SiteSidebar />
      </div>
      <SiteFooter />

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

export default function Home() {
  return (
    <Suspense fallback={<div />}>
      <HomeContent />
    </Suspense>
  );
}
