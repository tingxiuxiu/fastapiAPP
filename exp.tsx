import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  LayoutGrid,
  List,
  Trash2,
  Edit3,
  ChevronRight,
  TrendingUp,
  History,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  FileText,
  X,
  Send,
  Check,
  Activity,
  Layers,
  ArrowUpDown,
  AlertCircle,
  BarChart3,
  CheckCircle
} from 'lucide-react';

const PRIORITY_CONFIG = {
  CRITICAL: {
    label: '紧急',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    order: 1
  },
  HIGH: {
    label: '高',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    order: 2
  },
  MEDIUM: {
    label: '中',
    bg: 'bg-sky-100 dark:bg-sky-950/60',
    text: 'text-sky-800 dark:text-sky-300',
    border: 'border-sky-300 dark:border-sky-800',
    dot: 'bg-sky-500',
    order: 3
  },
  LOW: {
    label: '低',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400',
    order: 4
  }
};

const STATUS_CONFIG = {
  NOT_STARTED: {
    label: '未开始',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
    badgeBg: 'bg-slate-500'
  },
  IN_PROGRESS: {
    label: '处理中',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-800',
    badgeBg: 'bg-blue-500'
  },
  PENDING: {
    label: '已挂起',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-800',
    badgeBg: 'bg-amber-500'
  },
  RESOLVED: {
    label: '已解决',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-800',
    badgeBg: 'bg-emerald-500'
  }
};

