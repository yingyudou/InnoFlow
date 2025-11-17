// 开发者中心功能

// 开发者数据（模拟）
let developerData = {
    plugins: [
        {
            id: 'my-plugin-1',
            name: 'AI代码审查',
            version: 'v1.0.5',
            status: 'approved', // pending, approved, rejected
            price: 99,
            uploadTime: '2025-10-15',
            publishTime: '2025-10-18',
            downloads: 567,
            sales: 45,
            earnings: 3118.5, // 45 * 99 * 0.7
            rating: 4.6,
            description: '自动审查代码质量，发现潜在问题和优化建议'
        },
        {
            id: 'my-plugin-2',
            name: '性能监控工具',
            version: 'v1.8.3',
            status: 'pending',
            price: 79,
            uploadTime: '2025-11-01',
            publishTime: null,
            downloads: 0,
            sales: 0,
            earnings: 0,
            rating: 0,
            description: '实时监控项目性能指标，生成分析报告'
        },
        {
            id: 'my-plugin-3',
            name: 'API测试助手',
            version: 'v1.5.0',
            status: 'approved',
            price: 129,
            uploadTime: '2025-09-20',
            publishTime: '2025-09-25',
            downloads: 456,
            sales: 32,
            earnings: 2889.6, // 32 * 129 * 0.7
            rating: 4.6,
            description: '可视化API测试，自动生成测试报告'
        }
    ],
    earnings: [
        {
            id: 'earn-1',
            pluginName: 'AI代码审查',
            amount: 69.3, // 1 * 99 * 0.7
            platformFee: 29.7, // 1 * 99 * 0.3
            sales: 1,
            date: '2025-11-01 14:30',
            status: 'settled' // pending, settled
        },
        {
            id: 'earn-2',
            pluginName: 'API测试助手',
            amount: 90.3, // 1 * 129 * 0.7
            platformFee: 38.7, // 1 * 129 * 0.3
            sales: 1,
            date: '2025-11-01 10:15',
            status: 'settled'
        },
        {
            id: 'earn-3',
            pluginName: 'AI代码审查',
            amount: 138.6, // 2 * 99 * 0.7
            platformFee: 59.4, // 2 * 99 * 0.3
            sales: 2,
            date: '2025-10-30 16:45',
            status: 'settled'
        },
        {
            id: 'earn-4',
            pluginName: 'API测试助手',
            amount: 129.0, // 1 * 129 * 0.7 (待结算)
            platformFee: 55.3, // 1 * 129 * 0.3
            sales: 1,
            date: '2025-11-02 09:20',
            status: 'pending'
        }
    ],
    statistics: {
        totalPlugins: 0,
        publishedPlugins: 0,
        totalEarnings: 0,
        totalDownloads: 0,
        monthEarnings: 0,
        availableBalance: 0,
        totalSales: 0
    }
};

// 初始化开发者中心
function initDeveloperCenter() {
    updateDeveloperStats();
    renderPluginsList();
    renderEarningsList();
    updateProfileStats();
}

// 更新开发者统计数据
function updateDeveloperStats() {
    const plugins = developerData.plugins;
    const earnings = developerData.earnings;

    // 计算统计数据
    developerData.statistics.totalPlugins = plugins.length;
    developerData.statistics.publishedPlugins = plugins.filter(p => p.status === 'approved').length;
    developerData.statistics.totalEarnings = plugins.reduce((sum, p) => sum + p.earnings, 0);
    developerData.statistics.totalDownloads = plugins.reduce((sum, p) => sum + p.downloads, 0);
    developerData.statistics.totalSales = plugins.reduce((sum, p) => sum + p.sales, 0);

    // 本月收益（已结算）
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    developerData.statistics.monthEarnings = earnings
        .filter(e => {
            const earnDate = new Date(e.date);
            return earnDate.getMonth() === currentMonth &&
                   earnDate.getFullYear() === currentYear &&
                   e.status === 'settled';
        })
        .reduce((sum, e) => sum + e.amount, 0);

    // 可提现余额（已结算的收益）
    developerData.statistics.availableBalance = earnings
        .filter(e => e.status === 'settled')
        .reduce((sum, e) => sum + e.amount, 0);

    // 更新页面显示
    document.getElementById('totalPlugins').textContent = developerData.statistics.totalPlugins;
    document.getElementById('publishedPlugins').textContent = developerData.statistics.publishedPlugins;
    document.getElementById('totalEarnings').textContent = `¥${developerData.statistics.totalEarnings.toFixed(2)}`;
    document.getElementById('totalDownloads').textContent = developerData.statistics.totalDownloads;

    document.getElementById('monthEarnings').textContent = `¥${developerData.statistics.monthEarnings.toFixed(2)}`;
    document.getElementById('availableBalance').textContent = `¥${developerData.statistics.availableBalance.toFixed(2)}`;
    document.getElementById('totalSales').textContent = developerData.statistics.totalSales;
}

