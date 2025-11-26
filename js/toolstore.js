// 工具商店功能

// 商店中的工具列表（模拟数据）
const storeTools = [
    {
        id: 'ai-assistant',
        name: 'AI 会议助手',
        icon: '🤖',
        description: '智能分析会议录音，自动生成会议摘要和待办事项',
        author: 'InnoFlow 官方',
        version: 'v1.2.0',
        downloads: 1234,
        rating: 4.8,
        isInstalled: false,
        price: 0, // 免费
        isPremium: false
    },
    {
        id: 'doc-generator',
        name: '文档生成器',
        icon: '📝',
        description: '根据代码和注释自动生成项目文档',
        author: 'DevTools 工作室',
        version: 'v1.3.2',
        downloads: 342,
        rating: 4.5,
        isInstalled: false,
        price: 0, // 免费
        isPremium: false
    },
    {
        id: 'code-reviewer',
        name: 'AI 代码审查',
        icon: '🔍',
        description: '自动审查代码质量，发现潜在问题和优化建议',
        author: 'TechFlow 团队',
        version: 'v1.0.5',
        downloads: 567,
        rating: 4.6,
        isInstalled: false,
        price: 99 // 付费
    },
    {
        id: 'test-automation',
        name: '测试自动化',
        icon: '🧪',
        description: '自动生成测试用例和执行测试',
        author: 'QA Pro',
        version: 'v2.1.0',
        downloads: 789,
        rating: 4.7,
        isInstalled: false,
        price: 149 // 付费
    },
    {
        id: 'performance-monitor',
        name: '性能监控',
        icon: '📊',
        description: '实时监控项目性能指标，生成分析报告',
        author: 'Metrics Lab',
        version: 'v1.8.3',
        downloads: 623,
        rating: 4.4,
        isInstalled: false,
        price: 79 // 付费
    },
    {
        id: 'api-tester',
        name: 'API 测试工具',
        icon: '🔌',
        description: '可视化API测试，自动生成测试报告',
        author: 'API Tools 团队',
        version: 'v1.5.0',
        downloads: 456,
        rating: 4.6,
        isInstalled: false,
        price: 129 // 付费
    }
];

// 初始化（延迟执行，确保 main.js 已加载）
document.addEventListener('DOMContentLoaded', function() {
    // 延迟检查，确保 main.js 中的 installedTools 已定义
    setTimeout(() => {
        checkInstalledStatus();
        initToolStore();
    }, 50);
});

// 检查已安装的工具状态
function checkInstalledStatus() {
    // 默认已安装的工具（演示项目默认安装）
    const defaultInstalled = ['ai-assistant', 'doc-generator'];

    // 从 main.js 获取已安装的工具列表
    if (typeof installedTools !== 'undefined' && installedTools.length > 0) {
        storeTools.forEach(tool => {
            tool.isInstalled = installedTools.some(t => t.id === tool.id);
        });

        // 同步已安装插件数量到订阅状态
        if (typeof getCurrentSubscription !== 'undefined' && typeof currentSubscription !== 'undefined') {
            const sub = getCurrentSubscription();
            if (sub) {
                sub.pluginsUsed = installedTools.length;
                currentSubscription.pluginsUsed = installedTools.length;
            }
        }
    } else {
        // 如果 main.js 未加载，使用默认值
        storeTools.forEach(tool => {
            tool.isInstalled = defaultInstalled.includes(tool.id);
        });

        // 同步默认安装数量
        if (typeof getCurrentSubscription !== 'undefined' && typeof currentSubscription !== 'undefined') {
            const sub = getCurrentSubscription();
            if (sub) {
                sub.pluginsUsed = defaultInstalled.length;
                currentSubscription.pluginsUsed = defaultInstalled.length;
            }
        }
    }
}

// 获取当前订阅（从 subscription.js）
function getCurrentSubscriptionFromStore() {
    if (typeof getCurrentSubscription !== 'undefined') {
        return getCurrentSubscription();
    }
    // 默认返回免费版
    return { plan: 'free' };
}

// 初始化工具商店
function initToolStore() {
    const grid = document.getElementById('toolstoreGrid');
    if (!grid) return;

    grid.innerHTML = '';

    storeTools.forEach(tool => {
        const card = createStoreToolCard(tool);
        grid.appendChild(card);
    });
}

