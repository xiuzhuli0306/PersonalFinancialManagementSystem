<template>
    <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ collapsed: isCollapse }">
            <div class="sidebar-inner">
                <!-- Logo -->
                <div class="sidebar-logo">
                    <div class="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                    </div>
                    <span v-show="!isCollapse" class="logo-text">Finance Admin</span>
                </div>

                <!-- Navigation Menu -->
                <nav class="sidebar-nav">
                    <div class="nav-section">
                        <div class="nav-label" v-show="!isCollapse">System</div>
                        <div class="nav-item" v-if="roleType === 'Admin'"
                            :class="{ active: isActive('/admin/userList') }" @click="navigateTo('/admin/userList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span v-show="!isCollapse">Account Management</span>
                        </div>
                    </div>

                    <div class="nav-section">
                        <div class="nav-label" v-show="!isCollapse">Finance</div>
                        <div class="nav-item" :class="{ active: isActive('/admin/accountList') }"
                            @click="navigateTo('/admin/accountList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            <span v-show="!isCollapse">Accounts</span>
                        </div>
                        <div class="nav-item" :class="{ active: isActive('/admin/financeTypeList') }"
                            @click="navigateTo('/admin/financeTypeList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            <span v-show="!isCollapse">Categories</span>
                        </div>
                        <div class="nav-item" :class="{ active: isActive('/admin/financeRecordList') }"
                            @click="navigateTo('/admin/financeRecordList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="12" x2="12" y1="1" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <span v-show="!isCollapse">Transactions</span>
                        </div>
                        <div class="nav-item" :class="{ active: isActive('/admin/budgetList') }"
                            @click="navigateTo('/admin/budgetList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                            </svg>
                            <span v-show="!isCollapse">Budgets</span>
                        </div>
                    </div>

                    <div class="nav-section">
                        <div class="nav-label" v-show="!isCollapse">Messages</div>
                        <div class="nav-item" v-if="roleType === 'Admin'"
                            :class="{ active: isActive('/admin/announcementList') }"
                            @click="navigateTo('/admin/announcementList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M19.4 14.9C20.2 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 .7 0 1.3.1 1.9.3" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                <circle cx="18" cy="8" r="3" />
                            </svg>
                            <span v-show="!isCollapse">Announcements</span>
                        </div>
                        <div class="nav-item" :class="{ active: isActive('/admin/notificationList') }"
                            @click="navigateTo('/admin/notificationList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <span v-show="!isCollapse">Notifications</span>
                        </div>
                        <div class="nav-item" v-if="roleType !== 'Admin'"
                            :class="{ active: isActive('/admin/reminderSettingList') }"
                            @click="navigateTo('/admin/reminderSettingList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span v-show="!isCollapse">Reminders</span>
                        </div>
                    </div>

                    <div class="nav-section" v-if="roleType === 'Admin'">
                        <div class="nav-label" v-show="!isCollapse">Logs</div>
                        <div class="nav-item" :class="{ active: isActive('/admin/operationLogList') }"
                            @click="navigateTo('/admin/operationLogList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" x2="8" y1="13" y2="13" />
                                <line x1="16" x2="8" y1="17" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <span v-show="!isCollapse">Operation Logs</span>
                        </div>
                    </div>

                    <div class="nav-section">
                        <div class="nav-label" v-show="!isCollapse">AI Tools</div>
                        <div class="nav-item" :class="{ active: isActive('/admin/aiBillRecognitionList') }"
                            @click="navigateTo('/admin/aiBillRecognitionList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M9 15l2 2 4-4" />
                            </svg>
                            <span v-show="!isCollapse">AI Bill Recognition</span>
                        </div>
                    </div>

                    <div class="nav-section" v-if="roleType === 'Admin'">
                        <div class="nav-label" v-show="!isCollapse">Analytics</div>
                        <div class="nav-item" :class="{ active: isActive('/admin/adminStatistics') }"
                            @click="navigateTo('/admin/adminStatistics')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" x2="18" y1="20" y2="10" />
                                <line x1="12" x2="12" y1="20" y2="4" />
                                <line x1="6" x2="6" y1="20" y2="14" />
                            </svg>
                            <span v-show="!isCollapse">Statistics</span>
                        </div>
                    </div>
                </nav>

                <!-- Footer User Area -->
                <div class="sidebar-footer">
                    <div class="user-card">
                        <div class="user-avatar">
                            {{ userInfo.userName ? userInfo.userName[0] : 'U' }}
                        </div>
                        <div v-show="!isCollapse" class="user-meta">
                            <span class="user-name">{{ userInfo.userName }}</span>
                            <span class="user-role">{{ roleType }}</span>
                        </div>
                    </div>
                    <div class="nav-item logout-item" @click="handleLogout">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        <span v-show="!isCollapse">Sign Out</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Area -->
        <div class="main-wrapper">
            <!-- Top Header -->
            <header class="top-header">
                <div class="header-left">
                    <button class="collapse-btn" @click="isCollapse = !isCollapse">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" x2="21" y1="12" y2="12" />
                            <line x1="3" x2="21" y1="6" y2="6" />
                            <line x1="3" x2="21" y1="18" y2="18" />
                        </svg>
                    </button>
                    <!-- Breadcrumb -->
                    <div class="breadcrumb-bar">
                        <span v-for="(item, index) in breadcrumbList" :key="index" class="breadcrumb-item">
                            <span class="breadcrumb-text" @click="navigateTo(item.path)">{{ item.title }}</span>
                            <span v-if="index < breadcrumbList.length - 1" class="breadcrumb-sep">/</span>
                        </span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        {{ currentDate }}
                    </div>
                    <div class="header-actions">
                        <button class="action-btn" title="Profile" @click="handleUserInfo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                        <button class="action-btn" title="Change Password" @click="handlePasswordEdit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="16" r="1" />
                                <rect x="3" y="10" width="18" height="12" rx="2" />
                                <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Content Area -->
            <main class="main-content">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup>
