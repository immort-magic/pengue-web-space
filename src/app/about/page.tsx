import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import SiteSidebar from "../components/SiteSidebar";

import AboutChat from "./AboutChat";

export default function AboutPage() {
  return (
    <>
      <SiteHeader activeTop="drawer" />

      <div className="main-container">
        <main className="about-section">
          <div className="about-hero">
            <div className="about-title">关于我</div>
            <div className="about-subtitle">
              这里是我的数字分身。你可以直接对话，了解我的项目与想法。
            </div>
          </div>

          <AboutChat />
        </main>

        <SiteSidebar />
      </div>

      <SiteFooter />
    </>
  );
}
