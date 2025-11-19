<template>
  <div class="h-screen flex bg-gray-900">
    <!-- 左侧边栏 -->
    <AppSidebar />

    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-50">个人中心</h1>
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <span class="text-gray-300">{{ authStore.user?.name }}</span>
            <button 
              class="px-4 py-2 text-gray-300 hover:text-gray-50 transition-colors"
              @click="handleLogout"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto px-6 py-8">
      <!-- Profile Header -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ authStore.user?.name?.charAt(0) || 'U' }}</span>
            </div>
            <button class="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
              <Camera :size="16" class="text-gray-300" />
            </button>
          </div>

          <!-- User Info -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">{{ authStore.user?.name || '用户' }}</h1>
            <p class="text-gray-400 mb-4">{{ authStore.user?.phone || '未绑定手机号' }}</p>
            
            <!-- Stats -->
            <div class="flex gap-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-400">{{ userStats.projects }}</div>
                <div class="text-sm text-gray-400">项目数</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-400">{{ userStats.videos }}</div>
                <div class="text-sm text-gray-400">视频数</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-400">{{ userStats.usage }}</div>
                <div class="text-sm text-gray-400">使用次数</div>
              </div>
            </div>
          </div>

          <!-- Edit Button -->
          <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all">
            编辑资料
          </button>
        </div>
      </div>

      <!-- Content Tabs -->
      <div class="mb-6">
        <div class="flex gap-1 p-1 bg-gray-800 rounded-lg w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-6 py-2 text-sm font-medium rounded-md transition-all duration-200"
            :class="[
              activeTab === tab.id
                ? 'bg-gray-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-300'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'basic'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">基本信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">用户名</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">手机号</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入手机号"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">公司/组织</label>
              <input
                v-model="profileForm.company"
                type="text"
                class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                placeholder="请输入公司或组织名称"
              />
            </div>
          </div>
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">个人简介</label>
            <textarea
              v-model="profileForm.bio"
              rows="4"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none resize-none"
              placeholder="介绍一下自己..."
            ></textarea>
          </div>
          <div class="mt-6 flex justify-end">
            <button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all">
              保存修改
            </button>
          </div>
        </div>

        <!-- 企业认证 -->
        <div v-if="activeTab === 'enterprise'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">企业认证</h2>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="{
                'bg-yellow-500/20 text-yellow-400': enterpriseCertification.status === 'pending',
                'bg-green-500/20 text-green-400': enterpriseCertification.status === 'approved',
                'bg-red-500/20 text-red-400': enterpriseCertification.status === 'rejected',
                'bg-gray-500/20 text-gray-400': enterpriseCertification.status === 'none'
              }"
            >
              {{ getStatusText(enterpriseCertification.status) }}
            </span>
          </div>

          <!-- 未申请状态 -->
          <div v-if="enterpriseCertification.status === 'none'" class="space-y-6">
            <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div class="flex items-start gap-3">
                <Building2 :size="20" class="text-blue-400 mt-0.5" />
                <div>
                  <h3 class="font-semibold text-blue-400 mb-1">企业认证权益</h3>
                  <ul class="text-sm text-gray-300 space-y-1">
                    <li>• 获得企业专属标识和认证徽章</li>
                    <li>• 提升品牌可信度和专业形象</li>
                    <li>• 支持创建多个团队子账号</li>
                    <li>• 享受企业级技术支持服务</li>
                    <li>• 优先体验新功能和产品</li>
                  </ul>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitEnterpriseApplication" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">企业名称 <span class="text-red-400">*</span></label>
                  <input
                    v-model="enterpriseForm.companyName"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入企业全称"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">统一社会信用代码 <span class="text-red-400">*</span></label>
                  <input
                    v-model="enterpriseForm.creditCode"
                    type="text"
                    required
                    pattern="[0-9A-Z]{18}"
                    maxlength="18"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="18位统一社会信用代码"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">法定代表人 <span class="text-red-400">*</span></label>
                  <input
                    v-model="enterpriseForm.legalPerson"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入法定代表人姓名"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">企业联系电话 <span class="text-red-400">*</span></label>
                  <input
                    v-model="enterpriseForm.contactPhone"
                    type="tel"
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入企业联系电话"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">企业地址</label>
                <input
                  v-model="enterpriseForm.address"
                  type="text"
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                  placeholder="请输入企业注册地址"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">营业执照 <span class="text-red-400">*</span></label>
                <div class="space-y-3">
                  <div
                    class="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                    @click="triggerFileUpload"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*,.pdf"
                      class="hidden"
                      @change="handleFileChange"
                    />
                    <Upload :size="32" class="mx-auto mb-2 text-gray-400" />
                    <p class="text-sm text-gray-400 mb-1">点击上传营业执照</p>
                    <p class="text-xs text-gray-500">支持 JPG、PNG、PDF 格式，大小不超过 10MB</p>
                  </div>
                  
                  <div v-if="enterpriseForm.licenseFile" class="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <FileText :size="20" class="text-blue-400" />
                    <span class="flex-1 text-sm text-gray-300">{{ enterpriseForm.licenseFile.name }}</span>
                    <button
                      type="button"
                      class="text-red-400 hover:text-red-300"
                      @click="enterpriseForm.licenseFile = null"
                    >
                      <X :size="18" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg">
                <input
                  v-model="enterpriseForm.agreed"
                  type="checkbox"
                  id="agree-terms"
                  required
                  class="mt-1"
                />
                <label for="agree-terms" class="text-sm text-gray-300">
                  我已阅读并同意《企业认证服务协议》和《隐私政策》，确保提交的企业信息真实有效
                </label>
              </div>

              <div class="flex justify-end gap-3">
                <button
                  type="submit"
                  class="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!enterpriseForm.licenseFile || !enterpriseForm.agreed"
                >
                  提交认证申请
                </button>
              </div>
            </form>
          </div>

          <!-- 审核中状态 -->
          <div v-if="enterpriseCertification.status === 'pending'" class="space-y-6">
            <div class="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
              <div class="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock :size="32" class="text-yellow-400" />
              </div>
              <h3 class="text-lg font-semibold text-yellow-400 mb-2">认证申请审核中</h3>
              <p class="text-sm text-gray-400 mb-4">我们正在审核您的企业认证申请，预计1-3个工作日内完成</p>
              <div class="text-xs text-gray-500">
                提交时间：{{ enterpriseCertification.submittedAt }}
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-lg font-semibold">申请信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div class="text-sm">
                  <span class="text-gray-400">企业名称：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.companyName }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">信用代码：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.creditCode }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">法定代表人：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.legalPerson }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">联系电话：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.contactPhone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 已通过状态 -->
          <div v-if="enterpriseCertification.status === 'approved'" class="space-y-6">
            <div class="p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 :size="32" class="text-green-400" />
              </div>
              <h3 class="text-lg font-semibold text-green-400 mb-2">企业认证已通过</h3>
              <p class="text-sm text-gray-400 mb-4">恭喜！您的企业已完成认证，可以享受企业专属权益</p>
              <div class="text-xs text-gray-500">
                认证时间：{{ enterpriseCertification.approvedAt }}
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-lg font-semibold">企业信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                <div class="text-sm">
                  <span class="text-gray-400">企业名称：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.companyName }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">信用代码：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.creditCode }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">法定代表人：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.legalPerson }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-400">联系电话：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.contactPhone }}</span>
                </div>
                <div class="text-sm col-span-2">
                  <span class="text-gray-400">企业地址：</span>
                  <span class="text-gray-300">{{ enterpriseCertification.address || '未填写' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 已拒绝状态 -->
          <div v-if="enterpriseCertification.status === 'rejected'" class="space-y-6">
            <div class="p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle :size="32" class="text-red-400" />
              </div>
              <h3 class="text-lg font-semibold text-red-400 mb-2">认证申请未通过</h3>
              <p class="text-sm text-gray-400 mb-2">很抱歉，您的企业认证申请未通过审核</p>
              <div class="p-3 bg-gray-700/50 rounded text-left text-sm">
                <span class="text-gray-400">拒绝原因：</span>
                <span class="text-gray-300">{{ enterpriseCertification.rejectReason }}</span>
              </div>
            </div>

            <button
              class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              @click="reapplyEnterprise"
            >
              重新申请认证
            </button>
          </div>
        </div>

        <!-- 我的文档 -->
        <div v-if="activeTab === 'documents'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">我的文档</h2>
            <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              @click="$router.push('/my-documents')"
            >
              查看全部文档
            </button>
          </div>
          <p class="text-gray-400 mb-4">快速访问您上传的知识库文档</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-3">
                <FileText :size="24" class="text-blue-400" />
                <div>
                  <div class="font-medium">文档总数</div>
                  <div class="text-2xl font-bold text-blue-400">{{ userStats.documents }}</div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-3">
                <CheckCircle :size="24" class="text-green-400" />
                <div>
                  <div class="font-medium">训练完成</div>
                  <div class="text-2xl font-bold text-green-400">{{ userStats.trainedDocs }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 我的创作 -->
        <div v-if="activeTab === 'creations'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">我的创作</h2>
            <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              @click="$router.push('/my-creations')"
            >
              查看全部创作
            </button>
          </div>
          <p class="text-gray-400 mb-4">查看和管理AI生成的内容</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-3">
                <BookOpen :size="24" class="text-purple-400" />
                <div>
                  <div class="font-medium">创作总数</div>
                  <div class="text-2xl font-bold text-purple-400">{{ userStats.creations }}</div>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-3">
                <Hash :size="24" class="text-orange-400" />
                <div>
                  <div class="font-medium">总字数</div>
                  <div class="text-2xl font-bold text-orange-400">{{ userStats.totalWords }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div v-if="activeTab === 'stats'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">使用统计</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Video :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.videos }}</div>
                  <div class="text-sm text-gray-400">视频创作</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">本月新增 {{ userStats.videosThisMonth }} 个</div>
            </div>

            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.totalTime }}</div>
                  <div class="text-sm text-gray-400">使用时长</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">本月 {{ userStats.timeThisMonth }} 小时</div>
            </div>

            <div class="p-6 bg-gray-700/50 rounded-xl">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp :size="20" class="text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ userStats.efficiency }}%</div>
                  <div class="text-sm text-gray-400">效率提升</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">相比传统方式</div>
            </div>
          </div>
        </div>

        <!-- 账户设置 -->
        <div v-if="activeTab === 'account'" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-6">账户设置</h2>
          <div class="space-y-6">
            <!-- 密码修改 -->
            <div class="p-4 bg-gray-700/50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">修改密码</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">当前密码</label>
                  <input
                    v-model="passwordForm.current"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入当前密码"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">新密码</label>
                  <input
                    v-model="passwordForm.new"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请输入新密码"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">确认密码</label>
                  <input
                    v-model="passwordForm.confirm"
                    type="password"
                    class="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
              <div class="mt-4">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  修改密码
                </button>
              </div>
            </div>

            <!-- 账户安全 -->
            <div class="p-4 bg-gray-700/50 rounded-lg">
              <h3 class="text-lg font-semibold mb-4">账户安全</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">两步验证</div>
                    <div class="text-sm text-gray-400">为您的账户添加额外的安全保护</div>
                  </div>
                  <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    启用
                  </button>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">登录通知</div>
                    <div class="text-sm text-gray-400">当有新设备登录时发送通知</div>
                  </div>
                  <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    已启用
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Sparkles, 
  Camera, 
  Video, 
  Clock, 
  TrendingUp,
  FileText,
  CheckCircle,
  BookOpen,
  Hash,
  Building2,
  Upload,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'
