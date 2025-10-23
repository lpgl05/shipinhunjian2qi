# TRAE AI 项目规则

## 🎯 项目概述
这是一个AI驱动的视频混剪创作平台，使用Vue 3 + TypeScript + Pinia + Tailwind CSS技术栈。TRAE需要遵循以下规则来确保代码质量和项目一致性。

## 🏗️ 技术栈约束

### 必须使用的技术
- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript (严格模式)
- **状态管理**: Pinia
- **样式框架**: Tailwind CSS
- **构建工具**: Vite
- **路由**: Vue Router 4
- **图标**: Lucide Vue Next

### 禁止使用的技术
- Vue 2 Options API
- Vuex (使用Pinia替代)
- 内联样式 (使用Tailwind CSS)
- jQuery或其他DOM操作库

## 📁 文件结构规则

### 组件放置规则
```
src/
├── components/          # 通用可复用组件
├── views/              # 页面级组件
├── layouts/            # 布局组件
├── store/              # Pinia状态管理
├── router/             # 路由配置
└── assets/             # 静态资源
```

### 文件命名规则
- **Vue组件**: PascalCase (如: `AgentCard.vue`)
- **Store文件**: camelCase (如: `auth.ts`)
- **页面组件**: PascalCase + Page后缀 (如: `HomePage.vue`)

## 💻 代码编写规则

### Vue组件结构
```vue
<template>
  <!-- 使用Tailwind CSS类名 -->
  <div class="component-wrapper">
    <!-- 内容 -->
  </div>
</template>

<script setup lang="ts">
// 1. 导入顺序：Vue -> 第三方 -> 本地
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// 2. 接口定义
interface Props {
  title: string
  description?: string
}

// 3. Props和Emits
const props = defineProps<Props>()
const emit = defineEmits<{
  click: [id: string]
}>()

// 4. 响应式数据
const isLoading = ref(false)

// 5. 计算属性
const displayTitle = computed(() => props.title)

// 6. 方法定义
const handleClick = () => {
  emit('click', 'id')
}
</script>
```

### TypeScript规则
- 所有变量和函数必须有明确的类型注解
- 使用interface定义对象类型
- 使用联合类型定义枚举值
- 避免使用any类型

### 状态管理规则
- 每个功能域独立一个Store
- 使用Composition API风格的Pinia
- 状态修改只能通过Actions
- 异步操作必须有错误处理

## 🎨 样式规则

### Tailwind CSS使用规则
- 优先使用Tailwind CSS类名
- 避免自定义CSS，除非Tailwind无法实现
- 使用项目定义的颜色变量
- 响应式设计使用Tailwind断点

### 颜色规范
```css
/* 主色调 */
bg-gray-900     /* 主背景 */
bg-gray-800     /* 次要背景 */
text-gray-50    /* 主文本 */
text-gray-400   /* 次要文本 */

/* 品牌色 */
from-blue-500 to-violet-500  /* 主要渐变 */
```

## 🔧 组件开发规则

### 组件设计原则
1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 通过Props传递数据，避免硬编码
3. **类型安全**: 所有Props和Emits必须有类型定义
4. **性能优化**: 合理使用computed和v-memo

### 组件通信规则
- 父子通信: Props down, Events up
- 跨组件通信: 使用Pinia Store
- 兄弟组件通信: 通过共同的父组件或Store

### 事件命名规则
- 使用动词形式: `click`, `change`, `submit`
- 具体化事件: `agent-select`, `video-upload`

## 📊 状态管理规则

### Store结构规范
```typescript
export const useExampleStore = defineStore('example', () => {
  // ========== 状态 ==========
  const state = ref<StateType>(initialState)
  
  // ========== 计算属性 ==========
  const computedValue = computed(() => state.value.property)
  
  // ========== Actions ==========
  const updateState = (newValue: StateType) => {
    state.value = newValue
  }
  
  return {
    state,
    computedValue,
    updateState
  }
})
```

### 异步操作规范
```typescript
const fetchData = async () => {
  try {
    isLoading.value = true
    const data = await api.getData()
    state.value = data
  } catch (error) {
    console.error('Error:', error)
    // 错误处理
  } finally {
    isLoading.value = false
  }
}
```

## 🎯 特定功能规则

### 智能体系统
- 智能体状态存储在`workspace.ts`
- 智能体切换必须更新布局模式
- 智能体卡片使用`AgentCard.vue`组件

### 视频编辑功能
- 视频片段数据存储在`video.ts`
- 时间线操作使用VueDraggable
- 视频预览使用HTML5 video元素

### 用户认证
- 认证状态存储在`auth.ts`
- 使用`AuthModal.vue`处理登录
- 未认证用户重定向到首页

## 🚫 禁止的操作

### 代码层面
- 直接修改Store状态 (必须通过Actions)
- 在组件中直接操作DOM (使用Vue的响应式系统)
- 使用内联样式 (使用Tailwind CSS)
- 硬编码API地址 (使用环境变量)

### 文件操作
- 不要修改`package.json`中的核心依赖版本
- 不要删除现有的Store模块
- 不要修改Tailwind配置中的颜色定义

## 📝 注释和文档规则

### 组件注释
```typescript
/**
 * 智能体卡片组件
 * 用于展示智能体信息和交互
 */
interface Props {
  /** 智能体图标 */
  icon: string
  /** 智能体标题 */
  title: string
}
```

### 函数注释
```typescript
/**
 * 创建视频片段
 * @param clipData 片段数据
 * @returns 片段ID
 */
const createClip = (clipData: VideoClip): string => {
  // 实现
}
```

## 🔍 代码质量要求

### 必须检查的项目
- [ ] TypeScript类型检查通过
- [ ] 组件Props有完整类型定义
- [ ] 异步操作有错误处理
- [ ] 使用Tailwind CSS而非自定义样式
- [ ] 组件遵循单一职责原则

### 性能要求
- 组件渲染时间 < 100ms
- 页面加载时间 < 2s
- 内存使用合理，无内存泄漏

## 🎨 UI/UX规则

### 设计一致性
- 使用项目定义的颜色系统
- 保持组件间距一致 (使用Tailwind spacing)
- 动画效果使用`transition-all duration-300`

### 响应式设计
- 移动优先设计
- 使用Tailwind响应式前缀
- 确保在所有设备上可用

### 交互反馈
- 按钮必须有hover和active状态
- 加载状态必须有视觉反馈
- 错误状态必须有明确提示

## 🔧 开发工具规则

### 必须使用的工具
- TypeScript严格模式
- Vue DevTools (开发时)
- Vite开发服务器

### 推荐的IDE设置
- VSCode + Vetur/Volar插件
- 启用TypeScript检查
- 配置Prettier格式化

## 📋 测试规则

### 组件测试
- 关键组件必须有单元测试
- 测试Props和Events
- 测试组件渲染结果

### 集成测试
- 测试Store和组件的集成
- 测试路由跳转
- 测试用户交互流程

## 🚀 部署规则

### 构建要求
- 构建必须无错误和警告
- 生产构建必须压缩优化
- 静态资源必须正确引用

### 环境配置
- 开发环境使用本地配置
- 生产环境使用环境变量
- 不同环境的API地址分离

## 📞 问题处理

### 遇到问题时
1. 检查TypeScript类型错误
2. 查看浏览器控制台错误
3. 确认组件Props传递正确
4. 验证Store状态更新

### 寻求帮助
- 查阅Vue 3官方文档
- 参考项目现有代码实现
- 查看Tailwind CSS文档

---

**重要提醒**: 这些规则是为了确保项目代码质量和一致性，请严格遵循。如有疑问，请参考项目现有代码实现。