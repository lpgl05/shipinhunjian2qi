<template>
  <div class="space-y-6">
    <!-- 欢迎消息配置 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 class="text-lg font-bold text-white mb-4">欢迎消息配置</h2>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          对话引导语
        </label>
        <textarea
          v-model="config.welcomeMessage"
          rows="3"
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
          placeholder="请输入对话引导语..."
        ></textarea>
      </div>
    </div>

    <!-- 快捷提示配置 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-white">快捷提示配置</h2>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          @click="addQuickPrompt"
        >
          <Plus :size="16" />
          添加提示
        </button>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="(prompt, index) in config.quickPrompts"
          :key="prompt.id"
          class="flex items-center gap-3 p-4 bg-gray-800 rounded-lg"
        >
          <div class="flex items-center gap-3 flex-1">
            <div class="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
              {{ index + 1 }}
            </div>
            <input
              v-model="prompt.text"
              type="text"
              class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 outline-none"
              placeholder="请输入快捷提示文本..."
            />
          </div>
          <button
            class="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            @click="removeQuickPrompt(index)"
          >
            <Trash2 :size="18" />
          </button>
        </div>
        
        <div v-if="config.quickPrompts.length === 0" class="text-center py-8 text-gray-500">
          暂无快捷提示，点击上方按钮添加
        </div>
      </div>
    </div>

    <!-- 写作模板配置 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-white">写作模板配置</h2>
        <button
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
          @click="addTemplate"
        >
          <Plus :size="16" />
          添加模板
        </button>
      </div>
      
      <div class="space-y-4">
        <div
          v-for="(template, index) in config.writingTemplates"
          :key="template.id"
          class="p-6 bg-gray-800 rounded-lg"
        >
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs text-gray-400 mb-2">模板名称</label>
              <input
                v-model="template.name"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm focus:border-blue-500 outline-none"
                placeholder="例如：周报、发言稿..."
              />
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-2">分类</label>
              <select
                v-model="template.category"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm focus:border-blue-500 outline-none"
              >
                <option value="business">商务</option>
                <option value="marketing">营销</option>
                <option value="technical">技术</option>
                <option value="common">通用</option>
              </select>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-xs text-gray-400 mb-2">描述</label>
            <input
              v-model="template.description"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm focus:border-blue-500 outline-none"
              placeholder="模板描述..."
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-xs text-gray-400 mb-2">提示词模板</label>
            <textarea
              v-model="template.prompt"
              rows="3"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm focus:border-blue-500 outline-none resize-none"
              placeholder="例如：请帮我写一份..."
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button
              class="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm flex items-center gap-1.5"
              @click="removeTemplate(index)"
            >
              <Trash2 :size="14" />
              删除模板
            </button>
          </div>
        </div>
        
        <div v-if="config.writingTemplates.length === 0" class="text-center py-8 text-gray-500">
          暂无写作模板，点击上方按钮添加
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="flex justify-end gap-3">
      <button
        class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        @click="resetConfig"
      >
        重置
      </button>
      <button
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white rounded-lg transition-all"
        @click="saveConfig"
      >
        保存配置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { useFrontendConfigStore } from '../../store/frontend-config'

const frontendConfigStore = useFrontendConfigStore()

const config = ref({
  welcomeMessage: '',
  quickPrompts: [] as any[],
  writingTemplates: [] as any[]
})

onMounted(() => {
  // 加载当前配置
  config.value = {
    welcomeMessage: frontendConfigStore.config.welcomeMessage,
    quickPrompts: [...frontendConfigStore.config.quickPrompts],
    writingTemplates: [...frontendConfigStore.config.writingTemplates]
  }
})

const addQuickPrompt = () => {
  config.value.quickPrompts.push({
    id: Date.now().toString(),
    text: '',
    order: config.value.quickPrompts.length + 1
  })
}

const removeQuickPrompt = (index: number) => {
  config.value.quickPrompts.splice(index, 1)
}

const addTemplate = () => {
  config.value.writingTemplates.push({
    id: Date.now().toString(),
    name: '',
    description: '',
    prompt: '',
    category: 'common',
    order: config.value.writingTemplates.length + 1
  })
}

const removeTemplate = (index: number) => {
  config.value.writingTemplates.splice(index, 1)
}

const saveConfig = () => {
  frontendConfigStore.updateConfig(config.value)
  alert('配置已保存！用户端将自动更新。')
}

const resetConfig = () => {
  if (confirm('确定要重置配置吗？此操作将恢复默认配置。')) {
    config.value = {
      welcomeMessage: frontendConfigStore.config.welcomeMessage,
      quickPrompts: [...frontendConfigStore.config.quickPrompts],
      writingTemplates: [...frontendConfigStore.config.writingTemplates]
    }
  }
}
</script>