// 创建商店工具卡片
function createStoreToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'store-tool-card';

    // 价格标签
    const priceTag = tool.price > 0
        ? `<div class="tool-price-tag">¥${tool.price}</div>`
        : `<div class="tool-price-tag free">免费</div>`;

    // 安全标识
    const securityBadge = typeof getSecurityBadge !== 'undefined'
        ? (() => {
            const badge = getSecurityBadge(tool.id);
            return `<div class="security-badge" onclick="showSecurityDetails('${tool.id}'); event.stopPropagation();"
                         style="position: absolute; top: 12px; left: 12px; background: ${badge.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; cursor: pointer; z-index: 10; display: flex; align-items: center; gap: 4px;">
                    ${badge.icon} ${badge.text}
                  </div>`;
        })()
        : '';

    // 安装按钮
    let installButton = '';
    if (tool.isInstalled) {
        installButton = `<button class="btn-primary installed" disabled>✓ 已安装</button>`;
    } else if (tool.price > 0) {
        installButton = `<button class="btn-primary premium" onclick="handlePurchase('${tool.id}')">
            💳 购买并安装
        </button>`;
    } else {
        installButton = `<button class="btn-primary" onclick="handleInstall('${tool.id}')">安装</button>`;
    }

    // 评价按钮（已安装的工具可以评价）
    const ratingButton = tool.isInstalled
        ? `<button class="btn-secondary" onclick="showRatingModal('${tool.id}'); event.stopPropagation();" style="margin-top: 8px; width: 100%;">
            ⭐ 评价
          </button>`
        : '';

    // 评价信息（可点击查看详情）
    const ratingInfo = typeof getRatingCount !== 'undefined' && getRatingCount(tool.id) > 0
        ? `<div onclick="showRatingList('${tool.id}'); event.stopPropagation();" style="cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 8px; color: var(--text-secondary); font-size: 13px;">
            <span>⭐ ${tool.rating}</span>
            <span>(${getRatingCount(tool.id)}条评价)</span>
          </div>`
        : `<div style="display: flex; align-items: center; gap: 4px; margin-top: 8px; color: var(--text-secondary); font-size: 13px;">
            <span>⭐ ${tool.rating}</span>
          </div>`;

    card.innerHTML = `
        ${priceTag}
        ${securityBadge}
        <div class="store-tool-icon">${tool.icon}</div>
        <div class="store-tool-name">${tool.name}</div>
        <div class="store-tool-desc">${tool.description}</div>
        <div class="store-tool-meta">
            <div class="store-tool-author">
                <span>发布者: ${tool.author}</span>
            </div>
            <div class="store-tool-stats">
                <span>📥 ${tool.downloads} 次下载</span>
            </div>
        </div>
        ${ratingInfo}
        <div class="store-tool-version">版本: ${tool.version}</div>
        ${installButton}
        ${ratingButton}
    `;

    return card;
}

// 处理安装
function handleInstall(toolId) {
    const tool = storeTools.find(t => t.id === toolId);
    if (!tool) return;

    if (tool.isInstalled) {
        alert('该工具已安装');
        return;
    }

    // 检查插件数量限制
    if (typeof checkFeatureLimit !== 'undefined') {
        const limit = checkFeatureLimit('plugins');
        if (!limit.allowed) {
            if (typeof showUpgradePrompt !== 'undefined') {
                showUpgradePrompt('plugins');
            } else {
                alert('插件数量已达上限，请升级套餐以安装更多插件');
            }
            return;
        }
    }

    // 调用 main.js 中的安装函数
    if (typeof installTool !== 'undefined') {
        installTool({
            id: tool.id,
            name: tool.name,
            icon: tool.icon,
            description: tool.description,
            url: getToolUrl(tool.id)
        });
        // 更新状态
        tool.isInstalled = true;

        // 更新用户行为（用于推荐算法）
        if (typeof updateUserBehavior !== 'undefined') {
            updateUserBehavior('install', tool.id);
        }

        // 执行安全扫描
        if (typeof performSecurityScan !== 'undefined') {
            performSecurityScan(tool.id, tool);
        }

        // 发送通知
        if (typeof addNotification !== 'undefined') {
            addNotification('plugin', '插件安装成功', `"${tool.name}" 已成功安装到你的项目中`, 'project.html');
        }

        // 重新检查状态并刷新
        checkInstalledStatus();
        initToolStore();

        // 刷新推荐区域
        if (typeof renderRecommendations !== 'undefined') {
            const recommendationsSection = document.getElementById('recommendationsSection');
            if (recommendationsSection) {
                renderRecommendations('recommendationsSection');
            }
        }
    } else {
        alert(`工具 "${tool.name}" 安装成功！`);
        tool.isInstalled = true;
        initToolStore();
    }
}

