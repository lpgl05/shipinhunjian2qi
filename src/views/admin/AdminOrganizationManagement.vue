<template>
  <div class="space-y-6">
    <!-- 搜索和筛选 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索企业（企业名称、统一社会信用代码）"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <button
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
          @click="handleSearch"
        >
          搜索
        </button>
        <!-- 视图切换按钮 -->
        <div class="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
          <button
            class="px-3 py-2 rounded-md transition-all"
            :class="viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
            @click="viewMode = 'list'"
            title="列表视图"
          >
            <List :size="18" />
          </button>
          <button
            class="px-3 py-2 rounded-md transition-all"
            :class="viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'"
            @click="viewMode = 'card'"
            title="卡片视图"
          >
            <LayoutGrid :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- 选项卡和统计 -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl">
      <div class="flex items-center justify-between border-b border-gray-800">
        <div class="flex items-center">
          <button
            class="px-6 py-4 text-sm font-medium transition-all relative"
            :class="activeTab === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'"
            @click="activeTab = 'all'"
          >
            全部
            <span class="ml-2 px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
              {{ totalCount }}
            </span>
            <div
              v-if="activeTab === 'all'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            ></div>
          </button>
          <button
            class="px-6 py-4 text-sm font-medium transition-all relative"
            :class="activeTab === 'pending' ? 'text-white' : 'text-gray-400 hover:text-white'"
            @click="activeTab = 'pending'"
          >
            待审核
            <span class="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs">
              {{ pendingCount }}
            </span>
            <div
              v-if="activeTab === 'pending'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            ></div>
          </button>
          <button
            class="px-6 py-4 text-sm font-medium transition-all relative"
            :class="activeTab === 'approved' ? 'text-white' : 'text-gray-400 hover:text-white'"
            @click="activeTab = 'approved'"
          >
            已审核
            <span class="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
              {{ approvedCount }}
            </span>
            <div
              v-if="activeTab === 'approved'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
            ></div>
          </button>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800 border-b border-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">企业名称</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">管理员</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">联系方式</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">状态</th>
              <th v-if="activeTab !== 'pending'" class="px-6 py-4 text-left text-sm font-medium text-gray-300">团队积分</th>
              <th v-if="activeTab !== 'pending'" class="px-6 py-4 text-left text-sm font-medium text-gray-300">子账号</th>
              <th v-if="activeTab !== 'pending'" class="px-6 py-4 text-left text-sm font-medium text-gray-300">有效期至</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300">注册时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-300 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="org in filteredOrganizations"
              :key="org.id"
              class="hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="text-sm text-gray-300">{{ org.companyName }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ org.creditCode }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">{{ org.adminName }}</td>
              <td class="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{{ org.adminPhone }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium inline-block"
                  :class="org.status === 'pending' 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-green-500/20 text-green-400'"
                >
                  {{ org.status === 'pending' ? '待审核' : '已审核' }}
                </span>
              </td>
              <td v-if="activeTab !== 'pending'" class="px-6 py-4 text-sm text-orange-400 font-bold whitespace-nowrap">
                {{ org.status === 'approved' ? org.teamPoints.toLocaleString() : '-' }}
              </td>
              <td v-if="activeTab !== 'pending'" class="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                {{ org.status === 'approved' ? `${org.subAccountCount} / ${org.maxSubAccounts}` : '-' }}
              </td>
              <td v-if="activeTab !== 'pending'" class="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                {{ org.status === 'approved' ? org.expiresAt : '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{{ org.createdAt }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    v-if="org.status === 'pending'"
                    class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                    @click="handleApprove(org)"
                  >
                    立即审核
                  </button>
                  <template v-else>
                    <button
                      class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                      @click="handleEdit(org)"
                    >
                      管理
                    </button>
                    <button
                      class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                      @click="handleAddPoints(org)"
                    >
                      积分
                    </button>
                    <button
                      class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                      @click="handleAddSubAccounts(org)"
                    >
                      子账号
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- 空状态 -->
        <div v-if="filteredOrganizations.length === 0" class="py-12 text-center text-gray-400">
          <Building2 :size="48" class="mx-auto mb-4 opacity-50" />
          <p>暂无企业数据</p>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="org in filteredOrganizations"
            :key="org.id"
            class="bg-gray-800 border rounded-xl p-6 hover:border-gray-600 transition-all"
            :class="org.status === 'pending' ? 'border-orange-500/30' : 'border-gray-700'"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-1">{{ org.companyName }}</h3>
                <p class="text-sm text-gray-400">{{ org.creditCode }}</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                :class="org.status === 'pending' 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-green-500/20 text-green-400'"
              >
                {{ org.status === 'pending' ? '待审核' : '已审核' }}
              </span>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex items-center gap-3 text-sm">
                <User :size="16" class="text-gray-400" />
                <span class="text-gray-400">管理员：</span>
                <span class="text-gray-300">{{ org.adminName }}</span>
                <span class="text-gray-500">（{{ org.adminPhone }}）</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <Calendar :size="16" class="text-gray-400" />
                <span class="text-gray-400">注册时间：</span>
                <span class="text-gray-300">{{ org.createdAt }}</span>
              </div>

              <template v-if="org.status === 'approved'">
                <div class="flex items-center gap-3 text-sm">
                  <Coins :size="16" class="text-orange-400" />
                  <span class="text-gray-400">团队积分：</span>
                  <span class="text-orange-400 font-bold">{{ org.teamPoints.toLocaleString() }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                  <Users :size="16" class="text-blue-400" />
                  <span class="text-gray-400">子账号：</span>
                  <span class="text-gray-300">{{ org.subAccountCount }} / {{ org.maxSubAccounts }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                  <Calendar :size="16" class="text-green-400" />
                  <span class="text-gray-400">有效期至：</span>
                  <span class="text-gray-300">{{ org.expiresAt }}</span>
                </div>
              </template>

              <template v-else>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">企业资质文件</label>
                  <div class="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg">
                    <div class="flex items-center gap-3">
                      <FileText :size="20" class="text-gray-400" />
                      <span class="text-gray-300 text-sm">营业执照.pdf</span>
                      <button class="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="org.status === 'pending'" class="pt-4 border-t border-gray-700">
              <button
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                @click="handleApprove(org)"
              >
                立即审核
              </button>
            </div>

            <div v-else class="pt-4 border-t border-gray-700 flex items-center gap-2">
              <button
                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
                @click="handleEdit(org)"
              >
                管理
              </button>
              <button
                class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-medium transition-all"
                @click="handleAddPoints(org)"
              >
                增加积分
              </button>
              <button
                class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs font-medium transition-all"
                @click="handleAddSubAccounts(org)"
              >
                添加子账号
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredOrganizations.length === 0" class="py-12 text-center text-gray-400">
          <Building2 :size="48" class="mx-auto mb-4 opacity-50" />
          <p>暂无企业数据</p>
        </div>
      </div>
    </div>

    <!-- 审核企业模态框 -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showApproveModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white">企业认证审核</h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">企业名称</label>
              <input
                v-model="approveForm.companyName"
                type="text"
                disabled
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">统一社会信用代码</label>
              <input
                v-model="approveForm.creditCode"
                type="text"
                disabled
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">企业资质文件</label>
            <div class="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
              <div class="flex items-center gap-3">
                <FileText :size="20" class="text-gray-400" />
                <span class="text-gray-300 text-sm">营业执照.pdf</span>
                <button class="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
                  查看
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-800 pt-4 space-y-4">
            <h4 class="text-lg font-bold text-white">授权配置</h4>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">团队积分</label>
              <input
                v-model.number="approveForm.teamPoints"
                type="number"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">账号有效期</label>
              <input
                v-model="approveForm.accountExpires"
                type="date"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">子账号数量</label>
              <input
                v-model.number="approveForm.subAccountCount"
                type="number"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
            @click="handleReject"
          >
            拒绝
          </button>
          <button
            class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
            @click="handleApproveSubmit"
          >
            通过审核
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showApproveModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑组织模态框 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showEditModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-4xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-white">管理企业组织</h3>

        <!-- 基本信息 -->
        <div class="space-y-4">
          <h4 class="text-lg font-bold text-white">基本信息</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">企业名称</label>
              <input
                v-model="editForm.companyName"
                type="text"
                disabled
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">统一社会信用代码</label>
              <input
                v-model="editForm.creditCode"
                type="text"
                disabled
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
              />
            </div>
          </div>

          <!-- 配置管理 -->
          <div class="border-t border-gray-800 pt-6 space-y-4">
            <h4 class="text-lg font-bold text-white">配置管理</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">团队积分</label>
                <input
                  v-model.number="editForm.teamPoints"
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
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">子账号数量上限</label>
                <input
                  v-model.number="editForm.maxSubAccounts"
                  type="number"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <!-- 子账号列表 -->
          <div class="border-t border-gray-800 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-bold text-white">子账号列表</h4>
              <button
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                @click="showAddSubAccountModal = true"
              >
                添加子账号
              </button>
            </div>
            
            <div class="space-y-2">
              <div
                v-for="subAccount in editForm.subAccounts"
                :key="subAccount.id"
                class="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div>
                  <p class="text-sm font-medium text-white">{{ subAccount.name }}</p>
                  <p class="text-xs text-gray-400">{{ subAccount.phone }}</p>
                </div>
                <button
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-all"
                  @click="handleRemoveSubAccount(subAccount.id)"
                >
                  移除
                </button>
              </div>
            </div>
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

    <!-- 增加积分模态框 -->
    <div
      v-if="showAddPointsModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddPointsModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-6">
        <h3 class="text-xl font-bold text-white">增加团队积分</h3>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">企业名称</label>
          <input
            v-model="pointsForm.companyName"
            type="text"
            disabled
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">增加积分</label>
          <input
            v-model.number="pointsForm.points"
            type="number"
            placeholder="请输入要增加的积分数量"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            @click="handleSavePoints"
          >
            确认
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showAddPointsModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 添加子账号模态框 -->
    <div
      v-if="showAddSubAccountModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showAddSubAccountModal = false"
    >
      <div class="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-6">
        <h3 class="text-xl font-bold text-white">添加子账号</h3>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">手机号</label>
          <input
            v-model="subAccountForm.phone"
            type="text"
            placeholder="请输入手机号"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">姓名</label>
          <input
            v-model="subAccountForm.name"
            type="text"
            placeholder="请输入姓名"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
          />
        </div>
        <div class="flex items-center gap-3">
          <button
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            @click="handleSaveSubAccount"
          >
            添加
          </button>
          <button
            class="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all font-medium"
            @click="showAddSubAccountModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { User, Coins, Users, Calendar, FileText, List, LayoutGrid, Building2 } from 'lucide-vue-next'

interface SubAccount {
  id: string
  name: string
  phone: string
}

interface Organization {
  id: string
  companyName: string
  creditCode: string
  adminName: string
  adminPhone: string
  teamPoints: number
  subAccountCount: number
  maxSubAccounts: number
  expiresAt: string
  subAccounts: SubAccount[]
  status: 'pending' | 'approved'
  createdAt: string
}

const searchQuery = ref('')
const activeTab = ref<'all' | 'pending' | 'approved'>('all')
const viewMode = ref<'list' | 'card'>('list')
const showEditModal = ref(false)
const showApproveModal = ref(false)
const showAddPointsModal = ref(false)
const showAddSubAccountModal = ref(false)

const organizations = ref<Organization[]>([])
const editForm = ref<Organization | null>(null)
const approveForm = ref({
  id: '',
  companyName: '',
  creditCode: '',
  teamPoints: 1000,
  accountExpires: '2025-12-31',
  subAccountCount: 10
})
const pointsForm = ref({
  id: '',
  companyName: '',
  points: 0
})
const subAccountForm = ref({
  name: '',
  phone: ''
})

// 模拟数据
onMounted(() => {
  organizations.value = [
    // 待审核企业
    {
      id: 'p1',
      companyName: '新的科技有限公司',
      creditCode: '91110000MA98765432',
      adminName: '王五',
      adminPhone: '136****6666',
      teamPoints: 0,
      subAccountCount: 0,
      maxSubAccounts: 10,
      expiresAt: '',
      subAccounts: [],
      status: 'pending',
      createdAt: '2024-12-01'
    },
    {
      id: 'p2',
      companyName: '创业科技有限公司',
      creditCode: '91110000MA55555555',
      adminName: '孙八',
      adminPhone: '133****8888',
      teamPoints: 0,
      subAccountCount: 0,
      maxSubAccounts: 15,
      expiresAt: '',
      subAccounts: [],
      status: 'pending',
      createdAt: '2024-12-05'
    },
    // 已审核企业
    {
      id: 'a1',
      companyName: '某某科技有限公司',
      creditCode: '91110000MA01234567',
      adminName: '李四',
      adminPhone: '139****9999',
      teamPoints: 5000,
      subAccountCount: 3,
      maxSubAccounts: 10,
      expiresAt: '2025-12-31',
      subAccounts: [
        { id: '1', name: '张三', phone: '138****8888' },
        { id: '2', name: '王五', phone: '136****6666' },
        { id: '3', name: '赵六', phone: '137****7777' }
      ],
      status: 'approved',
      createdAt: '2024-02-20'
    },
    {
      id: 'a2',
      companyName: '创新科技股份有限公司',
      creditCode: '91110000MA11223344',
      adminName: '钱七',
      adminPhone: '135****5555',
      teamPoints: 10000,
      subAccountCount: 5,
      maxSubAccounts: 20,
      expiresAt: '2026-06-30',
      subAccounts: [
        { id: '1', name: '张三', phone: '138****8888' },
        { id: '2', name: '李四', phone: '139****9999' },
        { id: '3', name: '王五', phone: '136****6666' },
        { id: '4', name: '赵六', phone: '137****7777' },
        { id: '5', name: '孙八', phone: '133****8888' }
      ],
      status: 'approved',
      createdAt: '2024-05-15'
    }
  ]
})

// 统计数据
const totalCount = computed(() => organizations.value.length)
const pendingCount = computed(() => organizations.value.filter(org => org.status === 'pending').length)
const approvedCount = computed(() => organizations.value.filter(org => org.status === 'approved').length)

// 过滤后的组织列表
const filteredOrganizations = computed(() => {
  let result = organizations.value

  // 选项卡过滤
  if (activeTab.value === 'pending') {
    result = result.filter(org => org.status === 'pending')
  } else if (activeTab.value === 'approved') {
    result = result.filter(org => org.status === 'approved')
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(org =>
      org.companyName.toLowerCase().includes(query) ||
      org.creditCode.toLowerCase().includes(query)
    )
  }

  return result
})

const handleSearch = () => {
  // 搜索逻辑
}

const handleApprove = (org: Organization) => {
  approveForm.value = {
    id: org.id,
    companyName: org.companyName,
    creditCode: org.creditCode,
    teamPoints: 1000,
    accountExpires: '2025-12-31',
    subAccountCount: 10
  }
  showApproveModal.value = true
}

const handleApproveSubmit = () => {
  const org = organizations.value.find(o => o.id === approveForm.value.id)
  if (org) {
    org.status = 'approved'
    org.teamPoints = approveForm.value.teamPoints
    org.expiresAt = approveForm.value.accountExpires
    org.maxSubAccounts = approveForm.value.subAccountCount
  }
  showApproveModal.value = false
  alert('审核通过！')
}

const handleReject = () => {
  const org = organizations.value.find(o => o.id === approveForm.value.id)
  if (org) {
    organizations.value = organizations.value.filter(o => o.id !== org.id)
  }
  showApproveModal.value = false
  alert('已拒绝该企业认证申请')
}

const handleEdit = (org: Organization) => {
  editForm.value = JSON.parse(JSON.stringify(org))
  showEditModal.value = true
}

const handleSaveEdit = () => {
  if (editForm.value) {
    const index = organizations.value.findIndex(o => o.id === editForm.value!.id)
    if (index !== -1) {
      organizations.value[index] = editForm.value
    }
    showEditModal.value = false
    alert('保存成功！')
  }
}

const handleAddPoints = (org: Organization) => {
  pointsForm.value = {
    id: org.id,
    companyName: org.companyName,
    points: 0
  }
  showAddPointsModal.value = true
}

const handleSavePoints = () => {
  const org = organizations.value.find(o => o.id === pointsForm.value.id)
  if (org) {
    org.teamPoints += pointsForm.value.points
  }
  showAddPointsModal.value = false
  alert('积分增加成功！')
}

const handleAddSubAccounts = (org: Organization) => {
  handleEdit(org)
  setTimeout(() => {
    showAddSubAccountModal.value = true
  }, 100)
}

const handleSaveSubAccount = () => {
  if (!subAccountForm.value.phone || !subAccountForm.value.name) {
    alert('请填写完整信息')
    return
  }

  if (editForm.value) {
    const currentCount = editForm.value.subAccountCount
    const maxCount = editForm.value.maxSubAccounts

    if (currentCount >= maxCount) {
      alert('子账号数量已达上限')
      return
    }

    editForm.value.subAccounts.push({
      id: Date.now().toString(),
      name: subAccountForm.value.name,
      phone: subAccountForm.value.phone
    })
    editForm.value.subAccountCount++

    subAccountForm.value = { name: '', phone: '' }
    showAddSubAccountModal.value = false
    alert('子账号添加成功！')
  }
}

const handleRemoveSubAccount = (subAccountId: string) => {
  if (editForm.value) {
    editForm.value.subAccounts = editForm.value.subAccounts.filter(
      sa => sa.id !== subAccountId
    )
    editForm.value.subAccountCount--
  }
}
</script>
