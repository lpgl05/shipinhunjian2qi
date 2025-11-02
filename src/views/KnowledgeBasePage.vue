<template>
  <div class="h-screen flex bg-gray-900">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航 -->
      <header class="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-50">知识库管理</h1>
          <p class="text-sm text-gray-400 mt-1">管理您的专属知识库，为AI提供专业知识支持</p>
        </div>
        <button
          class="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium flex items-center gap-2"
          @click="openCreateModal"
        >
          <Plus :size="18" />
          创建知识库
        </button>
      </header>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-7xl mx-auto">
          <!-- 知识库列表 -->
          <div v-if="knowledgeBaseStore.knowledgeBases.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="kb in knowledgeBaseStore.knowledgeBases"
              :key="kb.id"
              class="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition-all cursor-pointer group"
              @click="viewKnowledgeBase(kb)"
            >
              <!-- 状态标签 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BookOpen :size="24" class="text-purple-400" />
                  </div>
                  <div v-if="kb.status === 'building'" class="flex items-center gap-1 text-blue-400 text-xs">
                    <Loader2 :size="14" class="animate-spin" />
                    <span>构建中 {{ kb.progress }}%</span>
                  </div>
                  <div v-else-if="kb.status === 'completed'" class="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle :size="14" />
                    <span>已完成</span>
                  </div>
                  <div v-else-if="kb.status === 'failed'" class="flex items-center gap-1 text-red-400 text-xs">
                    <XCircle :size="14" />
                    <span>构建失败</span>
                  </div>
                </div>
                <button
                  class="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  @click.stop="deleteKnowledgeBase(kb.id)"
                >
                  <Trash2 :size="16" />
                </button>
              </div>

              <!-- 知识库信息 -->
              <h3 class="text-lg font-semibold text-gray-50 mb-2">{{ kb.name }}</h3>
              <p class="text-sm text-gray-400 mb-4 line-clamp-2">
                {{ kb.description || '暂无描述' }}
              </p>

              <!-- 统计信息 -->
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <FileText :size="14" />
                  <span>{{ kb.documentCount }} 个文档</span>
                </div>
                <div class="flex items-center gap-1">
                  <Calendar :size="14" />
                  <span>{{ kb.createdAt }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 bg-purple-500/10 rounded-full flex items-center justify-center">
              <BookOpen :size="40" class="text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">还没有知识库</h3>
            <p class="text-gray-500 mb-6">创建您的第一个知识库，为AI提供专业知识支持</p>
            <button
              class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium inline-flex items-center gap-2"
              @click="openCreateModal"
            >
              <Plus :size="18" />
              创建知识库
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- 创建/编辑知识库模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- 头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 class="text-xl font-bold text-gray-50">
              {{ currentStep === 1 ? '创建知识库' : currentStep === 2 ? '选择文档来源' : '构建知识库' }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">
              <span v-if="currentStep === 1">第一步：配置基本信息</span>
              <span v-else-if="currentStep === 2">第二步：添加知识来源</span>
              <span v-else>正在构建知识库...</span>
            </p>
          </div>
          <button
            class="p-2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="closeCreateModal"
            :disabled="currentStep === 3 && buildingStatus.progress < 100"
          >
            <X :size="24" />
          </button>
        </div>

        <!-- 步骤指示器 -->
        <div class="px-6 py-4 bg-gray-900/50 border-b border-gray-700">
          <div class="flex items-center justify-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="currentStep >= 1 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                1
              </div>
              <span class="text-sm" :class="currentStep >= 1 ? 'text-gray-200' : 'text-gray-500'">基本信息</span>
            </div>
            <div class="w-12 h-0.5" :class="currentStep >= 2 ? 'bg-purple-500' : 'bg-gray-700'"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                2
              </div>
              <span class="text-sm" :class="currentStep >= 2 ? 'text-gray-200' : 'text-gray-500'">添加文档</span>
            </div>
            <div class="w-12 h-0.5" :class="currentStep >= 3 ? 'bg-purple-500' : 'bg-gray-700'"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                :class="currentStep >= 3 ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'">
                3
              </div>
              <span class="text-sm" :class="currentStep >= 3 ? 'text-gray-200' : 'text-gray-500'">完成</span>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- 第一步：基本信息 -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                知识库名称 <span class="text-red-400">*</span>
              </label>
              <input
                v-model="kbForm.name"
                type="text"
                placeholder="例如：产品营销知识库、技术文档库"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
              />
            </div>

            <!-- 头像上传 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-3">
                知识库头像 <span class="text-gray-500">(选填)</span>
              </label>
              
              <!-- 当前选择的头像预览 -->
              <div v-if="kbForm.avatar" class="flex items-center gap-4 mb-3 p-3 bg-gray-700/50 rounded-lg">
                <img v-if="kbForm.avatarType === 'preset' || kbForm.avatarType === 'ai'" :src="kbForm.avatar" class="w-16 h-16 rounded-full object-cover" alt="头像预览" />
                <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {{ kbForm.name.substring(0, 2) || '知' }}
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-300">已选择头像</p>
                  <p class="text-xs text-gray-500">
                    {{ kbForm.avatarType === 'preset' ? '系统预设' : kbForm.avatarType === 'ai' ? 'AI生成' : '本地上传' }}
                  </p>
                </div>
                <button
                  type="button"
                  class="text-sm text-red-400 hover:text-red-300"
                  @click="kbForm.avatar = ''; kbForm.avatarType = ''"
                >
                  移除
                </button>
              </div>

              <!-- 上传方式选项卡 -->
              <div class="flex gap-2 mb-3">
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="avatarUploadTab === 'preset' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                  @click="avatarUploadTab = 'preset'"
                >
                  系统预设
                </button>
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="avatarUploadTab === 'upload' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                  @click="avatarUploadTab = 'upload'"
                >
                  本地上传
                </button>
                <button
                  type="button"
                  class="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="avatarUploadTab === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                  @click="avatarUploadTab = 'ai'"
                >
                  AI生成
                </button>
              </div>

              <!-- 系统预设头像 -->
              <div v-if="avatarUploadTab === 'preset'" class="grid grid-cols-6 gap-3">
                <button
                  v-for="(avatar, index) in presetAvatars"
                  :key="index"
                  type="button"
                  class="w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-110"
                  :class="kbForm.avatar === avatar ? 'border-purple-500' : 'border-gray-600 hover:border-gray-500'"
                  @click="selectPresetAvatar(avatar)"
                >
                  <img :src="avatar" class="w-full h-full object-cover" :alt="`预设头像${index + 1}`" />
                </button>
              </div>

              <!-- 本地上传 -->
              <div v-else-if="avatarUploadTab === 'upload'" class="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
                <label for="avatar-upload" class="cursor-pointer">
                  <Upload :size="32" class="mx-auto mb-2 text-gray-400" />
                  <p class="text-sm text-gray-300">点击上传头像</p>
                  <p class="text-xs text-gray-500 mt-1">支持 JPG、PNG 格式</p>
                </label>
              </div>

              <!-- AI生成 -->
              <div v-else-if="avatarUploadTab === 'ai'" class="text-center py-8 border-2 border-dashed border-purple-600/50 rounded-lg">
                <div v-if="!isGeneratingAvatar">
                  <Sparkles :size="32" class="mx-auto mb-2 text-purple-400" />
                  <p class="text-sm text-gray-300 mb-3">AI根据知识库名称生成头像</p>
                  <button
                    type="button"
                    class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all text-sm font-medium"
                    @click="generateAIAvatar"
                    :disabled="!kbForm.name.trim()"
                  >
                    生成AI头像
                  </button>
                  <p v-if="!kbForm.name.trim()" class="text-xs text-gray-500 mt-2">请先输入知识库名称</p>
                </div>
                <div v-else class="flex flex-col items-center">
                  <div class="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p class="text-sm text-gray-300">AI正在生成头像...</p>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                知识库描述 <span class="text-gray-500">(选填)</span>
              </label>
              <textarea
                v-model="kbForm.description"
                rows="4"
                placeholder="描述这个知识库的用途和包含的内容..."
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <!-- 第二步：选择文档来源 -->
          <div v-if="currentStep === 2" class="space-y-4">
            <!-- 来源类型选项卡 -->
            <div class="flex gap-2 border-b border-gray-700">
              <button
                v-for="tab in sourceTabs"
                :key="tab.id"
                class="px-4 py-2 text-sm font-medium transition-colors relative"
                :class="activeSourceTab === tab.id ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'"
                @click="activeSourceTab = tab.id"
              >
                <component :is="tab.icon" :size="16" class="inline mr-2" />
                {{ tab.name }}
                <div v-if="activeSourceTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
              </button>
            </div>

            <!-- 云盘选择 -->
            <div v-if="activeSourceTab === 'cloud'" class="space-y-3">
              <button
                type="button"
                class="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors flex items-center justify-center gap-2"
                @click="showCloudSelector = true"
              >
                <FolderOpen :size="18" />
                从云盘选择文档（支持多选）
              </button>

              <div v-if="selectedCloudSources.length > 0" class="space-y-2">
                <div class="text-xs text-gray-400">已选择 {{ selectedCloudSources.length }} 个文档：</div>
                <div
                  v-for="source in selectedCloudSources"
                  :key="source.id"
                  class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <FileText :size="16" class="text-blue-400" />
                  <span class="flex-1 text-sm text-gray-300">{{ source.name }}</span>
                  <button
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    @click="removeSource(source.id)"
                  >
                    <X :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 本地上传 -->
            <div v-if="activeSourceTab === 'local'" class="space-y-3">
              <div class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
                @click="triggerFileUpload">
                <Upload :size="32" class="mx-auto mb-3 text-gray-400" />
                <p class="text-gray-300 mb-1">点击上传文档</p>
                <p class="text-xs text-gray-500">支持 PDF, DOC, DOCX, TXT 格式</p>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </div>

              <div v-if="selectedLocalSources.length > 0" class="space-y-2">
                <div class="text-xs text-gray-400">已选择 {{ selectedLocalSources.length }} 个文档：</div>
                <div
                  v-for="source in selectedLocalSources"
                  :key="source.id"
                  class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <FileText :size="16" class="text-green-400" />
                  <span class="flex-1 text-sm text-gray-300">{{ source.name }}</span>
                  <button
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    @click="removeSource(source.id)"
                  >
                    <X :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 在线链接 -->
            <div v-if="activeSourceTab === 'url'" class="space-y-3">
              <div class="flex gap-2">
                <input
                  v-model="urlInput"
                  type="url"
                  placeholder="输入网页链接，如 https://example.com/docs"
                  class="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none"
                  @keyup.enter="addUrlSource"
                />
                <button
                  type="button"
                  class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  @click="addUrlSource"
                >
                  添加
                </button>
              </div>

              <div v-if="selectedUrlSources.length > 0" class="space-y-2">
                <div class="text-xs text-gray-400">已添加 {{ selectedUrlSources.length }} 个链接：</div>
                <div
                  v-for="source in selectedUrlSources"
                  :key="source.id"
                  class="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
                >
                  <Link2 :size="16" class="text-purple-400" />
                  <span class="flex-1 text-sm text-gray-300 truncate">{{ source.value }}</span>
                  <button
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    @click="removeSource(source.id)"
                  >
                    <X :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 第三步：构建中 -->
          <div v-if="currentStep === 3" class="flex items-center justify-center py-12">
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
              
              <h4 class="text-lg font-semibold text-gray-200 mb-2">{{ buildingStatus.message }}</h4>
              <p class="text-sm text-gray-400 mb-6">{{ buildingStatus.detail }}</p>
              
              <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  :style="{ width: buildingStatus.progress + '%' }"
                ></div>
              </div>
              <div class="mt-2 text-sm text-gray-400">{{ buildingStatus.progress }}%</div>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="border-t border-gray-700 p-6 flex items-center justify-between bg-gray-900/50">
          <button
            v-if="currentStep > 1 && currentStep < 3"
            type="button"
            class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            @click="currentStep--"
          >
            上一步
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              v-if="currentStep < 3"
              type="button"
              class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              @click="closeCreateModal"
            >
              取消
            </button>
            <button
              v-if="currentStep === 1"
              type="button"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium disabled:opacity-50"
              :disabled="!kbForm.name.trim()"
              @click="currentStep = 2"
            >
              下一步
            </button>
            <button
              v-else-if="currentStep === 2"
              type="button"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white rounded-lg transition-all font-medium disabled:opacity-50"
              :disabled="allSources.length === 0"
              @click="startBuilding"
            >
              开始构建
            </button>
            <button
              v-else-if="currentStep === 3 && buildingStatus.progress === 100"
              type="button"
              class="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 hover:brightness-110 text-white rounded-lg transition-all font-medium flex items-center gap-2"
              @click="closeCreateModal"
            >
              <CheckCircle :size="18" />
              完成
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 云盘选择器 -->
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
          :selected-ids="selectedCloudSources.map(s => s.id)"
          @confirm="handleCloudFilesConfirm"
          @upload="handleUploadToCloud"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, BookOpen, FileText, Calendar, Trash2, X, CheckCircle, XCircle, Loader2,
  FolderOpen, Upload, Link2, Sparkles
} from 'lucide-vue-next'
import AppSidebar from './WorkspacePage/AppSidebar.vue'
import CloudDriveSelector from '../components/CloudDriveSelector.vue'
import { useKnowledgeBaseStore } from '../store/knowledge-base'

const router = useRouter()
const knowledgeBaseStore = useKnowledgeBaseStore()

// 模态框状态
const showCreateModal = ref(false)
const currentStep = ref(1) // 1: 基本信息, 2: 选择文档, 3: 构建中
const showCloudSelector = ref(false)

// 表单数据
const kbForm = reactive({
  name: '',
  description: '',
  avatar: '',
  avatarType: '' // 'preset', 'upload', 'ai'
})

// 头像相关
const avatarUploadTab = ref<'preset' | 'upload' | 'ai'>('preset')
const isGeneratingAvatar = ref(false)

// 系统预设头像（使用占位图片URL）
const presetAvatars = [
  'https://api.dicebear.com/7.x/shapes/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Buddy&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Lucky&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Charlie&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/shapes/svg?seed=Max&backgroundColor=c7f9cc'
]

// 选择预设头像
const selectPresetAvatar = (avatar: string) => {
  kbForm.avatar = avatar
  kbForm.avatarType = 'preset'
}

// 处理头像上传
const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      kbForm.avatar = e.target?.result as string
      kbForm.avatarType = 'upload'
    }
    reader.readAsDataURL(file)
  }
}

