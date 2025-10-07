// 星穹铁道版本倒计时 - 现代化JavaScript功能文件

// 版本数据配置
const versionData = [
    { version: "1.0", releaseDate: "2023-04-26", endDate: "2023-06-07" },
    { version: "1.1", releaseDate: "2023-06-07", endDate: "2023-07-19" },
    { version: "1.2", releaseDate: "2023-07-19", endDate: "2023-08-30" },
    { version: "1.3", releaseDate: "2023-08-30", endDate: "2023-10-11" },
    { version: "1.4", releaseDate: "2023-10-11", endDate: "2023-11-15" },
    { version: "1.5", releaseDate: "2023-11-15", endDate: "2023-12-27" },
    { version: "1.6", releaseDate: "2023-12-27", endDate: "2024-02-07" },
    { version: "2.0", releaseDate: "2024-02-07", endDate: "2024-03-27" },
    { version: "2.1", releaseDate: "2024-03-27", endDate: "2024-05-08" },
    { version: "2.2", releaseDate: "2024-05-08", endDate: "2024-06-19" },
    { version: "2.3", releaseDate: "2024-06-19", endDate: "2024-07-31" },
    { version: "2.4", releaseDate: "2024-07-31", endDate: "2024-09-10" },
    { version: "2.5", releaseDate: "2024-09-10", endDate: "2024-10-23" },
    { version: "2.6", releaseDate: "2024-10-23", endDate: "2024-12-04" },
    { version: "2.7", releaseDate: "2024-12-04", endDate: "2025-01-15" },
    { version: "3.0", releaseDate: "2025-01-15", endDate: "2025-02-26" },
    { version: "3.1", releaseDate: "2025-02-26", endDate: "2025-04-09" },
    { version: "3.2", releaseDate: "2025-04-09", endDate: "2025-05-21" },
    { version: "3.3", releaseDate: "2025-05-21", endDate: "2025-07-02" },
    { version: "3.4", releaseDate: "2025-07-02", endDate: "2025-08-13" },
    { version: "3.5", releaseDate: "2025-08-13", endDate: "2025-09-24" },
    { version: "3.6", releaseDate: "2025-09-24", endDate: "2025-11-05" },
    { version: "3.7", releaseDate: "2025-11-05", endDate: "2025-12-17" },
    { version: "3.8", releaseDate: "2025-12-17", endDate: "2026-01-28" },
    { version: "3.9-预测", releaseDate: "2026-01-28", endDate: "2026-03-11" },
    { version: "4.0-预测", releaseDate: "2026-03-11", endDate: "2026-04-22" }
];

// 应用状态管理
let appState = {
    currentFilter: 'all',
    searchQuery: '',
    filteredVersions: [...versionData]
};

// 工具函数：计算倒计时
function calculateCountdown(endDate) {
    const targetDate = new Date(endDate).getTime();
    const currentDate = new Date().getTime();
    const diff = targetDate - currentDate;
    
    if (diff < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, expired: false };
}

// 工具函数：格式化数字为两位
function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
}

// 工具函数：获取版本状态
function getVersionStatus(version) {
    const now = new Date();
    const start = new Date(version.releaseDate);
    const end = new Date(version.endDate);
    const countdown = calculateCountdown(version.endDate);
    const isCurrent = now >= start && now <= end;
    
    if (isCurrent) {
        return { text: '当前版本', isCurrent: true, type: 'current' };
    } else if (countdown.expired) {
        return { text: '已更新', isCurrent: false, type: 'past' };
    } else {
        const daysToRelease = start > now ? Math.ceil((start - now) / (1000 * 60 * 60 * 24)) : 0;
        const text = daysToRelease > 0 ? `还有 ${daysToRelease} 天发布` : `剩余 ${countdown.days} 天`;
        return { text, isCurrent: false, type: 'upcoming' };
    }
}

// 工具函数：获取当前版本信息
function getCurrentVersionInfo() {
    const now = new Date();
    let currentVersion = null;
    let daysRemaining = 0;
    
    for (const version of versionData) {
        const start = new Date(version.releaseDate);
        const end = new Date(version.endDate);
        
        if (now >= start && now <= end) {
            currentVersion = version;
            const countdown = calculateCountdown(version.endDate);
            daysRemaining = countdown.days;
            break;
        }
    }
    
    return { currentVersion, daysRemaining };
}

