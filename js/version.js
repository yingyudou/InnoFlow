// 版本控制功能

// 版本数据（模拟）
const versionsData = [
    {
        version: 'v1.2.0',
        hash: 'a3f5c21',
        author: '张伟',
        date: '2025-11-01 15:30',
        message: '添加语音控制功能',
        branch: 'main',
        x: 100,
        y: 100
    },
    {
        version: 'v1.1.5',
        hash: 'b7e9d44',
        author: '李娜',
        date: '2025-10-28 10:20',
        message: '修复设备连接问题',
        branch: 'main',
        x: 100,
        y: 180
    },
    {
        version: 'v1.1.4',
        hash: 'c2a8f33',
        author: '王强',
        date: '2025-10-25 14:45',
        message: '优化UI界面',
        branch: 'feature-ui',
        x: 250,
        y: 220
    },
    {
        version: 'v1.1.3',
        hash: 'd5b3e66',
        author: '刘洋',
        date: '2025-10-22 09:15',
        message: '添加数据监控功能',
        branch: 'main',
        x: 100,
        y: 260
    },
    {
        version: 'v1.1.2',
        hash: 'e8c4d77',
        author: '陈晨',
        date: '2025-10-20 16:50',
        message: '集成第三方API',
        branch: 'feature-api',
        x: 250,
        y: 300
    },
    {
        version: 'v1.1.1',
        hash: 'f1d9e88',
        author: '赵敏',
        date: '2025-10-18 11:30',
        message: '性能优化',
        branch: 'develop',
        x: 400,
        y: 260
    },
    {
        version: 'v1.1.0',
        hash: 'g3e2f99',
        author: '孙涛',
        date: '2025-10-15 13:25',
        message: '场景联动功能上线',
        branch: 'main',
        x: 100,
        y: 340
    },
    {
        version: 'v1.0.9',
        hash: 'h6f5g11',
        author: '周杰',
        date: '2025-10-12 08:40',
        message: '修复安全漏洞',
        branch: 'main',
        x: 100,
        y: 420
    }
];

let canvas, ctx;
let selectedVersion = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('versionCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // 事件监听
    canvas.addEventListener('click', handleCanvasClick);
    document.getElementById('branchSelect').addEventListener('change', handleBranchChange);
    window.addEventListener('resize', resizeCanvas);
    
    // 延迟初始化，确保Canvas已完全渲染
    setTimeout(() => {
        // 初始化Canvas尺寸（支持高分辨率）
        resizeCanvas();
    }, 100);
});

// 获取Canvas显示尺寸（CSS像素）
function getCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
}

// 调整Canvas大小（支持高分辨率屏幕）
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // 如果Canvas还没有渲染完成，使用默认值
    const defaultWidth = rect.width || 1000;
    
    // 计算所需的内容高度（基于版本数据）
    const maxY = Math.max(...versionsData.map(v => v.y)) + 100; // 加上标签和边距
    const minY = Math.min(...versionsData.map(v => v.y)) - 50;
    const contentHeight = Math.max(600, maxY - minY + 100);
    
    // 计算所需的内容宽度（基于版本数据）
    const maxX = Math.max(...versionsData.map(v => v.x + 350)); // 加上标签宽度（约350px）
    const contentWidth = Math.max(defaultWidth, maxX + 50);
    
    // 设置Canvas实际像素（考虑设备像素比）
    canvas.width = contentWidth * dpr;
    canvas.height = contentHeight * dpr;
    
    // 设置Canvas显示尺寸（CSS像素）
    canvas.style.width = contentWidth + 'px';
    canvas.style.height = contentHeight + 'px';
    
    // 重置变换矩阵
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // 缩放绘图上下文以匹配设备像素比
    ctx.scale(dpr, dpr);
    
    // 重新绘制
    if (versionsData.length > 0) {
        drawVersionTree();
    }
}

// 绘制版本树
function drawVersionTree() {
    const size = getCanvasSize();
    ctx.clearRect(0, 0, size.width, size.height);
    
    // 绘制连线
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < versionsData.length - 1; i++) {
        const current = versionsData[i];
        const next = versionsData[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        
        if (current.branch === next.branch) {
            ctx.lineTo(next.x, next.y);
        } else {
            // 分支连线
            ctx.bezierCurveTo(
                current.x, current.y + 40,
                next.x, next.y - 40,
                next.x, next.y
            );
        }
        
        ctx.stroke();
    }
    
    // 绘制节点
    versionsData.forEach(version => {
        drawVersionNode(version);
    });
}

