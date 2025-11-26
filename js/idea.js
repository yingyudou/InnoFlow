// AI Idea 中心功能

// 用户方向选择历史（存储在localStorage）
let userDirectionHistory = JSON.parse(localStorage.getItem('trizDirectionHistory') || '[]');

// 保存方向选择历史
function saveDirectionHistory(directionName, directionId) {
    const historyItem = {
        directionName: directionName,
        directionId: directionId,
        timestamp: Date.now()
    };
    userDirectionHistory.push(historyItem);
    // 只保留最近100条记录
    if (userDirectionHistory.length > 100) {
        userDirectionHistory = userDirectionHistory.slice(-100);
    }
    localStorage.setItem('trizDirectionHistory', JSON.stringify(userDirectionHistory));
}

// 获取方向选择频率（用于优化推荐）
function getDirectionFrequency() {
    const frequency = {};
    userDirectionHistory.forEach(item => {
        const key = `${item.directionName}_${item.directionId}`;
        frequency[key] = (frequency[key] || 0) + 1;
    });
    return frequency;
}

// 根据历史优化方向推荐顺序
function optimizeDirectionRecommendation(directions) {
    const frequency = getDirectionFrequency();
    return directions.sort((a, b) => {
        const keyA = `${a.name}_${a.id}`;
        const keyB = `${b.name}_${b.id}`;
        const freqA = frequency[keyA] || 0;
        const freqB = frequency[keyB] || 0;
        // 优先推荐用户常选的方向
        return freqB - freqA;
    });
}

// Idea 数据（模拟）
const ideasData = [
    {
        id: 1,
        title: '语音控制功能',
        description: '通过语音命令控制智能家居设备，提升用户体验',
        category: '用户体验',
        tags: ['语音识别', 'AI', '交互'],
        author: '张伟',
        cluster: 0
    },
    {
        id: 2,
        title: '智能场景联动',
        description: '根据用户习惯自动调整设备状态，如回家模式、睡眠模式',
        category: '智能化',
        tags: ['自动化', '场景', 'AI'],
        author: '李娜',
        cluster: 0
    },
    {
        id: 3,
        title: '能耗监控面板',
        description: '实时显示各设备能耗数据，帮助用户节能',
        category: '数据分析',
        tags: ['可视化', '节能', '监控'],
        author: '王强',
        cluster: 1
    },
    {
        id: 4,
        title: '设备健康诊断',
        description: '自动检测设备运行状态，预警潜在故障',
        category: '维护',
        tags: ['诊断', '预警', 'AI'],
        author: '刘洋',
        cluster: 2
    },
    {
        id: 5,
        title: '多用户权限管理',
        description: '家庭成员分级权限，保护隐私和安全',
        category: '安全',
        tags: ['权限', '安全', '多用户'],
        author: '陈晨',
        cluster: 2
    },
    {
        id: 6,
        title: '远程控制优化',
        description: '外网访问速度优化，支持4G/5G快速响应',
        category: '性能',
        tags: ['网络', '性能', '优化'],
        author: '赵敏',
        cluster: 1
    },
    {
        id: 7,
        title: '手势识别控制',
        description: '通过摄像头识别手势，实现非接触式控制',
        category: '用户体验',
        tags: ['手势', 'AI', '交互'],
        author: '孙涛',
        cluster: 0
    },
    {
        id: 8,
        title: '设备联动规则编辑器',
        description: '可视化编辑设备联动逻辑，无需编程',
        category: '智能化',
        tags: ['可视化', '编辑器', '自动化'],
        author: '周杰',
        cluster: 0
    },
    {
        id: 9,
        title: '历史数据分析',
        description: '分析设备使用历史，提供优化建议',
        category: '数据分析',
        tags: ['大数据', 'AI', '分析'],
        author: '吴磊',
        cluster: 1
    },
    {
        id: 10,
        title: '第三方设备接入',
        description: '支持主流智能设备品牌接入，统一控制',
        category: '兼容性',
        tags: ['集成', 'API', '兼容'],
        author: '郑云',
        cluster: 2
    }
];

// Canvas 配置
let canvas, ctx;
let bubbles = [];
let selectedBubble = null;
let isClustered = false; // 是否已进行聚类
let clusterCategoryNames = {}; // 存储每个聚类的固定类别名称 {clusterId: categoryName}
let isDragging = false; // 是否正在拖动
let wasDragging = false; // 是否刚刚拖动过（用于区分点击和拖动）
let dragBubble = null; // 正在拖动的气泡
let dragOffset = { x: 0, y: 0 }; // 拖动偏移量
let dragStartPos = { x: 0, y: 0 }; // 拖动开始位置
const colors = ['#5B4FE8', '#F03D8E', '#00D4AA', '#FF9F1C', '#8338EC'];
const grayColor = '#9CA3AF'; // 灰色

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化对比UI
    updateCompareUI();
    canvas = document.getElementById('clusterCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // 初始化气泡
    initBubbles();
    drawBubbles();

    // 事件监听
    document.getElementById('clusterBtn').addEventListener('click', performClustering);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('resize', resizeCanvas);
});

// 获取 Canvas 显示尺寸（CSS 像素）
function getCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
}

// 调整 Canvas 大小（支持高分辨率屏幕）
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // 保存当前缩放状态
    const needsRedraw = bubbles.length > 0;

    // 重置变换矩阵
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 设置 Canvas 实际像素（考虑设备像素比）
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // 设置 Canvas 显示尺寸（CSS 像素）
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(dpr, dpr);

    if (needsRedraw) {
        drawBubbles();
    }
}

// 初始化气泡
function initBubbles() {
    const size = getCanvasSize();
    bubbles = ideasData.map((idea, index) => {
        return {
            id: idea.id,
            x: Math.random() * (size.width - 100) + 50,
            y: Math.random() * (size.height - 100) + 50,
            radius: 40 + Math.random() * 20,
            color: grayColor, // 初始为灰色
            idea: idea,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        };
    });
    isClustered = false; // 重置聚类状态
    clusterCategoryNames = {}; // 清空类别名称缓存
}