import AppSidebar from './WorkspacePage/AppSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('basic')

const tabs = [
  { id: 'basic', name: '基本信息' },
  { id: 'enterprise', name: '企业认证' },
  { id: 'documents', name: '我的文档' },
  { id: 'creations', name: '我的创作' },
  { id: 'stats', name: '使用统计' },
  { id: 'account', name: '账户设置' }
]

// 用户统计数据
const userStats = reactive({
  projects: 12,
  videos: 48,
  usage: 156,
  documents: 15,
  trainedDocs: 12,
  creations: 28,
  totalWords: '45.2K',
  videosThisMonth: 8,
  totalTime: '24.5h',
  timeThisMonth: '6.2h',
  efficiency: 85
})

// 个人资料表单
const profileForm = reactive({
  name: authStore.user?.name || '',
  phone: authStore.user?.phone || '',
  email: '',
  company: '',
  bio: ''
})

// 密码修改表单
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// 企业认证状态
const enterpriseCertification = reactive({
  status: 'none', // none, pending, approved, rejected
  companyName: '',
  creditCode: '',
  legalPerson: '',
  contactPhone: '',
  address: '',
  submittedAt: '',
  approvedAt: '',
  rejectReason: ''
})

// 企业认证申请表单
const enterpriseForm = reactive({
  companyName: '',
  creditCode: '',
  legalPerson: '',
  contactPhone: '',
  address: '',
  licenseFile: null as File | null,
  agreed: false
})