// 工具函数：过滤版本数据
function filterVersions() {
    const { currentFilter, searchQuery } = appState;
    
    let filtered = versionData.filter(version => {
        // 搜索过滤
        if (searchQuery && !version.version.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        // 状态过滤
        if (currentFilter !== 'all') {
            const status = getVersionStatus(version);
            return status.type === currentFilter;
        }
        
        return true;
    });
    
    appState.filteredVersions = filtered;
    return filtered;
}

// 更新统计信息
function updateStats() {
    const { currentVersion, daysRemaining } = getCurrentVersionInfo();
    
    document.getElementById('totalVersions').textContent = versionData.length;
    document.getElementById('currentVersion').textContent = currentVersion ? `v${currentVersion.version}` : '-';
    document.getElementById('daysRemaining').textContent = daysRemaining;
}

// 渲染版本卡片
function renderVersionCard(version) {
    const countdown = calculateCountdown(version.endDate);
    const status = getVersionStatus(version);
    
    const versionCard = document.createElement('div');
    versionCard.className = `version-card ${status.isCurrent ? 'current' : ''}`;
    versionCard.dataset.version = version.version;
    versionCard.dataset.status = status.type;
    
    if (status.isCurrent) {
        versionCard.id = 'current-version';
    }
    
    versionCard.innerHTML = `
        <div class="version-header">
            <h2 class="version-name">v${version.version}</h2>
            <div class="version-status ${status.type}">${status.text}</div>
        </div>
        <div class="version-dates">
            <div class="version-date">
                <div class="date-label">开始日期</div>
                <div class="date-value">${version.releaseDate}</div>
            </div>
            <div class="version-date">
                <div class="date-label">结束日期</div>
                <div class="date-value">${version.endDate}</div>
            </div>
        </div>
        <div class="countdown-display">
            <div class="countdown-label">剩余时间</div>
            <div class="countdown-timer ${countdown.expired ? 'expired' : ''} ${!countdown.expired && !status.isCurrent ? 'upcoming' : ''}">
                ${countdown.expired ? '已结束' : `${formatNumber(countdown.days)}天 ${formatNumber(countdown.hours)}:${formatNumber(countdown.minutes)}:${formatNumber(countdown.seconds)}`}
            </div>
        </div>
    `;
    
    return versionCard;
}

// 渲染版本列表
function renderVersionList() {
    const versionGrid = document.getElementById('versionList');
    const filteredVersions = filterVersions();
    
    // 显示加载状态
    versionGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 16px;"></i>
            <div>正在加载版本数据...</div>
        </div>
    `;
    
    // 延迟渲染以显示加载效果
    setTimeout(() => {
        versionGrid.innerHTML = '';
        
        if (filteredVersions.length === 0) {
            versionGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <div style="font-size: 1.2rem; margin-bottom: 8px;">未找到匹配的版本</div>
                    <div style="font-size: 0.9rem;">请尝试调整搜索条件或筛选器</div>
                </div>
            `;
            return;
        }
        
        let currentVersionCard = null;
        
        filteredVersions.forEach(version => {
            const card = renderVersionCard(version);
            versionGrid.appendChild(card);
            
            if (version.version === getCurrentVersionInfo().currentVersion?.version) {
                currentVersionCard = card;
            }
        });
        
        // 如果有当前版本，自动滚动到该版本
        if (currentVersionCard) {
            setTimeout(() => {
                currentVersionCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center'
                });
                
                // 添加高亮动画效果
                currentVersionCard.style.animation = 'currentVersionHighlight 2s ease-in-out';
            }, 500);
        }
    }, 300);
}

// 更新倒计时显示
function updateCountdown() {
    const filteredVersions = appState.filteredVersions;
    
    filteredVersions.forEach(version => {
        const countdown = calculateCountdown(version.endDate);
        const status = getVersionStatus(version);
        
        // 更新倒计时显示
        const timerElement = document.querySelector(`.version-card[data-version="${version.version}"] .countdown-timer`);
        if (timerElement) {
            timerElement.textContent = countdown.expired ? '已结束' : `${formatNumber(countdown.days)}天 ${formatNumber(countdown.hours)}:${formatNumber(countdown.minutes)}:${formatNumber(countdown.seconds)}`;
            timerElement.className = `countdown-timer ${countdown.expired ? 'expired' : ''} ${!countdown.expired && !status.isCurrent ? 'upcoming' : ''}`;
        }
        
        // 更新状态文本
        const statusElement = document.querySelector(`.version-card[data-version="${version.version}"] .version-status`);
        if (statusElement) {
            statusElement.textContent = status.text;
            statusElement.className = `version-status ${status.type}`;
        }
        
        // 更新卡片样式
        const cardElement = document.querySelector(`.version-card[data-version="${version.version}"]`);
        if (cardElement) {
            cardElement.className = `version-card ${status.isCurrent ? 'current' : ''}`;
            cardElement.dataset.status = status.type;
        }
    });
    
    // 更新统计信息
    updateStats();
}

