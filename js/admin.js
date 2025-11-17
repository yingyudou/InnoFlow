// 管理员功能模块

// 管理员权限检查
function checkAdminAuth() {
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin/admin-login.html';
        return false;
    }
    return true;
}

// 管理员数据（模拟）
const adminData = {
    plugins: {
        pending: [],
        reviewing: [],
        approved: [],
        rejected: []
    },
    pricingNegotiations: [],
    users: [],
    statistics: {
        totalPlugins: 0,
        pendingPlugins: 0,
        totalUsers: 0,
        totalRevenue: 0
    }
};

// 获取待审核插件数量
function getPendingPluginsCount() {
    return adminData.plugins.pending.length;
}

// 获取待定价协商数量
function getPendingPricingCount() {
    return adminData.pricingNegotiations.filter(n => n.status === 'pending' || n.status === 'negotiating').length;
}

// 审核插件
function reviewPlugin(pluginId, action, data = {}) {
    // 模拟审核操作
    console.log('审核插件:', pluginId, action, data);

    // 真实系统中应该调用后端API
    return {
        success: true,
        message: action === 'approve' ? '插件审核已通过' : '插件已驳回'
    };
}

// 发送定价建议
function sendPricingSuggestion(negotiationId, price, message) {
    // 模拟发送定价建议
    console.log('发送定价建议:', negotiationId, price, message);

    return {
        success: true,
        message: '定价建议已发送'
    };
}

// 确认最终定价
function confirmFinalPricing(negotiationId, finalPrice) {
    // 模拟确认定价
    console.log('确认最终定价:', negotiationId, finalPrice);

    return {
        success: true,
        message: '定价已确认'
    };
}

// 导出管理员功能
window.checkAdminAuth = checkAdminAuth;
window.getPendingPluginsCount = getPendingPluginsCount;
window.getPendingPricingCount = getPendingPricingCount;
window.reviewPlugin = reviewPlugin;
window.sendPricingSuggestion = sendPricingSuggestion;
window.confirmFinalPricing = confirmFinalPricing;

