// 安全扫描功能模块

// 安全扫描结果状态
const SecurityStatus = {
    SAFE: 'safe',
    WARNING: 'warning',
    DANGEROUS: 'dangerous',
    PENDING: 'pending'
};

// 安全扫描结果（模拟数据）
const securityScanResults = {
    'ai-assistant': {
        status: SecurityStatus.SAFE,
        score: 95,
        lastScan: '2025-01-15',
        issues: [],
        details: {
            malware: { detected: false, description: '未检测到恶意代码' },
            permissions: { level: 'normal', description: '权限请求合理' },
            dataPrivacy: { level: 'safe', description: '数据隐私保护良好' },
            codeQuality: { score: 92, description: '代码质量优秀' }
        }
    },
    'doc-generator': {
        status: SecurityStatus.SAFE,
        score: 88,
        lastScan: '2025-01-14',
        issues: [],
        details: {
            malware: { detected: false, description: '未检测到恶意代码' },
            permissions: { level: 'normal', description: '权限请求合理' },
            dataPrivacy: { level: 'safe', description: '数据隐私保护良好' },
            codeQuality: { score: 85, description: '代码质量良好' }
        }
    },
    'code-reviewer': {
        status: SecurityStatus.WARNING,
        score: 72,
        lastScan: '2025-01-13',
        issues: [
            { type: 'permission', severity: 'medium', description: '请求了额外的文件系统访问权限' },
            { type: 'code', severity: 'low', description: '存在部分未使用的依赖包' }
        ],
        details: {
            malware: { detected: false, description: '未检测到恶意代码' },
            permissions: { level: 'elevated', description: '权限请求较多，请谨慎使用' },
            dataPrivacy: { level: 'safe', description: '数据隐私保护良好' },
            codeQuality: { score: 75, description: '代码质量一般' }
        }
    }
};

// 执行安全扫描（模拟）
function performSecurityScan(toolId, toolData) {
    // 模拟扫描过程
    const scanResult = {
        status: SecurityStatus.PENDING,
        score: 0,
        lastScan: new Date().toISOString().split('T')[0],
        issues: [],
        details: {
            malware: { detected: false, description: '' },
            permissions: { level: 'normal', description: '' },
            dataPrivacy: { level: 'safe', description: '' },
            codeQuality: { score: 0, description: '' }
        }
    };

    // 模拟扫描逻辑
    let score = 100;

    // 检查恶意代码（模拟）
    const hasMalware = Math.random() < 0.05; // 5%概率检测到恶意代码
    if (hasMalware) {
        scanResult.details.malware.detected = true;
        scanResult.details.malware.description = '检测到可疑代码模式';
        scanResult.issues.push({
            type: 'malware',
            severity: 'high',
            description: '检测到可疑代码模式，建议谨慎使用'
        });
        score -= 50;
    } else {
        scanResult.details.malware.detected = false;
        scanResult.details.malware.description = '未检测到恶意代码';
    }

    // 检查权限请求
    const permissionLevel = Math.random() < 0.3 ? 'elevated' : 'normal';
    scanResult.details.permissions.level = permissionLevel;
    if (permissionLevel === 'elevated') {
        scanResult.details.permissions.description = '权限请求较多，请谨慎使用';
        scanResult.issues.push({
            type: 'permission',
            severity: 'medium',
            description: '请求了额外的系统权限'
        });
        score -= 10;
    } else {
        scanResult.details.permissions.description = '权限请求合理';
    }

    // 检查数据隐私
    const privacyLevel = Math.random() < 0.2 ? 'warning' : 'safe';
    scanResult.details.dataPrivacy.level = privacyLevel;
    if (privacyLevel === 'warning') {
        scanResult.details.dataPrivacy.description = '可能存在数据收集行为';
        scanResult.issues.push({
            type: 'privacy',
            severity: 'medium',
            description: '检测到数据收集行为，请查看隐私政策'
        });
        score -= 15;
    } else {
        scanResult.details.dataPrivacy.description = '数据隐私保护良好';
    }

    // 代码质量评分
    const codeQuality = 60 + Math.random() * 35; // 60-95分
    scanResult.details.codeQuality.score = Math.round(codeQuality);
    if (codeQuality < 70) {
        scanResult.details.codeQuality.description = '代码质量一般，建议改进';
        scanResult.issues.push({
            type: 'code',
            severity: 'low',
            description: '代码质量有待提升'
        });
        score -= 5;
    } else if (codeQuality < 85) {
        scanResult.details.codeQuality.description = '代码质量良好';
    } else {
        scanResult.details.codeQuality.description = '代码质量优秀';
    }

    // 确定最终状态
    scanResult.score = Math.max(0, Math.min(100, Math.round(score)));

    if (scanResult.score >= 80) {
        scanResult.status = SecurityStatus.SAFE;
    } else if (scanResult.score >= 60) {
        scanResult.status = SecurityStatus.WARNING;
    } else {
        scanResult.status = SecurityStatus.DANGEROUS;
    }

    // 保存扫描结果
    securityScanResults[toolId] = scanResult;

    return scanResult;
}

// 获取安全扫描结果
function getSecurityScanResult(toolId) {
    return securityScanResults[toolId] || null;
}