// 绘制气泡
function drawBubbles() {
    const size = getCanvasSize();
    ctx.clearRect(0, 0, size.width, size.height);

    // 绘制聚类连线
    drawClusterLines();

    // 绘制气泡
    bubbles.forEach(bubble => {
        // 阴影
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // 气泡
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();

        // 选中效果
        if (selectedBubble && selectedBubble.id === bubble.id) {
            ctx.strokeStyle = '#1A1A2E';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // 重置阴影
        ctx.shadowColor = 'transparent';

        // 文字颜色根据背景色调整（灰色时用深色字，彩色时用白色字）
        const isGray = bubble.color === grayColor || bubble.color.startsWith('#9CA3AF');
        ctx.fillStyle = isGray ? '#1A1A2E' : 'white';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const title = bubble.idea.title;
        if (title.length > 6) {
            ctx.fillText(title.substring(0, 5) + '...', bubble.x, bubble.y);
        } else {
            ctx.fillText(title, bubble.x, bubble.y);
        }

        // 拖动中的气泡添加高亮边框
        if (isDragging && dragBubble && dragBubble.id === bubble.id) {
            ctx.strokeStyle = '#5B4FE8';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });

    // 绘制聚类角标（聚类后显示）
    if (isClustered) {
        drawClusterLegend();
    }
}

// 绘制聚类连线
function drawClusterLines() {
    // 只有在聚类后才绘制连线
    if (!isClustered) return;

    const clusters = {};
    bubbles.forEach(bubble => {
        const cluster = bubble.idea.cluster;
        if (!clusters[cluster]) {
            clusters[cluster] = [];
        }
        clusters[cluster].push(bubble);
    });

    Object.values(clusters).forEach(clusterBubbles => {
        if (clusterBubbles.length < 2) return;

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;

        for (let i = 0; i < clusterBubbles.length - 1; i++) {
            for (let j = i + 1; j < clusterBubbles.length; j++) {
                ctx.beginPath();
                ctx.moveTo(clusterBubbles[i].x, clusterBubbles[i].y);
                ctx.lineTo(clusterBubbles[j].x, clusterBubbles[j].y);
                ctx.stroke();
            }
        }
    });
}

// 绘制聚类角标图例
function drawClusterLegend() {
    // 统计每个聚类的气泡数量
    const clusterCounts = {};
    bubbles.forEach(bubble => {
        const clusterId = bubble.idea.cluster;
        if (clusterId !== undefined) {
            clusterCounts[clusterId] = (clusterCounts[clusterId] || 0) + 1;
        }
    });

    const existingClusters = Object.keys(clusterCounts).map(Number).sort();
    if (existingClusters.length === 0) return;

    // 角标位置：右上角
    const size = getCanvasSize();
    const legendX = size.width - 200;
    const legendY = 20;
    const itemHeight = 32;
    const itemSpacing = 8;

    // 计算背景框尺寸
    const legendHeight = existingClusters.length * (itemHeight + itemSpacing) + 30;
    const legendWidth = 180;
    const padding = 12;

    // 绘制半透明背景（圆角矩形）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = 'rgba(91, 79, 232, 0.2)';
    ctx.lineWidth = 1.5;

    // 圆角矩形
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(legendX - padding + radius, legendY - padding);
    ctx.lineTo(legendX - padding + legendWidth - radius, legendY - padding);
    ctx.quadraticCurveTo(legendX - padding + legendWidth, legendY - padding, legendX - padding + legendWidth, legendY - padding + radius);
    ctx.lineTo(legendX - padding + legendWidth, legendY - padding + legendHeight - radius);
    ctx.quadraticCurveTo(legendX - padding + legendWidth, legendY - padding + legendHeight, legendX - padding + legendWidth - radius, legendY - padding + legendHeight);
    ctx.lineTo(legendX - padding + radius, legendY - padding + legendHeight);
    ctx.quadraticCurveTo(legendX - padding, legendY - padding + legendHeight, legendX - padding, legendY - padding + legendHeight - radius);
    ctx.lineTo(legendX - padding, legendY - padding + radius);
    ctx.quadraticCurveTo(legendX - padding, legendY - padding, legendX - padding + radius, legendY - padding);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 绘制标题
    ctx.fillStyle = '#1A1A2E';
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('聚类类别', legendX, legendY);

    // 绘制每个聚类项
    existingClusters.forEach((clusterId, index) => {
        const y = legendY + 22 + index * (itemHeight + itemSpacing);

        // 颜色圆点和边框
        ctx.beginPath();
        ctx.arc(legendX, y + 16, 10, 0, Math.PI * 2);
        ctx.fillStyle = colors[clusterId] || grayColor;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 使用保存的固定类别名称，如果没有则使用默认值
        const categoryName = clusterCategoryNames[clusterId] || '未分类';

        // 类别名称
        ctx.fillStyle = '#1A1A2E';
        ctx.font = '13px Inter';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // 限制文字宽度
        const maxWidth = legendWidth - 50;
        let displayName = categoryName;
        const metrics = ctx.measureText(displayName);
        if (metrics.width > maxWidth) {
            while (ctx.measureText(displayName + '...').width > maxWidth && displayName.length > 0) {
                displayName = displayName.slice(0, -1);
            }
            displayName += '...';
        }
        ctx.fillText(displayName, legendX + 24, y + 16);

        // 计数
        const count = clusterCounts[clusterId] || 0;
        ctx.fillStyle = '#6B7280';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`(${count})`, legendX + legendWidth - 12, y + 16);
    });
}

// AI 聚类动画
function performClustering() {
    // 检查 AI 调用限制
    if (typeof checkFeatureLimit !== 'undefined') {
        const limit = checkFeatureLimit('aiCalls');
        if (!limit.allowed) {
            if (typeof showUpgradePrompt !== 'undefined') {
                showUpgradePrompt('aiCalls');
            } else {
                alert('AI 调用次数已达上限，请升级套餐以使用更多 AI 功能');
            }
            return;
        }

        // 如果通过限制检查，增加已使用次数（模拟）
        if (typeof getCurrentSubscription !== 'undefined') {
            const sub = getCurrentSubscription();
            if (sub && typeof sub.aiCallsUsed !== 'undefined') {
                // 在真实系统中，这里应该通过 API 更新服务器
                // 演示版本中，我们只在本地模拟
                if (typeof currentSubscription !== 'undefined') {
                    currentSubscription.aiCallsUsed = (currentSubscription.aiCallsUsed || 0) + 1;
                }
            }
        }
    }

    // 原有的聚类逻辑
    const btn = document.getElementById('clusterBtn');
    btn.textContent = '🤖 聚类中...';
    btn.disabled = true;

    // 重新分配聚类
    ideasData.forEach((idea, index) => {
        idea.cluster = Math.floor(Math.random() * 3);
    });

    // 动画效果
    let frame = 0;
    const maxFrames = 60;

    const animate = () => {
        frame++;

        // 在最后一帧时提前设置聚类状态，确保角标会在本次绘制中显示
        if (frame >= maxFrames) {
            isClustered = true;
        }

        const size = getCanvasSize();
        bubbles.forEach((bubble, index) => {
            // 计算目标位置（基于聚类）
            const cluster = bubble.idea.cluster;
            const targetX = size.width / 4 * (cluster + 1);
            const targetY = size.height / 2 + (Math.random() - 0.5) * 100;

            // 平滑移动
            bubble.x += (targetX - bubble.x) * 0.05;
            bubble.y += (targetY - bubble.y) * 0.05;

            // 渐变染色：从灰色过渡到聚类颜色
            const progress = Math.min(frame / maxFrames, 1);
            const targetColor = colors[cluster];
            bubble.color = interpolateColor(grayColor, targetColor, progress);
        });

        drawBubbles();

        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            // 动画结束后，确保最终状态已绘制（包括角标）
            isClustered = true; // 再次确认标记已聚类

            // 计算并保存每个聚类的固定类别名称
            calculateClusterCategoryNames();

            drawBubbles(); // 再次绘制，确保角标显示
            btn.textContent = '🔄 重新聚类';
            btn.disabled = false;
        }
    };

    animate();
}

// 计算并保存每个聚类的类别名称（聚类后调用一次即可）
function calculateClusterCategoryNames() {
    const clusterMap = {};

    // 统计每个聚类的类别
    bubbles.forEach(bubble => {
        const clusterId = bubble.idea.cluster;
        if (clusterId !== undefined) {
            if (!clusterMap[clusterId]) {
                clusterMap[clusterId] = {
                    categories: {}
                };
            }
            const category = bubble.idea.category;
            // 如果想法来自TRIZ方向，使用方向名称作为类别（中性化）
            if (bubble.idea.isFromTRIZ && bubble.idea.category) {
                clusterMap[clusterId].categories[category] = (clusterMap[clusterId].categories[category] || 0) + 1;
            } else {
                clusterMap[clusterId].categories[category] = (clusterMap[clusterId].categories[category] || 0) + 1;
            }
        }
    });

    // 确定每个聚类的主要类别并保存
    clusterCategoryNames = {};
    Object.keys(clusterMap).forEach(clusterId => {
        const clusterData = clusterMap[clusterId];
        if (Object.keys(clusterData.categories).length > 0) {
            const sortedCategories = Object.entries(clusterData.categories)
                .sort((a, b) => b[1] - a[1]);
            // 使用中性化的类别名称（TRIZ方向名称已经是中性化的）
            clusterCategoryNames[clusterId] = sortedCategories[0][0];
        } else {
            clusterCategoryNames[clusterId] = '未分类';
        }
    });
}

// 颜色插值函数（从颜色1渐变到颜色2）
function interpolateColor(color1, color2, factor) {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// 处理鼠标按下事件（用于拖动）
function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    dragStartPos.x = x;
    dragStartPos.y = y;
    wasDragging = false;

    // 查找点击的气泡
    for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];
        const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
        if (distance < bubble.radius) {
            isDragging = true;
            dragBubble = bubble;
            dragOffset.x = x - bubble.x;
            dragOffset.y = y - bubble.y;
            // 将气泡移到最上层
            bubbles.splice(i, 1);
            bubbles.push(bubble);
            canvas.style.cursor = 'grabbing';
            return;
        }
    }
}

