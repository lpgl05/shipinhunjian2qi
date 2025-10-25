<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- 头部 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div>
              <h2 class="text-2xl font-bold text-gray-50">创建新人格</h2>
              <p class="text-sm text-gray-400 mt-1">
                步骤 {{ currentStep }} / {{ totalSteps }}
              </p>
            </div>
            <button
              class="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              @click="handleClose"
            >
              <X :size="24" />
            </button>
          </div>

          <!-- 进度条 -->
          <div class="px-6 py-4 bg-gray-800/50">
            <div class="flex gap-2">
              <div
                v-for="step in totalSteps"
                :key="step"
                class="flex-1 h-2 rounded-full transition-all duration-300"
                :class="[
                  step <= currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-violet-500'
                    : 'bg-gray-700'
                ]"
              ></div>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 overflow-y-auto scrollbar-thin p-6">
            <!-- 步骤1：身份定义 -->
            <div v-if="currentStep === 1" class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-50 mb-4">定义人格身份</h3>
                <p class="text-gray-400 mb-6">
                  为您的AI人格设置基本信息，这将帮助您在后续使用中快速识别
                </p>
              </div>

              <!-- 人格名称 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  人格名称 <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  placeholder="例如：老板-正式、CEO风格、营销总监..."
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>

              <!-- 人格描述 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  人格描述
                </label>
                <textarea
                  v-model="formData.description"
                  rows="4"
                  placeholder="描述这个人格的特点、使用场景等..."
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <!-- 步骤2：知识注入 -->
            <div v-if="currentStep === 2" class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-50 mb-4">注入知识库</h3>
                <p class="text-gray-400 mb-6">
                  上传文档、添加网页链接，让AI学习您的写作风格和知识内容
                </p>
              </div>

              <KnowledgeSourceInput
                :sources="formData.knowledgeSources"
                @add-source="handleAddSource"
                @remove-source="handleRemoveSource"
              />
            </div>

            <!-- 步骤3：声纹克隆 -->
            <div v-if="currentStep === 3" class="space-y-6">
              <div>
                <h3 class="text-xl font-semibold text-gray-50 mb-4">克隆声纹（可选）</h3>
                <p class="text-gray-400 mb-6">
                  录制或上传音频样本，为播客生成功能提供独特的声音
                </p>
              </div>

              <VoiceCloneInput
                @audio-ready="handleAudioReady"
              />
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800/50">
            <button
              v-if="currentStep > 1"
              class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
              @click="prevStep"
            >
              上一步
            </button>
            <div v-else></div>

            <div class="flex gap-3">
              <button
                class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors"
                @click="handleClose"
              >
                取消
              </button>
              <button
                v-if="currentStep < totalSteps"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canProceed"
                @click="nextStep"
              >
                下一步
              </button>
              <button
                v-else
                class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-violet-500 hover:brightness-110 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                :disabled="!canProceed || isCreating"
                @click="handleCreate"
              >
                <Loader2 v-if="isCreating" :size="18" class="animate-spin" />
                <span>{{ isCreating ? '创建中...' : '完成创建' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import KnowledgeSourceInput from './KnowledgeSourceInput.vue'
import VoiceCloneInput from './VoiceCloneInput.vue'

interface KnowledgeSource {
  id: string
  type: 'file' | 'link'
  value: string
  status: 'uploading' | 'processing' | 'success' | 'error'
}

interface PersonaFormData {
  name: string
  description: string
  knowledgeSources: KnowledgeSource[]
  audioUrl: string
}

interface Props {
  modelValue: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'create': [data: PersonaFormData]
}>()

const currentStep = ref(1)
const totalSteps = 3
const isCreating = ref(false)

const formData = ref<PersonaFormData>({
  name: '',
  description: '',
  knowledgeSources: [],
  audioUrl: ''
})

// 是否可以继续
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.name.trim().length > 0
    case 2:
      return formData.value.knowledgeSources.length > 0
    case 3:
      return true // 声纹是可选的
    default:
      return false
  }
})

// 下一步
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 添加知识源
const handleAddSource = (source: Omit<KnowledgeSource, 'id'>) => {
  const newSource: KnowledgeSource = {
    ...source,
    id: Date.now().toString()
  }
  formData.value.knowledgeSources.push(newSource)
  
  // 模拟处理过程
  setTimeout(() => {
    const index = formData.value.knowledgeSources.findIndex(s => s.id === newSource.id)
    if (index !== -1) {
      formData.value.knowledgeSources[index].status = 'success'
    }
  }, 2000)
}

// 移除知识源
const handleRemoveSource = (id: string) => {
  const index = formData.value.knowledgeSources.findIndex(s => s.id === id)
  if (index !== -1) {
    formData.value.knowledgeSources.splice(index, 1)
  }
}

// 音频准备就绪
const handleAudioReady = (url: string) => {
  formData.value.audioUrl = url
}

// 创建人格
const handleCreate = async () => {
  isCreating.value = true
  
  // 模拟创建过程
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  emit('create', formData.value)
  isCreating.value = false
  handleClose()
}

// 关闭模态框
const handleClose = () => {
  emit('update:modelValue', false)
  // 重置表单
  setTimeout(() => {
    currentStep.value = 1
    formData.value = {
      name: '',
      description: '',
      knowledgeSources: [],
      audioUrl: ''
    }
  }, 300)
}
</script>

<style scoped>
/* 模态框动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>

