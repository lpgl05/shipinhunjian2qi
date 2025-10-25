# 修复 computed 错误

## 问题描述
从首页点击"视频混剪智能体"卡片后出现黑屏，控制台报错：
```
Uncaught (in promise) ReferenceError: computed is not defined
at setup (ChatCanvas.vue:190:29)
```

## 问题原因
在 `ChatCanvas.vue` 中使用了 `computed` 函数，但没有从 Vue 中正确导入。

## 修复方案
在 `ChatCanvas.vue` 的导入语句中添加 `computed`：

```typescript
// 修复前
import { ref, nextTick, watch, onMounted } from 'vue'

// 修复后  
import { ref, nextTick, watch, onMounted, computed } from 'vue'
```

## 修复位置
文件：`src/views/WorkspacePage/ChatCanvas.vue`
行号：160

## 测试步骤
1. 刷新页面
2. 从首页点击"视频混剪智能体"卡片
3. 验证页面正常显示，无黑屏问题
4. 检查控制台无错误信息

## 预期结果
- 页面正常显示视频混剪工作区
- 左侧是对话区域，右侧是视频编辑画布
- 控制台无错误信息