// 处理鼠标移动事件（拖动中）
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDragging && dragBubble) {
        // 检查是否真的移动了（超过5px才算拖动）
        const moveDistance = Math.sqrt((x - dragStartPos.x) ** 2 + (y - dragStartPos.y) ** 2);
        if (moveDistance > 5) {
            wasDragging = true;
        }

        // 更新气泡位置
        dragBubble.x = x - dragOffset.x;
        dragBubble.y = y - dragOffset.y;

        // 边界检测，防止拖出画布
        const size = getCanvasSize();
        dragBubble.x = Math.max(dragBubble.radius, Math.min(size.width - dragBubble.radius, dragBubble.x));
        dragBubble.y = Math.max(dragBubble.radius, Math.min(size.height - dragBubble.radius, dragBubble.y));

        drawBubbles();
    } else {
        // 检查是否悬停在气泡上
        let hovering = false;
        for (const bubble of bubbles) {
            const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
            if (distance < bubble.radius) {
                hovering = true;
                break;
            }
        }
        canvas.style.cursor = hovering ? 'grab' : 'default';
    }
}

// 处理鼠标释放事件
function handleMouseUp(event) {
    if (isDragging) {
        isDragging = false;
        dragBubble = null;
        canvas.style.cursor = 'default';
        // wasDragging 在点击事件中重置
    }
}