// 渲染插件列表
function renderPluginsList() {
    const list = document.getElementById('pluginsList');
    if (!list) return;

    const plugins = developerData.plugins;

    if (plugins.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
                <h3 style="margin-bottom: 8px;">还没有上传插件</h3>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">开始创建您的第一个插件，分享给全球用户</p>
                <button class="btn-primary" onclick="window.location.href='upload-plugin.html'">立即上传插件</button>
            </div>
        `;
        return;
    }

    list.innerHTML = plugins.map(plugin => {
        const statusMap = {
            pending: { text: '待审核', class: 'status-pending' },
            approved: { text: '已上架', class: 'status-approved' },
            rejected: { text: '已驳回', class: 'status-rejected' }
        };
        const status = statusMap[plugin.status] || statusMap.pending;

        return `
            <div class="plugin-list-item">
                <div class="plugin-list-info">
                    <h3>${plugin.name}</h3>
                    <p style="color: var(--text-secondary); margin: 4px 0;">${plugin.description}</p>
                    <div class="plugin-list-meta">
                        <span>版本: ${plugin.version}</span>
                        <span>定价: ¥${plugin.price}</span>
                        <span>上传时间: ${plugin.uploadTime}</span>
                        ${plugin.publishTime ? `<span>上架时间: ${plugin.publishTime}</span>` : ''}
                        <span>下载: ${plugin.downloads}</span>
                        <span>销量: ${plugin.sales}</span>
                        <span>收益: ¥${plugin.earnings.toFixed(2)}</span>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                    <span class="plugin-status ${status.class}">${status.text}</span>
                    ${plugin.status === 'approved' ? `
                        <button class="btn-secondary" onclick="viewPluginStats('${plugin.id}')" style="font-size: 12px; padding: 6px 12px;">查看数据</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染收益列表
function renderEarningsList() {
    const list = document.getElementById('earningsList');
    if (!list) return;

    const earnings = developerData.earnings.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (earnings.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <div style="font-size: 48px; margin-bottom: 16px;">💰</div>
                <h3 style="margin-bottom: 8px;">暂无收益记录</h3>
                <p style="color: var(--text-secondary);">当您的插件被购买后，收益会显示在这里</p>
            </div>
        `;
        return;
    }

    list.innerHTML = earnings.map(earning => {
        return `
            <div class="earnings-item">
                <div class="earnings-header">
                    <div>
                        <div class="earnings-amount">+¥${earning.amount.toFixed(2)}</div>
                        <div class="earnings-date">${earning.date}</div>
                    </div>
                    <span class="plugin-status ${earning.status === 'settled' ? 'status-approved' : 'status-pending'}">
                        ${earning.status === 'settled' ? '已到账' : '待结算'}
                    </span>
                </div>
                <div class="earnings-detail">
                    <div>插件: ${earning.pluginName}</div>
                    <div>销量: ${earning.sales} 件</div>
                    <div>平台分成: ¥${earning.platformFee.toFixed(2)} (30%)</div>
                    <div>您的收益: ¥${earning.amount.toFixed(2)} (70%)</div>
                </div>
            </div>
        `;
    }).join('');
}

// 查看插件统计数据
function viewPluginStats(pluginId) {
    const plugin = developerData.plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    alert(`插件统计数据\n\n名称: ${plugin.name}\n下载量: ${plugin.downloads}\n销量: ${plugin.sales}\n总收益: ¥${plugin.earnings.toFixed(2)}\n评分: ${plugin.rating} ⭐`);
}
window.viewPluginStats = viewPluginStats;

// 更新个人中心页面的统计数据
function updateProfileStats() {
    // 更新个人中心页面的开发者统计
    const devPluginsCount = document.getElementById('devPluginsCount');
    const devEarnings = document.getElementById('devEarnings');
    const statPlugins = document.getElementById('statPlugins');

    if (devPluginsCount) {
        devPluginsCount.textContent = developerData.statistics.totalPlugins;
    }
    if (devEarnings) {
        devEarnings.textContent = `¥${developerData.statistics.totalEarnings.toFixed(0)}`;
    }
    if (statPlugins) {
        statPlugins.textContent = developerData.statistics.totalPlugins;
    }
}

// 导出函数
window.initDeveloperCenter = initDeveloperCenter;
window.updateProfileStats = updateProfileStats;
