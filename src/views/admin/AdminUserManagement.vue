<template>
  <div class="space-y-6">
    <!-- 搜索和筛选 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索用户（手机号、姓名）"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <div>
          <button
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800 border-b border-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">用户ID</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">手机号</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">姓名</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">积分</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">有效期至</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">注册时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 text-sm text-gray-300">{{ user.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-300">{{ user.phone }}</td>
              <td class="px-6 py-4 text-sm text-gray-300">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-300">{{ user.points }}</td>
              <td class="px-6 py-4 text-sm text-gray-300">{{ user.expiresAt || '永久' }}</td>
              <td class="px-6 py-4 text-sm text-gray-400">{{ user.createdAt }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
                    @click="handleEdit(user)"
                  >
                    编辑
                  </button>
                  <button
                    class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium transition-all"
                    @click="handleResetPassword(user)"
                  >
                    重置密码
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          共 {{ totalUsers }} 位用户
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-all"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="px-4 py-2 text-gray-300">{{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-all"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑用户模态框 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showEditModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-6 space-y-6">
        <h3 class="text-xl font-bold text-white">编辑用户信息</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">手机号</label>
            <input
              v-model="editForm.phone"
              type="text"
              disabled
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">积分</label>
            <input
              v-model.number="editForm.points"
              type="number"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">账号有效期</label>
            <input
              v-model="editForm.expiresAt"
              type="date"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            @click="handleSaveEdit"
          >
            保存
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showEditModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 重置密码模态框 -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showResetModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-6">
        <h3 class="text-xl font-bold text-white">重置密码</h3>
        
        <div>
          <p class="text-gray-300 mb-4">
            确定要重置用户 <span class="font-bold text-white">{{ resetUser?.name }}</span> 的密码吗？
          </p>
        </div>

        <div v-if="showNewPassword" class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-sm text-blue-300 mb-2">新密码已生成：</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 px-3 py-2 bg-gray-800 rounded text-white font-mono text-sm">{{ newPassword }}</code>
            <button
              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              @click="copyPassword"
            >
              复制
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-2">请将此密码告知用户，建议用户登录后修改密码</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="!showNewPassword"
            class="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all font-medium"
            @click="handleConfirmReset"
          >
            确认重置
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="closeResetModal"
          >
            {{ showNewPassword ? '关闭' : '取消' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: string
  phone: string
  name: string
  points: number
  expiresAt?: string
  createdAt: string
}

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10
const totalUsers = ref(0)
const showEditModal = ref(false)
const showResetModal = ref(false)
const showNewPassword = ref(false)
const newPassword = ref('')

const users = ref<User[]>([])
const editForm = ref({
  id: '',
  phone: '',
  points: 0,
  expiresAt: ''
})
const resetUser = ref<User | null>(null)

// 模拟数据
onMounted(() => {
  users.value = [
    {
      id: '1',
      phone: '138****8888',
      name: '张三',
      points: 85,
      expiresAt: '',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      phone: '137****7777',
      name: '赵六',
      points: 95,
      expiresAt: '',
      createdAt: '2024-11-10'
    },
    {
      id: '3',
      phone: '135****5555',
      name: '钱七',
      points: 45,
      expiresAt: '',
      createdAt: '2024-12-01'
    },
    {
      id: '4',
      phone: '139****9999',
      name: '李四',
      points: 120,
      expiresAt: '2025-12-31',
      createdAt: '2024-02-20'
    },
    {
      id: '5',
      phone: '136****6666',
      name: '王五',
      points: 80,
      expiresAt: '',
      createdAt: '2024-03-15'
    }
  ]
  totalUsers.value = users.value.length
})

const filteredUsers = computed(() => {
  let result = users.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.phone.toLowerCase().includes(query) || 
      user.name.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize))

const handleSearch = () => {
  currentPage.value = 1
}

const handleEdit = (user: User) => {
  editForm.value = {
    id: user.id,
    phone: user.phone,
    points: user.points,
    expiresAt: user.expiresAt || ''
  }
  showEditModal.value = true
}

const handleSaveEdit = () => {
  const user = users.value.find(u => u.id === editForm.value.id)
  if (user) {
    user.points = editForm.value.points
    user.expiresAt = editForm.value.expiresAt
  }
  showEditModal.value = false
  alert('保存成功！')
}

const handleResetPassword = (user: User) => {
  resetUser.value = user
  showNewPassword.value = false
  showResetModal.value = true
}

const handleConfirmReset = () => {
  // 生成随机密码
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const newPwd = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(x => chars[x % chars.length])
    .join('')
  
  newPassword.value = newPwd
  showNewPassword.value = true
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(newPassword.value)
    alert('密码已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

const closeResetModal = () => {
  showResetModal.value = false
  showNewPassword.value = false
  resetUser.value = null
  newPassword.value = ''
}
</script>
