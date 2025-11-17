// 定价管理功能模块

// 定价规则配置
const pricingRules = {
    // 价格区间
    priceRanges: {
        free: { min: 0, max: 0, label: '免费' },
        basic: { min: 1, max: 49, label: '基础工具' },
        medium: { min: 50, max: 149, label: '中等工具' },
        advanced: { min: 150, max: 299, label: '高级工具' },
        professional: { min: 300, max: 999, label: '专业工具' }
    },

    // 平台抽成比例
    platformFee: 0.3, // 30%
    developerShare: 0.7, // 70%

    // 自动审核阈值
    autoApprove: {
        maxPrice: 99, // 99元以下自动通过
        minRating: 4.5, // 上传者评分4.5以上
        verifiedDeveloper: true // 认证开发者
    },

    // 需要人工审核的条件
    manualReview: {
        priceOver: 299, // 超过299元
        priceChangeOver: 0.3, // 价格变动超过30%
        newDeveloper: true // 新开发者
    }
};

// 获取价格区间
function getPriceRange(price) {
    for (const [key, range] of Object.entries(pricingRules.priceRanges)) {
        if (price >= range.min && price <= range.max) {
            return range;
        }
    }
    return pricingRules.priceRanges.professional;
}

// 检查是否需要人工审核
function needsManualReview(plugin) {
    const rules = pricingRules.manualReview;

    // 价格超过阈值
    if (plugin.price > rules.priceOver) {
        return { need: true, reason: '价格超过自动审核阈值' };
    }

    // 新开发者
    if (rules.newDeveloper && plugin.isNewDeveloper) {
        return { need: true, reason: '新开发者需要人工审核' };
    }

    return { need: false };
}

// 检查是否可以自动通过
function canAutoApprove(plugin) {
    const rules = pricingRules.autoApprove;

    // 价格在自动通过范围内
    if (plugin.price <= rules.maxPrice) {
        // 认证开发者
        if (rules.verifiedDeveloper && plugin.developerVerified) {
            return { can: true, reason: '认证开发者，价格在自动通过范围内' };
        }

        // 评分足够高
        if (plugin.developerRating >= rules.minRating) {
            return { can: true, reason: '开发者评分足够高，价格在自动通过范围内' };
        }
    }

    return { can: false };
}

// 计算平台收益
function calculatePlatformRevenue(price) {
    return Math.round(price * pricingRules.platformFee);
}

// 计算开发者收益
function calculateDeveloperRevenue(price) {
    return Math.round(price * pricingRules.developerShare);
}

// 获取市场参考价格
function getMarketReference(category) {
    // 模拟市场参考数据
    const marketData = {
        '开发工具': [
            { name: '代码审查助手', price: 159, rating: 4.5 },
            { name: '安全扫描工具', price: 189, rating: 4.6 },
            { name: '性能优化专家', price: 199, rating: 4.7 }
        ],
        '测试工具': [
            { name: 'API测试助手', price: 199, rating: 4.4 },
            { name: '接口测试工具', price: 229, rating: 4.5 },
            { name: '自动化测试平台', price: 279, rating: 4.6 }
        ],
        '监控工具': [
            { name: '性能监控', price: 149, rating: 4.5 },
            { name: '日志分析', price: 179, rating: 4.6 },
            { name: '实时监控', price: 199, rating: 4.7 }
        ]
    };

    return marketData[category] || marketData['开发工具'];
}

// 生成定价建议
function generatePricingSuggestion(plugin, marketReference) {
    if (!marketReference || marketReference.length === 0) {
        return {
            suggestedPrice: plugin.price,
            reason: '暂无市场参考数据，建议保持原价'
        };
    }

    // 计算平均价格
    const avgPrice = marketReference.reduce((sum, ref) => sum + ref.price, 0) / marketReference.length;

    // 根据功能复杂度调整
    let suggestedPrice = avgPrice;

    // 如果原价在合理范围内（平均价格的80%-120%），建议保持
    if (plugin.price >= avgPrice * 0.8 && plugin.price <= avgPrice * 1.2) {
        suggestedPrice = plugin.price;
        return {
            suggestedPrice: suggestedPrice,
            reason: `价格在合理范围内（市场平均价格: ¥${Math.round(avgPrice)}），建议保持原价`
        };
    }

    // 如果价格过高，建议下调
    if (plugin.price > avgPrice * 1.2) {
        suggestedPrice = Math.round(avgPrice * 1.1);
        return {
            suggestedPrice: suggestedPrice,
            reason: `价格偏高（市场平均价格: ¥${Math.round(avgPrice)}），建议调整为 ¥${suggestedPrice} 以提高市场竞争力`
        };
    }

    // 如果价格过低，建议上调
    if (plugin.price < avgPrice * 0.8) {
        suggestedPrice = Math.round(avgPrice * 0.9);
        return {
            suggestedPrice: suggestedPrice,
            reason: `价格偏低（市场平均价格: ¥${Math.round(avgPrice)}），建议调整为 ¥${suggestedPrice} 以体现产品价值`
        };
    }

    return {
        suggestedPrice: suggestedPrice,
        reason: `参考市场平均价格 ¥${Math.round(avgPrice)}，建议定价 ¥${suggestedPrice}`
    };
}

// 验证定价合理性
function validatePricing(price, category) {
    const range = getPriceRange(price);
    const marketRef = getMarketReference(category);

    if (marketRef.length === 0) {
        return { valid: true, message: '价格合理' };
    }

    const avgPrice = marketRef.reduce((sum, ref) => sum + ref.price, 0) / marketRef.length;
    const minPrice = Math.min(...marketRef.map(ref => ref.price));
    const maxPrice = Math.max(...marketRef.map(ref => ref.price));

    // 价格在合理范围内
    if (price >= minPrice * 0.5 && price <= maxPrice * 1.5) {
        return { valid: true, message: '价格在合理范围内' };
    }

    // 价格过低
    if (price < minPrice * 0.5) {
        return {
            valid: false,
            message: `价格过低，建议不低于 ¥${Math.round(minPrice * 0.7)}`,
            suggestion: Math.round(minPrice * 0.7)
        };
    }

    // 价格过高
    if (price > maxPrice * 1.5) {
        return {
            valid: false,
            message: `价格过高，建议不超过 ¥${Math.round(maxPrice * 1.3)}`,
            suggestion: Math.round(maxPrice * 1.3)
        };
    }

    return { valid: true, message: '价格合理' };
}

// 导出定价功能
window.pricingRules = pricingRules;
window.getPriceRange = getPriceRange;
window.needsManualReview = needsManualReview;
window.canAutoApprove = canAutoApprove;
window.calculatePlatformRevenue = calculatePlatformRevenue;
window.calculateDeveloperRevenue = calculateDeveloperRevenue;
window.getMarketReference = getMarketReference;
window.generatePricingSuggestion = generatePricingSuggestion;
window.validatePricing = validatePricing;

