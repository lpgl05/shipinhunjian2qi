<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold text-white">风格提示词配置</h2>
        <p class="text-sm text-gray-400 mt-1">配置前端"快速开始"区域显示的写作模板提示词</p>
      </div>
      <button
        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white text-sm rounded-lg transition-all flex items-center gap-2"
        @click="showAddModal = true"
      >
        <Plus :size="16" />
        添加提示词
      </button>
    </div>

    <!-- 分类筛选 -->
    <div class="flex items-center gap-2 mb-4">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="px-4 py-2 rounded-lg text-sm transition-all"
        :class="[
          activeCategory === cat.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
        ]"
        @click="activeCategory = cat.value"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- 提示词列表 -->
    <div class="space-y-3">
      <div
        v-for="(prompt, index) in filteredPrompts"
        :key="prompt.id"
        class="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-lg flex items-center justify-center">
            <FileText :size="20" class="text-blue-400" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-white font-medium">{{ prompt.name }}</h3>
              <span
                class="px-2 py-0.5 text-xs rounded-full"
                :class="getCategoryStyle(prompt.category)"
              >
                {{ getCategoryLabel(prompt.category) }}
              </span>
            </div>
            <p class="text-sm text-gray-400 mb-2">{{ prompt.description }}</p>
            <div class="p-3 bg-gray-900 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">提示词模板:</p>
              <p class="text-sm text-gray-300">{{ prompt.prompt }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              @click="editPrompt(prompt)"
              title="编辑"
            >
              <Edit :size="18" />
            </button>
            <button
              class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              @click="deletePrompt(prompt.id)"
              title="删除"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredPrompts.length === 0" class="text-center py-12 text-gray-500">
        <FileText :size="48" class="mx-auto mb-3 opacity-30" />
        <p>暂无提示词，点击上方按钮添加</p>
      </div>
    </div>

    <!-- 添加/编辑模态框 -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <h3 class="text-lg font-bold text-white mb-4">
          {{ isEdit ? '编辑提示词' : '添加提示词' }}
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">模板名称 *</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
                placeholder="例如：周报、发言稿..."
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">分类 *</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
              >
                <option value="all">全部</option>
                <option value="marketing">营销类</option>
                <option value="technical">技术类</option>
                <option value="business">商务类</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">描述</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
              placeholder="快速生成工作周报"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">提示词内容 *</label>
            <textarea
              v-model="form.prompt"
              rows="4"
              class="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none resize-none"
              placeholder="请帮我写一份本周工作总结，包括本周工作内容、完成情况、遇到的问题和下周计划"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            @click="closeModal"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white rounded-lg transition-all"
            @click="savePrompt"
          >
            {{ isEdit ? '保存' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Trash2, Edit, FileText } from 'lucide-vue-next'

interface StylePrompt {
  id: string
  name: string
  description: string
  prompt: string
  category: string
  createdAt: string
}

// 模拟数据
const prompts = ref<StylePrompt[]>([
  {
    id: '1',
    name: '周报',
    description: '快速生成工作周报',
    prompt: '请帮我写一份本周工作总结，包括本周工作内容、完成情况、遇到的问题和下周计划',
    category: 'business',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: '发言稿',
    description: '撰写正式发言稿',
    prompt: '请帮我写一份发言稿，主题是：{topic}，要求专业、有说服力',
    category: 'business',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    name: '产品介绍',
    description: '产品功能介绍文案',
    prompt: '请帮我写一份产品介绍，突出产品的核心功能和优势',
    category: 'marketing',
    createdAt: '2024-01-17'
  },
  {
    id: '4',
    name: '营销方案',
    description: '制定营销推广方案',
    prompt: '请帮我制定一份营销方案，包括目标用户、推广渠道、活动策划等',
    category: 'marketing',
    createdAt: '2024-01-18'
  },
  {
    id: '5',
    name: '技术博客',
    description: '撰写技术博客文章',
    prompt: '请帮我写一篇技术博客，主题是：{topic}，要求深入浅出，适合技术人员阅读',
    category: 'technical',
    createdAt: '2024-01-19'
  }
])

const categories = [
  { label: '全部', value: 'all' },
  { label: '营销类', value: 'marketing' },
  { label: '技术类', value: 'technical' },
  { label: '商务类', value: 'business' }
]

const activeCategory = ref('all')
const showAddModal = ref(false)
const isEdit = ref(false)

const form = ref({
  id: '',
  name: '',
  description: '',
  prompt: '',
  category: 'all'
})

// 筛选提示词
const filteredPrompts = computed(() => {
  if (activeCategory.value === 'all') {
    return prompts.value
  }
  return prompts.value.filter(p => p.category === activeCategory.value)
})

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : category
}

// 获取分类样式
const getCategoryStyle = (category: string) => {
  const styles: Record<string, string> = {
    marketing: 'bg-green-500/20 text-green-400',
    technical: 'bg-blue-500/20 text-blue-400',
    business: 'bg-purple-500/20 text-purple-400'
  }
  return styles[category] || 'bg-gray-500/20 text-gray-400'
}

// 编辑提示词
const editPrompt = (prompt: StylePrompt) => {
  isEdit.value = true
  form.value = {
    id: prompt.id,
    name: prompt.name,
    description: prompt.description,
    prompt: prompt.prompt,
    category: prompt.category
  }
  showAddModal.value = true
}

// 删除提示词
const deletePrompt = (id: string) => {
  if (confirm('确定要删除这个提示词吗？')) {
    const index = prompts.value.findIndex(p => p.id === id)
    if (index > -1) {
      prompts.value.splice(index, 1)
      alert('删除成功！')
    }
  }
}

// 保存提示词
const savePrompt = () => {
  if (!form.value.name || !form.value.prompt) {
    alert('请填写所有必填项！')
    return
  }

  if (isEdit.value) {
    // 编辑
    const index = prompts.value.findIndex(p => p.id === form.value.id)
    if (index > -1) {
      prompts.value[index] = {
        ...prompts.value[index],
        name: form.value.name,
        description: form.value.description,
        prompt: form.value.prompt,
        category: form.value.category
      }
      alert('保存成功！')
    }
  } else {
    // 新增
    prompts.value.push({
      id: Date.now().toString(),
      name: form.value.name,
      description: form.value.description,
      prompt: form.value.prompt,
      category: form.value.category,
      createdAt: new Date().toISOString().split('T')[0]
    })
    alert('添加成功！')
  }

  closeModal()
}

// 关闭模态框
const closeModal = () => {
  showAddModal.value = false
  isEdit.value = false
  form.value = {
    id: '',
    name: '',
    description: '',
    prompt: '',
    category: 'all'
  }
}
</script>

