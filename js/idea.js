// AI Idea 中心功能

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
            clusterMap[clusterId].categories[category] = (clusterMap[clusterId].categories[category] || 0) + 1;
        }
    });
    
    // 确定每个聚类的主要类别并保存
    clusterCategoryNames = {};
    Object.keys(clusterMap).forEach(clusterId => {
        const clusterData = clusterMap[clusterId];
        if (Object.keys(clusterData.categories).length > 0) {
            const sortedCategories = Object.entries(clusterData.categories)
                .sort((a, b) => b[1] - a[1]);
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

