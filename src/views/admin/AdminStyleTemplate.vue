<template>
  <div class="space-y-6">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-white">系统内置风格管理</h2>
      <button
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium flex items-center gap-2"
        @click="handleAdd"
      >
        <Plus :size="20" />
        新增风格
      </button>
    </div>

    <!-- 风格列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="style in styles"
        :key="style.id"
        class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
      >
        <div class="flex items-start gap-4 mb-4">
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <div
              v-if="style.avatarType === 'default'"
              class="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-3xl"
            >
              {{ style.avatar }}
            </div>
            <img
              v-else
              :src="style.avatar"
              alt="风格头像"
              class="w-16 h-16 rounded-xl object-cover"
            />
          </div>
          
          <!-- 标题和操作 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-bold text-white mb-1">{{ style.name }}</h3>
                <p class="text-sm text-gray-400">{{ style.category }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  @click="handleEdit(style)"
                  title="编辑"
                >
                  <Edit :size="18" />
                </button>
                <button
                  class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  @click="handleDelete(style)"
                  title="删除"
                >
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4 max-h-32 overflow-y-auto">
          <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ style.content.substring(0, 200) }}{{ style.content.length > 200 ? '...' : '' }}</p>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs text-gray-500">创建时间：{{ style.createdAt }}</span>
          <span
            :class="[
              style.status === 'active'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400',
              'px-3 py-1 rounded-full text-xs font-medium'
            ]"
          >
            {{ style.status === 'active' ? '启用' : '禁用' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 新增/编辑模态框 -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-4xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white">{{ isEdit ? '编辑风格' : '新增风格' }}</h3>

        <div class="space-y-4">
          <!-- 头像选择 -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-3">风格头像</label>
            <div class="space-y-3">
              <!-- 当前头像预览 -->
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                  <div
                    v-if="form.avatarType === 'default'"
                    class="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-4xl"
                  >
                    {{ form.avatar }}
                  </div>
                  <img
                    v-else
                    :src="form.avatar"
                    alt="风格头像"
                    class="w-20 h-20 rounded-xl object-cover"
                  />
                </div>
                <button
                  type="button"
                  class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all text-sm font-medium border border-gray-700"
                  @click="triggerFileUpload"
                >
                  上传本地图片
                </button>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </div>
              
              <!-- 默认头像选择 -->
              <div>
                <p class="text-xs text-gray-400 mb-2">或选择默认头像:</p>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="avatar in defaultAvatars"
                    :key="avatar"
                    type="button"
                    :class="[
                      'w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all',
                      form.avatar === avatar && form.avatarType === 'default'
                        ? 'bg-blue-500/30 ring-2 ring-blue-500'
                        : 'bg-gray-800 hover:bg-gray-700'
                    ]"
                    @click="selectDefaultAvatar(avatar)"
                  >
                    {{ avatar }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">风格名称</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="例如：雷军风格"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">分类</label>
              <select
                v-model="form.category"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              >
                <option value="企业风格">企业风格</option>
                <option value="个人风格">个人风格</option>
                <option value="行业风格">行业风格</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
            <select
              v-model="form.status"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            >
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">风格内容</label>
            <textarea
              v-model="form.content"
              rows="15"
              placeholder="请输入风格的详细描述和特点，这将作为AI仿写的重要参考依据..."
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="mt-2 text-xs text-gray-500">建议字数：200-500字，包含风格特点、语言特色、常用句式等</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            @click="handleSave"
          >
            保存
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-6">
        <h3 class="text-xl font-bold text-white">确认删除</h3>
        <p class="text-gray-300">确定要删除风格「{{ deleteTarget?.name }}」吗？此操作不可恢复。</p>
        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
            @click="handleConfirmDelete"
          >
            确认删除
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showDeleteModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, Upload } from 'lucide-vue-next'

interface StyleTemplate {
  id: string
  name: string
  category: string
  content: string
  status: 'active' | 'inactive'
  avatar?: string // 头像URL或base64
  avatarType?: 'default' | 'upload' // 头像类型
  createdAt: string
}

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const deleteTarget = ref<StyleTemplate | null>(null)

const styles = ref<StyleTemplate[]>([])
const form = ref({
  id: '',
  name: '',
  category: '企业风格',
  content: '',
  status: 'active' as 'active' | 'inactive',
  avatar: '',
  avatarType: 'default' as 'default' | 'upload'
})

// 默认头像列表
const defaultAvatars = [
  '🎭', '🎨', '✨', '🌟', '💡', '🚀', '🎯', '💼'
]

const fileInputRef = ref<HTMLInputElement | null>(null)

// 模拟数据
onMounted(() => {
  styles.value = [
    {
      id: '1',
      name: '雷军风格',
      category: '企业风格',
      content: '以"Are you OK?"为代表，语言风格亲切、直白，善于用简单的词汇表达复杂的概念。常用问句与读者互动，强调用户价值和产品品质。文风轻松但不失权威，经常使用比喻和类比，让技术内容更容易理解。善于制造悬念和戏剧性，用数据和事实支撑观点，营造信任感。',
      status: 'active',
      avatar: '🎭',
      avatarType: 'default',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: '乔布斯风格',
      category: '个人风格',
      content: '极简主义，强调"Think Different"。用词精准、有力，善于用简单的语言描绘宏伟愿景。常用重复和排比增强气势，句子短而有力。善于讲故事，用产品改变世界的宏大叙事。避免复杂的术语，直击用户需求。用激情和信仰感染听众，营造宗教般的狂热。',
      status: 'active',
      avatar: '🎨',
      avatarType: 'default',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: '马斯克风格',
      category: '个人风格',
      content: '直言不讳，敢于挑战传统。喜欢用网络梗和幽默感拉近与用户的距离。善于用简短有力的推文表达观点，常用数字和具体事实增强说服力。不回避敏感话题，敢于表达个人观点。强调创新和突破，常用"第一性原理"思维。善于制造话题和争议，保持高曝光度。',
      status: 'active',
      avatar: '🚀',
      avatarType: 'default',
      createdAt: '2024-03-10'
    },
    {
      id: '4',
      name: '华为风格',
      category: '行业风格',
      content: '强调技术创新和艰苦奋斗精神。语言严谨、专业，善于用数据说话。重视社会责任和企业担当，常提及"以客户为中心"理念。善用古典诗词和典故，体现文化底蕴。强调长期主义和战略眼光，不追求短期利益。用沉稳、自信的语调传递专业权威感。',
      status: 'active',
      avatar: '💼',
      avatarType: 'default',
      createdAt: '2024-04-05'
    },
    {
      id: '5',
      name: '苹果风格',
      category: '行业风格',
      content: '极致的简洁和精准。用词考究，每个字都经过精心挑选。善于用形容词创造画面感，如"不可思议"、"令人惊叹"等。重视情感共鸣，用故事和情境打动用户。强调设计和美学的价值。常用排比句增强节奏感。用神秘的营销策略，往往制造悬念。',
      status: 'active',
      avatar: '✨',
      avatarType: 'default',
      createdAt: '2024-05-01'
    },
    {
      id: '6',
      name: '阿里风格',
      category: '行业风格',
      content: '强调价值观和使命感。善用金句和口号，如"让天下没有难做的生意"。语言亲切、接地气，善于用比喻和生活化语言解释商业逻辑。重视文化传承，常提及"武侠文化"和"侠客精神"。强调创业精神和奋斗精神。用格局和视野打动人心。',
      status: 'active',
      avatar: '🌟',
      avatarType: 'default',
      createdAt: '2024-06-15'
    }
  ]
})

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    id: '',
    name: '',
    category: '企业风格',
    content: '',
    status: 'active',
    avatar: defaultAvatars[0],
    avatarType: 'default'
  }
  showModal.value = true
}

