"use client";

import { useEffect, useState } from "react";

const SITE_START_DATE = "2026-01-30";

function formatClock(now: Date) {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function SiteFooter() {
  const [runtimeDays, setRuntimeDays] = useState(0);
  const [currentTime, setCurrentTime] = useState("--:--:--");

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

  return (
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
  );
}

