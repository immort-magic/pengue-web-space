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
  href?: string;
};

const ARTICLES: ArticleEntry[] = [
  {
    id: "vibe-lesson-1",
    title: "Vibe Coding 第一课：痛点与最小行动",
    excerpt:
      "从生活痛点中找到最值得解决的场景，聚焦“明确下一步行动”这个核心需求，并给出最小可行产品的核心链路与组件选择。",
    coverSrc: "/covers/lesson1.png",
    coverAlt: "Vibe Coding 第一课",
    category: "技术",
    dateISO: "2026-01-30",
    dateLabel: "2026年1月30日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/THnvwzfc0iwLz3kZczqcYAcKnXb",
  },
  {
    id: "vibe-lesson-2",
    title: "Vibe Coding 第二课：OneStep 需求与范围",
    excerpt:
      "围绕“启动任务的第一步”拆解产品目标、功能范围与页面流程，明确登录、显示、设置等核心模块与数据指标。",
    coverSrc: "/covers/lesson2.png",
    coverAlt: "Vibe Coding 第二课",
    category: "技术",
    dateISO: "2026-01-31",
    dateLabel: "2026年1月31日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/R9VmwFyqhiyMFak9QJocR9QWnHb",
  },
  {
    id: "vibe-lesson-3",
    title: "Vibe Coding 第三课：LLM 接入与自动化",
    excerpt:
      "在 OneStep 中接入 GLM-4-Plus 实现任务拆解，使用 Supabase Edge Function 调通鉴权并落地飞书提醒的自动化方案。",
    coverSrc: "/covers/lesson3.png",
    coverAlt: "Vibe Coding 第三课",
    category: "技术",
    dateISO: "2026-02-01",
    dateLabel: "2026年2月1日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/PAwpwmVDUiYm8fkgpBpcHZ0VnGg",
  },
  {
    id: "vibe-lesson-4",
    title: "Vibe Coding 第四课：作业润色 Skill",
    excerpt:
      "为作业复盘场景创建专用 Skill，基于优秀作业标准做评审与改写，并总结更适合自己的写作风格约束。",
    coverSrc: "/covers/lesson4.png",
    coverAlt: "Vibe Coding 第四课",
    category: "技术",
    dateISO: "2026-02-02",
    dateLabel: "2026年2月2日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/QMkiw2SCmiYZpXkqqEGcwr7GnPd",
  },
  {
    id: "vibe-lesson-5",
    title: "Vibe Coding 第五课：主页版本迭代",
    excerpt:
      "从对标站点找风格，完成 v0.1.0 到 v0.1.3 的多次迭代，加入键盘字输出、头像替换与 hover 动效，并反思模型与成本选择。",
    coverSrc: "/covers/lesson5.png",
    coverAlt: "Vibe Coding 第五课",
    category: "技术",
    dateISO: "2026-02-03",
    dateLabel: "2026年2月3日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/IyWfwUBpCiAroEkKWZUcXWC2nyi",
  },
  {
    id: "vibe-lesson-6",
    title: "Vibe Coding 第六课：GitHub + Vercel",
    excerpt:
      "完成 GitHub 配置与 Vercel 部署，解决私密邮箱导致的推送问题，并记录版本发布与文章动效的迭代过程。",
    coverSrc: "/covers/lesson6.png",
    coverAlt: "Vibe Coding 第六课",
    category: "技术",
    dateISO: "2026-02-04",
    dateLabel: "2026年2月4日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/J5TWwOMYTigoJBk6O8lcsHBPnu9",
  },
  {
    id: "vibe-lesson-7",
    title: "Vibe Coding 第七课：产品场景与桌面 MVP",
    excerpt:
      "从“坐下不知道下一步做什么”的痛点出发，评估价值与根因，选定 Mac 桌面版 OneStep，并实现最小功能验证。",
    coverSrc: "/covers/lesson7.png",
    coverAlt: "Vibe Coding 第七课",
    category: "技术",
    dateISO: "2026-02-05",
    dateLabel: "2026年2月5日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/PSx0w7N9vi2wblkUAg3cxXqgnPe",
  },
  {
    id: "vibe-lesson-8",
    title: "Vibe Coding 第八课：课程毕业名片",
    excerpt:
      "整合痛点到产品的路演与学习复盘，展示 OneStep 的最小可行功能，并完成 GitHub + Vercel 的上线发布。",
    coverSrc: "/covers/lesson8.png",
    coverAlt: "Vibe Coding 第八课",
    category: "技术",
    dateISO: "2026-02-06",
    dateLabel: "2026年2月6日",
    author: "文思月",
    href: "https://icndkdfnybk8.feishu.cn/wiki/BroKwZ8H5ijFWikSLyCc41T3nid?fromScene=spaceOverview",
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
                    {article.href ? (
                      <a
                        href={article.href}
                        className="article-title"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span className="article-title">{article.title}</span>
                    )}
                    <p className="article-excerpt">{article.excerpt}</p>
                    <div className="article-meta">
                      <span>{article.dateLabel}</span>
                      <span className="article-meta-divider">/</span>
                      <span>{article.author}</span>
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
