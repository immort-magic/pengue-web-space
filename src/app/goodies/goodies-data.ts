export const GOODIES_CATEGORIES = [
  { slug: "goods", label: "好物", desc: "用过、喜欢、会回购的东西。" },
  { slug: "apps", label: "应用", desc: "提升效率的日常应用清单。" },
  { slug: "sites", label: "网站", desc: "经常打开的宝藏站点合集。" },
  { slug: "plugins", label: "插件", desc: "浏览器/编辑器的好用插件。" },
  { slug: "diy", label: "Diy", desc: "折腾与小制作，记录过程与方案。" },
] as const;

export type GoodiesCategorySlug = (typeof GOODIES_CATEGORIES)[number]["slug"];

export type GoodiesItem = {
  id: string;
  title: string;
  icon?: string;
  desc: string;
  tags: string[];
  href?: string;
  badge?: string;
};

export const GOODIES_ITEMS: Record<GoodiesCategorySlug, GoodiesItem[]> = {
  goods: [],
  apps: [
    {
      id: "apps-mos",
      title: "Mos",
      icon: "🖱️",
      desc: "macOS 上的鼠标平滑滚动工具。",
      tags: ["macOS", "效率"],
      href: "https://mos.caldis.me/",
      badge: "常用",
    },
    {
      id: "apps-bob",
      title: "Bob",
      icon: "🌏",
      desc: "macOS 上的截图翻译工具。",
      tags: ["macOS", "翻译"],
      href: "https://bobtranslate.com/",
    },
    {
      id: "apps-pixpin",
      title: "PixPin",
      icon: "📷",
      desc: "macOS 上的截图、录屏与 GIF 工具。",
      tags: ["截图", "录屏"],
      href: "https://pixpin.com/",
    },
    {
      id: "apps-cherry-studio",
      title: "Cherry Studio",
      icon: "🍒",
      desc: "模型 API 管理与调用的桌面工具。",
      tags: ["模型", "API"],
      href: "https://cherry-ai.com/",
    },
    {
      id: "apps-cc-switch",
      title: "CC Switch",
      icon: "🔁",
      desc: "快速切换模型 API 的工具。",
      tags: ["模型", "效率"],
      href: "https://github.com/farion1231/cc-switch",
    },
    {
      id: "apps-lightning-say",
      title: "闪电说",
      icon: "⚡️",
      desc: "语音转文字的效率工具。",
      tags: ["语音", "转写"],
      href: "https://shandianshuo.cn/",
    },
  ],
  sites: [
    {
      id: "sites-lks",
      title: "LKS 推荐集合",
      icon: "🌐",
      desc: "优质工具与网站的推荐集合。",
      tags: ["合集", "推荐"],
      href: "https://xiangjianan.github.io/lks/",
      badge: "推荐",
    },
  ],
  plugins: [
    {
      id: "plugins-immersive-translate",
      title: "PDF 沉浸式翻译",
      icon: "📄",
      desc: "阅读 PDF 时的沉浸式翻译插件。",
      tags: ["阅读", "翻译"],
      href: "https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh?hl=zh-CN",
      badge: "必装",
    },
    {
      id: "plugins-global-speed",
      title: "Global Speed",
      icon: "⏩",
      desc: "浏览器全局播放速度控制。",
      tags: ["视频", "效率"],
      href: "https://chromewebstore.google.com/detail/global-speed-video-speed/jpbjcnkcffbooppibceonlgknpkniiff",
    },
    {
      id: "plugins-tampermonkey",
      title: "油猴子",
      icon: "🐵",
      desc: "强大的用户脚本管理器。",
      tags: ["脚本", "浏览器"],
      href: "https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN&utm_source=chrome-ntp-launcher",
    },
  ],
  diy: [],
};

export const GOODIES_VISIBLE_CATEGORIES = GOODIES_CATEGORIES.filter(
  (cat) => (GOODIES_ITEMS[cat.slug] ?? []).length > 0,
);