const INITIAL_ISSUES = [
  {
    id: 'ISSUE-1001',
    equipmentName: '3号车间注塑机-IMM-03',
    issueTitle: '液压泵主轴承异常发热及噪声过大',
    issueDescription: '巡检发现3号注塑机主液压泵温度达到85℃，伴随剧烈金属摩擦声，严重影响定压抱紧效果。',
    reporter: '刘强 (现场运维)',
    owner: '张工程 (设备专家)',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    expectedCompletion: '2026-10-12',
    reason: '轴承长期处于高压连续负荷下，润滑油脂干涸硬化导致金属直接磨损。',
    solution: '更换SKF耐高温极压轴承，清洗液压油路，补充抗磨液压油并加装冷却散热风道。',
    progress: 65,
    createdAt: '2026-10-07 09:30',
    logs: [
      {
        id: 'L-1',
        date: '2026-10-07 09:30',
        logger: '刘强',
        content: '现场巡检首次发现异常发热与噪声，已紧急停机上报并通知运维组。',
        progress: 0,
        statusChangedTo: 'NOT_STARTED'
      },
      {
        id: 'L-2',
        date: '2026-10-07 14:00',
        logger: '张工程',
        content: '拆解泵体检查完毕，确定驱动端轴承滚珠点蚀，发起紧急备件调拨单。',
        progress: 25,
        statusChangedTo: 'IN_PROGRESS'
      },
      {
        id: 'L-3',
        date: '2026-10-08 11:20',
        logger: '张工程',
        content: '耐高温轴承备件已送达客户现场，完成泵体清洗及旧轴承拆卸，正在组装新部件。',
        progress: 65,
        statusChangedTo: 'IN_PROGRESS'
      }
    ]
  },
  {
    id: 'ISSUE-1002',
    equipmentName: '自动装配线西门子S7-1500 PLC',
    issueTitle: 'PROFINET从站经常性偶发掉线报警',
    issueDescription: '装配线B区IO站每天随机掉线1-2次，导致全线报E-804通讯错误并停机。',
    reporter: '王伟 (生产主管)',
    owner: '李工程师 (自动化)',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    expectedCompletion: '2026-10-15',
    reason: '屏蔽网接地不良，周围变频器启动瞬间产生高频电磁干扰导致网络丢包。',
    solution: '重新制作带双屏蔽层的RJ45水晶头，网线穿金属管屏蔽，并单独将PLC地线接入独立接地极。',
    progress: 40,
    createdAt: '2026-10-08 08:15',
    logs: [
      {
        id: 'L-4',
        date: '2026-10-08 08:15',
        logger: '王伟',
        content: '交接班记录显示过去24小时内发生3次无规律停机，请求自动化工程师排查。',
        progress: 0,
        statusChangedTo: 'NOT_STARTED'
      },
      {
        id: 'L-5',
        date: '2026-10-08 16:45',
        logger: '李工程师',
        content: '使用网络分析仪抓包观察到变频器启动时丢包率骤增至12%，初步判定为干扰导致。',
        progress: 40,
        statusChangedTo: 'IN_PROGRESS'
      }
    ]
  },
  {
    id: 'ISSUE-1003',
    equipmentName: '200T数控冲压机-ST-200',
    issueTitle: '2号轴伺服驱动器报E-204过载错误',
    issueDescription: '高速冲压冲程过程中，Z轴伺服驱动器弹出过载报警，机械臂无法复位。',
    reporter: '陈晨 (操作员)',
    owner: '王技术员 (电气)',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    expectedCompletion: '2026-10-09',
    reason: '导轨缺油摩擦阻力增大，且伺服参数中电子齿轮比设置偏保守。',
    solution: '清洗滑轨并重新注油，调整伺服增益参数并增加自动润滑加注频次。',
    progress: 100,
    createdAt: '2026-10-06 10:00',
    logs: [
      {
        id: 'L-6',
        date: '2026-10-06 10:00',
        logger: '陈晨',
        content: '操作面板提示E-204，整机急停无法复位。',
        progress: 0,
        statusChangedTo: 'NOT_STARTED'
      },
      {
        id: 'L-7',
        date: '2026-10-06 15:30',
        logger: '王技术员',
        content: '重新调整驱动器PID增益及扭矩限制参数，完成机械导轨润滑油疏通。',
        progress: 80,
        statusChangedTo: 'IN_PROGRESS'
      },
      {
        id: 'L-8',
        date: '2026-10-07 11:00',
        logger: '王技术员',
        content: '连续试运行2000次无任何报警，各项指标正常，交付现场试生产。',
        progress: 100,
        statusChangedTo: 'RESOLVED'
      }
    ]
  },
  {
    id: 'ISSUE-1004',
    equipmentName: '包装输送线-02 (光电电容传感器)',
    issueTitle: '光电传感器受现场粉尘污染导致误误停',
    issueDescription: '纸箱感应光电开关镜面容易积灰，导致无物料时误触发信号。',
    reporter: '赵小龙 (品质保全)',
    owner: '孙师傅 (现场维保)',
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    expectedCompletion: '2026-10-18',
    reason: '传感器原选型缺少防尘罩，且镜头敏感度未根据现场环境做微调。',
    solution: '加装气吹防尘罩，并将对射式光电开关更换为抗粉尘激光红外传感器。',
    progress: 0,
    createdAt: '2026-10-09 09:00',
    logs: [
      {
        id: 'L-9',
        date: '2026-10-09 09:00',
        logger: '赵小龙',
        content: '已创建维保工单，等待备件到位后开始安装。',
        progress: 0,
        statusChangedTo: 'NOT_STARTED'
      }
    ]
  },
  {
    id: 'ISSUE-1005',
    equipmentName: '动力站1号冷却塔循环泵',
    issueTitle: '水泵机械密封处微量渗漏冷却水',
    issueDescription: '水泵运转时底部托盘有持续滴水现象，约每分钟15滴。',
    reporter: '钱明 (巡检员)',
    owner: '张工程 (设备专家)',
    priority: 'LOW',
    status: 'PENDING',
    expectedCompletion: '2026-10-25',
    reason: '密封动静环微小磨损，由于不影响当前主线生产，等待计划性月度检修时统一处理。',
    solution: '在月度停产检修日更换水泵机械密封圈及氟橡胶垫片。',
    progress: 15,
    createdAt: '2026-10-05 16:00',
    logs: [
      {
        id: 'L-10',
        date: '2026-10-05 16:00',
        logger: '钱明',
        content: '发现微渗，暂时放置接水盘，记录监控中。',
        progress: 15,
        statusChangedTo: 'PENDING'
      }
    ]
  }
];

