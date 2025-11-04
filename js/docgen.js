// 文档生成器功能

let selectedDocType = '';

// 选择文档类型
function selectDocType(type, element) {
    selectedDocType = type;
    
    // 更新选中状态
    document.querySelectorAll('.doc-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (element) {
        element.classList.add('selected');
    }
    
    // 显示生成配置区域
    document.getElementById('generateSection').style.display = 'block';
    
    // 根据类型更新标题
    const titleMap = {
        'api': '智能家居控制系统 API 文档',
        'readme': '智能家居控制系统 README',
        'architecture': '智能家居控制系统 架构文档',
        'user-guide': '智能家居控制系统 用户手册'
    };
    document.getElementById('docTitle').value = titleMap[type] || '智能家居控制系统 文档';
}

// 生成文档
function generateDocument() {
    const btn = document.getElementById('generateDocBtn');
    const title = document.getElementById('docTitle').value;
    const format = document.querySelector('input[name="format"]:checked').value;
    
    btn.textContent = '生成中...';
    btn.disabled = true;
    
    // 模拟生成过程
    setTimeout(() => {
        // 显示结果区域
        document.getElementById('resultSection').style.display = 'block';
        
        // 生成随机统计数据
        const filesCount = Math.floor(Math.random() * 50) + 20;
        const sectionsCount = Math.floor(Math.random() * 15) + 8;
        const docSize = Math.floor(Math.random() * 200) + 100;
        
        document.getElementById('filesScanned').textContent = filesCount;
        document.getElementById('sectionsGenerated').textContent = sectionsCount;
        document.getElementById('docSize').textContent = docSize + ' KB';
        
        // 生成预览内容
        generatePreview(selectedDocType, title);
        
        btn.textContent = '🚀 生成文档';
        btn.disabled = false;
        
        // 滚动到结果区域
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

// 生成预览内容
function generatePreview(type, title) {
    const preview = document.getElementById('docPreview');
    
    const previews = {
        'api': `
            <h3>${title}</h3>
            <h4>1. 概述</h4>
            <p>本文档描述了智能家居控制系统的 API 接口规范。</p>
            
            <h4>2. 认证</h4>
            <p>所有 API 请求需要携带认证令牌：</p>
            <pre>Authorization: Bearer &lt;token&gt;</pre>
            
            <h4>3. 接口列表</h4>
            <h5>3.1 设备控制</h5>
            <p><strong>POST /api/devices/control</strong></p>
            <p>控制智能设备开关状态</p>
            <pre>{
  "deviceId": "device_001",
  "action": "turn_on",
  "params": {}
}</pre>
            
            <h5>3.2 获取设备状态</h5>
            <p><strong>GET /api/devices/{deviceId}/status</strong></p>
            <p>获取指定设备的当前状态</p>
        `,
        'readme': `
            <h3>${title}</h3>
            <h4>项目简介</h4>
            <p>智能家居控制系统是一个基于物联网技术的智能化家居管理平台。</p>
            
            <h4>功能特性</h4>
            <ul>
                <li>设备远程控制</li>
                <li>场景联动</li>
                <li>语音控制</li>
                <li>能耗监控</li>
            </ul>
            
            <h4>快速开始</h4>
            <pre>npm install
npm run dev</pre>
            
            <h4>技术栈</h4>
            <ul>
                <li>前端: React + TypeScript</li>
                <li>后端: Node.js + Express</li>
                <li>数据库: MongoDB</li>
            </ul>
        `,
        'architecture': `
            <h3>${title}</h3>
            <h4>1. 系统架构</h4>
            <p>系统采用微服务架构，包含以下核心模块：</p>
            <ul>
                <li>设备管理服务</li>
                <li>用户认证服务</li>
                <li>场景联动服务</li>
                <li>数据存储服务</li>
            </ul>
            
            <h4>2. 技术选型</h4>
            <p>前端框架、后端框架、数据库等选择理由...</p>
            
            <h4>3. 部署架构</h4>
            <p>生产环境部署方案和服务器配置...</p>
        `,
        'user-guide': `
            <h3>${title}</h3>
            <h4>第一章：快速入门</h4>
            <p>欢迎使用智能家居控制系统，本指南将帮助您快速上手。</p>
            
            <h4>第二章：设备管理</h4>
            <p>如何添加、配置和管理智能设备...</p>
            
            <h4>第三章：场景设置</h4>
            <p>创建自动化场景，实现智能联动...</p>
        `
    };
    
    preview.innerHTML = previews[type] || previews['readme'];
}

// 下载文档
function downloadDoc() {
    const title = document.getElementById('docTitle').value;
    const format = document.querySelector('input[name="format"]:checked').value;
    alert(`下载 ${title} (${format.toUpperCase()}格式)\n\n（演示版）`);
}

// 预览文档
function previewDoc() {
    alert('在新窗口中预览文档\n\n（演示版）');
}

