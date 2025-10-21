<template>
  <div class="right-panel h-full flex flex-col bg-gray-800">
    <!-- 顶部功能栏 - 参考tunee模式 -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
      <div class="flex items-center gap-4">
        <h3 class="text-lg font-semibold text-gray-50 flex items-center gap-2">
          <Film :size="20" class="text-blue-400" />
          <span>智能体画布</span>
        </h3>
        <!-- 功能按钮组 -->
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors">
            导入素材
          </button>
          <button class="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors">
            添加BGM
          </button>
          <button class="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors">
            生成字幕
          </button>
          <button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            开始生成
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="icon-btn" title="画布设置">
          <Settings :size="18" />
        </button>
        <button class="icon-btn" title="更多选项">
          <MoreVertical :size="18" />
        </button>
      </div>
    </div>

    <!-- 视频预览区 - 主要区域 -->
    <div class="flex-1 p-6 bg-gray-950">
      <VideoPlayer :src="currentVideoSrc" />
    </div>

    <!-- Tab标签页 - 底部控制区 -->
    <div class="h-64 overflow-hidden flex flex-col border-t border-gray-700 bg-gray-800">
      <TabGroup>
        <TabList class="flex border-b border-gray-700 px-2">
          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="w-full px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
              :class="[
                selected
                  ? 'text-blue-400 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <AlignLeft :size="16" />
                <span>字幕</span>
              </div>
            </button>
          </Tab>

          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="w-full px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
              :class="[
                selected
                  ? 'text-blue-400 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <Scissors :size="16" />
                <span>片段</span>
              </div>
            </button>
          </Tab>

          <Tab v-slot="{ selected }" class="flex-1">
            <button
              class="w-full px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
              :class="[
                selected
                  ? 'text-blue-400 border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <Music :size="16" />
                <span>音乐</span>
              </div>
            </button>
          </Tab>
        </TabList>

        <TabPanels class="flex-1 overflow-hidden">
          <TabPanel class="h-full overflow-y-auto scrollbar-thin p-4">
            <SubtitleEditor />
          </TabPanel>

          <TabPanel class="h-full overflow-y-auto scrollbar-thin p-4">
            <ClipFineTuner />
          </TabPanel>

          <TabPanel class="h-full overflow-y-auto scrollbar-thin p-4">
            <BackgroundMusic />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Film, AlignLeft, Scissors, Music, MoreVertical, Settings } from 'lucide-vue-next'
import VideoPlayer from './VideoPlayer.vue'
import SubtitleEditor from './SubtitleEditor.vue'
import ClipFineTuner from './ClipFineTuner.vue'
import BackgroundMusic from './BackgroundMusic.vue'

// 当前预览的视频源
const currentVideoSrc = ref<string>()
</script>
