// 推荐算法功能模块

// 用户行为数据（模拟）
const userBehavior = {
    installedTools: [], // 已安装的工具ID列表
    ratedTools: {}, // 已评价的工具 {toolId: rating}
    viewedTools: [], // 浏览过的工具ID列表
    searchHistory: [] // 搜索历史
};

// 工具相似度矩阵（基于功能标签，模拟数据）
const toolSimilarity = {
    'ai-assistant': ['doc-generator', 'code-reviewer'],
    'doc-generator': ['ai-assistant', 'code-reviewer'],
    'code-reviewer': ['ai-assistant', 'doc-generator', 'test-automation'],
    'test-automation': ['code-reviewer', 'api-tester', 'performance-monitor'],
    'performance-monitor': ['test-automation', 'api-tester'],
    'api-tester': ['test-automation', 'performance-monitor']
};

// 工具分类映射
const toolCategories = {
    'ai-assistant': ['AI', '自动化', '会议'],
    'doc-generator': ['文档', '自动化', '开发'],
    'code-reviewer': ['代码', 'AI', '质量'],
    'test-automation': ['测试', '自动化', 'QA'],
    'performance-monitor': ['监控', '性能', '分析'],
    'api-tester': ['测试', 'API', '开发']
};

// 获取推荐工具
function getRecommendedTools(limit = 6) {
    if (typeof storeTools === 'undefined') {
        return [];
    }

    // 获取已安装的工具
    const installedIds = typeof installedTools !== 'undefined'
        ? installedTools.map(t => t.id)
        : [];

    // 计算每个工具的推荐分数
    const scores = {};

    storeTools.forEach(tool => {
        // 跳过已安装的工具
        if (installedIds.includes(tool.id)) {
            return;
        }

        let score = 0;

        // 1. 基于已安装工具的相似度推荐
        installedIds.forEach(installedId => {
            const similar = toolSimilarity[installedId] || [];
            if (similar.includes(tool.id)) {
                score += 30;
            }
        });

        // 2. 基于评分的推荐（高评分工具优先）
        if (tool.rating >= 4.5) {
            score += 20;
        } else if (tool.rating >= 4.0) {
            score += 10;
        }

        // 3. 基于下载量的推荐（热门工具）
        if (tool.downloads > 1000) {
            score += 15;
        } else if (tool.downloads > 500) {
            score += 10;
        } else if (tool.downloads > 200) {
            score += 5;
        }

        // 4. 基于分类的推荐（如果用户安装了同类工具）
        const toolCats = toolCategories[tool.id] || [];
        installedIds.forEach(installedId => {
            const installedCats = toolCategories[installedId] || [];
            const commonCats = toolCats.filter(cat => installedCats.includes(cat));
            if (commonCats.length > 0) {
                score += commonCats.length * 5;
            }
        });

        // 5. 新工具加成（最近添加的工具）
        if (tool.isNew) {
            score += 10;
        }

        scores[tool.id] = score;
    });

    // 按分数排序并返回前N个
    const sorted = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id]) => storeTools.find(t => t.id === id))
        .filter(t => t !== undefined);

    return sorted;
}

// 获取推荐理由
function getRecommendationReason(toolId) {
    if (typeof installedTools === 'undefined' || installedTools.length === 0) {
        return '热门推荐';
    }

    const installedIds = installedTools.map(t => t.id);

    // 检查是否因为相似工具推荐
    for (const installedId of installedIds) {
        const similar = toolSimilarity[installedId] || [];
        if (similar.includes(toolId)) {
            const installedTool = storeTools.find(t => t.id === installedId);
            return `与"${installedTool ? installedTool.name : '已安装工具'}"相似`;
        }
    }

    // 检查是否因为分类推荐
    const toolCats = toolCategories[toolId] || [];
    for (const installedId of installedIds) {
        const installedCats = toolCategories[installedId] || [];
        const commonCats = toolCats.filter(cat => installedCats.includes(cat));
        if (commonCats.length > 0) {
            return `与已安装工具同属"${commonCats[0]}"类别`;
        }
    }

    // 默认理由
    const tool = storeTools.find(t => t.id === toolId);
    if (tool && tool.rating >= 4.5) {
        return '高评分推荐';
    }
    if (tool && tool.downloads > 1000) {
        return '热门工具';
    }

    return '为你推荐';
}

// 更新用户行为（安装工具时调用）
function updateUserBehavior(action, toolId, data = {}) {
    switch (action) {
        case 'install':
            if (!userBehavior.installedTools.includes(toolId)) {
                userBehavior.installedTools.push(toolId);
            }
            break;
        case 'rate':
            userBehavior.ratedTools[toolId] = data.rating;
            break;
        case 'view':
            if (!userBehavior.viewedTools.includes(toolId)) {
                userBehavior.viewedTools.push(toolId);
            }
            break;
        case 'search':
            userBehavior.searchHistory.push(data.query);
            break;
    }
}

// 渲染推荐区域
function renderRecommendations(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const recommendations = getRecommendedTools(6);

    if (recommendations.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">🤖 为你推荐</h2>
            <p style="color: var(--text-secondary); font-size: 14px;">基于你的使用习惯和偏好</p>
        </div>
        <div class="toolstore-grid" id="recommendedToolsGrid">
            ${recommendations.map(tool => {
                const reason = getRecommendationReason(tool.id);
                return `
                    <div class="store-tool-card" style="position: relative;">
                        <div class="recommendation-badge" style="position: absolute; top: 48px; right: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; z-index: 10;">
                            💡 推荐
                        </div>
                        ${tool.price > 0
                            ? `<div class="tool-price-tag">¥${tool.price}</div>`
                            : `<div class="tool-price-tag free">免费</div>`
                        }
                        <div class="store-tool-icon">${tool.icon}</div>
                        <div class="store-tool-name">${tool.name}</div>
                        <div class="store-tool-desc">${tool.description}</div>
                        <div class="store-tool-meta">
                            <div class="store-tool-author">
                                <span>发布者: ${tool.author}</span>
                            </div>
                            <div class="store-tool-stats">
                                <span>📥 ${tool.downloads} 次下载</span>
                                <span>⭐ ${tool.rating}</span>
                            </div>
                        </div>
                        <div style="margin: 8px 0; padding: 8px; background: rgba(91, 79, 232, 0.05); border-radius: 6px; font-size: 12px; color: var(--primary-color);">
                            💡 ${reason}
                        </div>
                        <div class="store-tool-version">版本: ${tool.version}</div>
                        ${tool.isInstalled
                            ? `<button class="btn-primary installed" disabled>✓ 已安装</button>`
                            : tool.price > 0
                                ? `<button class="btn-primary premium" onclick="handlePurchase('${tool.id}')">💳 购买并安装</button>`
                                : `<button class="btn-primary" onclick="handleInstall('${tool.id}')">安装</button>`
                        }
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 导出全局函数
window.getRecommendedTools = getRecommendedTools;
window.getRecommendationReason = getRecommendationReason;
window.updateUserBehavior = updateUserBehavior;
window.renderRecommendations = renderRecommendations;
