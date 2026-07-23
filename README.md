# Astro Starter Kit: Blog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/astro-blog-starter-template)

![Astro Template Preview](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

<!-- dash-content-start -->

Create a blog with Astro and deploy it on Cloudflare Workers as a [static website](https://developers.cloudflare.com/workers/static-assets/).

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support
- ✅ Built-in Observability logging

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/astro-blog-starter-template
```

A live public deployment of this template is available at [https://astro-blog-starter-template.templates.workers.dev](https://astro-blog-starter-template.templates.workers.dev)

## 🚀 Project Structure

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                           | Action                                           |
| :-------------------------------- | :----------------------------------------------- |
| `npm install`                     | Installs dependencies                            |
| `npm run dev`                     | Starts local dev server at `localhost:4321`      |
| `npm run build`                   | Build your production site to `./dist/`          |
| `npm run preview`                 | Preview your build locally, before deploying     |
| `npm run astro ...`               | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`         | Get help using the Astro CLI                     |
| `npm run build && npm run deploy` | Deploy your production site to Cloudflare        |
| `npm wrangler tail`               | View real-time logs for all Workers              |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## 内容管理 CMS

作品集项目已接入内置 CMS：D1 保存草稿与已发布版本，图片和视频等静态资源保存在 `public/projects/`。管理员从 `/cms` 登录，编辑时访问草稿预览，点击“发布”后公开页面才会更新。

本地首次使用：

```bash
cp .dev.vars.example .dev.vars
npm run cms:migrate:local
npm run dev
```

在 `.dev.vars` 中设置本地管理员密码与足够长的随机 `CMS_SESSION_SECRET`，该文件不会提交到 Git。

Cloudflare 首次部署：

```bash
npx wrangler login
npx wrangler d1 create cyrene-cms
```

将 D1 创建命令返回的真实 `database_id` 写入 `wrangler.json`，替换全零占位 ID。然后配置生产密钥、应用 migration 并部署：

```bash
npx wrangler secret put CMS_PASSWORD
npx wrangler secret put CMS_SESSION_SECRET
npm run cms:migrate:remote
npm run build
npm run deploy
```

CMS 不负责上传静态资源。新增图片或视频时先放入 `public/projects/<项目目录>/` 并部署代码，再在编辑器中填写以 `/projects/` 开头的资源路径。不要把管理员密码、Session Secret 或 Cloudflare Token 写入源码或 `wrangler.json`。
