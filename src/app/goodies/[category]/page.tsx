import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import SiteSidebar from "../../components/SiteSidebar";

import {
  GOODIES_CATEGORIES,
  type GoodiesCategorySlug,
  GOODIES_ITEMS,
} from "../goodies-data";

const CATEGORY_SET = new Set<string>(GOODIES_CATEGORIES.map((c) => c.slug));

function isCategorySlug(value: string): value is GoodiesCategorySlug {
  return CATEGORY_SET.has(value);
}

export default function GoodiesCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const slug = params.category;
  if (!isCategorySlug(slug)) notFound();

  const current = GOODIES_CATEGORIES.find((c) => c.slug === slug);
  if (!current) notFound();

  const items = GOODIES_ITEMS[slug] ?? [];

  return (
    <>
      <SiteHeader activeTop="drawer" />

      <div className="main-container">
        <main className="goodies-section">
          <div className="goodies-hero">
            <div className="goodies-title">好东西 · {current.label}</div>
            <div className="goodies-subtitle">{current.desc}</div>
          </div>

          <div className="goodies-tabs" aria-label="好东西分类">
            {GOODIES_CATEGORIES.map((cat) => (
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
              {items.map((item) => (
                <a
                  key={item.id}
                  className="goodies-item"
                  href={item.href ?? "#"}
                >
                  <div className="goodies-item-head">
                    <div className="goodies-item-title">
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
              ))}
            </div>
          )}
        </main>

        <SiteSidebar />
      </div>

      <SiteFooter />
    </>
  );
}
