## 总规范

- 说明性内容（例如提交说明、文档、注释、mermaid），以中文为主，专有名词、约定俗称可用英文

## Markdown 规范

- 不使用`---`分割器
- `# Heading` 一级标题仅用于开头
- mermaid 节点名用英文字符

## 代码规范

- 避免嵌套结构
- 特殊的、非常规的需要写注释
- 变量、函数名、Docstring 用全英文
- 同一事物用统一表达
- 使用的依赖越少越好
- 选用简单直接的方式实现
- 代码、执行方式改变，调整已有的文档、计划，而非新建

## Shell 规范

- 优先使用、提供 Git Bash 执行所有 Shell 命令
- Windows 路径在 Bash 命令中优先使用正斜杠形式

## 项目概览

- 本项目是基于 Astro 5、TypeScript 和原生 CSS/JavaScript 的个人作品集与博客网站
- 部署目标为 Cloudflare Workers，适配器配置位于 `astro.config.mjs`，部署配置位于 `wrangler.json`
- 项目使用文件路由；`src/pages/` 中的 `.astro`、`.js` 文件会按目录和文件名生成 URL
- 页面以中文内容为主，品牌名称全局统一使用 `Cyrene 文无`，不要使用其他名称或缩写
- 当前 UI 主要直接写在各 `.astro` 文件内，包括页面结构、局部或全局样式以及浏览器脚本；没有 React、Vue 等客户端框架

## 目录结构

```text
.
├── public/                  # 原样复制到构建产物的字体、图片等静态资源
│   ├── fonts/               # Atkinson 字体文件
│   └── projects/            # 各作品案例使用的图片，按项目名分目录
├── src/
│   ├── components/          # 可复用 Astro 组件
│   ├── content/blog/        # Markdown/MDX 博客正文
│   ├── data/projects.ts     # 作品案例的类型定义与核心数据源
│   ├── layouts/             # 博客文章布局
│   ├── pages/               # Astro 文件路由与主要业务页面
│   ├── styles/global.css    # 由 BaseHead 引入的全局基础样式
│   ├── consts.ts            # 站点标题、描述等全局常量
│   └── content.config.ts    # blog 内容集合及 frontmatter 校验规则
├── astro.config.mjs         # Astro、MDX、sitemap、Cloudflare 配置
├── package.json             # 依赖、Node 版本与项目命令
├── tsconfig.json            # TypeScript 配置
└── wrangler.json            # Cloudflare Workers 配置
```

以下目录是安装或构建生成物，不应手工修改：

- `node_modules/`：npm 依赖
- `.astro/`：Astro 缓存和生成的类型
- `dist/`：生产构建产物
- `.wrangler/`：Wrangler 本地状态

## 页面与路由

- `/` → `src/pages/index.astro`：首页
- `/about` → `src/pages/about.astro`：个人介绍页
- `/contact` → `src/pages/contact.astro`：联系页
- `/portfolio-coaching` → `src/pages/portfolio-coaching.astro`：作品集辅导服务入口
- `/portfolio-projects` → `src/pages/portfolio-projects.astro`：作品集辅导案例列表
- `/layout-projects` → `src/pages/layout-projects.astro`：排版辅导案例列表
- `/interactive-projects` → `src/pages/interactive-projects.astro`：交互技术案例列表
- `/projects/[slug]` → `src/pages/projects/[slug].astro`：由 `projects.ts` 生成的案例详情页
- `/projects/local` → `src/pages/projects/local.astro`：开发环境中创建的本地案例详情页
- `/blog` → `src/pages/blog/index.astro`：博客列表
- `/blog/[...slug]` → `src/pages/blog/[...slug].astro`：博客文章详情
- `/rss.xml` → `src/pages/rss.xml.js`：博客 RSS

## 数据流与组件关系