// 处理点击事件（查看详情，但不触发拖动）
function handleCanvasClick(event) {
    // 如果刚刚拖动过，不触发点击事件
    if (wasDragging) {
        wasDragging = false;
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let clicked = null;
    bubbles.forEach(bubble => {
        const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
        if (distance < bubble.radius) {
            clicked = bubble;
        }
    });

    if (clicked) {
        selectedBubble = clicked;
        showIdeaDetail(clicked.idea);
        drawBubbles();
    }
}

// 显示 Idea 详情
function showIdeaDetail(idea) {
    const detailPanel = document.getElementById('detailPanel');

    // 生成 AI 建议
    const suggestions = generateAISuggestions(idea);

    detailPanel.innerHTML = `
        <div class="detail-content">
            <h2>${idea.title}</h2>

            <div class="detail-section">
                <h3>📝 描述</h3>
                <p>${idea.description}</p>
            </div>

            <div class="detail-section">
                <h3>🏷️ 分类</h3>
                <p>${idea.category}</p>
            </div>

            <div class="detail-section">
                <h3>🔖 标签</h3>
                <div class="detail-tags">
                    ${idea.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h3>👤 提出者</h3>
                <p>${idea.author}</p>
            </div>

            <div class="detail-section">
                <h3>🤖 AI 发散建议</h3>
                <ul class="ai-suggestions">
                    ${suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>

            <button class="btn-primary" style="width: 100%; margin-top: 20px;"
                    onclick="alert('展开详细讨论（演示版）')">
                展开详细讨论
            </button>
        </div>
    `;
}

// 生成 AI 建议
function generateAISuggestions(idea) {
    const suggestionTemplates = [
        `可以考虑将${idea.title}与机器学习结合，实现更智能的预测`,
        `建议为${idea.title}添加数据可视化功能，提升用户体验`,
        `可以探索${idea.title}在移动端的应用场景`,
        `考虑${idea.title}的安全性和隐私保护机制`,
        `建议进行${idea.title}的用户调研，验证需求`,
        `可以将${idea.title}模块化，便于后续扩展`,
        `探索${idea.title}与第三方服务的集成可能性`,
        `考虑${idea.title}的性能优化和响应速度`,
        `建议为${idea.title}设计A/B测试方案`,
        `可以研究${idea.title}的商业化变现模式`
    ];

    // 随机选择3条建议
    const shuffled = suggestionTemplates.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

// AI 问题分析（调用TRIZ引擎）
function analyzeProblem() {
    const problemText = document.getElementById('problemInput').value.trim();
    if (!problemText) {
        alert('请输入问题描述');
        return;
    }

    // 检查 AI 调用限制
    if (typeof checkFeatureLimit !== 'undefined') {
        const limit = checkFeatureLimit('aiCalls');
        if (!limit.allowed) {
            if (typeof showUpgradePrompt !== 'undefined') {
                showUpgradePrompt('aiCalls');
            } else {
                alert('AI 调用次数已达上限，请升级套餐以使用更多 AI 功能');
            }
            return;
        }

        // 如果通过限制检查，增加已使用次数（模拟）
        if (typeof getCurrentSubscription !== 'undefined') {
            const sub = getCurrentSubscription();
            if (sub && typeof sub.aiCallsUsed !== 'undefined') {
                if (typeof currentSubscription !== 'undefined') {
                    currentSubscription.aiCallsUsed = (currentSubscription.aiCallsUsed || 0) + 1;
                }
            }
        }
    }

    // 显示加载状态
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);"><div style="font-size: 48px; margin-bottom: 16px;">🤖</div><div>AI 正在分析问题结构与冲突点...</div></div>';

    // 模拟延迟（实际是同步调用TRIZ引擎）
    setTimeout(() => {
        // 调用TRIZ引擎（底层）
        const analysis = analyzeProblemWithTRIZ(problemText);

        // 理想解分析
        const idealSolution = typeof analyzeIdealSolution !== 'undefined'
            ? analyzeIdealSolution(problemText, analysis)
            : null;

        // 展示结果（用户只看到AI分析，看不到TRIZ）
        displayAnalysisResult(analysis, idealSolution);

        // 基于方向生成想法
        generateIdeasFromDirections(analysis.directions);
    }, 1500);
}

// 展示分析结果（增强版：包含理想解分析）
function displayAnalysisResult(analysis, idealSolution) {
    const resultDiv = document.getElementById('analysisResult');

    // 冲突点展示
    const conflictList = analysis.conflicts.length > 0
        ? analysis.conflicts.map(c =>
            `<li style="margin-bottom: 8px; padding: 12px; background: rgba(91, 79, 232, 0.05); border-radius: 8px; border-left: 3px solid var(--primary-color);">
                <strong>改善 ${c.improveName}</strong> 时，<strong>${c.deteriorateName}</strong> 可能受到影响
            </li>`
        ).join('')
        : '<li style="color: var(--text-secondary);">未检测到明显的技术矛盾</li>';

    // 理想解分析展示
    const idealSolutionSection = idealSolution ? `
        <div style="margin-bottom: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; color: white;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                ✨ 理想解（IFR）分析
            </h3>
            <p style="margin-bottom: 16px; line-height: 1.8; opacity: 0.95;">
                ${idealSolution.description}
            </p>
            <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                <strong style="display: block; margin-bottom: 8px;">理想解的关键特征：</strong>
                <ul style="margin: 0; padding-left: 20px; opacity: 0.9;">
                    ${idealSolution.keyPoints.map(point => `<li style="margin-bottom: 4px;">${point}</li>`).join('')}
                </ul>
            </div>
            ${idealSolution.suggestions && idealSolution.suggestions.length > 0 ? `
                <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 12px;">
                    <strong style="display: block; margin-bottom: 8px;">实现建议：</strong>
                    <ul style="margin: 0; padding-left: 20px; opacity: 0.9;">
                        ${idealSolution.suggestions.slice(0, 3).map(s => `<li style="margin-bottom: 4px;">${s.suggestion}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    ` : '';

    // 优化推荐顺序
    const optimizedDirections = optimizeDirectionRecommendation([...analysis.directions]);

    // 探索方向展示（中性化）
    const directionsList = optimizedDirections.map((dir, index) => {
        const frequency = getDirectionFrequency();
        const key = `${dir.name}_${dir.id}`;
        const selectCount = frequency[key] || 0;
        const isFrequent = selectCount > 0;

        return `
        <div class="direction-card" style="background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative;"
             onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-2px)'"
             onmouseout="this.style.boxShadow='none'; this.style.transform='translateY(0)'">
            ${isFrequent ? `<div style="position: absolute; top: 12px; right: 12px; background: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">常用</div>` : ''}
            <div style="display: flex; align-items: start; gap: 16px;">
                <div style="font-size: 32px; flex-shrink: 0;">${getDirectionIcon(dir.name)}</div>
                <div style="flex: 1;">
                    <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--primary-color);">
                        ${dir.name}
                    </h4>
                    <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
                        ${dir.description}
                    </p>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn-secondary" style="padding: 6px 16px; font-size: 13px;" onclick="showDirectionDetail('${dir.name}', ${dir.id})">
                            查看详情
                        </button>
                        <button class="btn-primary" style="padding: 6px 16px; font-size: 13px;" onclick="exploreDirection('${dir.name}', ${dir.id})">
                            探索此方向 →
                        </button>
                        <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);"
                                onclick="toggleDirectionCompare('${dir.name}', ${dir.id})" title="添加到对比">
                            ⚖️ 对比
                        </button>
                        <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid var(--border-color);"
                                onclick="showTRIZPrinciple(${dir.id})" title="了解TRIZ原理">
                            📚 TRIZ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');

    resultDiv.innerHTML = `
        ${idealSolutionSection}

        <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                🤖 AI 检测到的冲突点
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
                ${conflictList}
            </ul>
        </div>

        <div>
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                🤖 AI 为你识别了 ${analysis.directions.length} 个关键探索方向
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px;">
                ${directionsList}
            </div>
        </div>
    `;
}

// 获取方向图标
function getDirectionIcon(directionName) {
    const iconMap = {
        '模块化': '🧩',
        '局部强化': '⚡',
        '差异化设计': '🎨',
        '非对称优化': '🔀',
        '功能整合': '🔗',
        '一物多用': '🔄',
        '层次化结构': '📚',
        '平衡设计': '⚖️',
        '预防性设计': '🛡️',
        '预置优化': '⏰',
        '风险预防': '⚠️',
        '均衡设计': '⚖️',
        '逆向思维': '🔄',
        '柔性结构': '🌊',
        '自适应调节': '🎯',
        '适度设计': '📏',
        '空间扩展': '📐',
        '振动利用': '📳',
        '周期性优化': '⏱️',
        '持续优化': '📈',
        '快速处理': '⚡',
        '转化利用': '🔄',
        '反馈机制': '🔁',
        '中介引入': '🔀',
        '自我服务': '🤖',
        '资源再利用': '♻️',
        '成本优化': '💰',
        '系统替代': '🔄',
        '柔性封装': '📦',
        '多孔设计': '🔲',
        '视觉优化': '🎨',
        '材料统一': '🔗',
        '可回收设计': '♻️',
        '参数优化': '📊',
        '状态转换': '🔄',
        '热效应利用': '🔥',
        '氧化增强': '💨',
        '环境控制': '🌡️',
        '材料优化': '🔬'
    };
    return iconMap[directionName] || '💡';
}

// 方向对比数据
let compareDirections = JSON.parse(localStorage.getItem('trizCompareDirections') || '[]');

// 保存对比方向
function saveCompareDirections() {
    localStorage.setItem('trizCompareDirections', JSON.stringify(compareDirections));
}

// 切换方向对比
function toggleDirectionCompare(directionName, directionId) {
    const existingIndex = compareDirections.findIndex(d => d.id === directionId);

    if (existingIndex >= 0) {
        // 移除对比
        compareDirections.splice(existingIndex, 1);
        alert(`已从对比中移除：${directionName}`);
    } else {
        // 添加到对比（最多3个）
        if (compareDirections.length >= 3) {
            alert('最多只能对比3个方向，请先移除一个');
            return;
        }
        compareDirections.push({
            name: directionName,
            id: directionId
        });
        alert(`已添加到对比：${directionName}（${compareDirections.length}/3）`);
    }

    saveCompareDirections();
    updateCompareUI();
}

// 更新对比UI
function updateCompareUI() {
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        if (compareDirections.length > 0) {
            compareBtn.style.display = 'inline-block';
            compareBtn.innerHTML = `⚖️ 对比方向 (${compareDirections.length})`;
        } else {
            compareBtn.style.display = 'none';
        }
    }
}

// 显示方向对比
function showDirectionCompare() {
    if (compareDirections.length === 0) {
        alert('请先选择要对比的方向');
        return;
    }

    // 获取方向详细信息
    const trizPrinciples = window.TRIZ_PRINCIPLES || {};
    const directions = compareDirections.map(item => {
        const principle = Object.values(trizPrinciples).find(p => p && p.neutral === item.name);
        return {
            ...item,
            description: principle ? principle.description : '',
            trizName: principle ? principle.name : ''
        };
    });

    // 创建对比模态框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };

    const compareTable = directions.map(dir => `
        <tr>
            <td style="padding: 12px; border: 1px solid var(--border-color);">
                <div style="font-size: 24px; margin-bottom: 8px;">${getDirectionIcon(dir.name)}</div>
                <strong style="font-size: 16px; color: var(--primary-color);">${dir.name}</strong>
            </td>
            <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--text-secondary);">
                ${dir.description}
            </td>
            <td style="padding: 12px; border: 1px solid var(--border-color); text-align: center;">
                <button class="btn-primary" style="padding: 6px 16px; font-size: 13px;" onclick="exploreDirection('${dir.name}', ${dir.id}); document.querySelector('.modal-overlay').remove();">
                    探索
                </button>
            </td>
        </tr>
    `).join('');

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-size: 20px; font-weight: 600; margin: 0;">⚖️ 方向对比</h2>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary);">&times;</button>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left; width: 150px;">方向</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">描述</th>
                        <th style="padding: 12px; border: 1px solid var(--border-color); text-align: center; width: 100px;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${compareTable}
                </tbody>
            </table>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="btn-secondary" onclick="compareDirections = []; saveCompareDirections(); updateCompareUI(); this.closest('.modal-overlay').remove();">
                    清空对比
                </button>
                <button class="btn-primary" onclick="this.closest('.modal-overlay').remove();">
                    关闭
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 显示TRIZ原理详情（教育功能）
function showTRIZPrinciple(principleId) {
    const trizPrinciples = window.TRIZ_PRINCIPLES || {};
    const principle = trizPrinciples[principleId];
    if (!principle) {
        alert('未找到该TRIZ原理的详细信息');
        return;
    }

    // 创建TRIZ原理详情模态框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div>
                    <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0; color: var(--primary-color);">
                        TRIZ原理 ${principleId}: ${principle.name}
                    </h2>
                    <p style="color: var(--text-secondary); font-size: 14px; margin: 0;">
                        中性化表达：${principle.neutral}
                    </p>
                </div>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary);">&times;</button>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: var(--primary-color);">📝 原理描述</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 14px;">
                    ${principle.description}
                </p>
            </div>

            ${principle.example ? `
                <div style="margin-bottom: 24px; background: #f8f9fa; border-radius: 8px; padding: 16px;">
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: var(--primary-color);">💡 应用案例</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8; font-size: 14px;">
                        ${principle.example}
                    </p>
                </div>
            ` : ''}

            ${principle.application ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: var(--primary-color);">🎯 适用场景</h3>
                    <p style="color: var(--text-secondary); line-height: 1.8; font-size: 14px;">
                        ${principle.application}
                    </p>
                </div>
            ` : ''}

            <div style="background: #e3f2fd; border-left: 4px solid var(--primary-color); padding: 12px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #1976d2; line-height: 1.6;">
                    <strong>💡 TRIZ小知识：</strong>这是TRIZ（发明问题解决理论）的40个创新原理之一。TRIZ是前苏联发明家根里奇·阿奇舒勒通过对大量专利分析总结出的系统化创新方法。
                </p>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn-primary" style="padding: 10px 20px; font-size: 14px;" onclick="exploreDirection('${principle.neutral}', ${principleId}); this.closest('.modal-overlay').remove();">
                    探索此方向 →
                </button>
                <button class="btn-secondary" style="padding: 10px 20px; font-size: 14px;" onclick="this.closest('.modal-overlay').remove();">
                    关闭
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 显示方向详情
function showDirectionDetail(directionName, directionId) {
    // 获取方向详细信息（从全局TRIZ引擎）
    const trizPrinciples = window.TRIZ_PRINCIPLES || {};
    const principle = Object.values(trizPrinciples).find(p => p && p.neutral === directionName);
    if (!principle) {
        alert('未找到该方向的详细信息');
        return;
    }

    // 获取该方向生成的想法数量
    const ideasFromDirection = ideasData.filter(idea => idea.directionId === directionId).length;

    // 获取选择频率
    const frequency = getDirectionFrequency();
    const key = `${directionName}_${directionId}`;
    const selectCount = frequency[key] || 0;

    // 创建详情模态框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="font-size: 48px;">${getDirectionIcon(directionName)}</div>
                    <div>
                        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px 0; color: var(--primary-color);">
                            ${directionName}
                        </h2>
                        <p style="color: var(--text-secondary); font-size: 14px; margin: 0;">
                            TRIZ原理：${principle.name}
                        </p>
                    </div>
                </div>
                <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-secondary);">&times;</button>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">📝 方向描述</h3>
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 14px;">
                    ${principle.description}
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${selectCount}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">选择次数</div>
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${ideasFromDirection}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">生成想法</div>
                </div>
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${selectCount > 0 ? '常用' : '新方向'}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">使用状态</div>
                </div>
            </div>

            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn-primary" style="padding: 10px 20px; font-size: 14px;" onclick="exploreDirection('${directionName}', ${directionId}); this.closest('.modal-overlay').remove();">
                    探索此方向 →
                </button>
                <button class="btn-secondary" style="padding: 10px 20px; font-size: 14px;" onclick="toggleDirectionCompare('${directionName}', ${directionId}); this.closest('.modal-overlay').remove();">
                    ⚖️ 添加到对比
                </button>
                <button class="btn-secondary" style="padding: 10px 20px; font-size: 14px;" onclick="showTRIZPrinciple(${directionId}); this.closest('.modal-overlay').remove();">
                    📚 了解TRIZ原理
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// 探索方向（生成想法）- 增强版：基于上下文动态生成
function exploreDirection(directionName, directionId) {
    // 记录用户选择
    saveDirectionHistory(directionName, directionId);

    // 获取当前问题上下文（如果存在）
    const problemInput = document.getElementById('problemInput');
    const problemContext = problemInput ? problemInput.value.trim() : '';

    // 基于方向生成想法
    const newIdeas = [];

    // 为每个方向定义丰富的想法模板库（更自然、更具体）
    const ideaTemplates = {
        '模块化': [
            { title: '组件化架构设计', desc: '将系统拆分为独立的功能模块，每个模块负责特定功能，便于独立开发、测试和维护，降低系统耦合度' },
            { title: '插件式扩展机制', desc: '采用插件架构，允许第三方开发者扩展功能，核心系统保持轻量，新功能以插件形式动态加载' },
            { title: '微服务架构重构', desc: '将单体应用拆分为多个微服务，每个服务独立部署和扩展，提高系统的可维护性和可扩展性' },
            { title: '模块间标准化接口', desc: '定义清晰的模块接口规范，确保模块间通信标准化，便于替换和升级单个模块而不影响整体' },
            { title: '分层模块设计', desc: '按照业务逻辑、数据处理、界面展示等层次划分模块，每层职责明确，便于团队协作开发' }
        ],
        '局部强化': [
            { title: '关键路径性能优化', desc: '识别系统的关键性能瓶颈点，集中资源优化这些核心路径，以最小投入获得最大性能提升' },
            { title: '热点数据缓存策略', desc: '对频繁访问的数据实施缓存机制，减少重复计算和数据库查询，显著提升响应速度' },
            { title: '核心功能优先开发', desc: '优先完善和优化核心业务功能，确保主要用户需求得到高质量满足，次要功能可后续迭代' },
            { title: '关键节点监控增强', desc: '在系统关键节点部署详细监控，实时掌握系统状态，快速定位和解决潜在问题' },
            { title: '重点区域资源倾斜', desc: '将计算资源、带宽等优先分配给高价值业务区域，确保核心服务稳定运行' }
        ],
        '差异化设计': [
            { title: '个性化配置系统', desc: '为不同用户群体提供差异化的功能配置和界面布局，满足多样化需求，提升用户满意度' },
            { title: '分级功能策略', desc: '根据用户等级或使用场景提供不同级别的功能，免费用户基础功能，付费用户高级功能' },
            { title: '场景化界面适配', desc: '针对不同使用场景（移动端、桌面端、大屏）设计差异化的界面和交互方式，优化各场景体验' },
            { title: '多模式运行机制', desc: '系统支持多种运行模式（性能模式、省电模式、平衡模式），用户可根据需求选择' },
            { title: '定制化工作流', desc: '允许用户根据自身工作习惯定制工作流程和功能组合，打造专属的个性化体验' }
        ],
        '非对称优化': [
            { title: '读写分离架构', desc: '将读操作和写操作分离到不同的服务器，读多写少的场景下大幅提升系统吞吐量' },
            { title: '非对称加密方案', desc: '采用非对称加密算法，公钥加密私钥解密，提高数据传输安全性，同时简化密钥管理' },
            { title: '主从节点设计', desc: '设计主节点负责写入，从节点负责读取的非对称架构，提高系统并发处理能力' },
            { title: '差异化缓存策略', desc: '对热点数据和冷数据采用不同的缓存策略，热点数据长期缓存，冷数据按需加载' },
            { title: '非对称负载均衡', desc: '根据服务器性能差异分配不同权重，高性能服务器承担更多负载，优化资源利用' }
        ],
        '功能整合': [
            { title: '一站式服务平台', desc: '整合多个相关功能到统一平台，用户无需切换多个系统，提升工作效率和用户体验' },
            { title: '统一身份认证', desc: '整合多个系统的登录认证，用户一次登录即可访问所有关联服务，简化操作流程' },
            { title: '数据中台建设', desc: '整合各业务系统的数据，建立统一的数据中台，提供标准化的数据服务，避免数据孤岛' },
            { title: '功能模块合并', desc: '将功能相似或关联的模块合并，减少重复代码，降低维护成本，提高开发效率' },
            { title: '跨平台统一体验', desc: '整合不同平台的功能，提供统一的用户界面和交互体验，降低学习成本' }
        ],
        '一物多用': [
            { title: '多功能工具组件', desc: '设计一个组件同时具备多种功能，如一个按钮既可用于提交又可显示状态，减少界面元素' },
            { title: '数据复用机制', desc: '同一份数据在不同场景下复用，如用户信息既用于展示又用于权限控制，减少数据冗余' },
            { title: '通用接口设计', desc: '设计通用接口同时支持多种操作模式，一个接口处理多种业务场景，简化系统架构' },
            { title: '多角色权限系统', desc: '一个用户账号可同时拥有多种角色，在不同场景下自动切换权限，灵活高效' },
            { title: '智能上下文感知', desc: '系统根据当前上下文自动切换功能模式，一个界面在不同场景下呈现不同功能' }
        ],
        '层次化结构': [
            { title: '分层架构设计', desc: '采用经典的分层架构（表现层、业务层、数据层），每层职责清晰，便于维护和扩展' },
            { title: '多级缓存体系', desc: '建立多级缓存（本地缓存、分布式缓存、CDN），逐级命中，最大化缓存效果' },
            { title: '权限层级管理', desc: '设计多级权限体系，从系统级到功能级到数据级，精细控制访问权限' },
            { title: '数据分层存储', desc: '根据数据访问频率和重要性分层存储，热数据SSD，温数据HDD，冷数据归档，优化成本' },
            { title: '服务分层调用', desc: '将服务按重要性分层，核心服务优先保障，次要服务可降级，提高系统整体稳定性' }
        ],
        '平衡设计': [
            { title: '性能与成本平衡', desc: '在系统性能和运营成本之间找到平衡点，通过智能调度和资源复用，实现最优性价比' },
            { title: '功能与复杂度平衡', desc: '在功能丰富度和系统复杂度之间平衡，核心功能优先，避免过度设计' },
            { title: '安全与便利平衡', desc: '在安全性和使用便利性之间平衡，采用多因素认证但简化流程，兼顾安全与体验' },
            { title: '实时性与准确性平衡', desc: '在实时响应和数据准确性之间平衡，关键数据实时同步，非关键数据异步处理' },
            { title: '集中与分布式平衡', desc: '在集中管理和分布式部署之间平衡，核心数据集中，边缘计算分布式，兼顾效率与扩展' }
        ],
        '预防性设计': [
            { title: '健康检查机制', desc: '定期对系统各组件进行健康检查，提前发现潜在问题，预防故障发生' },
            { title: '容量预警系统', desc: '监控系统资源使用情况，当接近阈值时提前预警，自动扩容或通知管理员，避免服务中断' },
            { title: '数据备份策略', desc: '建立自动化的数据备份机制，定期备份关键数据，预防数据丢失风险' },
            { title: '异常监控告警', desc: '部署全面的异常监控系统，实时检测异常模式，提前预警潜在风险' },
            { title: '降级预案设计', desc: '预先设计系统降级方案，当负载过高时自动启用，保障核心功能可用' }
        ],
        '预置优化': [
            { title: '预加载机制', desc: '预测用户下一步操作，提前加载相关数据和资源，减少等待时间，提升响应速度' },
            { title: '预热缓存策略', desc: '系统启动时预加载热点数据到缓存，避免冷启动时的性能瓶颈' },
            { title: '预编译优化', desc: '对常用查询和计算进行预编译和优化，运行时直接使用，提升执行效率' },
            { title: '预分配资源池', desc: '预先分配和初始化资源池（连接池、线程池），避免运行时动态分配带来的延迟' },
            { title: '预配置模板', desc: '提供常用配置模板，用户快速选择即可完成配置，降低使用门槛' }
        ],
        '风险预防': [
            { title: '多重验证机制', desc: '在关键操作前进行多重验证（身份、权限、二次确认），降低误操作和恶意操作风险' },
            { title: '数据校验增强', desc: '在数据输入、传输、存储各环节加强校验，防止错误数据和恶意数据进入系统' },
            { title: '异常恢复机制', desc: '设计完善的异常处理和恢复机制，系统遇到错误时自动回滚或切换到备用方案' },
            { title: '安全审计日志', desc: '记录所有关键操作的安全审计日志，便于追溯和发现安全风险' },
            { title: '限流熔断保护', desc: '实施限流和熔断机制，防止系统过载，保护核心服务不受影响' }
        ],
        '均衡设计': [
            { title: '负载均衡策略', desc: '采用多级负载均衡，将请求均匀分配到各服务器，避免单点过载，提高系统稳定性' },
            { title: '资源均衡分配', desc: '动态监控各节点资源使用情况，自动调整资源分配，确保各节点负载均衡' },
            { title: '数据均衡分布', desc: '将数据均匀分布到多个存储节点，避免数据倾斜，提高查询和写入效率' },
            { title: '任务均衡调度', desc: '智能调度系统任务，确保各处理单元工作量均衡，最大化系统吞吐量' },
            { title: '成本效益均衡', desc: '在系统性能和运营成本之间找到最佳平衡点，实现效益最大化' }
        ],
        '逆向思维': [
            { title: '反向代理架构', desc: '采用反向代理，客户端请求先到代理服务器，由代理转发到后端，隐藏真实服务器，提升安全性' },
            { title: '倒序处理策略', desc: '对于某些场景采用倒序处理，如从最新数据开始处理，优先满足实时性需求' },
            { title: '反向索引优化', desc: '建立反向索引，从结果反推查询条件，优化复杂查询性能' },
            { title: '逆向工程分析', desc: '通过分析用户行为数据反向推导用户需求，优化产品功能和体验' },
            { title: '反向验证机制', desc: '采用反向验证，先假设操作合法，再验证异常情况，简化验证流程' }
        ],
        '柔性结构': [
            { title: '弹性伸缩架构', desc: '系统可根据负载自动伸缩，高峰期扩容，低峰期缩容，灵活应对流量变化' },
            { title: '可配置化设计', desc: '系统参数和功能高度可配置，无需修改代码即可调整行为，适应不同需求' },
            { title: '插件化扩展', desc: '采用插件化架构，新功能以插件形式添加，核心系统保持稳定，灵活扩展' },
            { title: '动态路由策略', desc: '根据实时网络状况动态调整路由，选择最优路径，提高传输效率' },
            { title: '自适应界面布局', desc: '界面根据屏幕尺寸和用户偏好自动调整布局，提供最佳显示效果' }
        ],
        '自适应调节': [
            { title: '智能负载均衡', desc: '根据服务器实时负载情况动态调整请求分配，自动将请求导向负载较低的服务器' },
            { title: '自适应缓存策略', desc: '根据数据访问模式自动调整缓存策略，热点数据长期缓存，冷数据及时淘汰' },
            { title: '动态限流机制', desc: '根据系统负载自动调整限流阈值，高负载时严格限流，低负载时放宽限制' },
            { title: '智能重试策略', desc: '根据错误类型和网络状况自动调整重试间隔和次数，提高请求成功率' },
            { title: '自适应学习算法', desc: '系统根据用户行为数据自动学习和调整推荐策略，持续优化用户体验' }
        ],
        '适度设计': [
            { title: '渐进式功能发布', desc: '新功能先小范围测试，逐步扩大范围，在稳定性和创新性之间找到平衡' },
            { title: '适度冗余设计', desc: '在关键组件设计适度冗余，既保证可靠性又不过度浪费资源' },
            { title: '分级服务质量', desc: '根据业务重要性提供不同级别的服务质量，核心业务优先保障，次要业务可降级' },
            { title: '适度缓存策略', desc: '缓存策略不过度也不不足，平衡缓存命中率和内存占用，找到最佳平衡点' },
            { title: '渐进式优化', desc: '采用渐进式优化策略，先解决主要问题，再逐步优化细节，避免过度优化' }
        ],
        '空间扩展': [
            { title: '分布式架构扩展', desc: '从单机扩展到分布式架构，通过水平扩展提升系统容量和性能' },
            { title: '多维度数据模型', desc: '将数据从单一维度扩展到多维度模型，支持更复杂的查询和分析需求' },
            { title: '云原生架构', desc: '采用云原生架构，充分利用云计算的弹性扩展能力，按需扩容' },
            { title: '多区域部署', desc: '将系统部署到多个地理区域，就近服务用户，提升响应速度和可用性' },
            { title: '多租户架构', desc: '从单租户扩展到多租户架构，一个系统服务多个客户，提高资源利用率' }
        ],
        '振动利用': [
            { title: '心跳检测机制', desc: '利用定期心跳检测监控服务状态，快速发现故障节点，保障系统可用性' },
            { title: '周期性任务调度', desc: '利用周期性任务处理定时业务，如定时报表、定时清理，自动化运维' },
            { title: '轮询更新策略', desc: '采用轮询机制定期更新数据，平衡实时性和系统负载' },
            { title: '振荡负载均衡', desc: '利用负载的周期性变化特点，在低峰期进行维护和优化，高峰期保障服务' },
            { title: '周期性数据同步', desc: '定期同步分布式数据，保持数据一致性，避免实时同步带来的性能开销' }
        ],
        '周期性优化': [
            { title: '定时任务优化', desc: '将连续运行的任务改为定时执行，在非高峰时段批量处理，降低系统负载' },
            { title: '周期性数据清理', desc: '定期清理过期数据和日志，释放存储空间，保持系统性能' },
            { title: '定时健康检查', desc: '定期检查系统健康状态，及时发现和修复问题，预防故障' },
            { title: '周期性性能优化', desc: '定期分析系统性能数据，识别瓶颈并优化，持续提升系统性能' },
            { title: '定时备份策略', desc: '按固定周期自动备份数据，保障数据安全，支持快速恢复' }
        ],
        '持续优化': [
            { title: '持续集成部署', desc: '建立CI/CD流程，代码变更自动构建、测试、部署，持续优化开发效率' },
            { title: '持续性能监控', desc: '建立持续的性能监控体系，实时掌握系统状态，持续优化性能' },
            { title: '持续用户反馈', desc: '建立用户反馈机制，持续收集和分析用户意见，迭代优化产品' },
            { title: '持续安全更新', desc: '定期更新安全补丁和防护策略，持续提升系统安全性' },
            { title: '持续数据分析', desc: '持续分析业务数据，发现优化机会，持续改进业务流程' }
        ],
        '快速处理': [
            { title: '异步处理机制', desc: '将耗时操作改为异步处理，快速响应用户请求，后台处理复杂任务' },
            { title: '快速失败策略', desc: '快速检测和报告错误，避免长时间等待，提升用户体验' },
            { title: '快速缓存响应', desc: '优先从缓存获取数据，快速响应常见请求，减少数据库压力' },
            { title: '快速降级方案', desc: '当服务异常时快速切换到降级方案，保障核心功能可用' },
            { title: '快速恢复机制', desc: '设计快速恢复流程，系统故障后能快速恢复到正常状态' }
        ],
        '转化利用': [
            { title: '错误日志分析', desc: '将错误日志转化为有价值的信息，分析错误模式，优化系统设计' },
            { title: '用户行为数据利用', desc: '将用户行为数据转化为产品优化依据，改进功能和体验' },
            { title: '冗余数据利用', desc: '将数据冗余转化为数据备份和容灾能力，提升系统可靠性' },
            { title: '系统负载波动利用', desc: '利用系统负载的波动特点，在低峰期进行维护和优化' },
            { title: '失败经验转化', desc: '将失败经验转化为预防措施和最佳实践，避免重复错误' }
        ],
        '反馈机制': [
            { title: '实时反馈系统', desc: '建立实时反馈机制，用户操作立即得到反馈，提升交互体验' },
            { title: '性能监控反馈', desc: '系统性能数据实时反馈给运维团队，快速定位和解决问题' },
            { title: '用户反馈闭环', desc: '建立用户反馈收集、分析、改进的闭环机制，持续优化产品' },
            { title: '自动调优反馈', desc: '系统根据运行数据自动调整参数，形成自我优化的反馈循环' },
            { title: 'A/B测试反馈', desc: '通过A/B测试收集用户反馈，数据驱动产品决策' }
        ],
        '中介引入': [
            { title: 'API网关设计', desc: '引入API网关作为统一入口，统一处理认证、限流、路由等横切关注点' },
            { title: '消息队列中间件', desc: '引入消息队列作为服务间通信中介，解耦服务，提高系统可扩展性' },
            { title: '配置中心', desc: '引入配置中心统一管理配置，支持动态更新，无需重启服务' },
            { title: '服务注册中心', desc: '引入服务注册中心管理服务发现和负载均衡，简化分布式系统架构' },
            { title: '数据同步中间件', desc: '引入数据同步中间件处理跨系统数据同步，保证数据一致性' }
        ],
        '自我服务': [
            { title: '自动化运维', desc: '系统自动监控、诊断、修复常见问题，减少人工干预，提高运维效率' },
            { title: '自愈系统设计', desc: '系统检测到异常时自动切换到备用方案或重启服务，实现自我恢复' },
            { title: '自动扩容缩容', desc: '系统根据负载自动扩容或缩容，无需人工干预，弹性应对流量变化' },
            { title: '自动备份恢复', desc: '系统自动定期备份数据，故障时自动恢复，保障数据安全' },
            { title: '智能资源调度', desc: '系统根据任务优先级和资源状况自动调度，优化资源利用' }
        ],
        '资源再利用': [
            { title: '对象池技术', desc: '复用数据库连接、线程等资源，避免频繁创建销毁，提升性能' },
            { title: '缓存复用机制', desc: '多个请求共享缓存数据，减少重复计算和查询，提高效率' },
            { title: '代码组件复用', desc: '提取公共代码为可复用组件，减少重复开发，提高开发效率' },
            { title: '数据模型复用', desc: '设计通用的数据模型，多个业务场景复用，降低开发成本' },
            { title: '基础设施复用', desc: '多个服务共享基础设施（数据库、缓存等），提高资源利用率' }
        ],
        '成本优化': [
            { title: '按需资源分配', desc: '根据实际需求动态分配资源，避免资源浪费，降低运营成本' },
            { title: '开源技术选型', desc: '优先选择成熟的开源技术，降低采购和维护成本' },
            { title: '云服务弹性计费', desc: '采用云服务按需付费模式，根据实际使用量计费，优化成本' },
            { title: '代码优化降本', desc: '优化代码性能，减少服务器资源消耗，降低运营成本' },
            { title: '自动化降低人力成本', desc: '通过自动化减少人工操作，降低人力成本，提高效率' }
        ],
        '系统替代': [
            { title: '微服务替代单体', desc: '用微服务架构替代单体架构，提高系统可扩展性和可维护性' },
            { title: 'NoSQL替代关系型', desc: '在合适场景用NoSQL数据库替代关系型数据库，提升性能和扩展性' },
            { title: '容器化替代传统部署', desc: '用容器化部署替代传统部署方式，提高部署效率和资源利用率' },
            { title: '事件驱动替代轮询', desc: '用事件驱动机制替代轮询机制，提高系统响应效率和资源利用率' },
            { title: 'Serverless替代传统服务', desc: '在合适场景用Serverless架构替代传统服务，降低运维成本' }
        ],
        '柔性封装': [
            { title: 'API版本管理', desc: '通过API版本控制实现向后兼容，新老版本共存，平滑升级' },
            { title: '配置化功能开关', desc: '通过配置开关控制功能启用，无需修改代码即可调整功能' },
            { title: '插件化架构', desc: '核心功能稳定，扩展功能以插件形式封装，灵活添加和移除' },
            { title: '适配器模式', desc: '通过适配器封装不同接口，统一对外提供服务，提高兼容性' },
            { title: '抽象层封装', desc: '通过抽象层封装底层实现细节，上层无需关心具体实现，便于替换' }
        ],
        '多孔设计': [
            { title: '分布式存储', desc: '数据分散存储到多个节点，提高存储容量和访问性能' },
            { title: '分片数据库', desc: '将大表分片存储，每个分片独立管理，提高查询和写入性能' },
            { title: '微服务拆分', desc: '将大系统拆分为多个微服务，每个服务独立部署，提高可扩展性' },
            { title: '分布式计算', desc: '将计算任务分散到多个节点并行处理，提高处理速度' },
            { title: '内容分发网络', desc: '将内容分发到多个边缘节点，用户就近访问，提高响应速度' }
        ],
        '视觉优化': [
            { title: '界面色彩优化', desc: '优化界面色彩搭配，提高可读性和美观度，提升用户体验' },
            { title: '信息层次可视化', desc: '通过颜色、大小、位置等视觉元素区分信息层次，提高信息传达效率' },
            { title: '状态可视化反馈', desc: '通过颜色变化、动画等视觉反馈展示系统状态，提升交互体验' },
            { title: '数据可视化展示', desc: '将复杂数据转化为图表等可视化形式，提高数据理解效率' },
            { title: '主题切换功能', desc: '支持多种视觉主题切换，满足不同用户偏好，提升用户体验' }
        ],
        '材料统一': [
            { title: '统一技术栈', desc: '全栈采用统一的技术栈，降低学习成本，提高开发效率' },
            { title: '统一数据格式', desc: '系统内统一使用标准数据格式（JSON、XML等），简化数据交换' },
            { title: '统一编码规范', desc: '制定统一的编码规范，提高代码可读性和可维护性' },
            { title: '统一接口标准', desc: '定义统一的接口标准，各模块遵循相同规范，便于集成' },
            { title: '统一日志格式', desc: '采用统一的日志格式，便于日志分析和问题定位' }
        ],
        '可回收设计': [
            { title: '资源自动回收', desc: '系统自动回收不再使用的资源（内存、连接等），避免资源泄漏' },
            { title: '数据归档机制', desc: '将历史数据归档到低成本存储，释放主存储空间，需要时可恢复' },
            { title: '代码重构复用', desc: '定期重构代码，提取可复用部分，提高代码质量' },
            { title: '容器资源回收', desc: '容器销毁时自动回收资源，支持快速创建和销毁，提高资源利用率' },
            { title: '临时数据清理', desc: '自动清理临时文件和缓存数据，释放存储空间' }
        ],
        '参数优化': [
            { title: '性能参数调优', desc: '根据实际运行情况调整系统参数（缓存大小、线程数等），优化性能' },
            { title: '算法参数优化', desc: '通过实验找到算法最优参数，提高算法效果' },
            { title: '数据库参数调优', desc: '优化数据库配置参数，提高查询和写入性能' },
            { title: '网络参数优化', desc: '调整网络相关参数（超时时间、重试次数等），提高网络请求成功率' },
            { title: '业务参数配置化', desc: '将业务参数配置化，无需修改代码即可调整业务规则' }
        ],
        '状态转换': [
            { title: '状态机设计', desc: '使用状态机管理对象状态转换，状态转换逻辑清晰，便于维护' },
            { title: '工作流引擎', desc: '通过工作流引擎管理业务流程状态转换，支持复杂业务流程' },
            { title: '生命周期管理', desc: '明确定义对象生命周期各阶段，规范状态转换流程' },
            { title: '状态持久化', desc: '将状态信息持久化存储，系统重启后能恢复之前状态' },
            { title: '状态同步机制', desc: '在分布式系统中同步状态变更，保证各节点状态一致' }
        ],
        '热效应利用': [
            { title: '热点数据识别', desc: '识别系统中的热点数据，优先缓存和优化，提高访问效率' },
            { title: '热更新机制', desc: '支持热更新，无需重启服务即可更新代码和配置，提高可用性' },
            { title: '热备切换', desc: '主备系统热切换，故障时快速切换到备用系统，保障服务连续性' },
            { title: '热点功能优化', desc: '重点优化高频使用的功能，以最小投入获得最大性能提升' },
            { title: '热数据分层', desc: '根据数据访问热度分层存储，热数据快速访问，冷数据低成本存储' }
        ],
        '氧化增强': [
            { title: '功能增强机制', desc: '通过插件、扩展等方式增强系统功能，无需修改核心代码' },
            { title: '性能增强优化', desc: '通过缓存、索引、算法优化等方式增强系统性能' },
            { title: '安全增强措施', desc: '通过多重认证、加密、审计等方式增强系统安全性' },
            { title: '体验增强设计', desc: '通过界面优化、交互改进等方式增强用户体验' },
            { title: '能力增强扩展', desc: '通过集成第三方服务、API等方式增强系统能力' }
        ],
        '环境控制': [
            { title: '多环境管理', desc: '统一管理开发、测试、生产等多环境，环境隔离，配置独立' },
            { title: '环境变量配置', desc: '通过环境变量控制系统行为，不同环境使用不同配置' },
            { title: '容器环境隔离', desc: '使用容器技术实现环境隔离，每个服务运行在独立环境中' },
            { title: '环境监控告警', desc: '监控各环境运行状态，异常时及时告警，保障环境稳定' },
            { title: '环境自动化部署', desc: '自动化部署到各环境，减少人工操作，提高部署效率' }
        ],
        '材料优化': [
            { title: '技术选型优化', desc: '选择最适合的技术栈，平衡性能、成本、可维护性等因素' },
            { title: '数据结构优化', desc: '选择合适的数据结构，提高数据操作效率' },
            { title: '算法优化', desc: '选择或设计更优的算法，提高计算效率' },
            { title: '框架选型', desc: '选择成熟稳定的框架，提高开发效率和系统稳定性' },
            { title: '依赖库优化', desc: '选择轻量、高效的依赖库，减少系统体积和性能开销' }
        ]
    };

    // 获取当前方向的模板，如果没有则使用通用模板
    let templates = ideaTemplates[directionName] || [
        { title: `${directionName}方案 1`, desc: `通过${directionName}来解决当前问题，提升系统性能` },
        { title: `${directionName}方案 2`, desc: `采用${directionName}优化用户体验，降低系统复杂度` },
        { title: `${directionName}方案 3`, desc: `运用${directionName}提高系统可靠性，增强适应性` },
        { title: `${directionName}方案 4`, desc: `利用${directionName}降低成本，优化资源配置` }
    ];

    // 基于问题上下文动态调整想法描述
    if (problemContext && problemContext.length > 10) {
        // 提取问题中的关键词
        const contextKeywords = extractContextKeywords(problemContext);

        // 为每个模板注入上下文信息
        templates = templates.map(template => {
            let enhancedDesc = template.desc;

            // 如果描述中包含通用词汇，尝试替换为上下文相关词汇
            if (contextKeywords.length > 0) {
                const keyword = contextKeywords[0];
                enhancedDesc = enhancedDesc.replace(/系统|问题|当前问题/g, keyword);
            }

            // 如果模板标题是通用的，也进行替换
            let enhancedTitle = template.title;
            if (enhancedTitle.includes('方案') && contextKeywords.length > 0) {
                enhancedTitle = `${contextKeywords[0]}的${directionName}${enhancedTitle.replace(/方案.*/, '方案')}`;
            }

            return {
                title: enhancedTitle,
                desc: enhancedDesc
            };
        });
    }

    // 随机选择4-5个想法（如果模板足够）
    const selectedTemplates = templates.length >= 4
        ? templates.sort(() => Math.random() - 0.5).slice(0, 4)
        : templates;

    // 生成想法
    selectedTemplates.forEach((template, index) => {
        newIdeas.push({
            id: ideasData.length + newIdeas.length + 1,
            title: template.title,
            description: template.desc,
            category: directionName,
            tags: [directionName, 'AI推荐', 'TRIZ方向'],
            author: 'AI',
            cluster: Math.floor(Math.random() * 3),
            directionId: directionId,
            isFromTRIZ: true
        });
    });

    // 添加到ideasData
    ideasData.push(...newIdeas);

    // 重新初始化气泡并聚类
    initBubbles();
    performClustering();

    // 更新对比UI
    updateCompareUI();

    // 滚动到气泡视图
    document.querySelector('.idea-cluster-view').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // 显示提示
    alert(`已基于"${directionName}"方向生成了 ${newIdeas.length} 个想法，请查看下方的气泡视图`);
}

// 提取上下文关键词（用于动态生成想法）
function extractContextKeywords(text) {
    // 提取名词和关键概念
    const keywords = [];
    const sentences = text.split(/[。，、；！？\n]/);

    // 常见的技术和业务关键词
    const techKeywords = ['系统', '应用', '平台', '服务', '功能', '性能', '数据', '用户', '界面', '接口', '架构', '模块'];

    sentences.forEach(sentence => {
        techKeywords.forEach(keyword => {
            if (sentence.includes(keyword) && !keywords.includes(keyword)) {
                keywords.push(keyword);
            }
        });

        // 提取2-4字的名词短语
        const nounPattern = /[\u4e00-\u9fa5]{2,4}/g;
        let match;
        while ((match = nounPattern.exec(sentence)) !== null && keywords.length < 5) {
            const word = match[0];
            if (!keywords.includes(word) && word.length >= 2) {
                keywords.push(word);
            }
        }
    });

    return keywords.slice(0, 3); // 返回前3个关键词
}

// 基于方向生成想法（从分析结果调用）
function generateIdeasFromDirections(directions) {
    // 这个方法会在分析完成后自动调用
    // 用户可以选择性地探索方向，所以这里不自动生成
    // 只在用户点击"探索此方向"时生成
}

// 导出全局函数
window.analyzeProblem = analyzeProblem;
window.exploreDirection = exploreDirection;
window.showDirectionDetail = showDirectionDetail;
window.showTRIZPrinciple = showTRIZPrinciple;
window.toggleDirectionCompare = toggleDirectionCompare;
window.showDirectionCompare = showDirectionCompare;
window.updateCompareUI = updateCompareUI;

// 气泡浮动动画（可选）
function startBubbleAnimation() {
    setInterval(() => {
        const size = getCanvasSize();
        bubbles.forEach(bubble => {
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            // 边界检测
            if (bubble.x < bubble.radius || bubble.x > size.width - bubble.radius) {
                bubble.vx *= -1;
            }
            if (bubble.y < bubble.radius || bubble.y > size.height - bubble.radius) {
                bubble.vy *= -1;
            }
        });

        drawBubbles();
    }, 50);
}