// 获取安全状态标识
function getSecurityBadge(toolId) {
    const result = getSecurityScanResult(toolId);
    if (!result) {
        return {
            text: '未扫描',
            color: '#9CA3AF',
            icon: '⏳'
        };
    }

    switch (result.status) {
        case SecurityStatus.SAFE:
            return {
                text: '安全',
                color: '#10B981',
                icon: '✓'
            };
        case SecurityStatus.WARNING:
            return {
                text: '警告',
                color: '#F59E0B',
                icon: '⚠'
            };
        case SecurityStatus.DANGEROUS:
            return {
                text: '危险',
                color: '#EF4444',
                icon: '✗'
            };
        default:
            return {
                text: '扫描中',
                color: '#6B7280',
                icon: '⏳'
            };
    }
}

// 显示安全扫描详情
function showSecurityDetails(toolId) {
    const tool = typeof storeTools !== 'undefined'
        ? storeTools.find(t => t.id === toolId)
        : { name: '工具', icon: '🔧' };

    let result = getSecurityScanResult(toolId);

    // 如果没有扫描结果，执行扫描
    if (!result) {
        result = performSecurityScan(toolId, tool);
    }

    const badge = getSecurityBadge(toolId);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>🔒 ${tool.name || '工具'} - 安全扫描报告</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px; padding: 20px; background: ${badge.color}15; border-radius: 12px; border-left: 4px solid ${badge.color};">
                    <div style="font-size: 48px; font-weight: 700; color: ${badge.color};">
                        ${result.score}
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">${badge.icon}</span>
                            <span style="font-size: 18px; font-weight: 600; color: ${badge.color};">
                                ${badge.text}
                            </span>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 14px;">
                            最后扫描: ${result.lastScan}
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="rescanTool('${toolId}', this.closest('.modal'))">
                        🔄 重新扫描
                    </button>
                </div>

                ${result.issues.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">⚠️ 发现的问题</h3>
                        ${result.issues.map(issue => {
                            const severityColor = {
                                'high': '#EF4444',
                                'medium': '#F59E0B',
                                'low': '#6B7280'
                            };
                            return `
                                <div style="padding: 12px; margin-bottom: 8px; background: ${severityColor[issue.severity]}15; border-left: 3px solid ${severityColor[issue.severity]}; border-radius: 6px;">
                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                        <div>
                                            <div style="font-weight: 600; margin-bottom: 4px;">${issue.description}</div>
                                            <div style="font-size: 12px; color: var(--text-secondary);">
                                                类型: ${issue.type} | 严重程度: ${issue.severity === 'high' ? '高' : issue.severity === 'medium' ? '中' : '低'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div style="padding: 16px; margin-bottom: 24px; background: #10B98115; border-left: 3px solid #10B981; border-radius: 6px; color: #10B981;">
                        ✓ 未发现安全问题
                    </div>
                `}

                <div>
                    <h3 style="margin-bottom: 16px; font-size: 16px; font-weight: 600;">详细检查项</h3>
                    <div style="display: grid; gap: 16px;">
                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600;">恶意代码检测</span>
                                <span style="color: ${result.details.malware.detected ? '#EF4444' : '#10B981'};">
                                    ${result.details.malware.detected ? '✗ 检测到' : '✓ 未检测到'}
                                </span>
                            </div>
                            <div style="font-size: 14px; color: var(--text-secondary);">
                                ${result.details.malware.description}
                            </div>
                        </div>

                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600;">权限请求</span>
                                <span style="color: ${result.details.permissions.level === 'elevated' ? '#F59E0B' : '#10B981'};">
                                    ${result.details.permissions.level === 'elevated' ? '⚠ 较高' : '✓ 正常'}
                                </span>
                            </div>
                            <div style="font-size: 14px; color: var(--text-secondary);">
                                ${result.details.permissions.description}
                            </div>
                        </div>

                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600;">数据隐私</span>
                                <span style="color: ${result.details.dataPrivacy.level === 'warning' ? '#F59E0B' : '#10B981'};">
                                    ${result.details.dataPrivacy.level === 'warning' ? '⚠ 警告' : '✓ 安全'}
                                </span>
                            </div>
                            <div style="font-size: 14px; color: var(--text-secondary);">
                                ${result.details.dataPrivacy.description}
                            </div>
                        </div>

                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600;">代码质量</span>
                                <span style="color: ${result.details.codeQuality.score >= 85 ? '#10B981' : result.details.codeQuality.score >= 70 ? '#F59E0B' : '#EF4444'};">
                                    ${result.details.codeQuality.score} 分
                                </span>
                            </div>
                            <div style="font-size: 14px; color: var(--text-secondary);">
                                ${result.details.codeQuality.description}
                            </div>
                        </div>
                    </div>
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
}

// 重新扫描工具
function rescanTool(toolId, modal) {
    const tool = typeof storeTools !== 'undefined'
        ? storeTools.find(t => t.id === toolId)
        : { name: '工具', icon: '🔧' };

    // 显示扫描中状态
    const scanBtn = modal.querySelector('.btn-secondary');
    scanBtn.textContent = '扫描中...';
    scanBtn.disabled = true;

    // 模拟扫描延迟
    setTimeout(() => {
        const result = performSecurityScan(toolId, tool);
        modal.remove();
        showSecurityDetails(toolId);
    }, 2000);
}

// 导出全局函数
window.showSecurityDetails = showSecurityDetails;
window.rescanTool = rescanTool;
window.getSecurityBadge = getSecurityBadge;
window.getSecurityScanResult = getSecurityScanResult;
window.performSecurityScan = performSecurityScan;