- `src/data/projects.ts` 是正式作品案例的单一数据源。新增或修改正式案例时，同时检查列表筛选、详情路由和 `public/projects/` 下的图片
- `portfolio-projects.astro`、`layout-projects.astro`、`interactive-projects.astro` 会按 `service` 字段筛选作品数据
- `src/components/ProjectCollection.astro` 负责复用案例集合 UI；它在开发环境显示新增和编辑入口
- 正式 CMS 数据保存在 Cloudflare D1 的 `cms_documents` 表中，包含互相独立的草稿和已发布版本；图片、视频等静态资源保存在 `public/projects/`
- 浏览器 IndexedDB 的 `portfolio-local-editor` 只用于兼容迁移旧的 Dev 草稿，不再是上线内容的数据源
- `src/content/blog/` 是博客内容源，支持 `.md` 与 `.mdx`；frontmatter 必须符合 `src/content.config.ts` 中的 schema
- 博客文章通过 `src/layouts/BlogPost.astro` 统一渲染；博客列表、RSS 和详情路由都通过 `getCollection('blog')` 读取同一内容集合
- `src/components/BaseHead.astro` 负责通用 head、SEO 元数据并引入 `src/styles/global.css`
- `Header.astro`、`Footer.astro` 主要服务于模板博客页面；定制作品集页面多使用各自的内联导航和页脚

## 已确认的项目页面框架

当前 `/portfolio-projects` 列表页及其通往 `/projects/[slug]` 详情页的整体框架已经确认正确。后续修改以现有实现为基准，除非需求明确要求重新设计，否则不要更换页面结构、主题或导航方式。

### 项目陈列页

- 页面文件为 `src/pages/portfolio-projects.astro`
- 保留深灰色背景、浅色文字、顶部四项导航、大标题介绍区、三列项目卡片、底部联系入口和页脚
- 桌面端项目网格为三列，移动端在 `720px` 及以下切换为单列
- 每张正式项目卡片由 `.project-card-wrap` 包裹，必须设置 `data-project-id={project.slug}`
- 卡片主体必须使用真实链接 `<a class="project-card">`，地址固定为 `/projects/${project.slug}`；不要使用 `#`、按钮点击模拟跳转或阻止正常链接事件
- 封面优先读取 `project.images[0]`，没有图片时才使用对应颜色的抽象占位图形
- 卡片依次显示项目序号、标题、院校、专业、申请季和摘要
- `编辑` 与 `新增` 控件只在 `import.meta.env.DEV` 为真时出现，不得进入正式构建页面

### 正式项目详情页

- 页面模板为 `src/pages/projects/[slug].astro`
- `getStaticPaths()` 必须遍历 `src/data/projects.ts`，使用 `project.slug` 同时生成路由参数和页面 props
- `Entecavir Odyssey` 使用 slug `designing-a-portfolio-story`，正确详情地址为 `/projects/designing-a-portfolio-story`
- 详情页保留返回按钮、品牌导航、项目序号与服务类型、项目标题、图片轮播、副标题、简介、成果、辅导老师、咨询入口和页脚
- `project.images` 有内容时显示轮播；没有图片时显示由 `project.color` 控制的抽象占位视觉
- 轮播保留横向滚动、前后按钮、分页点以及桌面端和移动端的不同比例
- 正式详情内容来自 `projects.ts`；开发环境的详情编辑器只覆盖当前浏览器显示，不替代源码数据

### 本地项目与链接完整性

- 管理员从 `/cms` 登录；只有通过服务端鉴权后才能读取草稿、保存、上传图片或发布
- D1 binding 固定为 `CMS_DB`，数据库 migration 位于 `migrations/`
- 开发环境历史编辑数据保存在 IndexedDB 的 `portfolio-local-editor` 数据库中，`portfolio-projects.astro` 使用键 `local-project-list-v2`；旧 Base64 图片不能发布，必须先另存为文件并放入 `public/projects/`
- 正式项目 ID 就是 `project.slug`，链接回退规则为 `/projects/${item.id}`
- CMS 新增项目 ID 以 `local-` 开头，但发布后仍使用统一动态详情链接 `/projects/${item.id}`；`/projects/local` 只兼容尚未迁移的旧 IndexedDB 项目
- 从 DOM 建立默认数据时，必须从 `.project-card` 锚点读取 `href`，不能从外层 `.project-card-wrap` 读取，因为外层元素没有 `href`
- 从 IndexedDB 恢复数据时，如果链接为空或为 `#`，必须根据正式项目或本地项目的 ID 规则重建链接
- 项目卡片的普通点击不能调用 `preventDefault()`；只有点击新增按钮或独立的编辑按钮时才允许阻止默认事件并打开编辑器
- 草稿列表中的所有项目链接必须携带 `?cms=draft`；新项目发布前只存在草稿数据中，丢失该参数会导致详情页按线上数据查询不到项目
- 已登录管理员访问一个只存在于草稿中的项目时，详情路由应自动跳转到同一路径的 `?cms=draft`，不能显示错误页
- 修改列表、本地存储或详情路由后，至少验证 Entecavir 卡片能够从 `/portfolio-projects` 进入 `/projects/designing-a-portfolio-story`

