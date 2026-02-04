import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import SiteSidebar from "../../components/SiteSidebar";

import {
  GOODIES_CATEGORIES,
  GOODIES_VISIBLE_CATEGORIES,
  type GoodiesCategorySlug,
  GOODIES_ITEMS,
} from "../goodies-data";
import GoodiesTypewriter from "../GoodiesTypewriter";

const CATEGORY_SET = new Set<string>(GOODIES_CATEGORIES.map((c) => c.slug));

function isCategorySlug(value: string): value is GoodiesCategorySlug {
  return CATEGORY_SET.has(value);
}

export function generateStaticParams() {
  return GOODIES_CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export default async function GoodiesCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const current = GOODIES_CATEGORIES.find((c) => c.slug === slug);
  if (!current) notFound();

  const items = GOODIES_ITEMS[slug] ?? [];

  const useTypewriter = slug === "apps" || slug === "sites" || slug === "plugins";

  return (
    <>
      <SiteHeader activeTop="drawer" />

      <div className="main-container">
        <main className="goodies-section">
          <div className="goodies-hero">
            <div className="goodies-title">好东西 · {current.label}</div>
            {useTypewriter ? (
              <GoodiesTypewriter text={`「${current.desc}」`} />
            ) : (
              <div className="goodies-subtitle">{current.desc}</div>
            )}
          </div>

          <div className="goodies-tabs" aria-label="好东西分类">
            {GOODIES_VISIBLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/goodies/${cat.slug}`}
                className={`goodies-tab${cat.slug === slug ? " active" : ""}`}
              >
                <span className="goodies-tab-label">{cat.label}</span>
              </Link>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="goodies-empty">暂无内容（占位）</div>
          ) : (
            <div className="goodies-items">
              {items.map((item) => {
                const isExternal = Boolean(item.href?.startsWith("http"));
                return (
                <a
                  key={item.id}
                  className="goodies-item"
                  href={item.href ?? "#"}
                  {...(isExternal
                    ? { target: "_blank", rel: "noreferrer" }
                    : undefined)}
                >
                  <div className="goodies-item-head">
                    <div className="goodies-item-title">
                      {item.icon ? (
                        <span className="goodies-item-icon">{item.icon}</span>
                      ) : null}
                      {item.title}
                      {item.badge ? (
                        <span className="goodies-badge">{item.badge}</span>
                      ) : null}
                    </div>
                    <div className="goodies-item-action">查看 →</div>
                  </div>
                  <div className="goodies-item-desc">{item.desc}</div>
                  <div className="goodies-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="goodies-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              );
              })}
            </div>
          )}
        </main>

        <SiteSidebar />
      </div>

      <SiteFooter />
    </>
  );
}
