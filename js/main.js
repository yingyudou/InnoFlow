// 主要 JavaScript 功能

// 登录表单处理
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 模拟登录
            window.location.href = 'dashboard.html';
        });
    }
    
    // 初始化项目面板
    const projectGrid = document.getElementById('projectGrid');
    if (projectGrid) {
        initProjects();
    }
    
    // 初始化工具面板
    const toolGrid = document.getElementById('toolGrid');
    if (toolGrid) {
        initTools();
    }
});

// 项目数据（模拟）
const projectsData = [
    {
        id: 1,
        name: '智能家居控制系统',
        stage: 'develop',
        stageName: '开发阶段',
        progress: 60,
        owner: '张伟',
        ownerAvatar: '%23F03D8E',
        ownerInitial: '张',
        updateTime: '2小时前'
    },
    {
        id: 2,
        name: 'AI 驱动的客服机器人',
        stage: 'define',
        stageName: '定义阶段',
        progress: 45,
        owner: '李娜',
        ownerAvatar: '%235B4FE8',
        ownerInitial: '李',
        updateTime: '5小时前'
    },
    {
        id: 3,
        name: '区块链溯源平台',
        stage: 'discover',
        stageName: '发现阶段',
        progress: 30,
        owner: '王强',
        ownerAvatar: '%2300D4AA',
        ownerInitial: '王',
        updateTime: '1天前'
    },
    {
        id: 4,
        name: '在线教育互动系统',
        stage: 'deliver',
        stageName: '交付阶段',
        progress: 85,
        owner: '刘洋',
        ownerAvatar: '%23FF9F1C',
        ownerInitial: '刘',
        updateTime: '3天前'
    },
    {
        id: 5,
        name: '健康数据分析平台',
        stage: 'develop',
        stageName: '开发阶段',
        progress: 55,
        owner: '陈晨',
        ownerAvatar: '%23E63946',
        ownerInitial: '陈',
        updateTime: '4天前'
    },
    {
        id: 6,
        name: '智慧物流管理系统',
        stage: 'define',
        stageName: '定义阶段',
        progress: 40,
        owner: '赵敏',
        ownerAvatar: '%238338EC',
        ownerInitial: '赵',
        updateTime: '1周前'
    }
];

// 初始化项目卡片
function initProjects() {
    const projectGrid = document.getElementById('projectGrid');
    const projectCount = document.getElementById('projectCount');
    
    if (projectCount) {
        projectCount.textContent = projectsData.length;
    }
    
    projectsData.forEach((project, index) => {
        const card = createProjectCard(project);
        projectGrid.appendChild(card);
        
        // 添加延迟动画
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

// 创建项目卡片
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => {
        window.location.href = 'project.html?id=' + project.id;
    };
    
    card.innerHTML = `
        <div class="project-card-header">
            <h3>${project.name}</h3>
            <span class="project-stage stage-${project.stage}">${project.stageName}</span>
        </div>
        <div class="project-progress">
            <div class="progress-label">
                <span>项目进度</span>
                <span class="progress-percent">${project.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}%"></div>
            </div>
        </div>
        <div class="project-footer">
            <div class="project-owner">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='${project.ownerAvatar}'/%3E%3Ctext x='50' y='65' font-size='40' fill='white' text-anchor='middle' font-family='Arial'%3E${project.ownerInitial}%3C/text%3E%3C/svg%3E" 
                     alt="${project.owner}" 
                     class="owner-avatar">
                <span class="owner-name">${project.owner}</span>
            </div>
            <span class="project-time">${project.updateTime}</span>
        </div>
    `;
    
    return card;
}

// 工具函数：获取 URL 参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 随机生成中文名字
function generateChineseName() {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '吴', '周'];
    const names = ['伟', '娜', '强', '敏', '静', '磊', '洋', '艳', '勇', '芳'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
}

// 平滑滚动
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 已安装的工具（模拟数据）
let installedTools = [
    {
        id: 'ai-assistant',
        name: 'AI 会议助手',
        icon: '🤖',
        description: '智能生成会议摘要',
        url: 'tool.html'
    },
    {
        id: 'doc-generator',
        name: '文档生成器',
        icon: '📝',
        description: '自动生成项目文档',
        url: 'docgen.html'
    }
];

// 初始化工具面板
function initTools() {
    const toolGrid = document.getElementById('toolGrid');
    if (!toolGrid) return;
    
    toolGrid.innerHTML = '';
    
    if (installedTools.length === 0) {
        toolGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">暂未安装任何工具，前往工具商店看看吧～</p>';
        return;
    }
    
    installedTools.forEach(tool => {
        const toolCard = createToolCard(tool);
        toolGrid.appendChild(toolCard);
    });
}

// 创建工具卡片
function createToolCard(tool) {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.onclick = (e) => {
        // 如果点击的是卸载按钮，不跳转
        if (e.target.classList.contains('tool-remove') || e.target.closest('.tool-remove')) {
            return;
        }
        const projectName = document.getElementById('projectTitle') ? 
            document.getElementById('projectTitle').textContent : '智能家居控制系统';
        window.location.href = tool.url + '?project=' + encodeURIComponent(projectName);
    };
    
    card.innerHTML = `
        <button class="tool-remove" onclick="removeTool('${tool.id}', event)">&times;</button>
        <div class="tool-icon">${tool.icon}</div>
        <div class="tool-name">${tool.name}</div>
        <div class="tool-desc">${tool.description}</div>
    `;
    
    return card;
}

// 卸载工具
function removeTool(toolId, event) {
    event.stopPropagation();
    if (confirm('确定要卸载此工具吗？')) {
        installedTools = installedTools.filter(tool => tool.id !== toolId);
        initTools();
    }
}

// 安装工具（从工具商店调用）
function installTool(tool) {
    if (installedTools.find(t => t.id === tool.id)) {
        alert('该工具已安装');
        return;
    }
    installedTools.push(tool);
    initTools();
    alert(`工具 "${tool.name}" 安装成功！`);
}

// 处理新建项目（带限制检查）
function handleNewProject() {
    // 检查订阅限制
    if (typeof checkFeatureLimit !== 'undefined') {
        const limit = checkFeatureLimit('projects');
        if (!limit.allowed) {
            if (typeof showUpgradePrompt !== 'undefined') {
                showUpgradePrompt('projects');
            } else {
                alert('项目数量已达上限，请升级套餐以创建更多项目');
            }
            return;
        }
    }
    
    // 如果通过限制检查，继续创建项目
    alert('新建项目功能（演示版）\n\n提示：在真实系统中，这里会打开项目创建表单');
}

