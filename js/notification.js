// 通知系统功能模块

// 通知数据（模拟）
let notifications = [
    {
        id: 1,
        type: 'system',
        title: '系统更新',
        message: 'InnoFlow 已更新至 v2.0.0，新增多项功能',
        time: '2025-01-15 10:30',
        read: false,
        link: '#'
    },
    {
        id: 2,
        type: 'plugin',
        title: '插件审核结果',
        message: '你的插件"AI 代码审查"已通过审核',
        time: '2025-01-15 09:15',
        read: false,
        link: 'developer/developer-center.html'
    },
    {
        id: 3,
        type: 'pricing',
        title: '定价协商',
        message: '管理员对你的插件"测试自动化"提出了定价建议',
        time: '2025-01-14 16:45',
        read: false,
        link: 'developer/developer-center.html'
    },
    {
        id: 4,
        type: 'security',
        title: '安全扫描完成',
        message: '已安装的插件"AI 会议助手"安全扫描完成，评分: 95分',
        time: '2025-01-14 14:20',
        read: true,
        link: 'toolstore.html'
    },
    {
        id: 5,
        type: 'rating',
        title: '收到新评价',
        message: '用户对"文档生成器"发表了5星评价',
        time: '2025-01-14 11:30',
        read: true,
        link: 'toolstore.html'
    }
];

// 通知类型配置
const notificationTypes = {
    system: { icon: '🔔', color: '#5B4FE8' },
    plugin: { icon: '🔌', color: '#00D4AA' },
    pricing: { icon: '💰', color: '#F59E0B' },
    security: { icon: '🔒', color: '#EF4444' },
    rating: { icon: '⭐', color: '#F03D8E' }
};

// 获取未读通知数量
function getUnreadCount() {
    return notifications.filter(n => !n.read).length;
}

// 标记通知为已读
function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationBadge();
    }
}

// 标记所有通知为已读
function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    updateNotificationBadge();
    if (typeof renderNotificationList !== 'undefined') {
        renderNotificationList();
    }
}

// 删除通知
function deleteNotification(notificationId) {
    notifications = notifications.filter(n => n.id !== notificationId);
    updateNotificationBadge();
    if (typeof renderNotificationList !== 'undefined') {
        renderNotificationList();
    }
}

// 添加通知
function addNotification(type, title, message, link = '#') {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }),
        read: false,
        link: link
    };

    notifications.unshift(newNotification);
    updateNotificationBadge();

    // 如果通知中心已打开，刷新列表
    if (typeof renderNotificationList !== 'undefined') {
        renderNotificationList();
    }

    // 显示桌面通知（如果浏览器支持）
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/assets/logo.svg'
        });
    }
}

// 更新通知徽章
function updateNotificationBadge() {
    const badges = document.querySelectorAll('.notification-badge');
    const unreadCount = getUnreadCount();

    badges.forEach(badge => {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    });
}

// 请求通知权限
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// 渲染通知图标（在导航栏）
function renderNotificationIcon(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const unreadCount = getUnreadCount();

    container.innerHTML = `
        <div class="notification-icon-wrapper" onclick="toggleNotificationPanel(event)" style="position: relative; cursor: pointer; padding: 8px; border-radius: 8px; transition: background 0.2s;">
            <span style="font-size: 20px;">🔔</span>
            ${unreadCount > 0 ? `
                <span class="notification-badge" style="position: absolute; top: 4px; right: 4px; background: #EF4444; color: white; border-radius: 10px; padding: 2px 6px; font-size: 11px; font-weight: 600; min-width: 18px; text-align: center;">
                    ${unreadCount > 99 ? '99+' : unreadCount}
                </span>
            ` : ''}
        </div>
    `;
}

// 切换通知面板
function toggleNotificationPanel(event) {
    event.stopPropagation();

    // 移除现有的通知面板
    const existingPanel = document.getElementById('notificationPanel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    // 创建通知面板
    const panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        width: 400px;
        max-height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    panel.innerHTML = `
        <div style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 18px; font-weight: 600; margin: 0;">通知</h3>
            <div style="display: flex; gap: 8px;">
                ${unreadNotifications.length > 0 ? `
                    <button class="btn-text" onclick="markAllAsRead()" style="font-size: 13px; padding: 4px 8px;">
                        全部已读
                    </button>
                ` : ''}
                <button class="btn-text" onclick="window.location.href='notifications.html'" style="font-size: 13px; padding: 4px 8px;">
                    查看全部
                </button>
            </div>
        </div>
        <div style="flex: 1; overflow-y: auto; max-height: 500px;">
            ${unreadNotifications.length > 0 ? `
                <div style="padding: 8px 16px; background: rgba(91, 79, 232, 0.05); font-size: 12px; font-weight: 600; color: var(--primary-color);">
                    未读 (${unreadNotifications.length})
                </div>
                ${unreadNotifications.map(n => renderNotificationItem(n)).join('')}
            ` : ''}
            ${readNotifications.length > 0 ? `
                <div style="padding: 8px 16px; background: #F5F7FA; font-size: 12px; font-weight: 600; color: var(--text-secondary);">
                    已读
                </div>
                ${readNotifications.slice(0, 5).map(n => renderNotificationItem(n, true)).join('')}
            ` : ''}
            ${notifications.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
                    <div>暂无通知</div>
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(panel);

    // 点击外部关闭
    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && !e.target.closest('.notification-icon-wrapper')) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 100);
}

// 渲染通知项
function renderNotificationItem(notification, isRead = false) {
    const typeConfig = notificationTypes[notification.type] || notificationTypes.system;

    return `
        <div class="notification-item"
             onclick="handleNotificationClick(${notification.id}, '${notification.link}')"
             style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.2s; ${!isRead ? 'background: rgba(91, 79, 232, 0.03);' : ''}"
             onmouseover="this.style.background='rgba(91, 79, 232, 0.05)'"
             onmouseout="this.style.background='${!isRead ? 'rgba(91, 79, 232, 0.03)' : 'transparent'}'">
            <div style="display: flex; gap: 12px;">
                <div style="font-size: 24px; flex-shrink: 0;">${typeConfig.icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                        <div style="font-weight: 600; font-size: 14px; ${!isRead ? 'color: var(--text-primary);' : 'color: var(--text-secondary);'}">
                            ${notification.title}
                        </div>
                        ${!isRead ? '<div style="width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; flex-shrink: 0; margin-top: 4px;"></div>' : ''}
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; line-height: 1.4;">
                        ${notification.message}
                    </div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                        ${notification.time}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 处理通知点击
function handleNotificationClick(notificationId, link) {
    markAsRead(notificationId);
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.remove();
    }
    if (link && link !== '#') {
        window.location.href = link;
    }
}

// 导出全局函数
window.toggleNotificationPanel = toggleNotificationPanel;
window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.deleteNotification = deleteNotification;
window.addNotification = addNotification;
window.handleNotificationClick = handleNotificationClick;
window.getUnreadCount = getUnreadCount;
window.updateNotificationBadge = updateNotificationBadge;