// 绘制版本节点
function drawVersionNode(version) {
    const radius = 25;
    const isSelected = selectedVersion && selectedVersion.hash === version.hash;
    
    // 外圈
    if (isSelected) {
        ctx.beginPath();
        ctx.arc(version.x, version.y, radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#5B4FE8';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // 节点圆圈
    ctx.beginPath();
    ctx.arc(version.x, version.y, radius, 0, Math.PI * 2);
    
    // 根据分支设置颜色
    const branchColors = {
        'main': '#5B4FE8',
        'develop': '#00D4AA',
        'feature-ui': '#F03D8E',
        'feature-api': '#FF9F1C'
    };
    
    ctx.fillStyle = branchColors[version.branch] || '#6B7280';
    ctx.fill();
    
    // 版本号文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(version.version, version.x, version.y);
    
    // 信息标签
    ctx.fillStyle = '#1A1A2E';
    ctx.font = '13px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`${version.author}`, version.x + 40, version.y - 10);
    
    ctx.fillStyle = '#6B7280';
    ctx.font = '11px Inter';
    ctx.fillText(version.date, version.x + 40, version.y + 8);
    
    ctx.font = '12px Inter';
    ctx.fillText(version.message, version.x + 40, version.y + 25);
}

// 处理点击事件
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    // 由于已经scale了上下文，坐标直接使用CSS像素
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    let clicked = null;
    versionsData.forEach(version => {
        const distance = Math.sqrt((x - version.x) ** 2 + (y - version.y) ** 2);
        if (distance < 25) {
            clicked = version;
        }
    });
    
    if (clicked) {
        selectedVersion = clicked;
        showVersionDetail(clicked);
        drawVersionTree();
    }
}

// 显示版本详情
function showVersionDetail(version) {
    const modal = document.getElementById('versionModal');
    const modalBody = document.getElementById('modalBody');
    
    // 生成变更文件列表
    const files = generateMockFiles();
    
    modalBody.innerHTML = `
        <div class="modal-row">
            <div class="modal-label">版本号</div>
            <div class="modal-value">
                <span class="version-badge">${version.version}</span>
            </div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">提交哈希</div>
            <div class="modal-value">
                <span class="commit-hash">${version.hash}</span>
            </div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">提交者</div>
            <div class="modal-value">${version.author}</div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">提交时间</div>
            <div class="modal-value">${version.date}</div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">分支</div>
            <div class="modal-value">${version.branch}</div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">提交信息</div>
            <div class="modal-value">${version.message}</div>
        </div>
        
        <div class="modal-row">
            <div class="modal-label">变更文件 (${files.length})</div>
            <div class="modal-value">
                ${files.map(f => `<div style="padding: 4px 0; color: #6B7280;">📄 ${f}</div>`).join('')}
            </div>
        </div>
        
        <div style="margin-top: 24px; display: flex; gap: 12px;">
            <button class="btn-primary" onclick="alert('查看详细差异（演示版）')">
                查看 Diff
            </button>
            <button class="btn-secondary" onclick="alert('回滚到此版本（演示版）')">
                回滚版本
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('versionModal');
    modal.classList.remove('active');
    selectedVersion = null;
    drawVersionTree();
}

// 处理分支切换
function handleBranchChange(event) {
    const branch = event.target.value;
    alert(`切换到分支: ${branch}\n（演示版，实际会加载该分支的版本历史）`);
}

// 生成模拟文件列表
function generateMockFiles() {
    const filePool = [
        'src/components/VoiceControl.tsx',
        'src/services/DeviceManager.ts',
        'src/utils/api.ts',
        'src/styles/main.css',
        'src/pages/Dashboard.tsx',
        'src/hooks/useDevice.ts',
        'package.json',
        'README.md',
        'src/config/config.ts',
        'src/types/device.d.ts'
    ];
    
    const count = Math.floor(Math.random() * 5) + 2;
    const shuffled = filePool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 点击模态框外部关闭
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('versionModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

