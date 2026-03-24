import { useCommonStore } from "@/store";
import AdminLayout from "@/views/Admin/Layout/index.vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { createRouter, createWebHashHistory } from "vue-router";

// Import components directly
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgetPassword from "../views/ForgetPassword.vue";
import NotFound from "../views/NotFound.vue";
import AdminHome from "../views/Admin/Home.vue";
import UserPerson from "../views/Admin/UserPerson.vue";
import PasswordEdit from "../views/Admin/PasswordEdit.vue";
import UserList from "../views/Admin/UserList.vue";
import AdminAccountList from "../views/Admin/AccountList.vue";
import AdminAnnouncementList from "../views/Admin/AnnouncementList.vue";
import AdminBudgetList from "../views/Admin/BudgetList.vue";
import AdminFinanceRecordList from "../views/Admin/FinanceRecordList.vue";
import AdminFinanceTypeList from "../views/Admin/FinanceTypeList.vue";
import AdminNotificationList from "../views/Admin/NotificationList.vue";
import AdminOperationLogList from "../views/Admin/OperationLogList.vue";
import AdminReminderSettingList from "../views/Admin/ReminderSettingList.vue";
import AdminStatistics from "../views/Admin/AdminStatistics.vue";
import AdminAiBillRecognitionList from "../views/Admin/AiBillRecognitionList.vue";

// Configure NProgress
NProgress.configure({
  showSpinner: false, // Hide loading spinner
  speed: 1000,
  trickle: false,
});

// Route configuration
const routes = [
  {
    path: "/",
    redirect: "/admin",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/forgetPassword",
    name: "forgetPassword",
    component: ForgetPassword,
  },
  // 404 page
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
  },
];



const adminRoutes = [
  {
    path: "/admin",
    name: "admin",
    redirect: "/admin/home",
    component: AdminLayout,
    meta: {
      title: "Dashboard",
      isAdmin: true,
    },
    children: [
      {
        path: "/admin/home",
        name: "adminHome",
        meta: {
          title: "Dashboard",
          isAdmin: true,
        },
        component: AdminHome,
      },
      {
        path: "/admin/userPerson",
        name: "adminUserPerson",
        meta: {
          title: "Account Info",
          isAdmin: true,
        },
        component: UserPerson,
      },
      {
        path: "/admin/passwordEdit",
        name: "passwordEdit",
        meta: {
          title: "Change Password",
          isAdmin: true,
        },
        component: PasswordEdit,
      },
      {
        path: "/admin/userList",
        name: "adminUserList",
        meta: {
          title: "User Management",
          isAdmin: true,
          adminOnly: true,
        },
        component: UserList,
      },
           	 {
            path: "/Admin/accountList",
            meta: {
                title: "Accounts",
                isAdmin: true,
            },
            component: AdminAccountList
        },	
 
      	 {
            path: "/Admin/announcementList",
            meta: {
                title: "Announcements",
                isAdmin: true,
                adminOnly: true,
            },
            component: AdminAnnouncementList
        },	
 
      	 {
            path: "/Admin/budgetList",
            meta: {
                title: "Budgets",
                isAdmin: true,
            },
            component: AdminBudgetList
        },	
 
      	 {
            path: "/Admin/financeRecordList",
            meta: {
                title: "Transactions",
                isAdmin: true,
            },
            component: AdminFinanceRecordList
        },	
 
      	 {
            path: "/Admin/financeTypeList",
            meta: {
                title: "Categories",
                isAdmin: true,
            },
            component: AdminFinanceTypeList
        },	
 
      	 {
            path: "/Admin/notificationList",
            meta: {
                title: "Notifications",
                isAdmin: true,
            },
            component: AdminNotificationList
        },	
 
      	 {
            path: "/Admin/operationLogList",
            meta: {
                title: "Operation Logs",
                isAdmin: true,
                adminOnly: true,
            },
            component: AdminOperationLogList
        },	
 
      	 {
            path: "/Admin/reminderSettingList",
            meta: {
                title: "Reminders",
                isAdmin: false,
            },
            component: AdminReminderSettingList
        },	
 
      	 {
            path: "/admin/adminStatistics",
            meta: {
                title: "Statistics",
                isAdmin: true,
                adminOnly: true,
            },
            component: AdminStatistics
        },

         {
            path: "/Admin/aiBillRecognitionList",
            meta: {
                title: "AI Bill Recognition",
                isAdmin: true,
            },
            component: AdminAiBillRecognitionList
        },
 
 
    ],
  },
];

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, ...adminRoutes],
});

// Router before guard
router.beforeEach(async (to, from, next) => {
  // Start progress bar
  NProgress.start();

  // Get store instance
  const commonStore = useCommonStore();

  // Handle route permissions
  if (commonStore.token) {
    // Check if user info exists
    if (commonStore.hasUserInfo == false) {
      // Get account info
      await commonStore.getInfo();
      // If account id is null or 0
      if (commonStore.userId == null || commonStore.userId == 0) {
        commonStore.logout();
      }
    }
    // If navigating to admin page
    if (to.meta && to.meta.isAdmin) {
      // Both admin and user can access admin pages
      if (commonStore.roleType == "Admin" || commonStore.roleType == "User") {
        // Admin-only pages
        if (to.meta.adminOnly && commonStore.roleType != "Admin") {
          next({ path: "/admin/home" });
        } else {
          next();
        }
      } else {
        next({ path: "/login" });
      }
    } else {
      // Logged-in user accessing non-admin page, redirect to admin
      next({ path: "/admin" });
    }
  } else {
    if (to.meta && to.meta.isAdmin) {
      next({ path: "/login" });
    } else {
      next();
    }
  }
});

// Router after guard
router.afterEach(() => {
  window.scrollTo({ top: 0 });
  // Close progress bar
  NProgress.done();
});

export default router;
