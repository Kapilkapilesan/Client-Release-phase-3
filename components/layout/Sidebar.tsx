import React from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  UsersRound,
  User,
  FileText,
  DollarSign,
  ClipboardList,
  BarChart3,
  Wallet,
  TrendingUp,
  Settings,
  ChevronDown,
  Globe,
  Shield,
  AlertCircle,
  ArrowLeftRight,
  Receipt,
  ChevronLeft,
  Download,
  Calendar,
  Package,
  MessageSquare,
  PieChart,
  ShieldCheck,
  RotateCcw,
  UserPlus,
  Bell,
  Clock,
  Sparkles,
  Zap,
  LogOut,
  MoreVertical,
  Smartphone,
} from "lucide-react";
import { Page } from "./MainLayout";
import { notificationService } from "../../services/notification.service";
import { authService } from "../../services/auth.service";
import { colors } from "@/themes/colors";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  userRole: string;
}

interface MenuItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
  roles?: string[];
  permission?: string;
  permissions?: string[];
}

export function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  userRole,
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [lastPollTime, setLastPollTime] = React.useState<string>('');
  const [isPolling, setIsPolling] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      permission: "dashboard.view",
    },
    {
      id: "admin-dashboard",
      label: "Admin Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
      permission: "admin_dashboard.view",
    },
    {
      id: "branches",
      label: "Branches",
      icon: <Building2 className="w-5 h-5" />,
      permission: "branches.view",
    },
    {
      id: "centers-section" as Page,
      label: "Centers (CSU)",
      icon: <Users className="w-5 h-5" />,
      submenu: [
        {
          id: "centers",
          label: "Schedule",
          icon: <ClipboardList className="w-4 h-4" />,
        },
        {
          id: "meeting-scheduling",
          label: "Meeting Schedule",
          icon: <ClipboardList className="w-4 h-4" />,
          permission: "sessions.view",
        },
        {
          id: "center-requests",
          label: "Transfer Requests",
          icon: <ArrowLeftRight className="w-4 h-4" />,
          permission: "customers.approve_transfer",
        },
      ],
      permission: "centers.view",
    },
    {
      id: "groups",
      label: "Groups",
      icon: <UsersRound className="w-5 h-5" />,
      permission: "groups.view",
    },
    {
      id: "customers-section" as Page,
      label: "Customers",
      icon: <User className="w-5 h-5" />,
      submenu: [
        {
          id: "customers",
          label: "Customer List",
          icon: <ClipboardList className="w-4 h-4" />,
        },
        {
          id: "customer-requests" as Page,
          label: "Edit Approvals",
          icon: <ShieldCheck className="w-4 h-4" />,
          permission: "customers.approve",
        },
      ],
      permission: "customers.view",
    },
    {
      id: "shareholders",
      label: "Shareholders",
      icon: <PieChart className="w-5 h-5" />,
      permission: "shareholders.view",
    },
  ];

  const productMenuItems: MenuItem[] = [
    {
      id: "loan-product" as Page,
      label: "Loan",
      icon: <DollarSign className="w-4 h-4" />,
      permission: "loan_products.view",
    },
    {
      id: "investment-product" as Page,
      label: "Investment",
      icon: <TrendingUp className="w-4 h-4" />,
      permission: "investment_products.view",
    },
  ];

  const loanMenuItems: MenuItem[] = [
    {
      id: "loan-create" as Page,
      label: "Create Loan",
      icon: <FileText className="w-4 h-4" />,
      permission: "loans.create",
    },
    {
      id: "loan-approval" as Page,
      label: "Loan Approval",
      icon: <Shield className="w-4 h-4" />,
      permission: "loans.approve",
    },
    {
      id: "loan-sent-back" as Page,
      label: "Sent Back Loans",
      icon: <AlertCircle className="w-4 h-4" />,
      permission: "loans.view",
    },
    {
      id: "loan-list" as Page,
      label: "Loan List",
      icon: <ClipboardList className="w-4 h-4" />,
      permission: "loans.view",
    },
  ];

  const collectionMenuItems: MenuItem[] = [
    {
      id: "due-list" as Page,
      label: "Due List",
      icon: <ClipboardList className="w-4 h-4" />,
      permission: "collections.due_list",
    },
    {
      id: "collections" as Page,
      label: "Collections",
      icon: <DollarSign className="w-4 h-4" />,
      permission: "collections.view",
    },
    {
      id: "receipt-rejections" as Page,
      label: "Cancellation Requests",
      icon: <RotateCcw className="w-4 h-4" />,
      permission: "receipts.approvecancel",
    },
    {
      id: "collection-summary" as Page,
      label: "Collection Summary",
      icon: <Receipt className="w-4 h-4" />,
      permission: "collections.summary",
    },
  ];

  const approvalMenuItems: MenuItem[] = [
    {
      id: "salary-approval" as Page,
      label: "Salary Approval",
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: "finance.approve_salary",
    },

  ];

  const financeMenuItems: MenuItem[] = [
    {
      id: "finance-overview" as Page,
      label: "Finance Overview",
      icon: <Wallet className="w-4 h-4" />,
      permission: "finance.view",
    },
    {
      id: "fund-transactions" as Page,
      label: "Fund Truncation",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      permissions: [
        "finance.shareholders",
        "finance.investments",
        "finance.approveloanpayout",
        "finance.disburse_salary",
        "finance.staffloans",
        "finance.investmentpayouts"
      ],
    },
    {
      id: "fund-truncation-summary" as Page,
      label: "Truncation Summary",
      icon: <FileText className="w-4 h-4" />,
      permission: "finance.truncation_summary",
    },
    {
      id: "branch-transactions" as Page,
      label: "Branch Truncation",
      icon: <Building2 className="w-4 h-4" />,
      permission: "finance.branch_truncation_view",
    },
  ];

  const promotionMenuItems: MenuItem[] = [
    {
      id: "staff-promotion" as Page,
      label: "Staff Promotion",
      icon: <UserPlus className="w-4 h-4" />,
      permissions: ["promotions.view", "salary_increments.view", "salary_increments.create"],
    },
    {
      id: "promotion-approval" as Page,
      label: "Promotion Approval",
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: "promotions.approve",
    },
    {
      id: "salary-increment-approval" as Page,
      label: "Salary Increment Approval",
      icon: <DollarSign className="w-4 h-4" />,
      permission: "salary_increments.approve",
    },
    {
      id: "temporary-promotion" as Page,
      label: "Temporary Promotion",
      icon: <Clock className="w-4 h-4" />,
      permission: "temporary_promotions.manage",
    },
  ];

  const staffLoanMenuItems: MenuItem[] = [
    {
      id: "staff-loan-create" as Page,
      label: "Create Staff Loan",
      icon: <FileText className="w-4 h-4" />,
      permission: "staffloans.create",
    },
    {
      id: "staff-loan-list" as Page,
      label: "Staff Loans",
      icon: <FileText className="w-4 h-4" />,
      permission: "staffloans.view_all",
    },
    {
      id: "staff-loan-approval" as Page,
      label: "Staff Loan Approvals",
      icon: <ShieldCheck className="w-4 h-4" />,
      permission: "staffloans.approve",
    },
  ];

  const agreementMenuItems: MenuItem[] = [
    {
      id: "loan-agreement" as Page,
      label: "Loan Agreement",
      icon: <FileText className="w-4 h-4" />,
      permission: "loan_agreements.view",
    },
    {
      id: "reprint-approvals" as Page,
      label: "Reprint Requests",
      icon: <Clock className="w-4 h-4" />,
      permission: "loan_agreements.approve_reprint",
    },
  ];

  const fetchCounts = async () => {
    try {
      setIsPolling(true);
      const response = await notificationService.getSidebarCounts();
      if (response.status === "success") {
        setCounts(response.data);
        setLastPollTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch sidebar counts:", error);
    } finally {
      setIsPolling(false);
    }
  };

  // Immediate fetch function for critical updates
  const fetchCountsImmediate = async () => {
    try {
      const response = await notificationService.getSidebarCounts();
      if (response.status === "success") {
        setCounts(response.data);
        setLastPollTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch sidebar counts:", error);
    }
  };

  React.useEffect(() => {
    setIsMounted(true);
    fetchCounts();
    setCurrentUser(authService.getCurrentUser());

    // Initial fetch immediately, then set up polling
    intervalRef.current = setInterval(fetchCounts, 30000); // Poll every 30 seconds for more responsive updates

    // Also set up a visibility change listener to pause/resume polling when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        fetchCountsImmediate(); // Fetch immediately when tab becomes visible
        intervalRef.current = setInterval(fetchCounts, 30000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    if (!currentPage || !isMounted) return;

    // Trigger immediate count update when navigating to specific pages
    const shouldUpdateImmediately = [
      'customers',
      'customer-requests',
      'loan-approval',
      'salary-approval',
      'fund-transactions',
      'complaints',
      'receipt-rejections',
      'staff-loan-approval',
      'promotion-approval',
      'salary-increment-approval',
      'temporary-promotion'
    ];

    if (shouldUpdateImmediately.includes(currentPage as string)) {
      fetchCountsImmediate();
    }

    const findParentMenu = (page: Page): string | null => {
      if (loanMenuItems.some((m) => m.id === page)) return "loans";
      if (productMenuItems.some((m) => m.id === page)) return "products";
      if (financeMenuItems.some((m) => m.id === page)) return "finance";
      if (collectionMenuItems.some((m) => m.id === page))
        return "collections-section";
      if (approvalMenuItems.some((m) => m.id === page))
        return "approvals-section";
      if (promotionMenuItems.some((m) => m.id === page))
        return "promotion-section";
      if (staffLoanMenuItems.some((m) => m.id === page))
        return "staff-loan-section";
      if (agreementMenuItems.some((m) => m.id === page))
        return "agreement-section";
      if (["investment-create", "investment-list"].includes(page as string))
        return "investments-section";

      for (const item of menuItems) {
        if (item.submenu?.some((sub) => sub.id === page)) {
          return item.id as string;
        }
      }
      return null;
    };

    const parentId = findParentMenu(currentPage);
    if (parentId && !expandedMenus.includes(parentId)) {
      setExpandedMenus((prev) => [...prev, parentId]);
    }
  }, [currentPage, isMounted, expandedMenus]);

  React.useEffect(() => {
    if (isMounted && !isCollapsed) {
      const timer = setTimeout(() => {
        const activeItem = document.getElementById("active-sidebar-item");
        const navContainer = activeItem?.closest("nav");
        if (activeItem && navContainer) {
          const rect = activeItem.getBoundingClientRect();
          const containerRect = navContainer.getBoundingClientRect();
          const isVisible =
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom;
          if (!isVisible) {
            activeItem.scrollIntoView({ behavior: "auto", block: "nearest" });
          }
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentPage, expandedMenus, isMounted, isCollapsed]);

  const toggleMenu = (menuId: string) => {
    if (!isCollapsed) {
      setExpandedMenus((prev) =>
        prev.includes(menuId)
          ? prev.filter((id) => id !== menuId)
          : [...prev, menuId]
      );
    }
  };

  const getBadgeCount = (id: string): number => {
    switch (id) {
      case "centers":
        return counts.centers || 0;
      case "center-requests":
        return counts.center_transfers || 0;
      case "centers-section":
        return (counts.centers || 0) + (counts.center_transfers || 0);
      case "loan-approval":
        return counts.loans || 0;
      case "loan-sent-back":
        return counts.sent_back_loans || 0;
      case "loans":
        return (counts.loans || 0) + (counts.sent_back_loans || 0);
      case "salary-approval":
        return counts.salaries || 0;
      case "fund-transactions":
        return (counts.salaries || 0) + (counts.disbursements || 0);
      case "finance-overview":
        return 0;
      case "finance":
        return (counts.salaries || 0) + (counts.disbursements || 0);
      case "complaints":
        return counts.complaints || 0;
      case "receipt-rejections":
        return counts.receipt_cancellations || counts.reprint_requests || 0;
      case "customer-requests":
        return counts.customer_edits || 0;
      case "customers-section":
        return counts.customer_edits || 0;
      case "staff-promotion":
        return 0;
      case "promotion-approval":
        return counts.promotions || 0;
      case "salary-increment-approval":
        return counts.salary_increments || 0;
      case "temporary-promotion":
        return 0;
      case "promotion-section":
        return (counts.promotions || 0) + (counts.salary_increments || 0);
      case "staff-management":
        return counts.attendance || 0;
      case "reprint-approvals":
        return counts.reprint_requests || 0;
      case "agreement-section":
        return counts.reprint_requests || 0;
      default:
        return 0;
    }
  };

  const renderBadge = (id: string, isSmall = false) => {
    const count = getBadgeCount(id);
    if (count <= 0) return null;

    return (
      <span
        className={`inline-flex items-center justify-center bg-red-600 text-white rounded-full font-bold shadow-md transform transition-all duration-300 ${isSmall
          ? "min-w-[18px] h-[18px] text-[10px] px-1"
          : "min-w-[22px] h-[22px] text-[11px] px-1.5"
          } ${isCollapsed
            ? "absolute -top-1 -right-1 border-2 border-white dark:border-gray-800"
            : "relative ml-auto"
          } hover:scale-110`}
      >
        {count > 99 ? "99+" : count}
        {!isCollapsed && (
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25"></span>
        )}
      </span>
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.roles && !item.roles.includes(userRole)) return null;
    if (
      item.permission &&
      (!isMounted || !authService.hasPermission(item.permission))
    )
      return null;

    const hasSubmenu = !!item.submenu?.length;
    const isExpanded = expandedMenus.includes(item.id as string);
    const isActive = currentPage === item.id;

    if (item.permissions && isMounted) {
      if (!item.permissions.some(p => authService.hasPermission(p))) {
        return null;
      }
    }

    if (hasSubmenu) {
      return (
        <div key={item.id} className="mx-3 mb-1">
          {isCollapsed ? (
            <button
              id={isActive ? "active-sidebar-item" : undefined}
              onClick={() => toggleMenu(item.id as string)}
              className={`w-full flex items-center justify-center aspect-square text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all group relative ${isActive ? "liquid-glass" : ""
                }`}
              title={item.label}
            >
              <div
                className={`group-hover:text-text-primary ${isActive ? "text-primary-600" : ""
                  }`}
              >
                {item.icon}
              </div>
              {renderBadge(item.id as string)}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          ) : (
            <>
              <button
                id={isActive ? "active-sidebar-item" : undefined}
                onClick={() => toggleMenu(item.id as string)}
                className={`w-full flex items-center justify-between px-5 py-2.5 text-text-secondary hover:bg-hover rounded-2xl transition-all duration-400 group ${isActive ? "liquid-glass text-primary-600 scale-[1.02]" : ""
                  }`}
              >
                <div className="flex-1 flex items-center justify-between transition-transform duration-300 group-hover:translate-x-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`group-hover:text-text-primary transition-colors ${isActive ? "text-primary-600" : ""
                        }`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderBadge(item.id as string, true)}
                    <div className="w-5 h-5 flex items-center justify-center bg-muted-bg rounded-full group-hover:bg-card transition-colors">
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-border-default py-1">
                  {item.submenu?.map((subItem) => {
                    if (subItem.roles && !subItem.roles.includes(userRole))
                      return null;
                    if (
                      subItem.permission &&
                      (!isMounted ||
                        !authService.hasPermission(subItem.permission))
                    )
                      return null;

                    if (
                      subItem.permissions &&
                      isMounted &&
                      !subItem.permissions.some(p => authService.hasPermission(p))
                    )
                      return null;

                    const isSubActive = currentPage === subItem.id;

                    return (
                      <button
                        key={subItem.id}
                        id={isSubActive ? "active-sidebar-item" : undefined}
                        onClick={() => onNavigate(subItem.id)}
                        className={`w-full flex items-center justify-between px-4 py-1.5 rounded-xl transition-all text-xs font-semibold group ${isSubActive
                          ? "liquid-glass-sub text-primary-600 scale-[1.01]"
                          : "text-text-muted hover:text-text-primary"
                          }`}
                      >
                        <div className="flex-1 flex items-center justify-between transition-transform duration-300 group-hover:translate-x-1">
                          <div className="flex items-center gap-2">
                            {subItem.icon}
                            <span>{subItem.label}</span>
                          </div>
                          {renderBadge(subItem.id as string, true)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    // Leaf menu item
    return (
      <div key={item.id} className="mx-3 mb-1">
        <button
          id={isActive ? "active-sidebar-item" : undefined}
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${isActive
            ? "liquid-glass text-primary-600 scale-[1.02]"
            : "text-text-secondary hover:bg-hover"
            }`}
          title={isCollapsed ? item.label : ""}
        >
          <div className={`flex-1 flex items-center gap-3 transition-transform duration-300 ${!isCollapsed ? 'group-hover:translate-x-1' : ''}`}>
            <div
              className={`${isActive
                ? "text-primary-600"
                : "text-text-muted group-hover:text-text-primary"
                } transition-colors`}
            >
              {item.icon}
            </div>

            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between overflow-hidden">
                <span className="text-sm font-bold tracking-tight truncate">
                  {item.label}
                </span>
                {renderBadge(item.id as string, true)}
              </div>
            )}
          </div>

          {isCollapsed && (
            <>
              {renderBadge(item.id as string)}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => {
    if (isCollapsed) return <div className="h-4" />;
    return (
      <div className="px-6 mt-6 mb-2">
        <p className="text-[10px] font-black tracking-[0.2em] text-text-muted uppercase opacity-60">
          {title}
        </p>
      </div>
    );
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? "w-24" : "w-[280px]"}
        bg-sidebar flex flex-col border-r border-border-default
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <div
        className={`p-6 ${isCollapsed ? "px-4" : "px-6"} flex items-center ${isCollapsed ? "justify-center" : "justify-between"
          }`}
      >
        <div className="flex items-center gap-3">

          {!isCollapsed && (
            <div className="overflow-hidden flex flex-col justify-center">
              <img
                src="/bms_logo.png"
                alt="BMS Capital Solutions"
                className="h-12 md:h-16 w-auto max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-24">
        {/* Polling Status Indicator */}
        {isMounted && (
          <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">

          </div>
        )}
        {isMounted &&
          (authService.hasPermission("dashboard.view") ||
            authService.hasPermission("admin_dashboard.view") ||
            authService.hasPermission("branches.view") ||
            authService.hasPermission("centers.view") ||
            authService.hasPermission("groups.view") ||
            authService.hasPermission("customers.view") ||
            authService.hasPermission("shareholders.view")) && (
            <SectionHeader title="Overview" />
          )}

        {menuItems.map(renderMenuItem)}

        {isMounted &&
          (authService.hasPermission("loan_products.view") ||
            authService.hasPermission("investment_products.view")) && (
            <>
              <SectionHeader title="Product" />
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => toggleMenu("products")}
                    className="w-full flex items-center justify-between px-5 py-2.5 mx-3 mb-1 w-[calc(100%-1.5rem)] text-text-secondary hover:bg-hover rounded-2xl transition-all duration-400 group"
                  >
                    <div className="flex-1 flex items-center justify-between transition-transform duration-300 group-hover:translate-x-1">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                        <span className="text-sm font-bold tracking-tight">
                          Product
                        </span>
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center bg-muted-bg rounded-full group-hover:bg-card transition-colors">
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-300 ${expandedMenus.includes("products") ? "rotate-180" : ""
                            }`}
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedMenus.includes("products")
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-border-default py-1 mr-3">
                      {productMenuItems.map(renderMenuItem)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mx-3 mb-1">
                  <button
                    onClick={() => toggleMenu("products")}
                    className="w-full flex items-center justify-center aspect-square text-text-secondary hover:bg-hover rounded-2xl group relative"
                  >
                    <Package className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              )}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("loans.create") ||
            authService.hasPermission("loans.approve") ||
            authService.hasPermission("loans.view")) && (
            <>
              <SectionHeader title="Loans" />
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => toggleMenu("loans")}
                    className="w-full flex items-center justify-between px-5 py-2.5 mx-3 mb-1 w-[calc(100%-1.5rem)] text-text-secondary hover:bg-hover rounded-2xl transition-all duration-400 group hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                      <span className="text-sm font-bold tracking-tight">
                        Loans
                      </span>
                    </div>
                    <div className="w-5 h-5 flex items-center justify-center bg-muted-bg rounded-full group-hover:bg-card transition-colors">
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${expandedMenus.includes("loans") ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedMenus.includes("loans")
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-border-default py-1 mr-3">
                      {loanMenuItems.map(renderMenuItem)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mx-3 mb-1">
                  <button
                    onClick={() => toggleMenu("loans")}
                    className="w-full flex items-center justify-center aspect-square text-text-secondary hover:bg-hover rounded-2xl group relative"
                  >
                    <FileText className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              )}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("collections.view") ||
            authService.hasPermission("collections.due_list") ||
            authService.hasPermission("collections.summary") ||
            authService.hasPermission("receipts.approvecancel")) && (
            <>
              <SectionHeader title="Collections" />
              {renderMenuItem({
                id: "collections-section" as Page,
                label: "Collections",
                icon: <DollarSign className="w-5 h-5" />,
                submenu: collectionMenuItems,
              })}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("investments.view") ||
            authService.hasPermission("investments.create")) && (
            <>
              <SectionHeader title="Investments" />
              {renderMenuItem({
                id: "investments-section" as Page,
                label: "Investments",
                icon: <TrendingUp className="w-5 h-5" />,
                permission: "investments.view",
                submenu: [
                  {
                    id: "investment-create" as Page,
                    label: "Create Investment",
                    icon: <FileText className="w-4 h-4" />,
                    permission: "investments.create",
                  },
                  {
                    id: "investment-list" as Page,
                    label: "Investment List",
                    icon: <ClipboardList className="w-4 h-4" />,
                    permission: "investments.view",
                  },
                ],
              })}
            </>
          )}

        {isMounted && authService.hasPermission("reports.view") && (
          <>
            <SectionHeader title="Analytics" />
            {renderMenuItem({
              id: "reports" as Page,
              label: "Reports",
              icon: <BarChart3 className="w-5 h-5" />,
              permission: "reports.view",
            })}
          </>
        )}

        {isMounted &&
          (authService.hasPermission("finance.approve_salary") ||
            authService.hasPermission("receipts.approve")) && (
            <>
              <SectionHeader title="Approvals" />
              {renderMenuItem({
                id: "approvals-section" as Page,
                label: "Transaction Approval",
                icon: <ShieldCheck className="w-5 h-5" />,
                submenu: approvalMenuItems,
              })}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("finance.view") ||
            authService.hasPermission("finance.transactions")) && (
            <>
              <SectionHeader title="Finance" />
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => toggleMenu("finance")}
                    className="w-full flex items-center justify-between px-5 py-2.5 mx-3 mb-1 w-[calc(100%-1.5rem)] text-text-secondary hover:bg-hover rounded-2xl transition-all duration-400 group hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-text-muted group-hover:text-text-primary" />
                      <span className="text-sm font-bold tracking-tight">
                        Finance
                      </span>
                    </div>
                    <div className="w-5 h-5 flex items-center justify-center bg-muted-bg rounded-full group-hover:bg-card transition-colors">
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${expandedMenus.includes("finance") ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedMenus.includes("finance")
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-border-default py-1 mr-3">
                      {financeMenuItems.map(renderMenuItem)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mx-3 mb-1">
                  <button
                    onClick={() => toggleMenu("finance")}
                    className="w-full flex items-center justify-center aspect-square text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl group relative"
                  >
                    <Wallet className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              )}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("promotions.view") ||
            authService.hasPermission("promotions.create") ||
            authService.hasPermission("promotions.approve") ||
            authService.hasPermission("salary_increments.view") ||
            authService.hasPermission("salary_increments.create") ||
            authService.hasPermission("salary_increments.approve") ||
            authService.hasPermission("temporary_promotions.manage") ||
            authService.hasPermission("temporary_promotions.view")) && (
            <>
              <SectionHeader title="Promotion" />
              {renderMenuItem({
                id: "promotion-section" as Page,
                label: "Promotion",
                icon: <TrendingUp className="w-5 h-5" />,
                submenu: promotionMenuItems,
              })}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("staffloans.create") ||
            authService.hasPermission("staffloans.view") ||
            authService.hasPermission("staffloans.approve")) && (
            <>
              <SectionHeader title="Staff Loans" />
              {renderMenuItem({
                id: "staff-loan-section" as Page,
                label: "Staff Loan",
                icon: <DollarSign className="w-5 h-5" />,
                submenu: staffLoanMenuItems,
              })}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("loan_agreements.view") ||
            authService.hasPermission("loan_agreements.approve_reprint")) && (
            <>
              <SectionHeader title="Agreement & Forms" />
              {renderMenuItem({
                id: "agreement-section" as Page,
                label: "Agreements",
                icon: <FileText className="w-5 h-5" />,
                submenu: agreementMenuItems,
              })}
            </>
          )}

        {isMounted &&
          (authService.hasPermission("staff.view") ||
            authService.hasPermission("roles.view") ||
            authService.hasPermission("permissions.view") ||
            authService.hasPermission("complaints.view")) && (
            <SectionHeader title="Management" />
          )}

        {isMounted && authService.hasPermission("staff.directory") && (
          <div className="mx-3 mb-1">
            <button
              onClick={() => onNavigate("staff-directory" as Page)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "staff-directory"
                ? "liquid-glass text-primary-600 scale-[1.02]"
                : "text-text-secondary hover:bg-hover hover:translate-x-1"
                }`}
            >
              <div
                className={`${currentPage === "staff-directory"
                  ? "text-primary-600"
                  : "text-text-muted group-hover:text-text-primary"
                  } transition-colors`}
              >
                <Users className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">
                  Staff Directory
                </span>
              )}
            </button>
          </div>
        )}

        {isMounted &&
          (authService.hasPermission("staff.view") ||
            authService.hasPermission("attendance.view") ||
            authService.hasPermission("salary.view") ||
            authService.hasPermission("payroll.view") ||
            authService.hasPermission("leave.view")) && (
            <div className="mx-3 mb-1">
              <button
                onClick={() => onNavigate("staff-management" as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "staff-management"
                  ? "liquid-glass text-primary-600 scale-[1.02]"
                  : "text-text-secondary hover:bg-hover hover:translate-x-1"
                  }`}
              >
                <div
                  className={`${currentPage === "staff-management"
                    ? "text-primary-600"
                    : "text-text-muted group-hover:text-text-primary"
                    } transition-colors`}
                >
                  <Users className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight">
                    Staff Management
                  </span>
                )}
              </button>
            </div>
          )}

        {isMounted && authService.hasPermission("roles.view") && (
          <div className="mx-3 mb-1">
            <button
              onClick={() => onNavigate("roles-privileges" as Page)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "roles-privileges"
                ? "liquid-glass text-primary-600 scale-[1.02]"
                : "text-text-secondary hover:bg-hover hover:translate-x-1"
                }`}
            >
              <div
                className={`${currentPage === "roles-privileges"
                  ? "text-primary-600"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  } transition-colors`}
              >
                <Shield className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">Roles</span>
              )}
            </button>
          </div>
        )}

        {isMounted && authService.hasPermission("complaints.view") && (
          <div className="mx-3 mb-1">
            <button
              onClick={() => onNavigate("complaints" as Page)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "complaints"
                ? "liquid-glass text-primary-600 scale-[1.02]"
                : "text-text-secondary hover:bg-hover hover:translate-x-1"
                }`}
            >
              <div
                className={`${currentPage === "complaints"
                  ? "text-primary-600"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  } transition-colors`}
              >
                <MessageSquare className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">
                  Complaints
                </span>
              )}
            </button>
          </div>
        )}

        {isMounted && userRole === 'super_admin' && (
          <>
            <SectionHeader title="System" />
            <div className="mx-3 mb-1">
              <button
                onClick={() => onNavigate('ip-whitelisting' as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === 'ip-whitelisting' ? 'liquid-glass text-primary-600 scale-[1.02]' : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1'}`}
              >
                <div className={`${currentPage === 'ip-whitelisting' ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'} transition-colors`}>
                  <Shield className="w-5 h-5" />
                </div>
                {!isCollapsed && <span className="text-sm font-bold tracking-tight">IP Whitelisting</span>}
              </button>
            </div>

            <div className="mx-3 mb-1">
              <button
                onClick={() => onNavigate('device-management' as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === 'device-management' ? 'liquid-glass text-primary-600 scale-[1.02]' : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1'}`}
              >
                <div className={`${currentPage === 'device-management' ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-100 dark:group-hover:text-gray-100'} transition-colors`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                {!isCollapsed && <span className="text-sm font-bold tracking-tight">Device Management</span>}
              </button>
            </div>

            <SectionHeader title="Maintenance" />
            {renderMenuItem({
              id: 'maintenance-section' as Page,
              label: 'Maintenance System',
              icon: <Settings className="w-5 h-5" />,
              submenu: [
                { id: 'security-settings' as Page, label: 'Security Settings', icon: <Shield className="w-4 h-4" /> },
                { id: 'backup-system' as Page, label: 'Backup System', icon: <Download className="w-4 h-4" /> },
                { id: 'system-test' as Page, label: 'System Test', icon: <ArrowLeftRight className="w-4 h-4" /> },
                { id: 'maintenance-mode' as Page, label: 'Maintenance Mode', icon: <AlertCircle className="w-4 h-4" /> },
                { id: 'audit-logs' as Page, label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
              ],
            })}
          </>
        )}

        {isMounted && authService.hasPermission("settings.view") && (
          <>
            <div className="mx-3 mb-1">
              <button
                onClick={() => onNavigate("system-config" as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "system-config"
                  ? "liquid-glass text-primary-600 scale-[1.02]"
                  : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:translate-x-1"
                  }`}
              >
                <div
                  className={`${currentPage === "system-config"
                    ? "text-primary-600"
                    : "text-text-muted group-hover:text-text-primary"
                    } transition-colors`}
                >
                  <Settings className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight">
                    System Config
                  </span>
                )}
              </button>
            </div>
            {isMounted && authService.hasPermission('maintenance.view') && (
              <div className="mx-3 mb-1">
                <button
                  onClick={() => onNavigate('ip-whitelisting' as Page)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === 'ip-whitelisting' ? 'liquid-glass text-primary-600 scale-[1.02]' : 'text-text-secondary hover:bg-hover hover:translate-x-1'}`}
                >
                  <div className={`${currentPage === 'ip-whitelisting' ? 'text-primary-600' : 'text-text-muted group-hover:text-text-primary'} transition-colors`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  {!isCollapsed && <span className="text-sm font-bold tracking-tight">IP Whitelisting</span>}
                </button>
              </div>
            )}

            {isMounted && authService.hasPermission('maintenance.manage') && (
              <>
                <SectionHeader title="Maintenance" />
                {renderMenuItem({
                  id: 'maintenance-section' as Page,
                  label: 'Maintenance System',
                  icon: <Settings className="w-5 h-5" />,
                  submenu: [
                    { id: 'backup-system' as Page, label: 'Backup System', icon: <Download className="w-4 h-4" /> },
                    { id: 'system-test' as Page, label: 'System Test', icon: <ArrowLeftRight className="w-4 h-4" /> },
                    { id: 'maintenance-mode' as Page, label: 'Maintenance Mode', icon: <AlertCircle className="w-4 h-4" /> },
                    { id: 'audit-logs' as Page, label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
                  ],
                })}
              </>
            )}
          </>
        )}

        <div className="pt-4 mt-4 border-t border-border-divider mx-4">
          {isMounted && authService.hasPermission("documents.view") && (
            <div className="mb-1">
              <button
                onClick={() => onNavigate("documents" as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "documents"
                  ? "liquid-glass text-primary-600 scale-[1.02]"
                  : "text-text-secondary hover:bg-hover hover:translate-x-1"
                  }`}
              >
                <div
                  className={`${currentPage === "documents"
                    ? "text-primary-600"
                    : "text-text-muted group-hover:text-text-primary"
                    } transition-colors`}
                >
                  <Download className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight">
                    Documents
                  </span>
                )}
              </button>
            </div>
          )}

          {isMounted && authService.hasPermission("website.view") && (
            <div className="mb-1">
              <button
                onClick={() => onNavigate("public-website" as Page)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-400 group relative ${currentPage === "public-website"
                  ? "liquid-glass text-primary-600 scale-[1.02]"
                  : "text-text-secondary hover:bg-hover hover:translate-x-1"
                  }`}
              >
                <div
                  className={`${currentPage === "public-website"
                    ? "text-primary-600"
                    : "text-text-muted group-hover:text-text-primary"
                    } transition-colors`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight">
                    Public Website
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-border-default bg-sidebar mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group hover:bg-hover ${isCollapsed ? "justify-center" : ""
            }`}
        >
          <div className="p-1.5 rounded-lg text-text-muted group-hover:text-primary-600 transition-colors">
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : ""
                }`}
            />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-bold text-text-secondary group-hover:text-primary-600 tracking-tight">
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}