const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_STARTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.badgeBg}`} />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ value, className = '' }) => {
  let barColor = 'bg-slate-400';
  if (value >= 100) barColor = 'bg-emerald-500';
  else if (value >= 60) barColor = 'bg-blue-500';
  else if (value >= 30) barColor = 'bg-amber-500';
  else if (value > 0) barColor = 'bg-rose-400';

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex items-center ${className}`}>
      <div
        className={`h-full ${barColor} transition-all duration-300 rounded-full`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default function App() {
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('SITE_EQUIPMENT_ISSUES');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    }
    return INITIAL_ISSUES;
  });

  const [currentView, setCurrentView] = useState('table'); // 'table' | 'kanban' | 'dashboard'
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  // Modal / Drawer States
  const [selectedIssue, setSelectedIssue] = useState(null); // Detail & Timeline Drawer
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [quickLogIssue, setQuickLogIssue] = useState(null);

  // Quick Log Form State
  const [logForm, setLogForm] = useState({
    logger: '',
    content: '',
    progress: 50,
    status: 'IN_PROGRESS'
  });

  // Issue Form State for Add / Edit
  const [issueForm, setIssueForm] = useState({
    equipmentName: '',
    issueTitle: '',
    issueDescription: '',
    reporter: '',
    owner: '',
    priority: 'MEDIUM',
    status: 'NOT_STARTED',
    expectedCompletion: new Date().toISOString().split('T')[0],
    reason: '',
    solution: '',
    progress: 0
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('SITE_EQUIPMENT_ISSUES', JSON.stringify(issues));
  }, [issues]);

  // Sync Log Form when Quick Log modal opens
  useEffect(() => {
    if (quickLogIssue) {
      setLogForm({
        logger: quickLogIssue.owner ? quickLogIssue.owner.split(' ')[0] : '现场人员',
        content: '',
        progress: quickLogIssue.progress || 0,
        status: quickLogIssue.status || 'IN_PROGRESS'
      });
    }
  }, [quickLogIssue]);

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('确定恢复初始化示例数据吗？当前所做的改动将被覆盖。')) {
      setIssues(INITIAL_ISSUES);
      localStorage.setItem('SITE_EQUIPMENT_ISSUES', JSON.stringify(INITIAL_ISSUES));
    }
  };

  const assigneesList = useMemo(() => {
    const set = new Set();
    issues.forEach(i => {
      if (i.owner) set.add(i.owner);
    });
    return Array.from(set);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchSearch =
        issue.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPriority = priorityFilter === 'ALL' || issue.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || issue.status === statusFilter;
      const matchAssignee = assigneeFilter === 'ALL' || issue.owner === assigneeFilter;

      return matchSearch && matchPriority && matchStatus && matchAssignee;
    });
  }, [issues, searchTerm, priorityFilter, statusFilter, assigneeFilter]);

  // Dashboard Stats
  const stats = useMemo(() => {
    const total = issues.length;
    const inProgress = issues.filter(i => i.status === 'IN_PROGRESS').length;
    const resolved = issues.filter(i => i.status === 'RESOLVED').length;
    const criticalOrHigh = issues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = issues.filter(i => i.status !== 'RESOLVED' && i.expectedCompletion && i.expectedCompletion < todayStr).length;

    const totalProgress = issues.reduce((acc, curr) => acc + (curr.progress || 0), 0);
    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return { total, inProgress, resolved, criticalOrHigh, overdue, avgProgress };
  }, [issues]);

  const handleOpenAdd = () => {
    setEditingIssue(null);
    setIssueForm({
      equipmentName: '',
      issueTitle: '',
      issueDescription: '',
      reporter: '',
      owner: '',
      priority: 'MEDIUM',
      status: 'NOT_STARTED',
      expectedCompletion: new Date().toISOString().split('T')[0],
      reason: '',
      solution: '',
      progress: 0
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (issue) => {
    setEditingIssue(issue);
    setIssueForm({
      equipmentName: issue.equipmentName || '',
      issueTitle: issue.issueTitle || '',
      issueDescription: issue.issueDescription || '',
      reporter: issue.reporter || '',
      owner: issue.owner || '',
      priority: issue.priority || 'MEDIUM',
      status: issue.status || 'NOT_STARTED',
      expectedCompletion: issue.expectedCompletion || '',
      reason: issue.reason || '',
      solution: issue.solution || '',
      progress: issue.progress || 0
    });
    setIsAddEditOpen(true);
  };

  const handleDeleteIssue = (id) => {
    if (window.confirm('确定要删除该设备问题记录吗？')) {
      setIssues(prev => prev.filter(item => item.id !== id));
      if (selectedIssue && selectedIssue.id === id) {
        setSelectedIssue(null);
      }
    }
  };

  const handleSaveIssue = (e) => {
    e.preventDefault();
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

    if (editingIssue) {
      // Update
      const updated = issues.map(item => {
        if (item.id === editingIssue.id) {
          return {
            ...item,
            ...issueForm,
            progress: Number(issueForm.progress)
          };
        }
        return item;
      });
      setIssues(updated);
      if (selectedIssue && selectedIssue.id === editingIssue.id) {
        setSelectedIssue({ ...selectedIssue, ...issueForm, progress: Number(issueForm.progress) });
      }
    } else {
      // Create new
      const newId = `ISSUE-${1000 + issues.length + 1}`;
      const newIssueItem = {
        id: newId,
        ...issueForm,
        progress: Number(issueForm.progress),
        createdAt: nowStr,
        logs: [
          {
            id: `L-${Date.now()}`,
            date: nowStr,
            logger: issueForm.reporter || '系统登记',
            content: `初始化设备问题记录: ${issueForm.issueTitle}`,
            progress: Number(issueForm.progress),
            statusChangedTo: issueForm.status
          }
        ]
      };
      setIssues([newIssueItem, ...issues]);
    }
    setIsAddEditOpen(false);
  };

  // Add Daily Progress Log
  const handleAddLogSubmit = (e) => {
    e.preventDefault();
    if (!quickLogIssue) return;

    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const newLogItem = {
      id: `L-${Date.now()}`,
      date: nowStr,
      logger: logForm.logger || '现场工程师',
      content: logForm.content || '无具体描述',
      progress: Number(logForm.progress),
      statusChangedTo: logForm.status
    };

    const updatedIssues = issues.map(item => {
      if (item.id === quickLogIssue.id) {
        return {
          ...item,
          progress: Number(logForm.progress),
          status: logForm.status,
          logs: [newLogItem, ...(item.logs || [])]
        };
      }
      return item;
    });

    setIssues(updatedIssues);

    // If active in drawer, update selectedIssue
    if (selectedIssue && selectedIssue.id === quickLogIssue.id) {
      setSelectedIssue(prev => ({
        ...prev,
        progress: Number(logForm.progress),
        status: logForm.status,
        logs: [newLogItem, ...(prev.logs || [])]
      }));
    }

    setQuickLogIssue(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and App Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  客户现场设备问题跟踪管理系统
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  On-Site Equipment Issue & Daily Progress Tracker
                </p>
              </div>
            </div>

            {/* Navigation View Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                概览看板
              </button>
              <button
                onClick={() => setCurrentView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                列表视图
              </button>
              <button
                onClick={() => setCurrentView('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentView === 'kanban'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                看板视图
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetData}
                title="恢复初始数据"
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                登记新问题
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {}
        {/* KPI Metric Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">问题总数</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
              <span className="text-[10px] text-slate-400">项记录</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
              <span className="text-xs font-medium">处理中</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</span>
              <span className="text-[10px] text-blue-400">现场排查中</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
              <span className="text-xs font-medium">高优/紧急</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.criticalOrHigh}</span>
              <span className="text-[10px] text-rose-400">需要优先支持</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-medium">已逾期未结</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.overdue}</span>
              <span className="text-[10px] text-amber-500">超预期日期</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-medium">已解决</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</span>
              <span className="text-[10px] text-emerald-500">完成闭环</span>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
              <span className="text-xs font-medium">总体平均进度</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.avgProgress}%</span>
              </div>
              <ProgressBar value={stats.avgProgress} />
            </div>
          </div>
        </div>

        {}
        {/* Search & Filter Toolbar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索设备名称、编号、问题摘要或关键字..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              
              {/* Priority Select */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">全部优先级</option>
                <option value="CRITICAL">紧急</option>
                <option value="HIGH">高优先级</option>
                <option value="MEDIUM">中优先级</option>
                <option value="LOW">低优先级</option>
              </select>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">全部状态</option>
                <option value="NOT_STARTED">未开始</option>
                <option value="IN_PROGRESS">处理中</option>
                <option value="PENDING">已挂起</option>
                <option value="RESOLVED">已解决</option>
              </select>

              {/* Assignee Select */}
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">全部责任人</option>
                {assigneesList.map((person, idx) => (
                  <option key={idx} value={person}>{person}</option>
                ))}
              </select>

              {/* Clear Filters button */}
              {(priorityFilter !== 'ALL' || statusFilter !== 'ALL' || assigneeFilter !== 'ALL' || searchTerm) && (
                <button
                  onClick={() => {
                    setPriorityFilter('ALL');
                    setStatusFilter('ALL');
                    setAssigneeFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> 重置筛选
                </button>
              )}
            </div>

          </div>
        </div>

        {}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Urgent Items High Alert Card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  紧急与高优先级关注列表 ({issues.filter(i => (i.priority==='CRITICAL'||i.priority==='HIGH') && i.status!=='RESOLVED').length})
                </h3>
                <button 
                  onClick={() => setCurrentView('table')}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  查看更多 <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {issues
                  .filter(i => (i.priority === 'CRITICAL' || i.priority === 'HIGH') && i.status !== 'RESOLVED')
                  .slice(0, 4)
                  .map(issue => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className="p-3.5 bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={issue.priority} />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{issue.equipmentName}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">{issue.issueTitle}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1"><User className="w-3 h-3"/> {issue.owner}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> 期望目标: {issue.expectedCompletion}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <StatusBadge status={issue.status} />
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{issue.progress}%</div>
                      </div>
                    </div>
                  ))}

                {issues.filter(i => (i.priority==='CRITICAL'||i.priority==='HIGH') && i.status!=='RESOLVED').length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400">
                    目前没有未闭环的高危紧急问题 🎉
                  </div>
                )}
              </div>
            </div>

            {/* Status Breakdown Side Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                状态分布比例
              </h3>

              <div className="space-y-3">
                {Object.keys(STATUS_CONFIG).map(statusKey => {
                  const count = issues.filter(i => i.status === statusKey).length;
                  const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
                  const cfg = STATUS_CONFIG[statusKey];

                  return (
                    <div key={statusKey} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${cfg.badgeBg}`} />
                          {cfg.label}
                        </span>
                        <span className="text-slate-500">{count} 项 ({pct}%)</span>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>最近更新日志频次</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {issues.reduce((a, b) => a + (b.logs ? b.logs.length : 0), 0)} 次
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>现场支持责任人</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{assigneesList.length} 人</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {}
        {currentView === 'table' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">设备编号 / 名称</th>
                    <th className="py-3 px-4">问题摘要</th>
                    <th className="py-3 px-4">优先级</th>
                    <th className="py-3 px-4">当前状态</th>
                    <th className="py-3 px-4">责任人 / 报告人</th>
                    <th className="py-3 px-4">解决进度</th>
                    <th className="py-3 px-4">预期完成时间</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                  {filteredIssues.map((issue) => {
                    const isOverdue = issue.status !== 'RESOLVED' && issue.expectedCompletion && issue.expectedCompletion < new Date().toISOString().split('T')[0];

                    return (
                      <tr
                        key={issue.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition group"
                      >
                        {/* Equipment Name & ID */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          <div className="flex flex-col">
                            <span>{issue.equipmentName}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">{issue.id}</span>
                          </div>
                        </td>

                        {/* Issue Title & description popup */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="text-left font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                          >
                            {issue.issueTitle}
                          </button>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{issue.issueDescription}</p>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PriorityBadge priority={issue.priority} />
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={issue.status} />
                        </td>

                        {/* Owner & Reporter */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-500" /> {issue.owner || '未指派'}
                            </span>
                            <span className="text-[10px] text-slate-400">报: {issue.reporter}</span>
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-4 min-w-[120px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                              <span>{issue.progress}%</span>
                              <span>{issue.logs ? issue.logs.length : 0} 条日志</span>
                            </div>
                            <ProgressBar value={issue.progress} />
                          </div>
                        </td>

                        {/* Expected Completion Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className={`flex items-center gap-1 ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{issue.expectedCompletion}</span>
                            {isOverdue && <span className="text-[10px] bg-rose-100 text-rose-700 px-1 rounded">逾期</span>}
                          </div>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            
                            {/* Fast Add Daily Progress Log */}
                            <button
                              onClick={() => setQuickLogIssue(issue)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition"
                              title="追加每日进度日志"
                            >
                              <History className="w-4 h-4" />
                            </button>

                            {/* View Details Drawer */}
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                              title="查看详情与时间轴"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(issue)}
                              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                              title="编辑问题"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredIssues.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 text-xs">
                        未匹配到符合条件的问题记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {}
        {currentView === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(STATUS_CONFIG).map((statusKey) => {
              const columnIssues = filteredIssues.filter(i => i.status === statusKey);
              const cfg = STATUS_CONFIG[statusKey];

              return (
                <div key={statusKey} className="bg-slate-100/70 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 flex flex-col h-full min-h-[500px]">
                  
                  {/* Kanban Header */}
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.badgeBg}`} />
                      <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">{cfg.label}</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                      {columnIssues.length}
                    </span>
                  </div>

                  {/* Kanban Cards */}
                  <div className="flex-1 space-y-3 pt-3 overflow-y-auto">
                    {columnIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{issue.id}</span>
                          <PriorityBadge priority={issue.priority} />
                        </div>

                        <div>
                          <h4 
                            onClick={() => setSelectedIssue(issue)}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2"
                          >
                            {issue.issueTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{issue.equipmentName}</p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>完成进度</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{issue.progress}%</span>
                          </div>
                          <ProgressBar value={issue.progress} />
                        </div>

                        {/* Footer metadata & buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-indigo-500" /> {issue.owner || '无'}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setQuickLogIssue(issue)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-indigo-600"
                              title="记每日进度"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                              title="详情"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}

                    {columnIssues.length === 0 && (
                      <div className="text-center py-10 text-[11px] text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
                        暂无此状态的问题
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {}
      {/* Detail & Daily Log Timeline Modal Drawer */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-semibold">
                    {selectedIssue.id}
                  </span>
                  <PriorityBadge priority={selectedIssue.priority} />
                  <StatusBadge status={selectedIssue.status} />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedIssue.issueTitle}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  设备: {selectedIssue.equipmentName}
                </p>
              </div>

              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Field Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">责任人</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-indigo-500" /> {selectedIssue.owner || '未分配'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">报告人</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">{selectedIssue.reporter}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">预期完成时间</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">{selectedIssue.expectedCompletion}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">登记时间</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">{selectedIssue.createdAt}</span>
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="space-y-1.5 bg-indigo-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>现场当前完成总进度</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{selectedIssue.progress}%</span>
                </div>
                <ProgressBar value={selectedIssue.progress} />
              </div>

              {/* Description, Root Cause & Solution */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> 问题现象描述
                  </h4>
                  <p className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedIssue.issueDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> 原因分析 (Root Cause)
                    </h4>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed min-h-[80px]">
                      {selectedIssue.reason || '暂未录入原因分析'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-500" /> 解决方案 (Solution)
                    </h4>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed min-h-[80px]">
                      {selectedIssue.solution || '暂未录入解决方案'}
                    </p>
                  </div>
                </div>
              </div>

              {}
              {/* Daily Progress Timeline */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    每日解决进度时间轴 ({selectedIssue.logs ? selectedIssue.logs.length : 0})
                  </h3>

                  <button
                    onClick={() => setQuickLogIssue(selectedIssue)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> 追加今日进展
                  </button>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {selectedIssue.logs && selectedIssue.logs.map((log) => (
                    <div key={log.id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 ring-2 ring-indigo-100 dark:ring-indigo-900/50" />
                      
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" /> {log.logger}
                          </span>
                          <span className="text-[11px] text-slate-400">{log.date}</span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {log.content}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span>更新进度至: <strong className="text-indigo-600 dark:text-indigo-400">{log.progress}%</strong></span>
                          {log.statusChangedTo && (
                            <span className="flex items-center gap-1">
                              状态调整: <StatusBadge status={log.statusChangedTo} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!selectedIssue.logs || selectedIssue.logs.length === 0) && (
                    <p className="text-xs text-slate-400 italic">暂无历史解决进度更新日志。</p>
                  )}
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(selectedIssue)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> 编辑此记录
              </button>

              <button
                onClick={() => setSelectedIssue(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-medium transition"
              >
                关闭抽屉
              </button>
            </div>

          </div>
        </div>
      )}

      {}
      {/* Quick Add Daily Progress Modal */}
      {quickLogIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
                <History className="w-4 h-4 text-indigo-600" />
                追加每日解决进度日志
              </h3>
              <button
                onClick={() => setQuickLogIssue(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              对应设备: <strong className="text-slate-700 dark:text-slate-200">{quickLogIssue.equipmentName}</strong>
            </p>

            <form onSubmit={handleAddLogSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">记录/填写人</label>
                <input
                  type="text"
                  required
                  value={logForm.logger}
                  onChange={(e) => setLogForm({ ...logForm, logger: e.target.value })}
                  placeholder="例如：张工 / 现场工程组"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">今日进展及解决动作说明</label>
                <textarea
                  rows={3}
                  required
                  value={logForm.content}
                  onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
                  placeholder="描述今天完成的具体排查、调拨备件、更换拆卸或测试结果..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">调整完成进度 (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={logForm.progress}
                      onChange={(e) => setLogForm({ ...logForm, progress: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">同步变更当前状态</label>
                  <select
                    value={logForm.status}
                    onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="NOT_STARTED">未开始</option>
                    <option value="IN_PROGRESS">处理中</option>
                    <option value="PENDING">已挂起</option>
                    <option value="RESOLVED">已解决</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickLogIssue(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition"
                >
                  保存日志
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {}
      {/* Add / Edit Issue Modal Form */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                {editingIssue ? '编辑设备问题详情' : '登记客户现场设备新问题'}
              </h3>
              <button onClick={() => setIsAddEditOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIssue} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">设备名称 / 规格编号 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：3号车间注塑机-IMM-03"
                    value={issueForm.equipmentName}
                    onChange={(e) => setIssueForm({ ...issueForm, equipmentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">问题简要标题 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：液压泵轴承异常发热及发响"
                    value={issueForm.issueTitle}
                    onChange={(e) => setIssueForm({ ...issueForm, issueTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">详细问题现象描述</label>
                <textarea
                  rows={3}
                  placeholder="详细记录现场故障表现、报警代码及对生产的影响..."
                  value={issueForm.issueDescription}
                  onChange={(e) => setIssueForm({ ...issueForm, issueDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">报告人</label>
                  <input
                    type="text"
                    placeholder="例如：刘强"
                    value={issueForm.reporter}
                    onChange={(e) => setIssueForm({ ...issueForm, reporter: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">现场责任人/专家</label>
                  <input
                    type="text"
                    placeholder="例如：张工程"
                    value={issueForm.owner}
                    onChange={(e) => setIssueForm({ ...issueForm, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">优先级</label>
                  <select
                    value={issueForm.priority}
                    onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="CRITICAL">紧急</option>
                    <option value="HIGH">高</option>
                    <option value="MEDIUM">中</option>
                    <option value="LOW">低</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">预期完成时间</label>
                  <input
                    type="date"
                    value={issueForm.expectedCompletion}
                    onChange={(e) => setIssueForm({ ...issueForm, expectedCompletion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">根本原因分析 (Root Cause)</label>
                  <textarea
                    rows={2}
                    placeholder="排查确定的根本诱因..."
                    value={issueForm.reason}
                    onChange={(e) => setIssueForm({ ...issueForm, reason: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">解决方案 (Solution)</label>
                  <textarea
                    rows={2}
                    placeholder="拟定或已实施的纠正措施..."
                    value={issueForm.solution}
                    onChange={(e) => setIssueForm({ ...issueForm, solution: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">当前状态</label>
                  <select
                    value={issueForm.status}
                    onChange={(e) => setIssueForm({ ...issueForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="NOT_STARTED">未开始</option>
                    <option value="IN_PROGRESS">处理中</option>
                    <option value="PENDING">已挂起</option>
                    <option value="RESOLVED">已解决</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">当前解决进度 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={issueForm.progress}
                    onChange={(e) => setIssueForm({ ...issueForm, progress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition"
                >
                  {editingIssue ? '更新保存' : '提交登记'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <footer className="py-4 border-t border-slate-200/60 dark:border-slate-800 text-center text-[11px] text-slate-400">
        客户现场设备问题跟踪管理系统 &copy; 2026 On-Site Support Management System. All rights reserved.
      </footer>
    </div>
  );
}
