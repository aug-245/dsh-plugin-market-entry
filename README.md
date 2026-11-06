# dsh-plugin-market-entry

在 DeepSeek Harness 的左侧栏添加一个 **插件市场** 入口按钮，点击后在主区域打开插件市场页面。

An entry button for the plugin market in the DeepSeek Harness left sidebar. Clicking it opens the market in the main panel.

## 功能 / Features

- 左侧栏新增「插件市场 / Plugin Market」图标按钮，位于官方 **Plugins** 与 **Schedules** 两个入口之间（`order: 1`）。
- 点击进入主区域的插件市场页面：如果当前 profile 已安装 [dshmarket](https://github.com/dsh-market/dsh-market)（DSH Desktop 默认预置），页面直接渲染该市场自己的完整界面（浏览、搜索、安装、更新），无需离开当前窗口。
- 若市场插件不存在或被禁用，面板显示一个本地化的落地卡片，提供「打开插件管理」按钮跳转到宿主自带的插件页。
- 中文 / English 文案跟随界面语言，颜色只使用 DSH 主题 token（`--dsw-alias-*`），随明暗主题切换。

## 安装 / Install

从市场安装（推荐）：在插件页的 **发现 / Discover** 中找到本插件并安装。

手动安装：

```sh
dsh plugin add git+https://github.com/aug-245/dsh-plugin-market-entry.git
```

安装后刷新页面（或按宿主提示重启）即可看到侧边栏图标。

## 实现 / How it works

- `cordis.patch.yml` 插入 bundle 行 `plugin-market-entry`。
- `client.js` 通过 `window.__ModuleLoader__` 注册客户端模块：在 `sidebar.panellist` 槽位注册图标，在 `main` 槽位注册同名 key 的面板组件，并用 Client locale 服务提供中英文文案。
- 面板通过客户端服务 `ctx.get('market')` 复用已安装市场的渲染入口 `market.render({ surface: 'sidebar' })`；服务不可用时渲染降级卡片。

## 许可 / License

MIT
