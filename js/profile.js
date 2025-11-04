// 个人中心功能

// 用户数据（模拟）
let userData = {
    name: '李娜',
    email: 'lina@example.com',
    phone: '138****5678',
    avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%235B4FE8\'/%3E%3Ctext x=\'50\' y=\'65\' font-size=\'40\' fill=\'white\' text-anchor=\'middle\' font-family=\'Arial\'%3E李%3C/text%3E%3C/svg%3E',
    registerDate: '2025-01-15',
    projectsCount: 6,
    aiCallsCount: 156,
    teamMembersCount: 8
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initProfile();
    updateStats();
});

// 初始化个人页面
function initProfile() {
    // 更新用户信息显示
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('displayName').textContent = userData.name;
    document.getElementById('displayEmail').textContent = userData.email;
    document.getElementById('displayPhone').textContent = userData.phone;
    
    // 更新订阅状态
    if (typeof getCurrentSubscription !== 'undefined') {
        const sub = getCurrentSubscription();
        if (sub) {
            const planName = sub.plan === 'free' ? '免费版' : sub.plan === 'pro' ? '专业版' : '企业版';
            const planElement = document.querySelector('.plan-name');
            if (planElement) {
                planElement.textContent = planName;
            }
            
            if (sub.endDate) {
                const endDateElement = document.getElementById('subscriptionEndDate') || document.querySelector('.detail-value');
                if (endDateElement) {
                    endDateElement.textContent = sub.endDate;
                }
            }
        }
    }
}

// 更新统计数据
function updateStats() {
    // 从项目数据获取项目数量
    if (typeof projectsData !== 'undefined') {
        userData.projectsCount = projectsData.length;
    }
    
    // 从订阅数据获取 AI 调用次数
    if (typeof getCurrentSubscription !== 'undefined') {
        const sub = getCurrentSubscription();
        if (sub && sub.aiCallsUsed) {
            userData.aiCallsCount = sub.aiCallsUsed;
        }
        if (sub && sub.teamMembersUsed) {
            userData.teamMembersCount = sub.teamMembersUsed;
        }
    }
    
    // 更新统计显示
    document.getElementById('statProjects').textContent = userData.projectsCount;
    document.getElementById('statAICalls').textContent = userData.aiCallsCount;
    document.getElementById('statTeam').textContent = userData.teamMembersCount;
}

// 编辑设置
function editSetting(type) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    let title = '';
    let inputType = 'text';
    let currentValue = '';
    let placeholder = '';
    
    switch(type) {
        case 'name':
            title = '编辑用户名';
            currentValue = userData.name;
            placeholder = '请输入用户名';
            break;
        case 'email':
            title = '编辑邮箱';
            inputType = 'email';
            currentValue = userData.email;
            placeholder = '请输入邮箱地址';
            break;
        case 'phone':
            title = '编辑手机号';
            inputType = 'tel';
            currentValue = userData.phone;
            placeholder = '请输入手机号';
            break;
        case 'password':
            title = '修改密码';
            inputType = 'password';
            placeholder = '请输入新密码';
            break;
    }
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">${title.replace('编辑', '').replace('修改', '')}</label>
                    <input type="${inputType}" id="editInput" value="${currentValue}" placeholder="${placeholder}" 
                           style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px;">
                </div>
                ${type === 'password' ? `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">确认密码</label>
                        <input type="password" id="confirmInput" placeholder="请再次输入新密码" 
                               style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 14px;">
                    </div>
                ` : ''}
                <div style="display: flex; gap: 12px;">
                    <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">取消</button>
                    <button class="btn-primary" style="flex: 1;" onclick="saveSetting('${type}', this.closest('.modal'))">保存</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // 聚焦输入框
    setTimeout(() => {
        const input = document.getElementById('editInput');
        if (input) input.focus();
    }, 100);
}

