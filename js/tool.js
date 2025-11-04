// AI 会议助手功能

document.addEventListener('DOMContentLoaded', function() {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const generateBtn = document.getElementById('generateBtn');
    
    // 点击上传区域
    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 拖拽上传
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#5B4FE8';
        uploadBox.style.background = 'rgba(91, 79, 232, 0.05)';
    });
    
    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#E5E7EB';
        uploadBox.style.background = 'transparent';
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = '#E5E7EB';
        uploadBox.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // 文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // 生成摘要
    generateBtn.addEventListener('click', generateSummary);
});

// 处理文件选择
function handleFileSelect(file) {
    const uploadBox = document.getElementById('uploadBox');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    
    uploadBox.style.display = 'none';
    fileInfo.style.display = 'block';
    fileName.textContent = `📁 ${file.name}`;
}

// 生成摘要
function generateSummary() {
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
    
    const generateBtn = document.getElementById('generateBtn');
    const summarySection = document.getElementById('summarySection');
    
    // 显示加载状态
    generateBtn.textContent = '生成中...';
    generateBtn.disabled = true;
    
    // 模拟 AI 处理延迟
    setTimeout(() => {
        // 生成随机摘要内容
        const summary = generateMockSummary();
        
        // 填充摘要内容
        document.getElementById('meetingDate').textContent = formatDate(new Date());
        document.getElementById('duration').textContent = `${Math.floor(Math.random() * 60 + 30)} 分钟`;
        document.getElementById('participants').textContent = Math.floor(Math.random() * 5 + 3);
        
        // 核心要点
        const keyPointsList = document.getElementById('keyPoints');
        keyPointsList.innerHTML = '';
        summary.keyPoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            keyPointsList.appendChild(li);
        });
        
        // 待办事项
        const todoList = document.getElementById('todoItems');
        todoList.innerHTML = '';
        summary.todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo;
            todoList.appendChild(li);
        });
        
        // 创新建议
        const suggestionsList = document.getElementById('suggestions');
        suggestionsList.innerHTML = '';
        summary.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            suggestionsList.appendChild(li);
        });
        
        // 显示摘要
        document.querySelector('.upload-section').style.display = 'none';
        summarySection.style.display = 'block';
        
        generateBtn.textContent = '生成摘要';
        generateBtn.disabled = false;
    }, 2000);
}

// 生成模拟摘要
function generateMockSummary() {
    const keyPointsPool = [
        '确定了智能家居系统的核心功能模块，包括设备控制、场景联动、数据监控',
        '讨论了用户体验优化方案，重点关注语音控制和手势识别功能',
        '明确了项目时间节点，预计在3个月内完成第一版原型开发',
        '评审了技术架构方案，决定采用微服务架构提升系统可扩展性',
        '分析了竞品功能特点，确定了差异化竞争策略',
        '讨论了数据安全和隐私保护措施，制定了安全规范',
        '确认了与第三方设备厂商的合作意向，拓展设备兼容性'
    ];
    
    const todosPool = [
        '张伟负责完成语音控制模块的原型开发，截止日期：本周五',
        '李娜整理用户调研报告，下周一提交给团队评审',
        '王强搭建开发环境并完成基础框架代码，本周内完成',
        '刘洋联系第三方设备厂商，商讨API接入方案',
        '陈晨设计数据监控面板的UI原型，本周三前完成',
        '赵敏编写项目技术文档，包括架构设计和接口规范',
        '孙涛进行性能测试并输出测试报告'
    ];
    
    const suggestionsPool = [
        '建议引入AI算法实现设备使用习惯学习，提供个性化场景推荐',
        '可以考虑开发小程序版本，降低用户使用门槛',
        '建议设计设备状态可视化大屏，方便家庭成员查看',
        '可以探索与智能音箱的深度集成，提升语音控制体验',
        '建议建立用户反馈渠道，快速迭代产品功能',
        '可以考虑增加能源管理功能，帮助用户节省电费',
        '建议设计多语言支持，拓展国际市场',
        '可以探索订阅制商业模式，提供高级功能服务'
    ];
    
    return {
        keyPoints: getRandomItems(keyPointsPool, 3),
        todos: getRandomItems(todosPool, 4),
        suggestions: getRandomItems(suggestionsPool, 3)
    };
}

// 随机选择数组项
function getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 导出摘要
function exportSummary() {
    // 获取摘要内容
    const keyPoints = Array.from(document.getElementById('keyPoints').children)
        .map(li => li.textContent);
    const todos = Array.from(document.getElementById('todoItems').children)
        .map(li => li.textContent);
    const suggestions = Array.from(document.getElementById('suggestions').children)
        .map(li => li.textContent);
    
    const content = `
=================================
会议摘要 - InnoFlow AI 助手
=================================

📅 会议时间：${document.getElementById('meetingDate').textContent}
⏱️ 会议时长：${document.getElementById('duration').textContent}
👥 参与人数：${document.getElementById('participants').textContent}

📋 核心要点
${keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

✅ 待办事项
${todos.map((t, i) => `${i + 1}. ${t}`).join('\n')}

💡 创新建议
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

=================================
由 InnoFlow 创新开发辅助系统生成
=================================
    `;
    
    // 创建下载
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `会议摘要_${formatDateForFilename(new Date())}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('摘要已导出！');
}

// 重置工具
function resetTool() {
    document.querySelector('.upload-section').style.display = 'block';
    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('uploadBox').style.display = 'block';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('fileInput').value = '';
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

// 格式化日期为文件名
function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

