"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import SiteSidebar from "../components/SiteSidebar";

import { GOODIES_VISIBLE_CATEGORIES } from "./goodies-data";

export default function GoodiesIndexPage() {
  const [typewriterText, setTypewriterText] = useState("");
  const typewriterTimeoutRef = useRef<number | null>(null);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    const sentence =
      "「这里是我的抽屉——收纳那些值得反复使用、反复打开、反复折腾的东西。」";

    const step = () => {
      const isDeleting = isDeletingRef.current;
      const typeSpeed = isDeleting ? 30 : 80;

      if (isDeleting) {
        charIndexRef.current = Math.max(0, charIndexRef.current - 1);
        setTypewriterText(sentence.substring(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          isDeletingRef.current = false;
          typewriterTimeoutRef.current = window.setTimeout(step, 600);
          return;
        }
      } else {
        charIndexRef.current = Math.min(sentence.length, charIndexRef.current + 1);
        setTypewriterText(sentence.substring(0, charIndexRef.current));

        if (charIndexRef.current === sentence.length) {
          isDeletingRef.current = true;
          typewriterTimeoutRef.current = window.setTimeout(step, 2200);
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

  return (
    <>
      <SiteHeader activeTop="drawer" />

      <div className="main-container">
        <main className="goodies-section">
          <div className="goodies-hero">
            <div className="goodies-title">好东西</div>
            <div className="goodies-subtitle">
              <span className="typewriter-text">{typewriterText}</span>
              <span className="typewriter-cursor" />
            </div>
          </div>

          <div className="goodies-grid">
            {GOODIES_VISIBLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/goodies/${cat.slug}`}
                className="goodies-card"
              >
                <div className="goodies-card-head">
                <div className="goodies-card-title">{cat.label}</div>
                <div className="goodies-card-arrow">→</div>
              </div>
              <div className="goodies-card-desc">{cat.desc}</div>
              <div className="goodies-card-meta">
                进入{cat.label}清单
              </div>
            </Link>
          ))}
        </div>
        </main>

        <SiteSidebar />
      </div>

      <SiteFooter />
    </>
  );
}
