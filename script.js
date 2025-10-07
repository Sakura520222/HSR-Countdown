// 星穹铁道版本倒计时 - JavaScript功能文件

// 版本数据配置 <mcreference link="https://www.bilibili.com/opus/1003434914483273776?bsource=toutiao_bilibilih5" index="1">1</mcreference> <mcreference link="https://www.bilibili.com/opus/1014032797836247040?bsource=toutiao_bilibilih5" index="4">4</mcreference>
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

// 工具函数：获取版本状态文本
function getVersionStatus(version) {
    const now = new Date();
    const start = new Date(version.releaseDate);
    const end = new Date(version.endDate);
    const countdown = calculateCountdown(version.endDate);
    const isCurrent = now >= start && now <= end;
    
    if (isCurrent) {
        return { text: '当前版本', isCurrent: true };
    } else if (countdown.expired) {
        return { text: '已更新', isCurrent: false };
    } else {
        const daysToRelease = start > now ? Math.ceil((start - now) / (1000 * 60 * 60 * 24)) : 0;
        const text = daysToRelease > 0 ? `还有 ${daysToRelease} 天发布` : `剩余 ${countdown.days} 天`;
        return { text, isCurrent: false };
    }
}

// 渲染版本倒计时卡片
function renderVersionCountdown() {
    const versionList = document.getElementById('versionList');
    
    // 显示加载状态
    versionList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            正在加载版本数据...
        </div>
    `;
    
    // 延迟渲染以显示加载动画
    setTimeout(() => {
        versionList.innerHTML = '';
        
        let currentVersionCard = null;
        
        versionData.forEach(version => {
            const countdown = calculateCountdown(version.endDate);
            const status = getVersionStatus(version);
            const now = new Date();
            const start = new Date(version.releaseDate);
            const end = new Date(version.endDate);
            const isCurrent = now >= start && now <= end;
            
            const versionCard = document.createElement('div');
            versionCard.className = `version-card ${status.isCurrent ? 'current' : ''}`;
            versionCard.dataset.version = version.version;
            
            // 如果是当前版本，添加特殊标识
            if (status.isCurrent) {
                versionCard.id = 'current-version';
                currentVersionCard = versionCard;
            }
            
            versionCard.innerHTML = `
                <div class="version-header">
                    <h2 class="version-name">v${version.version}</h2>
                    <div class="version-status ${status.isCurrent ? 'current' : ''}">${status.text}</div>
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
            
            versionList.appendChild(versionCard);
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
            }, 1000);
        }
    }, 800); // 延迟800ms显示加载效果
}

// 更新倒计时显示
function updateCountdown() {
    versionData.forEach(version => {
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
            statusElement.className = `version-status ${status.isCurrent ? 'current' : ''}`;
        }
        
        // 更新卡片样式
        const cardElement = document.querySelector(`.version-card[data-version="${version.version}"]`);
        if (cardElement) {
            cardElement.className = `version-card ${status.isCurrent ? 'current' : ''}`;
        }
    });
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
        showScrollHint('已定位到当前版本');
    } else {
        showScrollHint('未找到当前版本');
    }
}

// 显示滚动提示
function showScrollHint(message) {
    // 移除已存在的提示
    const existingHint = document.getElementById('scroll-hint');
    if (existingHint) {
        existingHint.remove();
    }
    
    // 创建新的提示元素
    const hint = document.createElement('div');
    hint.id = 'scroll-hint';
    hint.textContent = message;
    hint.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(hint);
    
    // 显示动画
    setTimeout(() => {
        hint.style.opacity = '1';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 300);
    }, 2000);
}

// 页面加载完成后的初始化
function initializePage() {
    renderVersionCountdown();
    setupBackToTop();
    setupKeyboardShortcuts();
    
    // 启动倒计时更新
    setInterval(updateCountdown, 1000);
    
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
        // 可以在这里添加错误报告或用户提示
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise拒绝:', event.reason);
    });
}

// 导出函数供HTML使用
window.CountdownApp = {
    initialize: initializePage,
    updateCountdown: updateCountdown,
    renderVersionCountdown: renderVersionCountdown
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// 设置错误处理
handleErrors();