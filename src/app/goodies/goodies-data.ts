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
  desc: string;
  tags: string[];
  href?: string;
  badge?: string;
};

const PLACEHOLDER = "#";

export const GOODIES_ITEMS: Record<GoodiesCategorySlug, GoodiesItem[]> = {
  goods: [
    {
      id: "goods-1",
      title: "人体工学椅（占位）",
      desc: "久坐也更舒服：腰靠、扶手与坐深调节都很关键。",
      tags: ["桌搭", "健康", "性价比"],
      href: PLACEHOLDER,
      badge: "推荐",
    },
    {
      id: "goods-2",
      title: "桌面台灯（占位）",
      desc: "显色高、无频闪，晚上写代码眼睛更轻松。",
      tags: ["桌搭", "护眼"],
      href: PLACEHOLDER,
    },
    {
      id: "goods-3",
      title: "降噪耳机（占位）",
      desc: "通勤/办公的专注神器，配合白噪音更稳。",
      tags: ["通勤", "专注"],
      href: PLACEHOLDER,
    },
    {
      id: "goods-4",
      title: "键鼠套装（占位）",
      desc: "手感与效率兼顾：键程、配列与连接稳定性。",
      tags: ["生产力", "桌搭"],
      href: PLACEHOLDER,
    },
  ],
  apps: [
    {
      id: "apps-1",
      title: "任务管理（占位）",
      desc: "把一天拆成可执行的最小步骤，减少拖延。",
      tags: ["效率", "GTD"],
      href: PLACEHOLDER,
      badge: "常用",
    },
    {
      id: "apps-2",
      title: "笔记系统（占位）",
      desc: "沉淀输出：结构化笔记 + 双向链接更好用。",
      tags: ["写作", "知识库"],
      href: PLACEHOLDER,
    },
    {
      id: "apps-3",
      title: "截图标注（占位）",
      desc: "随手截、随手标、随手发，沟通成本更低。",
      tags: ["协作", "效率"],
      href: PLACEHOLDER,
    },
    {
      id: "apps-4",
      title: "时间追踪（占位）",
      desc: "记录时间去向，反向优化自己的节奏。",
      tags: ["习惯", "复盘"],
      href: PLACEHOLDER,
    },
  ],
  sites: [
    {
      id: "sites-1",
      title: "灵感库（占位）",
      desc: "设计/排版/配色灵感随手收藏。",
      tags: ["设计", "灵感"],
      href: PLACEHOLDER,
    },
    {
      id: "sites-2",
      title: "工具箱（占位）",
      desc: "在线小工具集合：格式化、转换、校验。",
      tags: ["工具", "效率"],
      href: PLACEHOLDER,
      badge: "收藏",
    },
    {
      id: "sites-3",
      title: "摄影参考（占位）",
      desc: "构图与用光参考，快速找到方向。",
      tags: ["摄影", "灵感"],
      href: PLACEHOLDER,
    },
    {
      id: "sites-4",
      title: "学习清单（占位）",
      desc: "高质量教程与文档入口，避免信息噪音。",
      tags: ["学习", "技术"],
      href: PLACEHOLDER,
    },
  ],
  plugins: [
    {
      id: "plugins-1",
      title: "广告拦截（占位）",
      desc: "更干净的浏览体验，减少干扰。",
      tags: ["浏览器", "专注"],
      href: PLACEHOLDER,
    },
    {
      id: "plugins-2",
      title: "沉浸阅读（占位）",
      desc: "一键阅读模式，长文更舒服。",
      tags: ["阅读", "浏览器"],
      href: PLACEHOLDER,
      badge: "必装",
    },
    {
      id: "plugins-3",
      title: "Git 增强（占位）",
      desc: "可视化提交历史与 blame，排查更快。",
      tags: ["开发", "VS Code"],
      href: PLACEHOLDER,
    },
    {
      id: "plugins-4",
      title: "代码格式化（占位）",
      desc: "统一风格，减少无意义的 diff。",
      tags: ["开发", "规范"],
      href: PLACEHOLDER,
    },
  ],
  diy: [
    {
      id: "diy-1",
      title: "NAS/家用服务器（占位）",
      desc: "媒体库、备份、自动化，一次折腾长期收益。",
      tags: ["折腾", "家庭"],
      href: PLACEHOLDER,
      badge: "项目",
    },
    {
      id: "diy-2",
      title: "键盘改造（占位）",
      desc: "轴体、卫星轴、消音与手感调教记录。",
      tags: ["桌搭", "手作"],
      href: PLACEHOLDER,
    },
    {
      id: "diy-3",
      title: "树莓派小项目（占位）",
      desc: "监控、传感器、信息面板……想法都能落地。",
      tags: ["硬件", "开发"],
      href: PLACEHOLDER,
    },
    {
      id: "diy-4",
      title: "工作流自动化（占位）",
      desc: "脚本/快捷指令，把重复操作一次性解决。",
      tags: ["效率", "自动化"],
      href: PLACEHOLDER,
    },
  ],
};

