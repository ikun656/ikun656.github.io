# ikun656 工具站

纯前端、个人维护的轻量工具集合，部署在 GitHub Pages，无后端、无账号体系。所有工具计算都在浏览器本地完成。

## 工具清单

| 工具 | 路径 | 说明 |
| --- | --- | --- |
| 主页（站点介绍） | `index.html` | SPA 导航 + 数据驱动渲染 |
| JSON 格式化器 | `json/json-formatter.html` | 格式化、压缩、校验、转义、自定义缩进 |
| Base64 编解码 | `base64/base64.html` | 文本与 Base64 互转，支持 URL-safe |
| 时间戳转换 | `timestamp/timestamp.html` | 时间戳↔日期，秒/毫秒自动判断，本地与 UTC |
| VSIX 下载加速器 | `vsix-downloader/vsix.html` | 从 VS Code 插件市场拉取扩展安装包 |
| Cloud 文件下载 | `download/cloud-downloader.html` | 列出仓库 `cloud` 目录文件，代理加速下载 |
| 软件下载站 | `download/software-downloader.html` | F-Droid / Termux / NewPipe 等下载入口 |

## 目录结构

```
ikun656.github.io/
├── index.html              # 主页 SPA（左侧导航 + hash 切页）
├── content.json            # 导航/品牌/公告/页面文案（cms.js 读取渲染）
├── cms.js                  # 数据驱动渲染
├── policy.js               # 政策同意遮罩（自动注入，所有页面共用）
├── theme.css / theme.js    # 暗色模式（Cookie 记忆，head 防闪）
├── assets/icons/*.svg      # 按钮/导航图标（CSS mask 实现）
├── json/  base64/  timestamp/   # 独立工具子页面
├── vsix-downloader/  download/  # 既有独立子页面
├── cloud/                  # Cloud 下载器的公开文件目录
└── home.jpg                # 站点 logo
```

## 架构说明

- **主页 SPA**：`index.html` 用左侧导航 + `hash` 切换 `<div class="page">` 区块；导航项、文案来自 `content.json`，由 `cms.js` 渲染。
- **独立子页面**：各工具是独立 HTML 文件，主页用 `<a>` 真实跳转，保持每个工具可单独分享。
- **共用逻辑**：
  - `policy.js` 自动向每个页面注入政策遮罩（若页面已有 `#policyOverlay` 则不重复注入），读取/写入 `policy_agreed` Cookie（365 天）。
  - `theme.js` 提供暗色模式切换，偏好存 `theme_pref` Cookie；`<head>` 内联防闪脚本在渲染前应用主题。
- **访问统计**：不蒜子（busuanzi）第三方服务，Cookie 去重 UV/PV，页脚展示。详见站内隐私政策。
- **图标**：本地 `assets/icons/*.svg` 用 CSS `mask` + `--ico` 变量着色。

## 本地预览

纯静态，任意静态服务器即可，注意根路径（`/` 绝对引用资源）：

```bash
cd ikun656.github.io
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/
```

## 许可证

代码以公开方式托管，供学习参考，可个人修改二次开发，不得用于商业用途或恶意传播。
