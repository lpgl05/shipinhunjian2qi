# AI视频混剪平台

一个基于Vue 3 + TypeScript的智能视频混剪创作平台，融合了Genspark的科技感和Tunee的流畅交互体验。

## ✨ 功能特性

### 🎯 核心功能

- **智能体广场** - 模仿Genspark的现代化首页设计，提供多种AI智能体选择
- **对话式创作** - 参考Tunee的自然交互方式，通过对话完成视频创作
- **实时预览** - 专业的视频播放器，支持实时预览和精细化编辑
- **素材管理** - 完善的资源管理系统，支持文件夹、搜索和多种视图模式
- **字幕编辑** - 可视化字幕编辑器，支持时间码调整和样式定制
- **片段微调** - 精准的视频片段剪辑，支持入出点调整和音量控制
- **智能配乐** - AI推荐背景音乐，支持音量混合和淡入淡出效果

### 🎨 UI/UX亮点

- **深色主题** - 专业的深色配色方案，护眼且美观
- **渐变效果** - 品牌渐变色(蓝色到紫色)贯穿整个设计
- **流畅动画** - 所有交互都有精心设计的过渡动画
- **响应式设计** - 完美适配不同屏幕尺寸
- **拖拽排序** - 支持视频片段的拖拽重排
- **毛玻璃效果** - 现代化的backdrop-blur效果

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI框架**: Tailwind CSS
- **组件库**: Headless UI
- **图标**: lucide-vue-next
- **拖拽**: vuedraggable.next

## 📦 项目结构

\`\`\`
src/
├── assets/                  # 静态资源
├── components/              # 全局组件
│   ├── AgentCard.vue       # 智能体卡片
│   └── AuthModal.vue       # 认证模态框
├── layouts/                 # 布局组件
│   └── WorkspaceLayout.vue # 工作区三栏布局
├── views/                   # 页面组件
│   ├── HomePage.vue        # 首页（智能体广场）
│   └── WorkspacePage/      # 工作台页面
│       └── components/     # 工作台子组件
│           ├── AppSidebar.vue        # 左侧导航栏
│           ├── ChatCanvas.vue        # 对话画布
│           ├── ChatMessage.vue       # 聊天消息
│           ├── RightPanel.vue        # 右侧预览面板
│           ├── VideoPlayer.vue       # 视频播放器
│           ├── SubtitleEditor.vue    # 字幕编辑器
│           ├── ClipFineTuner.vue     # 片段微调器
│           ├── BackgroundMusic.vue   # 背景音乐
│           ├── AssetManager.vue      # 素材管理器
│           └── UGI/                  # 生成式UI组件
│               ├── SelectOptions.vue
│               └── VideoTimeline.vue
├── store/                   # Pinia状态管理
│   ├── auth.ts             # 用户认证
│   ├── chat.ts             # 聊天消息
│   ├── video.ts            # 视频时间线
│   └── asset.ts            # 素材管理
├── router/                  # 路由配置
├── style.css               # 全局样式
└── main.ts                 # 应用入口
\`\`\`

## 🚀 快速开始

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:5173 查看应用

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 预览生产构建

\`\`\`bash
npm run preview
\`\`\`

## 🎨 设计规范

### 色彩系统

| 用途 | 变量名 | 颜色值 | Tailwind类 |
|------|--------|--------|------------|
| 主背景 | bg-primary | #111827 | bg-gray-900 |
| 次背景 | bg-secondary | #1F2937 | bg-gray-800 |
| 卡片/浮层 | surface | #374151 | bg-gray-700 |
| 主文本 | text-primary | #F9FAFB | text-gray-50 |
| 次文本 | text-secondary | #9CA3AF | text-gray-400 |
| 品牌色 | primary-accent | #3B82F6 → #8B5CF6 | gradient |

### 交互状态

- **主按钮**: 渐变背景 + 悬停放大 + 点击缩小
- **输入框**: 聚焦时蓝色边框 + 发光效果
- **卡片**: 悬停时边框高亮 + 轻微放大

## 📝 开发指南

### 组件开发规范

1. 使用 `<script setup>` 语法
2. 使用 TypeScript 进行类型定义
3. 遵循设计文档中的色彩和交互规范
4. 所有组件都应该是响应式的
5. 添加适当的过渡动画

### 状态管理

使用 Pinia 进行状态管理，按功能模块划分：

- `useAuthStore` - 用户认证状态
- `useChatStore` - 聊天消息
- `useVideoStore` - 视频时间线
- `useAssetStore` - 素材资源

### 路由配置

- `/` - 首页（智能体广场）
- `/workspace` - 工作台

## 🔧 待实现功能

- [ ] 后端API集成
- [ ] 实际的视频处理功能
- [ ] 文件上传功能
- [ ] 视频导出功能
- [ ] 用户个人中心
- [ ] 项目保存和管理
- [ ] AI模型集成

## 📄 许可证

本项目仅供学习和演示使用。

## 🙏 致谢

- 设计灵感来自 [Genspark](https://www.genspark.ai) 和 [Tunee](https://www.tunee.ai)
- 使用了优秀的开源项目和工具

---

**开发完成时间**: 2025年10月

**版本**: v1.0.0
