<template>
  <div class="video-config h-full flex bg-gray-900">
    <!-- 左侧配置面板 -->
    <div class="w-1/2 flex flex-col border-r border-gray-700">
      <!-- 顶部操作栏 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-gray-50">视频参数配置</h3>
          <span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">步骤 1/5</span>
        </div>
        <div class="flex items-center gap-2">
          <!-- 保存模板按钮 -->
          <button
            class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
            @click="showSaveTemplateModal = true"
          >
            <Save :size="16" />
            <span>保存模板</span>
          </button>
        </div>
      </div>

      <!-- Sheet切换导航 -->
      <div class="flex border-b border-gray-700 bg-gray-800">
        <button
          v-for="sheet in sheets"
          :key="sheet.id"
          class="sheet-tab"
          :class="{ 'active': activeSheet === sheet.id }"
          @click="activeSheet = sheet.id"
        >
          <component :is="sheet.icon" :size="16" />
          <span>{{ sheet.name }}</span>
        </button>
      </div>

      <!-- Sheet内容区 -->
      <div class="flex-1 overflow-y-auto scrollbar-thin">
        <!-- 模板选择 -->
        <div v-if="activeSheet === 'template'" class="p-6 space-y-6">
          <!-- 基础模板 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">基础模板</h5>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">视频格式</label>
              <select v-model="config.aspectRatio" class="input-primary">
                <option value="9:16">竖版 (9:16) - 适合抖音、快手</option>
                <option value="16:9">横版 (16:9) - 适合B站、YouTube</option>
              </select>
            </div>
          </div>

          <!-- 我的模板 -->
          <div v-if="savedTemplates.length > 0" class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">我的模板</h5>
            <div class="space-y-2">
              <div
                v-for="template in savedTemplates"
                :key="template.id"
                class="template-item"
                :class="{ 'selected': selectedTemplate === template.id }"
                @click="loadTemplate(template)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h6 class="font-medium text-gray-50">{{ template.name }}</h6>
                    <p class="text-sm text-gray-400">{{ template.description }}</p>
                  </div>
                  <button class="text-red-400 hover:text-red-300" @click.stop="deleteTemplate(template.id)">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 模板库 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">模板库</h5>
            <button
              class="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-between"
              @click="showTemplateLibraryModal = true"
            >
              <div class="flex items-center gap-3">
                <Database :size="20" class="text-blue-400" />
                <span>浏览系统模板库</span>
              </div>
              <Layers :size="16" />
            </button>
          </div>
        </div>

        <!-- 参数配置 -->
        <div v-if="activeSheet === 'params'" class="p-6 space-y-6">
          <!-- 基本信息 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">基本信息</h5>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">视频标题</label>
                <input
                  v-model="config.title"
                  type="text"
                  placeholder="输入视频标题"
                  class="input-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">视频生成数量</label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="config.videoCount"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="默认3个"
                    class="input-primary flex-1"
                  />
                  <span class="text-sm text-gray-400 whitespace-nowrap">最多100个</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">视频时长 ({{ config.duration }}秒)</label>
                <input
                  v-model="config.duration"
                  type="range"
                  min="15"
                  max="180"
                  step="5"
                  class="range-slider"
                />
              </div>
            </div>
          </div>

          <!-- 视频质量 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">视频质量</h5>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">分辨率</label>
                <select v-model="config.resolution" class="input-primary">
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">帧率</label>
                <select v-model="config.fps" class="input-primary">
                  <option :value="30">30 FPS</option>
                  <option :value="60">60 FPS</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 转场效果 -->
          <div class="space-y-4">
            <h5 class="text-sm font-medium text-gray-300">转场效果</h5>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">转场效果</label>
              <div class="flex gap-2 flex-wrap mb-3">
                <button
                  v-for="transition in transitions"
                  :key="transition.value"
                  class="btn-option"
                  :class="{ 'active': config.transition === transition.value }"
                  @click="config.transition = transition.value"
                >
                  {{ transition.label }}
                </button>
              </div>
              <button
                class="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2 text-sm"
                @click="showTransitionLibraryModal = true"
              >
                <Layers :size="16" />
                <span>转场效果库</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 标题配置 -->
        <div v-if="activeSheet === 'title'" class="p-6 space-y-6">
          <!-- 全局配置 -->
          <div class="space-y-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h5 class="text-sm font-medium text-blue-400 flex items-center gap-2">
              <Heading :size="16" />
              <span>主副标题样式设置</span>
            </h5>
            
            <div class="grid grid-cols-3 gap-4">
              <!-- 标题位置 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">标题位置</label>
                <select v-model="config.titlePosition" class="input-primary">
                  <option value="top">顶部</option>
                  <option value="center">中间</option>
                  <option value="bottom">底部</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              
              <!-- 主副标题间距 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">主副标题间距</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="config.titleSpacing"
                    type="number"
                    class="input-primary flex-1"
                  />
                  <span class="text-sm text-gray-400">px</span>
                </div>
              </div>
              
              <!-- 对齐方式 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">对齐方式</label>
                <select v-model="config.titleAlignment" class="input-primary">
                  <option value="left">左对齐</option>
                  <option value="center">居中</option>
                  <option value="right">右对齐</option>
                </select>
              </div>
            </div>

            <!-- 动画效果 -->
            <div class="grid grid-cols-3 gap-4 mt-2">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">标题动画</label>
                <select v-model="config.titleAnimation" class="input-primary">
                  <option value="none">无</option>
                  <option value="fade">淡入</option>
                  <option value="slide-up">上滑进入</option>
                  <option value="slide-down">下滑进入</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 主标题配置 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Heading :size="16" />
                <span>主标题</span>
              </label>
              <Switch
                v-model="config.enableMainTitle"
                :class="config.enableMainTitle ? 'bg-blue-600' : 'bg-gray-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span class="sr-only">启用主标题</span>
                <span
                  :class="config.enableMainTitle ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div v-if="config.enableMainTitle" class="space-y-4">
              <!-- 主标题文本 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">标题文本</label>
                <input
                  v-model="config.mainTitle"
                  type="text"
                  placeholder="输入主标题文本"
                  class="input-primary"
                />
              </div>

              <!-- 字间距和字体大小 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字间距</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.mainTitleLetterSpacing"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.mainTitleSize"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
              </div>

              <!-- 颜色和字体 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">颜色</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="config.mainTitleColor"
                      type="color"
                      class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      v-model="config.mainTitleColor"
                      type="text"
                      class="input-primary flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体</label>
                  <select v-model="config.mainTitleFont" class="input-primary">
                    <option value="思源黑体Heavy">思源黑体Heavy</option>
                    <option value="PingFang SC">PingFang SC</option>
                    <option value="Microsoft YaHei">Microsoft YaHei</option>
                    <option value="Heiti SC">黑体</option>
                    <option value="STSong">宋体</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 副标题配置 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-green-400 flex items-center gap-2">
                <Heading :size="16" />
                <span>副标题</span>
              </label>
              <Switch
                v-model="config.enableSubTitle"
                :class="config.enableSubTitle ? 'bg-blue-600' : 'bg-gray-700'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span class="sr-only">启用副标题</span>
                <span
                  :class="config.enableSubTitle ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </Switch>
            </div>

            <div v-if="config.enableSubTitle" class="space-y-4">
              <!-- 副标题文本 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">标题文本</label>
                <input
                  v-model="config.subTitle"
                  type="text"
                  placeholder="输入副标题文本"
                  class="input-primary"
                />
              </div>

              <!-- 字间距和字体大小 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字间距</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.subTitleLetterSpacing"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.subTitleSize"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
              </div>

              <!-- 颜色和字体 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">颜色</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="config.subTitleColor"
                      type="color"
                      class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      v-model="config.subTitleColor"
                      type="text"
                      class="input-primary flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体</label>
                  <select v-model="config.subTitleFont" class="input-primary">
                    <option value="思源黑体Heavy">思源黑体Heavy</option>
                    <option value="PingFang SC">PingFang SC</option>
                    <option value="Microsoft YaHei">Microsoft YaHei</option>
                    <option value="Heiti SC">黑体</option>
                    <option value="STSong">宋体</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 字幕配置 -->
        <div v-if="activeSheet === 'subtitle'" class="p-6 space-y-4">
          <!-- 字幕样式设置标题 -->
          <div class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h5 class="text-sm font-medium text-green-400 flex items-center gap-2">
              <Type :size="16" />
              <span>字幕样式设置</span>
            </h5>
          </div>

          <!-- 基础配置折叠面板 -->
          <div class="border border-gray-700 rounded-lg overflow-hidden">
            <button
              class="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
              @click="subtitleSections.basic = !subtitleSections.basic"
            >
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 bg-green-500 rounded"></div>
                <span class="text-sm font-medium text-gray-200">基础配置</span>
              </div>
              <component :is="subtitleSections.basic ? ChevronUp : ChevronDown" :size="18" class="text-gray-400" />
            </button>
            <div v-show="subtitleSections.basic" class="p-4 bg-gray-800/50 space-y-4">
              <!-- 字幕颜色 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字幕颜色</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="config.subtitleColor"
                    type="color"
                    class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                  />
                  <input
                    v-model="config.subtitleColor"
                    type="text"
                    class="input-primary flex-1"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              <!-- 字幕位置 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字幕位置</label>
                <select v-model="config.subtitlePosition" class="input-primary">
                  <option value="template1">模板位置1（横屏视频）</option>
                  <option value="template2">模板位置2（竖屏视频）</option>
                  <option value="top">顶部</option>
                  <option value="center">中间</option>
                  <option value="bottom">底部</option>
                  <option value="custom">自定义</option>
                </select>
              </div>

              <!-- 字体大小和字体 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.subtitleSize"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体</label>
                  <select v-model="config.subtitleFont" class="input-primary">
                    <option value="思源黑体Heavy">思源黑体Heavy</option>
                    <option value="PingFang SC">PingFang SC</option>
                    <option value="Microsoft YaHei">Microsoft YaHei</option>
                    <option value="Heiti SC">黑体</option>
                    <option value="STSong">宋体</option>
                  </select>
                </div>
              </div>

              <!-- 字体描边颜色和字体描边宽度 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体描边颜色</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="config.subtitleStrokeColor"
                      type="color"
                      class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      v-model="config.subtitleStrokeColor"
                      type="text"
                      class="input-primary flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字体描边宽度</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="config.subtitleStrokeWidth"
                      type="number"
                      class="input-primary flex-1"
                    />
                    <span class="text-sm text-gray-400">px</span>
                  </div>
                </div>
              </div>

              <!-- 字幕阴影深度 -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">字幕阴影深度</label>
                <div class="flex items-center gap-2">
                  <input
                    v-model.number="config.subtitleShadowDepth"
                    type="number"
                    class="input-primary flex-1"
                  />
                  <span class="text-sm text-gray-400">px</span>
                </div>
              </div>

              <!-- 字幕背景颜色和字幕背景透明度 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字幕背景颜色</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="config.subtitleBackgroundColor"
                      type="color"
                      class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      v-model="config.subtitleBackgroundColor"
                      type="text"
                      class="input-primary flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">字幕背景透明度</label>
                  <input
                    v-model.number="config.subtitleBackgroundOpacity"
                    type="number"
                    min="0"
                    max="100"
                    class="input-primary"
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 花字折叠面板 -->
          <div class="border border-gray-700 rounded-lg overflow-hidden">
            <button
              class="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
              @click="subtitleSections.fancy = !subtitleSections.fancy"
            >
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 bg-yellow-500 rounded"></div>
                <span class="text-sm font-medium text-gray-200">花字</span>
              </div>
              <component :is="subtitleSections.fancy ? ChevronUp : ChevronDown" :size="18" class="text-gray-400" />
            </button>
            <div v-show="subtitleSections.fancy" class="p-4 bg-gray-800/50">
              <button
                class="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                @click="showFontLibraryModal = true"
              >
                <Type :size="18" />
                <span>打开花字字体库</span>
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">选择花字样式，让字幕更生动</p>
            </div>
          </div>

          <!-- 贴纸折叠面板 -->
          <div class="border border-gray-700 rounded-lg overflow-hidden">
            <button
              class="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
              @click="subtitleSections.sticker = !subtitleSections.sticker"
            >
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 bg-blue-500 rounded"></div>
                <span class="text-sm font-medium text-gray-200">贴纸</span>
              </div>
              <component :is="subtitleSections.sticker ? ChevronUp : ChevronDown" :size="18" class="text-gray-400" />
            </button>
            <div v-show="subtitleSections.sticker" class="p-4 bg-gray-800/50">
              <button
                class="w-full px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                @click="showStickerLibraryModal = true"
              >
                <Layers :size="18" />
                <span>打开贴纸库</span>
              </button>
              <p class="text-xs text-gray-500 mt-2 text-center">添加贴纸装饰，丰富字幕效果</p>

              <!-- 当前贴纸与控制 -->
              <div v-if="config.subtitleSticker" class="space-y-3 mt-2">
                <!-- 当前选择预览 -->
                <div class="flex items-center gap-3">
                  <span class="text-xs text-gray-400">当前贴纸</span>
                  <div class="px-2 py-1 rounded-lg bg-gray-700 text-gray-100 flex items-center gap-2">
                    <span class="text-2xl leading-none">{{ stickerEmojiMap[config.subtitleSticker] || '✨' }}</span>
                    <span class="text-xs text-gray-400">ID: {{ config.subtitleSticker }}</span>
                  </div>
                </div>

                <!-- 位置与缩放控制 -->
                <div class="grid grid-cols-3 gap-3">
                  <!-- X（水平百分比） -->
                  <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">水平位置 X (%)</label>
                    <input v-model.number="config.stickerX" type="range" min="0" max="100" class="range-slider" />
                    <input v-model.number="config.stickerX" type="number" min="0" max="100" class="input-primary mt-1" />
                  </div>
                  <!-- Y（垂直百分比） -->
                  <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">垂直位置 Y (%)</label>
                    <input v-model.number="config.stickerY" type="range" min="0" max="100" class="range-slider" />
                    <input v-model.number="config.stickerY" type="number" min="0" max="100" class="input-primary mt-1" />
                  </div>
                  <!-- Scale（百分比） -->
                  <div>
                    <label class="block text-xs font-medium text-gray-300 mb-1">大小 Scale (%)</label>
                    <input v-model.number="config.stickerScale" type="range" min="10" max="200" class="range-slider" />
                    <input v-model.number="config.stickerScale" type="number" min="10" max="200" class="input-primary mt-1" />
                  </div>
                </div>

                <!-- 重置默认 -->
                <div class="flex justify-end">
                  <button class="px-3 py-1.5 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600 transition-colors" @click="resetSticker()">重置默认</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 关键字折叠面板 -->
          <div class="border border-gray-700 rounded-lg overflow-hidden">
            <button
              class="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
              @click="subtitleSections.keyword = !subtitleSections.keyword"
            >
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 bg-orange-500 rounded"></div>
                <span class="text-sm font-medium text-gray-200">关键字</span>
              </div>
              <component :is="subtitleSections.keyword ? ChevronUp : ChevronDown" :size="18" class="text-gray-400" />
            </button>
            <div v-show="subtitleSections.keyword" class="p-4 bg-gray-800/50 space-y-4">
              <!-- 启用关键字高亮 -->
              <div class="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div class="flex items-center gap-2">
                  <Sparkles :size="16" class="text-orange-400" />
                  <label class="text-sm font-medium text-gray-200">启用关键字高亮</label>
                </div>
                <Switch
                  v-model="config.enableKeywordHighlight"
                  :class="config.enableKeywordHighlight ? 'bg-orange-600' : 'bg-gray-700'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                >
                  <span class="sr-only">启用关键字高亮</span>
                  <span
                    :class="config.enableKeywordHighlight ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  />
                </Switch>
              </div>

              <!-- 关键字配置 -->
              <div v-if="config.enableKeywordHighlight" class="space-y-4">
                <p class="text-xs text-gray-400">
                  开启后，系统将在视频生成阶段自动提取关键字并突出显示
                </p>

                <!-- 关键字颜色 -->
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">关键字颜色</label>
                  <div class="flex items-center gap-2">
                    <input
                      v-model="config.keywordColor"
                      type="color"
                      class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                    />
                    <input
                      v-model="config.keywordColor"
                      type="text"
                      class="input-primary flex-1"
                      placeholder="#FFD700"
                    />
                  </div>
                </div>

                <!-- 关键字背景颜色和透明度 -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">关键字背景颜色</label>
                    <div class="flex items-center gap-2">
                      <input
                        v-model="config.keywordBackgroundColor"
                        type="color"
                        class="h-10 w-16 rounded cursor-pointer border-2 border-gray-600"
                      />
                      <input
                        v-model="config.keywordBackgroundColor"
                        type="text"
                        class="input-primary flex-1"
                        placeholder="#FF4500"
                      />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">背景透明度</label>
                    <input
                      v-model.number="config.keywordBackgroundOpacity"
                      type="number"
                      min="0"
                      max="100"
                      class="input-primary"
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 音色配置 -->
        <div v-if="activeSheet === 'voice'" class="p-6 space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">音色类型</label>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="voice in voiceTypes"
                  :key="voice.id"
                  class="voice-card"
                  :class="{ 'selected': config.voiceType === voice.id }"
                  @click="config.voiceType = voice.id"
                >
                  <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <component :is="voice.icon" :size="16" class="text-gray-300" />
                  </div>
                  <div>
                    <h6 class="font-medium text-gray-50">{{ voice.name }}</h6>
                    <p class="text-xs text-gray-400">{{ voice.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">语速</label>
              <input
                v-model="config.voiceSpeed"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                class="range-slider"
              />
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>慢</span>
                <span>{{ config.voiceSpeed }}x</span>
                <span>快</span>
              </div>
            </div>
            
            <!-- 定制音色按钮 -->
            <div>
              <button
                class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                @click="handleVoiceCloneClick"
              >
                <Mic :size="20" />
                <span>定制专属音色</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧预览面板 -->
    <div class="w-1/2 flex flex-col bg-gray-800">
      <!-- 预览标题 -->
      <div class="p-4 border-b border-gray-700">
        <h4 class="text-lg font-semibold text-gray-200">实时预览</h4>
      </div>

      <!-- 预览内容 -->
      <div class="flex-1 p-6 flex items-center justify-center">
        <div 
          class="preview-container"
          :class="config.aspectRatio === '9:16' ? 'preview-vertical' : 'preview-horizontal'"
        >
          <div
            class="preview-frame"
            :class="config.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'"
          >
            <!-- 预览内容 -->
            <div ref="previewRef" class="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white relative overflow-hidden">
              <!-- 标题预览（绝对定位，可选顶部/中间/底部；支持动画与双向绑定） -->
              <div
                v-if="config.enableMainTitle || config.enableSubTitle"
                class="absolute inset-x-4"
                :class="titleContainerPositionClass"
              >
                <div :class="titleAlignmentClass" class="max-w-[92%] mx-auto">
                  <!-- 主标题（contenteditable，双向数据绑定） -->
                  <div
                    v-if="config.enableMainTitle"
                    ref="mainTitleRef"
                    class="title-text title-h1 select-text"
                    contenteditable="true"
                    :style="mainTitleStyle"
                    :class="[titleAnimationClass]"
                    @input="onMainTitleInput"
                  >{{ safeMainTitle }}</div>

                  <!-- 副标题（contenteditable，双向数据绑定） -->
                  <div
                    v-if="config.enableSubTitle"
                    ref="subTitleRef"
                    class="mt-2 title-text title-h2 select-text"
                    contenteditable="true"
                    :style="subTitleStyle"
                    :class="['opacity-90', titleAnimationClass]"
                    @input="onSubTitleInput"
                  >{{ safeSubTitle }}</div>
                </div>
              </div>

              <!-- 背景信息（非标题，仅作辅助预览说明） -->
              <div class="absolute left-4 bottom-4 text-xs opacity-80">
                <p>{{ config.aspectRatio === '9:16' ? '竖版视频' : '横版视频' }}</p>
                <p class="mt-1">{{ config.duration }}秒 • {{ config.resolution }} • {{ config.fps }}fps</p>
              </div>

              <!-- 贴纸预览（div 贴纸，支持拖拽与缩放） -->
              <div v-if="config.subtitleSticker" ref="stickerRef" class="absolute select-none touch-none will-change-transform" :style="stickerStyle" @pointerdown="onStickerPointerDown">
                <span class="text-3xl leading-none">{{ stickerEmojiMap[config.subtitleSticker] || '✨' }}</span>
                <!-- 右下角缩放手柄 -->
                <div class="sticker-resize-handle" @pointerdown.stop="onResizePointerDown"></div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    

    <!-- 保存模板模态框 -->
    <SaveTemplateModal
      v-if="showSaveTemplateModal"
      :config="config"
      @close="showSaveTemplateModal = false"
      @save="handleSaveTemplate"
    />

    <!-- 模板库模态框 -->
    <TemplateLibraryModal
      v-if="showTemplateLibraryModal"
      @close="showTemplateLibraryModal = false"
      @select="loadTemplate"
    />

    <!-- 转场效果库模态框 -->
    <TransitionLibraryModal
      v-if="showTransitionLibraryModal"
      @close="showTransitionLibraryModal = false"
      @select="(t: string) => config.transition = t"
    />

    <!-- 花字字体库模态框 -->
    <FontLibraryModal
      v-if="showFontLibraryModal"
      @close="showFontLibraryModal = false"
      @select="(fontId: string) => config.subtitleFont = fontId"
    />

    <!-- 贴纸库模态框 -->
    <StickerLibraryModal
      v-if="showStickerLibraryModal"
      @close="showStickerLibraryModal = false"
      @select="(stickerId: string) => config.subtitleSticker = stickerId"
    />

    <!-- 音色克隆模态框 -->
    <VoiceCloneModal />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { Switch } from '@headlessui/vue'
import {
  Save,
  Trash2,
  Settings,
  Type,
  Mic,
  Palette,
  Layers,
  Database,
  Shield,
  Heart,
  Zap,
  Drama,
  Heading,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-vue-next'
import SaveTemplateModal from './components/SaveTemplateModal.vue'
import TemplateLibraryModal from './components/TemplateLibraryModal.vue'
import TransitionLibraryModal from './components/TransitionLibraryModal.vue'
import FontLibraryModal from './components/FontLibraryModal.vue'
import StickerLibraryModal from './components/StickerLibraryModal.vue'
import VoiceCloneModal from '../../../../components/VoiceCloneModal.vue'
import { useVideoStore } from '../../../../store/video'

// 导入音色图标 - 使用 Lucide 图标替代 SVG 文件
// import authoritativeIcon from '../../../../assets/icons/voice/authoritative.svg'
// import calmIcon from '../../../../assets/icons/voice/calm.svg'
// import energeticIcon from '../../../../assets/icons/voice/energetic.svg'
// import dramaticIcon from '../../../../assets/icons/voice/dramatic.svg'

// Sheet配置
const sheets = [
  { id: 'template', name: '模板', icon: Palette },
  { id: 'params', name: '基础', icon: Settings },
  { id: 'title', name: '标题', icon: Heading },
  { id: 'subtitle', name: '字幕', icon: Type },
  { id: 'voice', name: '音色', icon: Mic }
]

const activeSheet = ref('template')
const selectedTemplate = ref<string | null>(null)

// 字幕配置折叠状态
const subtitleSections = reactive({
  basic: false,      // 基础配置默认折叠
  fancy: false,      // 花字默认折叠
  sticker: false,    // 贴纸默认折叠
  keyword: false     // 关键字默认折叠
})

// 初始化 videoStore
const videoStore = useVideoStore()

// 配置数据
const config = reactive({
  aspectRatio: '9:16',
  title: '',
  videoCount: 3,
  duration: 60,
  resolution: '1080p',
  fps: 30,
  style: 'modern',
  transition: 'fade',
  enableSubtitles: true,
  subtitleStyle: 'modern',
  subtitlePosition: 'template1',
  subtitleFont: '思源黑体Heavy',
  subtitleSticker: '',
  // 贴纸位置与缩放（百分比）
  stickerX: 50,
  stickerY: 80,
  stickerScale: 100,
  subtitleColor: '#FFFFFF',
  subtitleSize: 12,
  subtitleStrokeColor: '#000000',
  subtitleStrokeWidth: 0,
  subtitleShadowDepth: 0,
  subtitleBackgroundColor: '#FFFFFF',
  subtitleBackgroundOpacity: 0,
  // 关键字配置
  enableKeywordHighlight: false,            // 启用关键字高亮
  keywordColor: '#FFD700',                  // 关键字颜色
  keywordBackgroundColor: '#FF4500',        // 关键字背景色
  keywordBackgroundOpacity: 30,             // 关键字背景透明度
  voiceType: 'authoritative',
  voiceSpeed: 1.0,
  // 标题配置
  titlePosition: 'top',
  titleSpacing: 0,
  titleAlignment: 'left',
  titleAnimation: 'none',
  // 主标题配置
  enableMainTitle: true,
  mainTitle: '',
  mainTitleFont: '',
  mainTitleLetterSpacing: 0,
  mainTitleSize: 32,
  mainTitleColor: '#333333',
  // 副标题配置
  enableSubTitle: false,
  subTitle: '',
  subTitleFont: '',
  subTitleLetterSpacing: 0,
  subTitleSize: 28,
  subTitleColor: '#333333'
})

// 选项数据
const transitions = [
  { value: 'fade', label: '淡入淡出' },
  { value: 'cut', label: '硬切' },
  { value: 'slide', label: '推拉' },
  { value: 'zoom', label: '缩放' }
]

const subtitleStyles = [
  { value: 'modern', label: '现代' },
  { value: 'classic', label: '经典' },
  { value: 'bold', label: '粗体' }
]

const subtitlePositions = [
  { value: 'top', label: '顶部' },
  { value: 'bottom', label: '底部' }
]

const voiceTypes = [
  { id: 'authoritative', name: '权威', description: '专业稳重', icon: Shield },
  { id: 'calm', name: '平静', description: '温和舒缓', icon: Heart },
  { id: 'energetic', name: '活力', description: '充满激情', icon: Zap },
  { id: 'dramatic', name: '戏剧', description: '富有表现力', icon: Drama }
]

// 模板数据
const savedTemplates = ref([
  { id: '1', name: '产品宣传模板', description: '适合产品展示的竖版模板' },
  { id: '2', name: '社媒营销模板', description: '适合社交媒体的横版模板' }
])

// 模态框状态
const showSaveTemplateModal = ref(false)
const showTemplateLibraryModal = ref(false)
const showTransitionLibraryModal = ref(false)
const showFontLibraryModal = ref(false)
const showStickerLibraryModal = ref(false)

// 方法
const loadTemplate = (template: any) => {
  console.log('加载模板:', template)
  selectedTemplate.value = template.id
  // 应用模板配置到实际配置中
  if (template.config) {
    Object.assign(config, template.config)
  }
}

const deleteTemplate = (id: string) => {
  savedTemplates.value = savedTemplates.value.filter(t => t.id !== id)
}


/**
 * 贴纸（div）配置与交互
 */
const stickerEmojiMap: Record<string, string> = {
  heart: '❤️',
  star: '✨',
  smile: '😊',
  fire: '🔥',
  arrow: '➡️',
  flag: '🚩',
  sparkles: '💫',
  check: '✅'
}

// 预览容器与贴纸元素引用
const previewRef = ref<HTMLElement | null>(null)
const stickerRef = ref<HTMLElement | null>(null)

// 贴纸样式（基于百分比位置与缩放）
const stickerStyle = computed(() => {
  const scale = (config.stickerScale || 100) / 100
  return {
    left: `${config.stickerX}%`,
    top: `${config.stickerY}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition: 'transform 120ms ease, left 120ms ease, top 120ms ease'
  } as Record<string, string>
})

// 拖拽与缩放状态
let dragActive = false
let resizeActive = false

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// rAF 渲染（在频繁交互时更平滑）
let rafId: number | null = null
function scheduleRender() {
  if (rafId != null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const el = stickerRef.value
    if (!el) return
    const scale = (config.stickerScale || 100) / 100
    el.style.left = `${config.stickerX}%`
    el.style.top = `${config.stickerY}%`
    el.style.transform = `translate(-50%, -50%) scale(${scale})`
  })
}

function onStickerPointerDown(e: PointerEvent) {
  if (!previewRef.value) return
  dragActive = true
  const rect = previewRef.value.getBoundingClientRect()
  const move = (ev: PointerEvent) => {
    if (!dragActive) return
    const xPercent = clamp(((ev.clientX - rect.left) / rect.width) * 100, 0, 100)
    const yPercent = clamp(((ev.clientY - rect.top) / rect.height) * 100, 0, 100)
    config.stickerX = Math.round(xPercent)
    config.stickerY = Math.round(yPercent)
    scheduleRender()
  }
  const up = () => {
    dragActive = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

function onResizePointerDown(e: PointerEvent) {
  if (!previewRef.value || !stickerRef.value) return
  resizeActive = true
  const rect = previewRef.value.getBoundingClientRect()
  const startX = e.clientX
  const startY = e.clientY
  const initialScale = config.stickerScale
  const diag = Math.sqrt(rect.width * rect.width + rect.height * rect.height)
  const move = (ev: PointerEvent) => {
    if (!resizeActive) return
    const delta = Math.sqrt((ev.clientX - startX) ** 2 + (ev.clientY - startY) ** 2)
    const deltaPercent = (delta / diag) * 200 // 大致映射到 0-200%
    config.stickerScale = clamp(Math.round(initialScale + deltaPercent), 10, 200)
    scheduleRender()
  }
  const up = () => {
    resizeActive = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

// 持久化（仅贴纸相关字段）
const STICKER_STORAGE_KEY = 'video_sticker_state_v1'
let saveTimer: number | null = null
function saveDebounced() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    const payload = {
      subtitleSticker: config.subtitleSticker,
      stickerX: config.stickerX,
      stickerY: config.stickerY,
      stickerScale: config.stickerScale
    }
    localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify(payload))
    saveTimer = null
  }, 250)
}

function loadStickerState() {
  try {
    const raw = localStorage.getItem(STICKER_STORAGE_KEY)
    if (!raw) return
    const s = JSON.parse(raw)
    if (typeof s.subtitleSticker === 'string') config.subtitleSticker = s.subtitleSticker
    if (typeof s.stickerX === 'number') config.stickerX = clamp(s.stickerX, 0, 100)
    if (typeof s.stickerY === 'number') config.stickerY = clamp(s.stickerY, 0, 100)
    if (typeof s.stickerScale === 'number') config.stickerScale = clamp(s.stickerScale, 10, 200)
  } catch {}
}

watch(() => [config.subtitleSticker, config.stickerX, config.stickerY, config.stickerScale], saveDebounced, { deep: false })

function resetSticker() {
  config.stickerX = 50
  config.stickerY = 80
  config.stickerScale = 100
  scheduleRender()
}

onMounted(() => {
  loadStickerState()
  scheduleRender()
})


/**
 * 标题（主/副标题）样式与交互
 */
const mainTitleRef = ref<HTMLElement | null>(null)
const subTitleRef = ref<HTMLElement | null>(null)

// 安全文本（空值回退到默认）
const safeMainTitle = computed(() => {
  const t = (config.mainTitle || '').trim()
  return t.length ? t : '视频标题'
})
const safeSubTitle = computed(() => {
  const t = (config.subTitle || '').trim()
  return t.length ? t : '副标题'
})

// 标题容器位置类（顶部/中间/底部）
const titleContainerPositionClass = computed(() => {
  switch (config.titlePosition) {
    case 'top':
      return 'top-6'
    case 'center':
      return 'top-1/2 -translate-y-1/2'
    case 'bottom':
      return 'bottom-6'
    default:
      return 'top-6'
  }
})

// 对齐方式类
const titleAlignmentClass = computed(() => {
  switch (config.titleAlignment) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
})

// 动画类
const titleAnimationClass = computed(() => {
  switch (config.titleAnimation) {
    case 'fade':
      return 'title-anim-fade'
    case 'slide-up':
      return 'title-anim-slide-up'
    case 'slide-down':
      return 'title-anim-slide-down'
    default:
      return ''
  }
})

// 颜色合法性校验
function isValidHexColor(v: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)
}

// 主标题样式
const mainTitleStyle = computed(() => {
  const hasSize = Number.isFinite(Number(config.mainTitleSize))
  const spacing = clamp(config.mainTitleLetterSpacing ?? 0, -200, 200)
  const color = isValidHexColor(config.mainTitleColor || '')
    ? config.mainTitleColor!
    : 'var(--title-color, #333333)'
  return {
    color,
    fontFamily: config.mainTitleFont || 'var(--title-font-family, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif)',
    fontSize: hasSize ? `${clamp(Number(config.mainTitleSize), 12, 150)}px` : 'var(--title-font-size-h1, 2rem)',
    fontWeight: 'var(--title-font-weight, 600)',
    letterSpacing: `${spacing}px`,
    lineHeight: 'var(--title-line-height, 1.3)',
    whiteSpace: 'var(--title-white-space, nowrap)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textDecoration: 'none'
  } as Record<string, string>
})

// 副标题样式
const subTitleStyle = computed(() => {
  const hasSize = Number.isFinite(Number(config.subTitleSize))
  const spacing = clamp(config.subTitleLetterSpacing ?? 0, -200, 200)
  const color = isValidHexColor(config.subTitleColor || '')
    ? config.subTitleColor!
    : 'var(--title-color, #333333)'
  const mt = (config.titleSpacing ?? 0)
  return {
    color,
    fontFamily: config.subTitleFont || 'var(--title-font-family, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif)',
    fontSize: hasSize ? `${clamp(Number(config.subTitleSize), 10, 120)}px` : 'var(--title-font-size-h2, 1.75rem)',
    fontWeight: 'var(--title-font-weight, 600)',
    letterSpacing: `${spacing}px`,
    lineHeight: 'var(--title-line-height, 1.3)',
    marginTop: mt ? `${clamp(Number(mt), 0, 100)}px` : 'var(--title-spacing, 0.5em)',
    whiteSpace: 'var(--title-white-space, nowrap)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textDecoration: 'none'
  } as Record<string, string>
})

// 双向绑定（在预览区编辑内容时，同步回配置）
function sanitizeInlineText(el: HTMLElement | null) {
  if (!el) return ''
  // 只保留纯文本，去掉换行和多余空格
  return el.innerText.replace(/\s+/g, ' ').trim()
}

function onMainTitleInput(e: Event) {
  const t = sanitizeInlineText(e.target as HTMLElement)
  // 适度限制长度，过长时自动截断
  config.mainTitle = t.slice(0, 120)
}

function onSubTitleInput(e: Event) {
  const t = sanitizeInlineText(e.target as HTMLElement)
  config.subTitle = t.slice(0, 160)
}

// 参数范围校验与回退
watch(() => config.mainTitleSize, (v) => { config.mainTitleSize = clamp(Number(v) || 32, 12, 150) })
watch(() => config.subTitleSize, (v) => { config.subTitleSize = clamp(Number(v) || 28, 10, 120) })
watch(() => config.titleSpacing, (v) => { config.titleSpacing = clamp(Number(v) || 0, 0, 100) })
watch(() => config.mainTitleLetterSpacing, (v) => { config.mainTitleLetterSpacing = clamp(Number(v) || 0, -200, 200) })
watch(() => config.subTitleLetterSpacing, (v) => { config.subTitleLetterSpacing = clamp(Number(v) || 0, -200, 200) })
watch(() => config.mainTitleColor, (v) => { if (!isValidHexColor(String(v))) config.mainTitleColor = '#FFFFFF' })
watch(() => config.subTitleColor, (v) => { if (!isValidHexColor(String(v))) config.subTitleColor = '#FFFFFF' })



const handleSaveTemplate = (templateData: any) => {
  savedTemplates.value.push({
    id: Date.now().toString(),
    name: templateData.name,
    description: templateData.description
  })
  showSaveTemplateModal.value = false
}

// 处理音色克隆点击
const handleVoiceCloneClick = () => {
  videoStore.toggleVoiceModal()
}
</script>

<style scoped>
.sheet-tab {
  @apply flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-50 hover:bg-gray-700 transition-all;
}

.sheet-tab.active {
  @apply text-blue-400 bg-gray-700 border-b-2 border-blue-400;
}

.template-card {
  @apply bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.template-card.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.template-item {
  @apply bg-gray-700 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.template-item.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.input-primary {
  @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all;
}

.range-slider {
  @apply w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer;
}

.range-slider::-webkit-slider-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full appearance-none;
}

.btn-option {
  @apply px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition-colors;
}

.btn-option.active {
  @apply bg-blue-600 text-white;
}

.voice-card {
  @apply flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-600;
}

.voice-card.selected {
  @apply ring-2 ring-blue-500 bg-gray-600;
}

.preview-container {
  @apply w-full;
}

.preview-vertical {
  @apply max-w-xs;
}

.preview-horizontal {
  @apply max-w-md;
}

.preview-frame {
  @apply w-full bg-gray-700 rounded-lg overflow-hidden relative;
}

/* 标题组件默认主题变量（便于后续通过主题/全局覆写） */
.title-theme {
  /* 字体与层级大小 */
  --title-font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --title-font-size-h1: 2rem;   /* ~32px */
  --title-font-size-h2: 1.75rem;/* ~28px */
  --title-font-weight: 600;     /* 中等偏粗 */
  --title-line-height: 1.3;     /* 1.2 - 1.5 推荐中值 */

  /* 颜色与背景（在深色预览背景上使用浅色遮罩以保证对比度） */
  --title-color: #333333;                   /* 深色文字，>=4.5:1 */
  --title-bg: rgba(255,255,255,0.85);       /* 预览默认：浅色半透明，提高可读性 */

  /* 间距布局 */
  --title-padding-y: 0.5em;
  --title-padding-x: 0;
  --title-margin-bottom: 0.75em;
  --title-text-align: left;
  --title-spacing: 0.5em;                   /* 主副标题间距（在未显式设置时使用） */

  /* 文本呈现 */
  --title-white-space: nowrap;              /* 默认不换行 */
  --title-mobile-decrease: 0.25rem;         /* 移动端字号适当缩小 */
}

/* 标题容器（适配默认主题变量） */
.title-block {
  background: var(--title-bg, rgba(255,255,255,0.85));
  padding: var(--title-padding-y, 0.5em) var(--title-padding-x, 0);
  margin-bottom: var(--title-margin-bottom, 0.75em);
  text-align: var(--title-text-align, left);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  border-radius: 8px;
}

/* 标题文本默认行为 */
.title-text {
  color: var(--title-color, #333333);
  white-space: var(--title-white-space, nowrap);
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-family: var(--title-font-family, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif);
  line-height: var(--title-line-height, 1.3);
  font-weight: var(--title-font-weight, 600);
}

/* 层级对应默认字号（可被内联样式或配置覆盖） */
.title-h1 { font-size: var(--title-font-size-h1, 2rem); }
.title-h2 { font-size: var(--title-font-size-h2, 1.75rem); }

/* 移动端字号适配 */
@media (max-width: 640px) {
  .title-h1 { font-size: calc(var(--title-font-size-h1, 2rem) - var(--title-mobile-decrease, 0.25rem)); }
  .title-h2 { font-size: calc(var(--title-font-size-h2, 1.75rem) - var(--title-mobile-decrease, 0.25rem)); }
}

/* 贴纸缩放手柄样式 */
.sticker-resize-handle {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  cursor: nwse-resize;
}

/* 文本自动截断/换行（多行省略） */
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标题动画效果 */
@keyframes titleFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.title-anim-fade {
  animation: titleFadeIn 400ms ease-out both;
}

@keyframes titleSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.title-anim-slide-up {
  animation: titleSlideUp 420ms ease-out both;
}

@keyframes titleSlideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}
.title-anim-slide-down {
  animation: titleSlideDown 420ms ease-out both;
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