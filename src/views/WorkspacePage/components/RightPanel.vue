<template>
  <div class="right-panel h-full flex flex-col bg-gray-800">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <h3 class="text-lg font-semibold text-gray-50 flex items-center gap-2">
        <Film :size="20" class="text-blue-400" />
        <span>智能体画布</span>
      </h3>
      <div class="flex items-center gap-2">
        <button class="icon-btn" title="画布设置">
          <Settings :size="18" />
        </button>
        <button class="icon-btn" title="更多选项">
          <MoreVertical :size="18" />
        </button>
      </div>
    </div>

    <!-- 视频预览区 -->
    <div class="p-4 border-b border-gray-700">
      <VideoPlayer :src="currentVideoSrc" />
    </div>

    <!-- Tab标签页 -->
    <div class="flex-1 overflow-hidden flex flex-col">
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