// 设置筛选器功能
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('versionSearch');
    
    // 筛选器按钮点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加active类到当前按钮
            button.classList.add('active');
            
            // 更新应用状态
            appState.currentFilter = button.dataset.filter;
            
            // 重新渲染列表
            renderVersionList();
        });
    });
    
    // 搜索框输入事件
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value;
        
        // 防抖处理，避免频繁渲染
        clearTimeout(searchInput.debounceTimer);
        searchInput.debounceTimer = setTimeout(() => {
            renderVersionList();
        }, 300);
    });
}

// 设置控制按钮功能
function setupControls() {
    const refreshBtn = document.getElementById('refreshBtn');
    const currentVersionBtn = document.getElementById('currentVersionBtn');
    
    // 刷新按钮
    refreshBtn.addEventListener('click', () => {
        // 添加旋转动画
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
        
        // 重新渲染列表
        renderVersionList();
        updateStats();
        
        // 显示刷新提示
        showToast('数据已刷新', 'success');
        
        // 重置旋转动画
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 500);
    });
    
    // 定位当前版本按钮
    currentVersionBtn.addEventListener('click', scrollToCurrentVersion);
}

// 设置返回顶部功能
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('visible', window.pageYOffset > 200);
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 添加键盘快捷键支持
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // ESC键返回顶部
        if (event.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // 空格键一键定位至当前版本
        if (event.key === ' ' && event.target === document.body) {
            event.preventDefault();
            scrollToCurrentVersion();
        }
        // Ctrl+F 聚焦搜索框
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            document.getElementById('versionSearch').focus();
        }
    });
}

// 一键定位至当前版本
function scrollToCurrentVersion() {
    const currentVersionCard = document.getElementById('current-version');
    if (currentVersionCard) {
        // 添加高亮动画效果
        currentVersionCard.style.animation = 'none';
        setTimeout(() => {
            currentVersionCard.style.animation = 'currentVersionHighlight 2s ease-in-out';
        }, 10);
        
        // 平滑滚动到当前版本
        currentVersionCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
        });
        
        // 显示提示信息
        showToast('已定位到当前版本', 'info');
    } else {
        showToast('未找到当前版本', 'warning');
    }
}

// 显示Toast提示
function showToast(message, type = 'info') {
    // 移除已存在的Toast
    const existingToast = document.getElementById('app-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 设置Toast样式
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: 16px 20px;
        color: var(--text-primary);
        font-size: 0.9rem;
        z-index: 10000;
        box-shadow: var(--shadow-heavy);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// 获取Toast图标
function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// 隐藏加载动画
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// 页面加载完成后的初始化
function initializePage() {
    // 显示加载动画
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // 初始化统计信息
    updateStats();
    
    // 渲染版本列表
    renderVersionList();
    
    // 设置各种功能
    setupFilters();
    setupControls();
    setupBackToTop();
    setupKeyboardShortcuts();
    
    // 启动倒计时更新
    setInterval(updateCountdown, 1000);
    
    // 隐藏加载动画
    setTimeout(hideLoading, 1000);
    
    // 添加页面加载完成动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// 错误处理
function handleErrors() {
    window.addEventListener('error', (event) => {
        console.error('页面错误:', event.error);
        showToast('页面加载出现错误', 'error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise拒绝:', event.reason);
        showToast('应用出现异常', 'error');
    });
}

// 导出函数供HTML使用
window.CountdownApp = {
    initialize: initializePage,
    updateCountdown: updateCountdown,
    renderVersionList: renderVersionList,
    scrollToCurrentVersion: scrollToCurrentVersion
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// 设置错误处理
handleErrors();