import { useCommonStore } from '@/store';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const commonStore = useCommonStore();
const router = useRouter();
const route = useRoute();

const userInfo = computed(() => commonStore.userInfo)
const roleType = computed(() => commonStore.roleType)
const isCollapse = ref(false)
const breadcrumbList = ref([])

const currentDate = computed(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
})

watch(
    () => route.matched,
    (matched) => {
        if (!isHome(matched[0])) {
            breadcrumbList.value = [
                { title: 'Dashboard', path: '/admin' },
                ...matched.map(item => ({
                    title: item.meta.title || item.name,
                    path: item.path
                }))
            ]
        } else {
            breadcrumbList.value = matched.map(item => ({
                title: item.meta.title || item.name,
                path: item.path
            }))
        }
    },
    { immediate: true }
)

function isHome(r) {
    return r && r.path === "/admin";
}
function isActive(path) {
    return route.path === path;
}
function navigateTo(path) {
    router.push(path);
}
function handleLogout() {
    commonStore.logout();
    router.push("/login");
}
function handleUserInfo() {
    router.push("/admin/userPerson");
}
function handlePasswordEdit() {
    router.push("/admin/passwordEdit");
}
</script>

<style scoped lang="scss">
.admin-layout {
    display: flex;
    height: 100vh;
    background: #f5f5f5;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ===== Sidebar ===== */
.sidebar {
    width: 240px;
    background: #0f172a;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.3s ease;
    overflow: hidden;

    &.collapsed {
        width: 64px;
    }
}

.sidebar-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* Logo */
.sidebar-logo {
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
}

.logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #ffffff;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.logo-text {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    letter-spacing: -0.01em;
}

/* Navigation */
.sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 16px 8px;

    &::-webkit-scrollbar {
        width: 0;
    }
}

.nav-section {
    margin-bottom: 16px;
}

.nav-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #475569;
    padding: 0 12px;
    margin-bottom: 6px;
    white-space: nowrap;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    color: #94a3b8;

    svg {
        flex-shrink: 0;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
    }

    &.active {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }
}

/* Footer User */
.sidebar-footer {
    padding: 12px 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    margin-bottom: 8px;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #334155;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
}

.user-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.user-name {
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-role {
    font-size: 11px;
    color: #64748b;
}

.logout-item {
    color: #94a3b8;

    &:hover {
        background: rgba(244, 63, 94, 0.1);
        color: #f43f5e;
    }
}

/* ===== Main Area ===== */
.main-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
}

/* Top Header */
.top-header {
    height: 56px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        background: #f1f5f9;
        color: #0f172a;
    }
}

.breadcrumb-bar {
    display: flex;
    align-items: center;
    gap: 4px;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.breadcrumb-text {
    font-size: 13px;
    color: #64748b;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
        color: #0f172a;
    }
}

.breadcrumb-item:last-child .breadcrumb-text {
    color: #0f172a;
    font-weight: 600;
}

.breadcrumb-sep {
    font-size: 12px;
    color: #cbd5e1;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-date {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f1f5f9;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        background: #f1f5f9;
        color: #0f172a;
    }
}

/* Content Area */
.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: #f5f5f5;
}
</style>