const handleEdit = (style: StyleTemplate) => {
  isEdit.value = true
  form.value = {
    id: style.id,
    name: style.name,
    category: style.category,
    content: style.content,
    status: style.status,
    avatar: style.avatar || defaultAvatars[0],
    avatarType: style.avatarType || 'default'
  }
  showModal.value = true
}

// 选择默认头像
const selectDefaultAvatar = (avatar: string) => {
  form.value.avatar = avatar
  form.value.avatarType = 'default'
}

// 触发文件选择
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }
  
  // 验证文件大小 (最大2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB')
    return
  }
  
  // 读取文件并转换为base64
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatar = e.target?.result as string
    form.value.avatarType = 'upload'
  }
  reader.readAsDataURL(file)
}

const handleSave = () => {
  if (!form.value.name || !form.value.content) {
    alert('请填写完整信息')
    return
  }

  if (isEdit.value) {
    const index = styles.value.findIndex(s => s.id === form.value.id)
    if (index !== -1) {
      styles.value[index] = {
        ...form.value,
        createdAt: styles.value[index].createdAt
      }
    }
  } else {
    styles.value.push({
      ...form.value,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    })
  }

  showModal.value = false
  alert(isEdit.value ? '修改成功！' : '创建成功！')
}

const handleDelete = (style: StyleTemplate) => {
  deleteTarget.value = style
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  if (deleteTarget.value) {
    styles.value = styles.value.filter(s => s.id !== deleteTarget.value!.id)
    showDeleteModal.value = false
    deleteTarget.value = null
    alert('删除成功！')
  }
}
</script>

