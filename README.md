# AIHub Frontend Project

# AIHub 前端项目

## Project Introduction / 项目简介

AIHub is a Vue 3-based multi-scenario intelligent dialogue platform providing core functionalities including AI assistant, medical consultation, service support, and PDF document Q&A. Built with modular architecture, it supports rapid switching between different conversation scenarios, chat history management, PDF file parsing, and real-time message rendering with typewriter effect.

AIHub 是一个基于 Vue 3 的多场景智能对话平台，提供人工智能助手、医疗咨询、服务支持及 PDF 文档问答等核心功能。通过模块化设计实现不同对话场景的快速切换，支持聊天记录管理、PDF 文件解析及实时消息流渲染。

---

## Core Features / 核心功能

### Multi-scenario Intelligent Dialogue / 多场景智能对话

- General AI Assistant (ChatAI)
- Medical Consultation (ChatMedical)
- Service Support (ChatService)
- PDF Document Q&A (ChatPdf)

### Key Functionalities / 核心功能特性

- Real-time message streaming with typewriter effect
- Chat history management
- PDF file upload & content parsing
- Smart conversation title generation
- Conversation switching & clearing

### Module Technical Details / 模块技术实现

| 模块名称        | 技术实现要点                    | 技术亮点                                                              |
| --------------- | ------------------------------- | --------------------------------------------------------------------- |
| **ChatAI**      | 集成搜索引擎API实现实时联网搜索 | 使用Axios拦截器实现流式响应<br>结合SSE协议进行实时数据推送            |
| **ChatMedical** | 基于医疗知识图谱的语义解析      | 采用Neo4j图数据库存储关系数据<br>实现自然语言到Cypher查询的自动转换   |
| **ChatTravel**  | MCP（多条件路径规划）服务集成   | 集成高德地图API实现多模态出行规划<br>支持语音指令解析与多条件权重配置 |
| **ChatPDF**     | PDF.js解析结合文本向量化        | 实现PDF文档结构解析<br>采用TF-IDF算法进行关键信息提取                 |

---

## Technology Stack / 技术栈

| Category         | Tools & Frameworks                      |
| ---------------- | --------------------------------------- | ----------- | --------------------------------- |
| 分类             | 技术栈                                  | 版本        | 用途说明                          |
| ---------------- | --------------------------------------- | ----------- | --------------------------------- |
| 核心框架         | Vue 3                                   | 3.5.13      | 渐进式JavaScript框架              |
| 路由管理         | Vue Router 4                            | 4.5.0       | 单页面应用路由管理                |
| UI组件库         | Element Plus                            | 2.9.7       | 企业级UI组件库                    |
| 状态管理         | Pinia                                   | 3.0.1       | Vue官方推荐的状态管理库           |
| HTTP客户端       | Axios                                   | 1.8.4       | Promise-based HTTP客户端          |
| 构建工具         | Vite                                    | 6.2.1       | 新一代前端构建工具                |
| 开发调试         | Vite Vue Devtools                       | 7.7.2       | Vue开发调试插件                   |
| Markdown解析     | Marked                                  | 15.0.7      | Markdown文本解析                  |
| 代码格式化       | Prettier                                | 3.5.3       | 代码风格统一工具                  |

---

## 快速入门

### 环境要求

- Node.js v18+
- npm v9+ 或 yarn
- 现代浏览器（推荐Chrome 120+）

### 安装步骤

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

### 项目结构

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

### 开发者指引

1. 组件开发规范：
   - 使用Composition API写法
   - 组件命名采用大驼峰式
   - 公共组件放在/src/components
2. API调用规范：
   - 接口统一管理在/src/api目录
   - 使用async/await处理异步
3. 样式规范：
   - 使用Element Plus布局系统
   - 自定义样式写在assets/main.css