// 生成AI头像
const generateAIAvatar = async () => {
  if (!kbForm.name.trim()) return
  
  isGeneratingAvatar.value = true
  
  // 模拟AI生成过程
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 使用知识库名称生成唯一的头像
  const seed = encodeURIComponent(kbForm.name)
  kbForm.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=random`
  kbForm.avatarType = 'ai'
  
  isGeneratingAvatar.value = false
}

// 文档来源选项卡
const activeSourceTab = ref<'cloud' | 'local' | 'url'>('cloud')
const sourceTabs = [
  { id: 'cloud', name: '云盘文档', icon: FolderOpen },
  { id: 'local', name: '本地上传', icon: Upload },
  { id: 'url', name: '在线链接', icon: Link2 }
]

// 选中的来源
const selectedCloudSources = ref<any[]>([])
const selectedLocalSources = ref<any[]>([])
const selectedUrlSources = ref<any[]>([])
const urlInput = ref('')
const fileInput = ref<HTMLInputElement>()

// 模拟云盘文件
const cloudFiles = ref([
  { id: 'cf1', name: '产品说明书.pdf', type: 'pdf', size: '2.1MB', uploadDate: '2023-11-01' },
  { id: 'cf2', name: 'API文档.pdf', type: 'pdf', size: '1.5MB', uploadDate: '2023-11-05' },
  { id: 'cf3', name: '用户手册.docx', type: 'docx', size: '800KB', uploadDate: '2023-11-10' }
])

// 构建状态
const buildingStatus = reactive({
  message: '正在分析文档内容...',
  detail: '正在提取关键信息和知识点',
  progress: 0
})

// 所有选中的来源
const allSources = computed(() => {
  return [...selectedCloudSources.value, ...selectedLocalSources.value, ...selectedUrlSources.value]
})

// 方法
const openCreateModal = () => {
  showCreateModal.value = true
  currentStep.value = 1
  resetForm()
}

const closeCreateModal = () => {
  // 如果正在构建中（未完成），不允许关闭
  if (currentStep.value === 3 && buildingStatus.progress < 100) return
  showCreateModal.value = false
  resetForm()
}

const resetForm = () => {
  kbForm.name = ''
  kbForm.description = ''
  kbForm.avatar = ''
  kbForm.avatarType = ''
  selectedCloudSources.value = []
  selectedLocalSources.value = []
  selectedUrlSources.value = []
  urlInput.value = ''
  activeSourceTab.value = 'cloud'
  avatarUploadTab.value = 'preset'
  currentStep.value = 1
  buildingStatus.message = '准备构建知识库...'
  buildingStatus.detail = '即将开始处理文档'
  buildingStatus.progress = 0
}

const handleCloudFilesConfirm = (fileIds: string[]) => {
  const files = cloudFiles.value.filter(f => fileIds.includes(f.id))
  selectedCloudSources.value = files.map(f => ({
    id: f.id,
    type: 'cloud',
    value: f.name,
    name: f.name
  }))
  showCloudSelector.value = false
}

const handleUploadToCloud = () => {
  alert('跳转到云盘上传页面')
  showCloudSelector.value = false
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    Array.from(files).forEach(file => {
      selectedLocalSources.value.push({
        id: Date.now().toString() + Math.random(),
        type: 'local',
        value: file.name,
        name: file.name
      })
    })
  }
}

const addUrlSource = () => {
  if (urlInput.value.trim()) {
    try {
      new URL(urlInput.value)
      selectedUrlSources.value.push({
        id: Date.now().toString(),
        type: 'url',
        value: urlInput.value.trim(),
        name: urlInput.value.trim()
      })
      urlInput.value = ''
    } catch {
      alert('请输入有效的URL格式')
    }
  }
}

const removeSource = (id: string) => {
  selectedCloudSources.value = selectedCloudSources.value.filter(s => s.id !== id)
  selectedLocalSources.value = selectedLocalSources.value.filter(s => s.id !== id)
  selectedUrlSources.value = selectedUrlSources.value.filter(s => s.id !== id)
}

const startBuilding = async () => {
  currentStep.value = 3
  buildingStatus.progress = 0

  // 模拟构建过程
  const stages = [
    { message: '正在分析文档内容...', detail: '提取关键信息和知识点', progress: 25, duration: 1500 },
    { message: '正在构建知识图谱...', detail: '建立知识之间的关联', progress: 50, duration: 2000 },
    { message: '正在优化知识索引...', detail: '提升检索效率', progress: 75, duration: 1500 },
    { message: '知识库构建完成！', detail: '可以开始使用了', progress: 100, duration: 500 }
  ]

  for (const stage of stages) {
    buildingStatus.message = stage.message
    buildingStatus.detail = stage.detail
    buildingStatus.progress = stage.progress
    await new Promise(resolve => setTimeout(resolve, stage.duration))
  }

  // 创建知识库
  knowledgeBaseStore.createKnowledgeBase({
    name: kbForm.name,
    description: kbForm.description,
    sources: allSources.value,
    status: 'completed'
  })

  // 显示成功并关闭
  setTimeout(() => {
    alert(`知识库"${kbForm.name}"创建成功！`)
    closeCreateModal()
  }, 500)
}

const viewKnowledgeBase = (kb: any) => {
  console.log('查看知识库:', kb)
  // TODO: 实现知识库详情页
}

const deleteKnowledgeBase = (id: string) => {
  if (confirm('确定要删除此知识库吗？删除后无法恢复。')) {
    knowledgeBaseStore.deleteKnowledgeBase(id)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