// 保存设置
function saveSetting(type, modal) {
    const input = document.getElementById('editInput');
    const newValue = input.value.trim();
    
    if (!newValue) {
        alert('请输入有效值');
        return;
    }
    
    // 密码验证
    if (type === 'password') {
        const confirmInput = document.getElementById('confirmInput');
        if (newValue !== confirmInput.value) {
            alert('两次输入的密码不一致');
            return;
        }
        if (newValue.length < 6) {
            alert('密码长度至少6位');
            return;
        }
    }
    
    // 更新数据
    switch(type) {
        case 'name':
            userData.name = newValue;
            document.getElementById('userName').textContent = newValue;
            document.getElementById('displayName').textContent = newValue;
            break;
        case 'email':
            userData.email = newValue;
            document.getElementById('userEmail').textContent = newValue;
            document.getElementById('displayEmail').textContent = newValue;
            break;
        case 'phone':
            userData.phone = newValue;
            document.getElementById('displayPhone').textContent = newValue;
            break;
        case 'password':
            alert('密码修改成功！');
            break;
    }
    
    modal.remove();
    alert('保存成功！');
}

// 显示编辑资料弹窗
function showEditModal() {
    editSetting('name');
}

// 显示设备管理弹窗
function showDeviceModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>登录设备</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="device-list">
                    <div class="device-item">
                        <div class="device-info">
                            <div class="device-icon">💻</div>
                            <div>
                                <div class="device-name">Windows PC - Chrome</div>
                                <div class="device-detail">当前设备 • 最后登录：2小时前</div>
                            </div>
                        </div>
                        <span class="device-badge current">当前</span>
                    </div>
                    <div class="device-item">
                        <div class="device-info">
                            <div class="device-icon">📱</div>
                            <div>
                                <div class="device-name">iPhone 14 - Safari</div>
                                <div class="device-detail">最后登录：1天前</div>
                            </div>
                        </div>
                        <button class="btn-text" onclick="removeDevice(this)">移除</button>
                    </div>
                    <div class="device-item">
                        <div class="device-info">
                            <div class="device-icon">💻</div>
                            <div>
                                <div class="device-name">MacBook Pro - Chrome</div>
                                <div class="device-detail">最后登录：3天前</div>
                            </div>
                        </div>
                        <button class="btn-text" onclick="removeDevice(this)">移除</button>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                    <button class="btn-secondary" style="width: 100%;" onclick="this.closest('.modal').remove()">关闭</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 移除设备
function removeDevice(btn) {
    if (confirm('确定要移除此设备吗？')) {
        btn.closest('.device-item').remove();
        alert('设备已移除');
    }
}

// 开启两步验证
function enable2FA() {
    if (confirm('确定要开启两步验证吗？\n\n开启后，登录时需要输入手机验证码。')) {
        alert('两步验证已开启！\n\n请使用手机验证码应用扫描二维码完成设置。');
    }
}

// 管理 API 密钥
function manageAPI() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>API 密钥管理</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <p style="color: var(--text-secondary); margin-bottom: 16px;">API 密钥用于访问 InnoFlow API 服务</p>
                    <div class="api-key-item">
                        <div class="api-key-info">
                            <div class="api-key-name">生产环境密钥</div>
                            <div class="api-key-value">sk_live_...a8f3</div>
                            <div class="api-key-meta">创建于 2025-01-15 • 最后使用：2小时前</div>
                        </div>
                        <button class="btn-text" onclick="copyAPIKey(this)">复制</button>
                    </div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">关闭</button>
                    <button class="btn-primary" style="flex: 1;" onclick="createAPIKey()">生成新密钥</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 复制 API 密钥
function copyAPIKey(btn) {
    const keyValue = btn.previousElementSibling.querySelector('.api-key-value').textContent;
    navigator.clipboard.writeText(keyValue).then(() => {
        btn.textContent = '已复制';
        setTimeout(() => {
            btn.textContent = '复制';
        }, 2000);
    });
}

// 创建新 API 密钥
function createAPIKey() {
    if (confirm('确定要生成新的 API 密钥吗？\n\n旧密钥将立即失效。')) {
        alert('新 API 密钥已生成！\n\n请妥善保管，密钥只显示一次。\n\nsk_live_new_' + Math.random().toString(36).substr(2, 16));
    }
}

// 确保函数在全局可用
window.editSetting = editSetting;
window.saveSetting = saveSetting;
window.showEditModal = showEditModal;
window.showDeviceModal = showDeviceModal;
window.removeDevice = removeDevice;
window.enable2FA = enable2FA;
window.manageAPI = manageAPI;
window.copyAPIKey = copyAPIKey;
window.createAPIKey = createAPIKey;

