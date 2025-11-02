<template>
  <div class="style-manager">
    <!-- 风格列表 -->
    <div class="style-list space-y-4">
      <!-- 我的风格分类 -->
      <div v-if="props.myStyles && props.myStyles.length > 0" class="my-styles">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h4 class="text-sm font-semibold text-gray-300">我的风格</h4>
            <span class="text-xs text-gray-500">({{ props.myStyles.length }})</span>
          </div>
          <button
            class="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            @click="openCreateModal"
          >
            <Plus :size="16" />
            创建新风格
          </button>
        </div>
        
        <!-- 横向滚动容器 -->
        <div class="overflow-x-auto scrollbar-thin pb-2">
          <div class="flex gap-3 min-w-max">
            <div
              v-for="style in props.myStyles"
              :key="style.id"
              class="flex-shrink-0 w-32 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-pointer group relative"
              :class="{ 'border-blue-500 bg-blue-500/10': selectedStyleId === style.id }"
              @click="selectStyle(style)"
            >
              <!-- 头像 -->
              <div class="flex justify-center mb-2">
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" :class="style.color">
                  {{ style.name.substring(0, 2) }}
                </div>
              </div>
              
              <!-- 名称 -->
              <h4 class="text-sm font-medium text-gray-50 text-center truncate">{{ style.name }}</h4>
              
              <!-- 操作按钮 - 悬浮显示 -->
              <div class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-1 bg-gray-900/80 text-gray-400 hover:text-blue-400 rounded transition-colors"
                  @click.stop="editMyStyle(style)"
                  title="编辑"
                >
                  <Edit3 :size="12" />
                </button>
                <button
                  class="p-1 bg-gray-900/80 text-gray-400 hover:text-red-400 rounded transition-colors"
                  @click.stop="deleteStyle(style)"
                  title="删除"
                >
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统预设分类 -->
      <div class="preset-styles">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-1 h-4 bg-purple-500 rounded-full"></div>
          <h4 class="text-sm font-semibold text-gray-300">系统预设</h4>
          <span class="text-xs text-gray-500">({{ systemStyles.length }})</span>
        </div>
        
        <!-- 横向滚动容器 -->
        <div class="overflow-x-auto scrollbar-thin pb-2">
          <div class="flex gap-3 min-w-max">
            <div
              v-for="style in systemStyles"
              :key="style.id"
              class="flex-shrink-0 w-32 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all cursor-pointer group relative"
              :class="{ 'border-purple-500 bg-purple-500/10': selectedStyleId === style.id }"
              @click="selectStyle(style)"
            >
              <!-- 头像 -->
              <div class="flex justify-center mb-2">
                <div class="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" :class="style.color">
                  {{ style.name.substring(0, 2) }}
                </div>
              </div>
              
              <!-- 名称 -->
              <h4 class="text-sm font-medium text-gray-50 text-center truncate">{{ style.name }}</h4>
              
              <!-- 编辑按钮 - 悬浮显示 -->
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-1 bg-gray-900/80 text-gray-400 hover:text-purple-400 rounded transition-colors"
                  @click.stop="editSystemStyle(style)"
                  title="编辑内容"
                >
                  <Edit3 :size="12" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建风格模态框 - 两步流程 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 class="text-xl font-bold text-gray-50">{{ isEditMode ? '编辑风格' : '创建新风格' }}</h3>
            <p class="text-sm text-gray-400 mt-1">
              <span v-if="createStep === 1">第一步：配置风格基础信息</span>
              <span v-else-if="createStep === 2">正在学习风格特征...</span>
              <span v-else>第三步：审核和编辑风格内容</span>
            </p>
          </div>
          <button
            class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
            @click="closeCreateModal"
          >
            <X :size="24" />
          </button>
        </div>

        <!-- 步骤指示器 -->
        <div class="px-6 py-4 bg-gray-900/50 border-b border-gray-700">
          <div class="flex items-center justify-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="createStep >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                1
              </div>
              <span class="text-sm" :class="createStep >= 1 ? 'text-gray-200' : 'text-gray-500'">基础配置</span>
            </div>
            <div class="w-12 h-0.5" :class="createStep >= 2 ? 'bg-purple-500' : 'bg-gray-700'"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="createStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                2
              </div>
              <span class="text-sm" :class="createStep >= 2 ? 'text-gray-200' : 'text-gray-500'">AI学习</span>
            </div>
            <div class="w-12 h-0.5" :class="createStep >= 3 ? 'bg-purple-500' : 'bg-gray-700'"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="createStep >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                3
              </div>
              <span class="text-sm" :class="createStep >= 3 ? 'text-gray-200' : 'text-gray-500'">完成</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- 第一步：基础配置 -->
          <div v-if="createStep === 1" class="space-y-6">
            <!-- 风格名称 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">风格名称 <span class="text-red-400">*</span></label>
              <input
                v-model="styleForm.name"
                type="text"
                placeholder="例如：雷军风格、华与华风格"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                required
              />
            </div>

            <!-- 风格描述 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">风格描述 <span class="text-gray-500">(选填)</span></label>
              <textarea
                v-model="styleForm.description"
                rows="3"
                placeholder="描述这个风格的特点和适用场景..."
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
              ></textarea>
            </div>

            <!-- 风格颜色 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">风格颜色</label>
              <div class="flex gap-3">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  type="button"
                  class="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                  :class="[
                    color.value,
                    styleForm.color === color.value ? 'border-white scale-110 ring-2 ring-white/50' : 'border-gray-600'
                  ]"
                  @click="styleForm.color = color.value"
                ></button>
              </div>
            </div>

            <!-- 知识来源选择 -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-300">知识来源 <span class="text-red-400">*</span></label>
              
              <!-- 来源类型标签 -->
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="sourceTab === 'cloud' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-gray-200'"
                  @click="sourceTab = 'cloud'"
                >
                  <FolderOpen :size="16" class="inline mr-1" />
                  云盘文档
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="sourceTab === 'url' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-gray-200'"
                  @click="sourceTab = 'url'"
                >
                  <Link2 :size="16" class="inline mr-1" />
                  在线网址
                </button>
              </div>

              <!-- 云盘文档选择 -->
              <div v-if="sourceTab === 'cloud'" class="space-y-3">
                <button
                  type="button"
                  class="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center justify-center gap-2"
                  @click="showCloudSelector = true"
                >
                  <FolderOpen :size="18" />
                  从云盘选择文档（支持多选）
                </button>

                <!-- 已选择的文档 -->
                <div v-if="selectedCloudFiles.length > 0" class="space-y-2">
                  <div class="text-xs text-gray-400 mb-2">已选择 {{ selectedCloudFiles.length }} 个文档：</div>
                  <div
                    v-for="file in selectedCloudFiles"
                    :key="file.id"
                    class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                  >
                    <FileText :size="16" class="text-blue-400" />
                    <span class="flex-1 text-sm text-gray-300">{{ file.name }}</span>
                    <button
                      type="button"
                      class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      @click="removeCloudFile(file.id)"
                    >
                      <X :size="16" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 在线网址输入 -->
              <div v-if="sourceTab === 'url'" class="space-y-3">
                <div class="flex gap-2">
                  <input
                    v-model="urlInput"
                    type="url"
                    placeholder="输入知识库网址，如 https://example.com"
                    class="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                    @keyup.enter="addUrl"
                  />
                  <button
                    type="button"
                    class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    @click="addUrl"
                  >
                    添加
                  </button>
                </div>

                <!-- 已添加的网址 -->
                <div v-if="selectedUrls.length > 0" class="space-y-2">
                  <div class="text-xs text-gray-400 mb-2">已添加 {{ selectedUrls.length }} 个网址：</div>
                  <div
                    v-for="(url, index) in selectedUrls"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                  >
                    <Link2 :size="16" class="text-green-400" />
                    <span class="flex-1 text-sm text-gray-300 truncate">{{ url }}</span>
                    <button
                      type="button"
                      class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      @click="removeUrl(index)"
                    >
                      <X :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 第二步：AI学习进度 -->
          <div v-if="createStep === 2" class="flex items-center justify-center py-12">
            <div class="text-center max-w-md">
              <div class="mb-6">
                <div class="w-20 h-20 mx-auto mb-4 relative">
                  <div class="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                  <div class="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <Sparkles :size="32" class="text-purple-400" />
                  </div>
                </div>
              </div>
              
              <h4 class="text-lg font-semibold text-gray-200 mb-2">{{ learningStatus.message }}</h4>
              <p class="text-sm text-gray-400 mb-6">{{ learningStatus.detail }}</p>
              
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  :style="{ width: learningStatus.progress + '%' }"
                ></div>
              </div>
              <div class="mt-2 text-sm text-gray-400">{{ learningStatus.progress }}%</div>
            </div>
          </div>

          <!-- 第三步：风格内容编辑 -->
          <div v-if="createStep === 3" class="space-y-4">
            <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle :size="20" class="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="text-green-400 font-medium mb-1">风格学习完成！</h4>
                <p class="text-sm text-gray-400">AI已成功分析您提供的知识源，并生成了以下风格特征。您可以查看和编辑生成的内容。</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">生成的风格内容（可编辑）</label>
              <textarea
                v-model="generatedStyleContent"
                rows="15"
                class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
                placeholder="风格内容将在这里显示..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-2">支持 Markdown 格式，保存后将作为该风格的核心特征。</p>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="border-t border-gray-700 p-6 flex items-center justify-between bg-gray-900/50">
          <button
            v-if="createStep === 1"
            type="button"
            class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            @click="closeCreateModal"
          >
            取消
          </button>
          <button
            v-else-if="createStep === 3"
            type="button"
            class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            @click="createStep = 1"
          >
            返回修改
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              v-if="createStep === 1"
              type="button"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canProceedToStep2"
              @click="startLearning"
            >
              开始学习风格
            </button>
            <button
              v-else-if="createStep === 3"
              type="button"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium"
              @click="saveNewStyle"
            >
              {{ isEditMode ? '保存修改' : '保存风格' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 云盘文档选择器模态框 -->
    <div v-if="showCloudSelector" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div class="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div class="p-6 border-b border-gray-700 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-200">选择云盘文档</h3>
          <button
            class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
            @click="showCloudSelector = false"
          >
            <X :size="20" />
          </button>
        </div>
        <CloudDriveSelector
          :files="cloudFiles"
          :selected-ids="selectedCloudFiles.map(f => f.id)"
          @confirm="handleCloudFilesConfirm"
          @upload="handleUploadToCloud"
        />
      </div>
    </div>

    <!-- 编辑系统风格内容模态框 -->
    <div v-if="showEditSystemStyleModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 class="text-xl font-bold text-gray-50">编辑风格内容</h3>
            <p class="text-sm text-gray-400 mt-1">{{ editingStyleData.name }}</p>
          </div>
          <button
            class="p-2 text-gray-400 hover:text-gray-200 transition-colors"
            @click="closeEditSystemStyleModal"
          >
            <X :size="24" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">风格内容（可编辑）</label>
            <textarea
              v-model="editingStyleContent"
              rows="20"
              class="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
              placeholder="风格内容..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-2">支持 Markdown 格式</p>
          </div>
        </div>

        <div class="border-t border-gray-700 p-6 flex items-center justify-end gap-3 bg-gray-900/50">
          <button
            type="button"
            class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            @click="closeEditSystemStyleModal"
          >
            取消
          </button>
          <button
            type="button"
            class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium"
            @click="saveSystemStyleContent"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Edit3, Trash2, X, FolderOpen, Link2, FileText, Sparkles, CheckCircle } from 'lucide-vue-next'
import CloudDriveSelector from '../../../../components/CloudDriveSelector.vue'

// Props
const props = defineProps<{
  selectedStyle: any
  availableStyles: any[]
  myStyles?: any[]
}>()

// Emits
const emit = defineEmits<{
  'style-select': [style: any]
  'style-create': [style: any]
  'style-update': [style: any]
  'style-delete': [styleId: string]
}>()

// 当前选中的风格 ID（用于响应式比较）
const selectedStyleId = computed(() => props.selectedStyle?.id)

// 系统预设风格（非"我的风格"）
const systemStyles = computed(() => {
  return props.availableStyles.filter(style => !style.isMine)
})

// 颜色选项
const colorOptions = [
  { value: 'bg-purple-500', name: '紫色' },
  { value: 'bg-blue-500', name: '蓝色' },
  { value: 'bg-green-500', name: '绿色' },
  { value: 'bg-orange-500', name: '橙色' },
  { value: 'bg-red-500', name: '红色' },
  { value: 'bg-pink-500', name: '粉色' },
  { value: 'bg-indigo-500', name: '靛蓝' },
  { value: 'bg-teal-500', name: '青色' }
]

// 模拟云盘文件
const cloudFiles = ref([
  {
    id: 'cf1',
    name: '公司年度报告.pdf',
    type: 'pdf',
    size: '3.2MB',
    uploadDate: '2023-10-20',
    trainingStatus: 'completed' as const
  },
  {
    id: 'cf2',
    name: '市场分析报告.docx',
    type: 'docx',
    size: '1.8MB',
    uploadDate: '2023-10-22',
    trainingStatus: 'completed' as const
  },
  {
    id: 'cf3',
    name: '产品说明书.txt',
    type: 'txt',
    size: '0.5MB',
    uploadDate: '2023-10-25',
    trainingStatus: 'completed' as const
  },
  {
    id: 'cf4',
    name: '雷军演讲稿集.pdf',
    type: 'pdf',
    size: '2.1MB',
    uploadDate: '2023-11-01',
    trainingStatus: 'completed' as const
  }
])

// 创建风格相关状态
const showCreateModal = ref(false)
const createStep = ref(1) // 1: 基础配置, 2: AI学习, 3: 编辑内容
const sourceTab = ref<'cloud' | 'url'>('cloud')
const showCloudSelector = ref(false)
const isEditMode = ref(false) // 是否为编辑模式
const editingStyleId = ref('') // 正在编辑的风格ID

const styleForm = reactive({
  name: '',
  description: '',
  color: 'bg-purple-500'
})

const selectedCloudFiles = ref<any[]>([])
const selectedUrls = ref<string[]>([])
const urlInput = ref('')

const learningStatus = reactive({
  message: '正在分析文档内容...',
  detail: '正在提取关键信息和写作特征',
  progress: 0
})

const generatedStyleContent = ref('')

// 编辑系统风格内容相关状态
const showEditSystemStyleModal = ref(false)
const editingStyleData = ref<any>({})
const editingStyleContent = ref('')

// 计算是否可以进入第二步
const canProceedToStep2 = computed(() => {
  return styleForm.name.trim() && 
         (selectedCloudFiles.value.length > 0 || selectedUrls.value.length > 0)
})

// 方法
const selectStyle = (style: any) => {
  emit('style-select', style)
}

const deleteStyle = (style: any) => {
  if (confirm(`确定要删除风格"${style.name}"吗？`)) {
    emit('style-delete', style.id)
  }
}

// 编辑系统预设风格（只编辑内容）
const editSystemStyle = (style: any) => {
  editingStyleData.value = style
  editingStyleContent.value = style.content || `# ${style.name}\n\n## 风格概述\n${style.description}\n\n...（风格内容待完善）`
  showEditSystemStyleModal.value = true
}

const closeEditSystemStyleModal = () => {
  showEditSystemStyleModal.value = false
  editingStyleData.value = {}
  editingStyleContent.value = ''
}

const saveSystemStyleContent = () => {
  const updatedStyle = {
    ...editingStyleData.value,
    content: editingStyleContent.value
  }
  emit('style-update', updatedStyle)
  alert(`风格"${updatedStyle.name}"内容已更新！`)
  closeEditSystemStyleModal()
}

// 编辑我的风格（完整编辑三步）
const editMyStyle = (style: any) => {
  isEditMode.value = true
  editingStyleId.value = style.id
  
  // 填充表单
  styleForm.name = style.name
  styleForm.description = style.description
  styleForm.color = style.color
  
  // 解析来源（模拟）
  selectedCloudFiles.value = []
  selectedUrls.value = []
  
  // 填充风格内容
  generatedStyleContent.value = style.content || ''
  
  // 打开模态框，直接进入第三步（可以返回修改前两步）
  showCreateModal.value = true
  createStep.value = 3
}

const openCreateModal = () => {
  isEditMode.value = false
  editingStyleId.value = ''
  showCreateModal.value = true
  createStep.value = 1
  resetForm()
}

const closeCreateModal = () => {
  if (createStep.value === 2) {
    return // 学习过程中不允许关闭
  }
  showCreateModal.value = false
  isEditMode.value = false
  editingStyleId.value = ''
  resetForm()
}

const resetForm = () => {
  styleForm.name = ''
  styleForm.description = ''
  styleForm.color = 'bg-purple-500'
  selectedCloudFiles.value = []
  selectedUrls.value = []
  urlInput.value = ''
  generatedStyleContent.value = ''
  createStep.value = 1
}

const handleCloudFilesConfirm = (fileIds: string[]) => {
  selectedCloudFiles.value = cloudFiles.value.filter(f => fileIds.includes(f.id))
  showCloudSelector.value = false
}

const handleUploadToCloud = () => {
  alert('上传文件功能：这里可以跳转到云盘上传页面')
  showCloudSelector.value = false
}

const removeCloudFile = (fileId: string) => {
  selectedCloudFiles.value = selectedCloudFiles.value.filter(f => f.id !== fileId)
}

const addUrl = () => {
  if (urlInput.value.trim()) {
    try {
      new URL(urlInput.value) // 验证URL格式
      selectedUrls.value.push(urlInput.value.trim())
      urlInput.value = ''
    } catch {
      alert('请输入有效的网址格式')
    }
  }
}

const removeUrl = (index: number) => {
  selectedUrls.value.splice(index, 1)
}

const startLearning = async () => {
  createStep.value = 2
  learningStatus.progress = 0
  
  // 模拟AI学习过程
  const stages = [
    { message: '正在分析文档内容...', detail: '正在提取关键信息和写作特征', progress: 20, duration: 1500 },
    { message: '正在识别写作风格...', detail: '分析语言风格、用词习惯和表达方式', progress: 45, duration: 2000 },
    { message: '正在生成风格模型...', detail: '构建风格特征库和写作规则', progress: 70, duration: 1800 },
    { message: '正在优化风格特征...', detail: '精炼风格要点，生成使用指南', progress: 90, duration: 1500 },
    { message: '学习完成！', detail: '风格特征已生成', progress: 100, duration: 500 }
  ]

  for (const stage of stages) {
    learningStatus.message = stage.message
    learningStatus.detail = stage.detail
    learningStatus.progress = stage.progress
    await new Promise(resolve => setTimeout(resolve, stage.duration))
  }

  // 生成模拟的风格内容
  generateStyleContent()
  
  // 进入第三步
  createStep.value = 3
}

const generateStyleContent = () => {
  const sources = [
    ...selectedCloudFiles.value.map(f => `- 文档：${f.name}`),
    ...selectedUrls.value.map(u => `- 网址：${u}`)
  ].join('\n')

  generatedStyleContent.value = `# ${styleForm.name}

## 风格概述
${styleForm.description}

## 知识来源
${sources}

## 核心特征

### 1. 语言风格
- **语气**：专业、严谨、富有洞察力
- **用词**：精准、简洁、具有行业深度
- **句式**：长短结合，逻辑清晰，节奏感强

### 2. 写作结构
- **开篇**：直击要点，引人入胜
- **正文**：层次分明，论据充分
- **结尾**：总结升华，留有余韵

### 3. 表达特点
- 善于运用数据和案例支撑观点
- 注重逻辑推理和因果分析
- 擅长用类比和比喻增强理解
- 语言简练有力，避免冗余

### 4. 适用场景
- 商业报告撰写
- 行业分析文章
- 产品介绍文案
- 演讲稿撰写

## 使用建议
1. 在正式场合使用此风格，能够提升专业度
2. 适合需要深度分析和逻辑论证的内容
3. 配合具体的数据和案例效果更佳

---
*此风格由 AI 基于提供的知识源自动生成，您可以根据需要进行调整。*
`
}

const saveNewStyle = () => {
  if (isEditMode.value) {
    // 编辑模式：更新现有风格
    const updatedStyle = {
      id: editingStyleId.value,
      name: styleForm.name,
      description: styleForm.description,
      color: styleForm.color,
      source: `个人创建 (${selectedCloudFiles.value.length + selectedUrls.value.length} 个来源)`,
      content: generatedStyleContent.value,
      isMine: true,
      updatedAt: new Date().toISOString()
    }

    emit('style-update', updatedStyle)
    alert(`风格"${updatedStyle.name}"更新成功！`)
  } else {
    // 创建模式：创建新风格
    const newStyle = {
      id: Date.now().toString(),
      name: styleForm.name,
      description: styleForm.description,
      color: styleForm.color,
      source: `个人创建 (${selectedCloudFiles.value.length + selectedUrls.value.length} 个来源)`,
      content: generatedStyleContent.value,
      isMine: true,
      createdAt: new Date().toISOString()
    }

    emit('style-create', newStyle)
    alert(`风格"${newStyle.name}"创建成功！`)
  }
  
  // 关闭模态框
  showCreateModal.value = false
  isEditMode.value = false
  editingStyleId.value = ''
  resetForm()
}
</script>

<style scoped>
/* 横向滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
