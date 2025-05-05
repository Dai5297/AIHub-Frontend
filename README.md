# AIHub Frontend Project

# AIHub 前端项目

- AIHUB后端项目 [传送门](https://github.com/Dai5297/AIHub-Backend)
- 项目在线地址: [传送门](https://aihub.daiai.top)

## 🌐 项目简介

AIHub 是一个基于 Vue 3 的多场景智能对话平台，提供以下核心功能：
- **ChatAI**：通用人工智能助手，支持联网搜索。
- **ChatMedical**：医疗咨询助手，基于知识图谱的语义解析。
- **ChatTravel**：出行规划助手，集成 MCP（多条件路径规划）服务。
- **ChatPDF**：PDF 文档问答助手，支持上传并解析 PDF 内容。

项目采用模块化架构设计，支持快速切换不同对话场景、聊天记录管理、PDF 文件解析及实时消息流渲染。

## 🧠 核心功能与模块说明

### 🤖 ChatAI - 通用对话助手
- **功能描述**：提供自然语言对话体验，支持联网搜索功能。
- **技术实现**：
  - 集成搜索引擎 API 实现实时联网搜索。
  - 使用 Axios 拦截器实现流式响应。
  - 基于 SSE 协议实现实时数据推送。
- **用户价值**：帮助用户获取最新互联网信息，解答广泛问题。

### 🏥 ChatMedical - 医疗咨询助手
- **功能描述**：基于医疗知识图谱的语义解析系统，提供专业医疗建议。
- **技术实现**：
  - 使用 Neo4j 图数据库存储和查询关系数据。
  - 实现自然语言到 Cypher 查询的自动转换。
- **用户价值**：辅助用户理解健康问题，提供初步诊断建议。

### 🚗 ChatTravel - 出行规划助手
- **功能描述**：集成 MCP（多条件路径规划）服务，支持多模态出行方案推荐。
- **技术实现**：
  - 集成高德地图 API 实现出行路线规划。
  - 支持语音指令解析与多条件权重配置。
- **用户价值**：为用户提供最优出行路径，提升出行效率。

### 📄 ChatPDF - PDF 文档问答助手
- **功能描述**：支持上传 PDF 文件，提取关键信息并进行问答交互。
- **技术实现**：
  - 使用 PDF.js 解析 PDF 文档结构。
  - 结合 TF-IDF 算法提取关键文本信息。
- **用户价值**：帮助用户快速从 PDF 中获取所需信息，节省时间。

## ⚙️ 技术栈

| 类别             | 工具/框架                  | 版本     | 用途说明                             |
|------------------|----------------------------|----------|--------------------------------------|
| 核心框架         | Vue                        | 3.5.13   | 渐进式 JavaScript 框架               |
| 路由管理         | Vue Router                 | 4.5.0    | 单页面应用路由管理                   |
| UI 组件库        | Element Plus               | 2.9.7    | 企业级 UI 组件库                     |
| 状态管理         | Pinia                      | 3.0.1    | Vue 官方推荐的状态管理库             |
| HTTP 客户端      | Axios                      | 1.8.4    | Promise-based HTTP 客户端            |
| 构建工具         | Vite                       | 6.2.1    | 新一代前端构建工具                   |
| 开发调试         | Vite Vue Devtools          | 7.7.2    | Vue 开发调试插件                     |
| Markdown 解析    | Marked                     | 15.0.7   | Markdown 文本解析                    |
| 代码格式化       | Prettier                   | 3.5.3    | 代码风格统一工具                     |
| 图数据库         | Neo4j                      | —        | 存储医疗知识图谱                     |
| 地图服务         | 高德地图 API               | —        | 提供出行路线规划                     |
| 文件解析         | PDF.js                     | —        | PDF 文档解析                         |
| 文本处理         | TF-IDF 算法                | —        | 关键信息提取                         |
| 图标库           | @element-plus/icons-vue    | 2        | UI 图标资源                          |
| 代码高亮         | highlight.js               | 11       | 代码语法高亮                         |

## 🚀 快速入门指南

### 🔧 环境要求
- Node.js v18+
- npm v9+ 或 yarn
- 现代浏览器（推荐 Chrome 120+）

### 📦 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-repo/aihub-frontend.git

# 进入项目目录
cd aihub-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 📁 项目结构

```
AIHub-Frontend/
├── src/                 # 核心源码
│   ├── api/            # 接口模块
│   ├── assets/         # 静态资源
│   ├── components/     # 通用组件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia状态管理
│   └── views/          # 页面视图
├── vite.config.js      # Vite配置
└── package.json        # 依赖管理
```

## 🧑‍💻 开发者指引

### 💡 组件开发规范
- 使用 Composition API 编写组件逻辑。
- 组件命名采用大驼峰式（PascalCase）。
- 公共组件统一放在 `/src/components` 目录下。

### 🔄 API 调用规范
- 所有接口统一管理在 `/src/api` 目录中。
- 使用 `async/await` 处理异步请求。
- 推荐使用 Axios 封装拦截器和错误处理。

### 🎨 样式规范
- 使用 Element Plus 提供的布局系统和样式类。
- 自定义样式统一写在 `/src/assets/main.css` 文件中。
- 推荐使用 Tailwind CSS 辅助编写现代 UI。

如需了解后端服务，请查看 [AIHUB后端项目](https://github.com/Dai5297/AIHub-Backend)。