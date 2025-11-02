<template>
  <div class="space-y-6">
    <!-- 页面标题和操作 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-white">通用知识库管理</h2>
          <p class="text-sm text-gray-400 mt-1">配置所有用户可用的AI智能体知识库</p>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          @click="showAddModal = true"
        >
          <Plus :size="16" />
          添加智能体
        </button>
      </div>
    </div>

    <!-- 智能体列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="agent in knowledgeAgents"
        :key="agent.id"
        class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg" :class="agent.color">
              {{ agent.name.substring(0, 2) }}
            </div>
            <div>
              <h3 class="text-white font-semibold">{{ agent.name }}</h3>
              <p class="text-xs text-gray-500">{{ agent.category }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              class="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
              @click="editAgent(agent)"
              title="编辑"
            >
              <Edit3 :size="14" />
            </button>
            <button
              class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              @click="deleteAgent(agent)"
              title="删除"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-400 mb-4">{{ agent.description }}</p>

        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <Database :size="14" class="text-gray-500" />
            <span class="text-gray-500">{{ agent.documentCount }} 文档</span>
          </div>
          <div class="flex items-center gap-2">
            <Users :size="14" class="text-gray-500" />
            <span class="text-gray-500">{{ agent.userCount }} 用户使用</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">状态</span>
            <button
              class="px-2 py-1 rounded text-xs transition-colors"
              :class="[
                agent.enabled
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-700 text-gray-400'
              ]"
              @click="toggleAgent(agent)"
            >
              {{ agent.enabled ? '已启用' : '已禁用' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="knowledgeAgents.length === 0" class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-4">
        <Database :size="32" class="text-gray-600" />
      </div>
      <h3 class="text-lg font-bold text-white mb-2">暂无通用智能体</h3>
      <p class="text-gray-400 mb-6">添加通用智能体，让所有用户都能使用</p>
      <button
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        @click="showAddModal = true"
      >
        添加第一个智能体
      </button>
    </div>

    <!-- 添加/编辑智能体模态框 -->
    <Teleport to="body">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        @click.self="showAddModal = false"
      >
        <div class="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">
              {{ editingAgent ? '编辑智能体' : '添加智能体' }}
            </h3>
            <button
              class="p-2 text-gray-400 hover:text-gray-300 rounded-lg transition-colors"
              @click="closeModal"
            >
              <X :size="20" />
            </button>
          </div>

          <form @submit.prevent="saveAgent" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">智能体名称</label>
                <input
                  v-model="agentForm.name"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
                  placeholder="例如：雷军、华与华..."
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">分类</label>
                <select
                  v-model="agentForm.category"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none"
                >
                  <option value="企业家">企业家</option>
                  <option value="品牌营销">品牌营销</option>
                  <option value="技术领袖">技术领袖</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">描述</label>
              <textarea
                v-model="agentForm.description"
                rows="3"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 outline-none resize-none"
                placeholder="描述智能体的特点和风格..."
                required
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">颜色</label>
              <div class="flex gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  class="w-10 h-10 rounded-lg border-2 transition-all"
                  :class="[
                    color,
                    agentForm.color === color ? 'border-white scale-110' : 'border-gray-700'
                  ]"
                  @click="agentForm.color = color"
                ></button>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                @click="closeModal"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {{ editingAgent ? '保存' : '添加' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit3, Trash2, Database, Users, X } from 'lucide-vue-next'

const showAddModal = ref(false)
const editingAgent = ref<any>(null)

const agentForm = ref({
  name: '',
  category: '企业家',
  description: '',
  color: 'bg-blue-500'
})

const colorOptions = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500'
]

// 模拟数据
const knowledgeAgents = ref([
  {
    id: '1',
    name: '雷军',
    category: '企业家',
    description: '小米创始人，擅长产品思维和互联网营销',
    color: 'bg-orange-500',
    documentCount: 156,
    userCount: 2340,
    enabled: true
  },
  {
    id: '2',
    name: '华与华',
    category: '品牌营销',
    description: '著名品牌营销专家，超级符号理论创始人',
    color: 'bg-red-500',
    documentCount: 89,
    userCount: 1876,
    enabled: true
  },
  {
    id: '3',
    name: '张一鸣',
    category: '技术领袖',
    description: '字节跳动创始人，产品和技术驱动型企业家',
    color: 'bg-blue-500',
    documentCount: 124,
    userCount: 1654,
    enabled: false
  }
])

const editAgent = (agent: any) => {
  editingAgent.value = agent
  agentForm.value = {
    name: agent.name,
    category: agent.category,
    description: agent.description,
    color: agent.color
  }
  showAddModal.value = true
}

const deleteAgent = (agent: any) => {
  if (confirm(`确定要删除智能体"${agent.name}"吗？`)) {
    const index = knowledgeAgents.value.findIndex(a => a.id === agent.id)
    if (index > -1) {
      knowledgeAgents.value.splice(index, 1)
    }
  }
}

const toggleAgent = (agent: any) => {
  agent.enabled = !agent.enabled
}

const saveAgent = () => {
  if (editingAgent.value) {
    // 编辑现有智能体
    Object.assign(editingAgent.value, agentForm.value)
  } else {
    // 添加新智能体
    knowledgeAgents.value.push({
      id: Date.now().toString(),
      ...agentForm.value,
      documentCount: 0,
      userCount: 0,
      enabled: true
    })
  }
  
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingAgent.value = null
  agentForm.value = {
    name: '',
    category: '企业家',
    description: '',
    color: 'bg-blue-500'
  }
}
</script>