## CMS 发布约定

- `src/lib/cms.ts` 是 CMS 数据、鉴权和草稿/发布操作的服务端入口
- `/api/cms/login` 与 `/api/cms/logout` 管理管理员 Session；Session Cookie 必须保持 `HttpOnly` 和 `SameSite=Strict`
- `/api/cms/projects?mode=draft` 只有管理员可读；不带 draft 参数时返回公开的已发布数据
- `PUT /api/cms/projects` 只保存草稿，不得直接影响访客页面
- `POST /api/cms/projects` 才将当前草稿复制为已发布版本
- CMS 不提供在线文件上传；项目数据只保存 `/projects/` 开头的静态资源路径，不保存 Base64、Blob 或二进制内容
- 新增图片和视频时放入 `public/projects/<project-slug>/`，先部署静态资源，再在 CMS 编辑器中填写资源路径
- `scripts/generate-project-assets.mjs` 会扫描 `public/projects/` 并生成 `src/data/project-assets.ts`；`predev` 与 `prebuild` 会自动执行，CMS 通过 `/api/cms/assets` 获取可选择的资源列表
- 资源选择 API 仅允许已登录管理员访问；封面单选图片，详情轮播支持多选图片和视频
- `src/data/projects.ts` 保留为首次种子与 D1 不可用时的只读回退数据，不再是 CMS 编辑后的唯一正式数据源
- 不允许在客户端代码中出现 `CMS_PASSWORD`、`CMS_SESSION_SECRET` 或 Cloudflare API Token
- 本地开发前运行 `npm run cms:migrate:local`，首次正式部署前运行 `npm run cms:migrate:remote`
- CMS 相关修改至少验证：登录失败与成功、未登录草稿请求返回 401、草稿保存、发布、公开列表、动态详情页以及静态图片/视频路径

## 静态资源约定

- `public/` 下的资源通过站点根路径引用，例如 `public/projects/entecavir/01.png` 对应 `/projects/entecavir/01.png`
- 不要在代码中写 `public/` 前缀，也不要 import 该目录下的文件
- 新增正式案例图片时，优先放在 `public/projects/<project-slug>/`，文件名保持稳定并在 `projects.ts` 中登记
- 图片路径区分大小写；Cloudflare 部署环境下必须与磁盘文件名完全一致

## 常用命令

所有命令都从仓库根目录执行：

```bash
npm run dev        # 启动 Astro 开发服务器
npm run build      # 构建到 dist/
npm run check      # 构建、TypeScript 检查和 Wrangler dry-run
npm run preview    # 构建后通过 Wrangler 本地预览
npm run deploy     # 部署到 Cloudflare Workers
npm run cf-typegen # 重新生成 Cloudflare 类型
```

项目要求 Node.js 22 或更高版本。完成代码修改后至少运行 `npm run build`；涉及类型、Cloudflare 配置或部署行为时运行 `npm run check`。

## 修改约定

- 新页面放入 `src/pages/`，可复用 UI 优先抽到 `src/components/`
- 修改案例字段时同步更新 `Project` 类型、所有数据项和消费该字段的页面
- 修改博客 frontmatter schema 时同步检查 `src/content/blog/` 中的全部文章
- 全局视觉基础放在 `src/styles/global.css`；只服务单个页面的样式保留在对应 `.astro` 文件中
- 保持 Astro 的服务端模板与浏览器脚本边界清晰，访问 `window`、`document`、`indexedDB` 等浏览器 API 的代码只放在客户端 `<script>` 中
- 不直接编辑生成目录；验证构建结果后也不提交 `dist/`、`.astro/`、`.wrangler/` 或 `node_modules/`
- 当前 `astro.config.mjs` 的 `site` 仍为 `https://example.com`；涉及 canonical URL、sitemap、RSS 或正式部署域名时先确认并更新该值
