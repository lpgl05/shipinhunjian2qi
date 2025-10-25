<template>
  <div class="style-manager">
    <!-- 风格管理头部 -->
    <div class="style-header mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-200">写作风格管理</h3>
          <p class="text-sm text-gray-400">管理和创建您的专属写作风格</p>
        </div>
        <button
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          @click="showCreateModal = true"
        >
          <Plus :size="16" />
          新增风格
        </button>
      </div>
    </div>

    <!-- 风格列表 -->
    <div class="style-list space-y-4">
      <div
        v-for="style in availableStyles"
        :key="style.id"
        class="style-card p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
        :class="{ 'border-purple-500 bg-purple-500/10': selectedStyle?.id === style.id }"
        @click="selectStyle(style)"
      >
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" :class="style.color">
            {{ style.name.substring(0, 2) }}
          </div>
          <div class="flex-1">
            <h4 class="text-gray-50 font-medium">{{ style.name }}</h4>
            <p class="text-sm text-gray-400">{{ style.description }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500">来源:</span>
              <span class="text-xs text-purple-400">{{ style.source || '系统预设' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              @click.stop="editStyle(style)"
              title="编辑风格"
            >
              <Edit3 :size="16" />
            </button>
            <button
              class="p-2 text-gray-400 hover:text-red-400 transition-colors"
              @click.stop="deleteStyle(style)"
              title="删除风格"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑风格模态框 -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-200">
            {{ showEditModal ? '编辑风格' : '创建新风格' }}
          </h3>
          <button
            class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
            @click="closeModal"
          >
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="saveStyle" class="space-y-4">
          <!-- 风格名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">风格名称</label>
            <input
              v-model="styleForm.name"
              type="text"
              placeholder="例如：CEO-创新风格"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
              required
            />
          </div>

          <!-- 风格描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">风格描述</label>
            <textarea
              v-model="styleForm.description"
              rows="3"
              placeholder="描述这个风格的特点和适用场景..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
              required
            ></textarea>
          </div>

          <!-- 风格颜色 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">风格颜色</label>
            <div class="flex gap-2">
              <button
                v-for="color in colorOptions"
                :key="color.value"
                type="button"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :class="[
                  color.value,
                  styleForm.color === color.value ? 'border-white scale-110' : 'border-gray-600'
                ]"
                @click="styleForm.color = color.value"
              ></button>
            </div>
          </div>

          <!-- 知识库来源 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">知识库来源</label>
            <div class="space-y-3">
              <!-- 文件上传 -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">上传文档</label>
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.doc,.docx"
                  @change="handleFileUpload"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>

              <!-- 链接输入 -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">知识库链接</label>
                <input
                  v-model="styleForm.knowledgeUrl"
                  type="url"
                  placeholder="输入知识库链接..."
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                />
              </div>

              <!-- 文本输入 -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">直接输入内容</label>
                <textarea
                  v-model="styleForm.knowledgeText"
                  rows="4"
                  placeholder="直接输入要学习的文本内容..."
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              @click="closeModal"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {{ showEditModal ? '保存修改' : '创建风格' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Edit3, Trash2, X } from 'lucide-vue-next'

// Props
const props = defineProps<{
  selectedStyle: any
  availableStyles: any[]
}>()

// Emits
const emit = defineEmits<{
  'style-select': [style: any]
  'style-create': [style: any]
  'style-update': [style: any]
  'style-delete': [styleId: string]
}>()

// 响应式数据
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingStyle = ref<any>(null)

// 风格表单
const styleForm = reactive({
  name: '',
  description: '',
  color: 'bg-purple-500',
  knowledgeUrl: '',
  knowledgeText: '',
  source: ''
})

// 颜色选项
const colorOptions = [
  { value: 'bg-purple-500', label: '紫色' },
  { value: 'bg-blue-500', label: '蓝色' },
  { value: 'bg-green-500', label: '绿色' },
  { value: 'bg-orange-500', label: '橙色' },
  { value: 'bg-red-500', label: '红色' },
  { value: 'bg-pink-500', label: '粉色' },
  { value: 'bg-indigo-500', label: '靛蓝' },
  { value: 'bg-teal-500', label: '青色' }
]

// 选择风格
const selectStyle = (style: any) => {
  emit('style-select', style)
}

// 编辑风格
const editStyle = (style: any) => {
  editingStyle.value = style
  Object.assign(styleForm, {
    name: style.name,
    description: style.description,
    color: style.color,
    knowledgeUrl: style.knowledgeUrl || '',
    knowledgeText: style.knowledgeText || '',
    source: style.source || ''
  })
  showEditModal.value = true
}

// 删除风格
const deleteStyle = (style: any) => {
  if (confirm(`确定要删除风格"${style.name}"吗？`)) {
    emit('style-delete', style.id)
  }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 这里可以添加文件处理逻辑
    styleForm.source = `文件: ${file.name}`
  }
}

// 保存风格
const saveStyle = () => {
  const styleData = {
    id: showEditModal.value ? editingStyle.value.id : `style-${Date.now()}`,
    name: styleForm.name,
    description: styleForm.description,
    color: styleForm.color,
    knowledgeUrl: styleForm.knowledgeUrl,
    knowledgeText: styleForm.knowledgeText,
    source: styleForm.source || '用户创建'
  }

  if (showEditModal.value) {
    emit('style-update', styleData)
  } else {
    emit('style-create', styleData)
  }

  closeModal()
}

// 关闭模态框
const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingStyle.value = null
  Object.assign(styleForm, {
    name: '',
    description: '',
    color: 'bg-purple-500',
    knowledgeUrl: '',
    knowledgeText: '',
    source: ''
  })
}
</script>

<style scoped>
.style-manager {
  /* 样式管理器样式 */
}
</style>
