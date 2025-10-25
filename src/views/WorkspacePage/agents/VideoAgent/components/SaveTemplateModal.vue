<template>
  <TransitionRoot :show="true" as="template">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <!-- 背景遮罩 -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <!-- 模态框 -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl transition-all">
              <!-- 头部 -->
              <div class="flex items-center justify-between p-6 border-b border-gray-700">
                <DialogTitle class="text-lg font-bold text-gray-50 flex items-center gap-3">
                  <Save :size="20" class="text-blue-400" />
                  <span>保存模板</span>
                </DialogTitle>
                <button
                  class="p-2 text-gray-400 hover:text-gray-50 hover:bg-gray-700 rounded-lg transition-all"
                  @click="$emit('close')"
                >
                  <X :size="18" />
                </button>
              </div>

              <!-- 内容区 -->
              <div class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">模板名称</label>
                  <input
                    v-model="templateName"
                    type="text"
                    placeholder="输入模板名称"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">模板描述</label>
                  <textarea
                    v-model="templateDescription"
                    placeholder="输入模板描述（可选）"
                    rows="3"
                    class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <!-- 当前配置预览 -->
                <div class="bg-gray-700 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-200 mb-3">当前配置</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-400">格式：</span>
                      <span class="text-gray-50">{{ config.aspectRatio === '9:16' ? '竖版 (9:16)' : '横版 (16:9)' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">时长：</span>
                      <span class="text-gray-50">{{ config.duration }}秒</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">分辨率：</span>
                      <span class="text-gray-50">{{ config.resolution }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">风格：</span>
                      <span class="text-gray-50">{{ getStyleLabel(config.style) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">字幕：</span>
                      <span class="text-gray-50">{{ config.enableSubtitles ? '已启用' : '未启用' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-400">音色：</span>
                      <span class="text-gray-50">{{ getVoiceLabel(config.voiceType) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="flex gap-3 pt-2">
                  <button
                    class="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                    @click="$emit('close')"
                  >
                    取消
                  </button>
                  <button
                    class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!templateName.trim()"
                    @click="saveTemplate"
                  >
                    保存模板
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Save, X } from 'lucide-vue-next'

// Props
const props = defineProps<{
  config: any
}>()

// 定义事件
const emit = defineEmits<{
  close: []
  save: [template: any]
}>()

// 状态
const templateName = ref('')
const templateDescription = ref('')

// 获取样式标签
const getStyleLabel = (style: string) => {
  const styles: Record<string, string> = {
    modern: '现代',
    cinematic: '电影感',
    vibrant: '活力',
    minimal: '简约'
  }
  return styles[style] || style
}

// 获取音色标签
const getVoiceLabel = (voice: string) => {
  const voices: Record<string, string> = {
    authoritative: '权威',
    calm: '平静',
    energetic: '活力',
    dramatic: '戏剧'
  }
  return voices[voice] || voice
}

// 保存模板
const saveTemplate = () => {
  if (!templateName.value.trim()) return
  
  const template = {
    name: templateName.value.trim(),
    description: templateDescription.value.trim(),
    config: { ...props.config }
  }
  
  emit('save', template)
}
</script>