// 文件上传引用
const fileInput = ref<HTMLInputElement>()

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    none: '未认证',
    pending: '审核中',
    approved: '已认证',
    rejected: '已拒绝'
  }
  return statusMap[status] || '未知'
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 验证文件大小（10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert('文件大小不能超过 10MB')
    return
  }
  
  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    alert('只支持 JPG、PNG、PDF 格式的文件')
    return
  }
  
  enterpriseForm.licenseFile = file
}

// 提交企业认证申请
const submitEnterpriseApplication = () => {
  if (!enterpriseForm.licenseFile) {
    alert('请上传营业执照')
    return
  }
  
  if (!enterpriseForm.agreed) {
    alert('请同意服务协议')
    return
  }
  
  // 模拟提交
  enterpriseCertification.status = 'pending'
  enterpriseCertification.companyName = enterpriseForm.companyName
  enterpriseCertification.creditCode = enterpriseForm.creditCode
  enterpriseCertification.legalPerson = enterpriseForm.legalPerson
  enterpriseCertification.contactPhone = enterpriseForm.contactPhone
  enterpriseCertification.address = enterpriseForm.address
  enterpriseCertification.submittedAt = new Date().toLocaleString('zh-CN')
  
  alert('企业认证申请已提交，请耐心等待审核！')
  
  // 清空表单
  Object.assign(enterpriseForm, {
    companyName: '',
    creditCode: '',
    legalPerson: '',
    contactPhone: '',
    address: '',
    licenseFile: null,
    agreed: false
  })
}

// 重新申请认证
const reapplyEnterprise = () => {
  enterpriseCertification.status = 'none'
  enterpriseCertification.rejectReason = ''
}

// 处理登出
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