// 获取工具URL
function getToolUrl(toolId) {
    const urlMap = {
        'ai-assistant': 'tool.html',
        'doc-generator': 'docgen.html',
        'code-reviewer': '#',
        'test-automation': '#',
        'performance-monitor': '#',
        'api-tester': '#'
    };
    return urlMap[toolId] || '#';
}

// 处理购买
function handlePurchase(toolId) {
    const tool = storeTools.find(t => t.id === toolId);
    if (!tool || tool.price <= 0) {
        handleInstall(toolId);
        return;
    }

    // 显示付费弹窗
    const paymentModal = document.createElement('div');
    paymentModal.className = 'modal active';
    paymentModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>购买工具</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">${tool.icon}</div>
                    <h3 style="margin-bottom: 8px;">${tool.name}</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">${tool.description}</p>
                    <div style="font-size: 32px; font-weight: 700; color: var(--primary-color);">
                        ¥${tool.price}
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <h4 style="margin-bottom: 12px;">支付方式</h4>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment" value="alipay" checked>
                            <span>💰 支付宝</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="wechat">
                            <span>💚 微信支付</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="card">
                            <span>💳 银行卡</span>
                        </label>
                    </div>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        取消
                    </button>
                    <button class="btn-primary" style="flex: 1;" onclick="confirmPurchase('${toolId}', this.closest('.modal'))">
                        确认支付 ¥${tool.price}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(paymentModal);

    // 点击外部关闭
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.remove();
        }
    });
}

// 确认购买
function confirmPurchase(toolId, modal) {
    const tool = storeTools.find(t => t.id === toolId);
    if (!tool) return;

    // 检查插件数量限制
    if (typeof checkFeatureLimit !== 'undefined') {
        const limit = checkFeatureLimit('plugins');
        if (!limit.allowed) {
            modal.remove();
            if (typeof showUpgradePrompt !== 'undefined') {
                showUpgradePrompt('plugins');
            } else {
                alert('插件数量已达上限，请升级套餐以安装更多插件');
            }
            return;
        }
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // 模拟支付过程
    const btn = modal.querySelector('.btn-primary');
    btn.textContent = '支付中...';
    btn.disabled = true;

    setTimeout(() => {
        // 支付成功，安装工具
        if (typeof installTool !== 'undefined') {
            installTool({
                id: tool.id,
                name: tool.name,
                icon: tool.icon,
                description: tool.description,
                url: getToolUrl(tool.id)
            });
        }

        tool.isInstalled = true;

        // 更新用户行为
        if (typeof updateUserBehavior !== 'undefined') {
            updateUserBehavior('install', tool.id);
        }

        // 执行安全扫描
        if (typeof performSecurityScan !== 'undefined') {
            performSecurityScan(tool.id, tool);
        }

        // 发送通知
        if (typeof addNotification !== 'undefined') {
            addNotification('plugin', '插件购买成功', `"${tool.name}" 已成功购买并安装`, 'project.html');
        }

        checkInstalledStatus();
        initToolStore();

        // 刷新推荐区域
        if (typeof renderRecommendations !== 'undefined') {
            const recommendationsSection = document.getElementById('recommendationsSection');
            if (recommendationsSection) {
                renderRecommendations('recommendationsSection');
            }
        }

        modal.remove();
        alert(`🎉 支付成功！\n\n工具 "${tool.name}" 已安装到您的项目中。`);
    }, 1500);
}

// 显示上传工具弹窗
function showUploadModal() {
    // 跳转到上传插件页面
    window.location.href = 'developer/upload-plugin.html';
}
