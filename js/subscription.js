// 订阅功能

// 订阅套餐数据
const subscriptionPlans = {
    free: {
        name: '免费版',
        price: 0,
        priceYearly: 0,
        features: {
            projects: 3,
            aiCalls: 50,
            teamMembers: 5,
            storage: 1
        }
    },
    pro: {
        name: '专业版',
        price: 99,
        priceYearly: 899,
        features: {
            projects: -1, // -1 表示无限
            aiCalls: 500,
            teamMembers: 20,
            storage: 50
        }
    },
    enterprise: {
        name: '企业版',
        price: 299,
        priceYearly: 2999,
        features: {
            projects: -1,
            aiCalls: -1,
            teamMembers: -1,
            storage: -1
        }
    }
};

// 当前订阅状态（模拟数据）
let currentSubscription = {
    plan: 'pro', // 专业版
    startDate: '2025-10-01',
    endDate: '2025-11-01', // 专业版到期日
    aiCallsUsed: 156, // 已使用的 AI 调用次数
    aiCallsLimit: 500, // 专业版限制
    projectsUsed: 6, // 已创建项目数（6个项目）
    projectsLimit: -1, // 专业版无限
    teamMembersUsed: 8, // 当前团队成员数
    teamMembersLimit: 20 // 专业版限制
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initSubscriptionPage();
});

// 初始化订阅页面
function initSubscriptionPage() {
    updateSubscriptionStatus();
    updatePricingCards();
}

// 更新定价卡片按钮状态
function updatePricingCards() {
    const currentPlan = currentSubscription.plan;
    
    // 免费版按钮
    const freeBtn = document.querySelector('.pricing-card:not(.featured):not(.enterprise) .btn-secondary');
    if (freeBtn && currentPlan === 'free') {
        freeBtn.disabled = true;
        freeBtn.textContent = '当前套餐';
    } else if (freeBtn) {
        freeBtn.disabled = false;
        freeBtn.textContent = '选择免费版';
        freeBtn.classList.remove('btn-secondary');
        freeBtn.classList.add('btn-primary');
        freeBtn.onclick = () => {
            if (confirm('确定要降级到免费版吗？降级后部分功能将受限。')) {
                currentSubscription.plan = 'free';
                currentSubscription.endDate = null;
                currentSubscription.aiCallsLimit = 50;
                currentSubscription.projectsLimit = 3;
                currentSubscription.teamMembersLimit = 5;
                updateSubscriptionStatus();
                updatePricingCards();
            }
        };
    }
    
    // 专业版按钮
    const proBtn = document.getElementById('proPlanBtn');
    if (proBtn) {
        if (currentPlan === 'pro') {
            proBtn.disabled = true;
            proBtn.textContent = '当前套餐';
            proBtn.className = 'btn-secondary';
        } else {
            proBtn.disabled = false;
            proBtn.textContent = '立即订阅';
            proBtn.className = 'btn-primary';
            proBtn.onclick = () => subscribeToPlan('pro');
        }
    }
    
    // 企业版按钮
    const enterpriseBtn = document.querySelector('.pricing-card.enterprise .btn-primary');
    if (enterpriseBtn) {
        if (currentPlan === 'enterprise') {
            enterpriseBtn.disabled = true;
            enterpriseBtn.textContent = '当前套餐';
            enterpriseBtn.className = 'btn-secondary';
        } else {
            enterpriseBtn.disabled = false;
            enterpriseBtn.textContent = '联系销售';
            enterpriseBtn.className = 'btn-primary';
        }
    }
}

// 更新订阅状态显示
function updateSubscriptionStatus() {
    const statusDiv = document.getElementById('subscriptionStatus');
    if (!statusDiv) return;
    
    const plan = subscriptionPlans[currentSubscription.plan];
    const isFree = currentSubscription.plan === 'free';
    
    statusDiv.innerHTML = `
        <div class="status-card">
            <div class="status-header">
                <div>
                    <h2>当前套餐：${plan.name}</h2>
                    ${!isFree ? `<p class="status-expire">到期时间：${currentSubscription.endDate || '永久有效'}</p>` : ''}
                </div>
                ${isFree ? `<button class="btn-primary" onclick="window.location.href='#pricing'">升级套餐</button>` : ''}
            </div>
            
            <div class="usage-stats">
                <div class="usage-item">
                    <div class="usage-label">AI 调用次数</div>
                    <div class="usage-bar">
                        <div class="usage-fill" style="width: ${(currentSubscription.aiCallsUsed / currentSubscription.aiCallsLimit) * 100}%"></div>
                    </div>
                    <div class="usage-text">
                        ${currentSubscription.aiCallsUsed} / ${currentSubscription.aiCallsLimit === -1 ? '∞' : currentSubscription.aiCallsLimit}
                    </div>
                </div>
                
                <div class="usage-item">
                    <div class="usage-label">项目数量</div>
                    <div class="usage-bar">
                        <div class="usage-fill" style="width: ${currentSubscription.projectsLimit === -1 ? 0 : (currentSubscription.projectsUsed / currentSubscription.projectsLimit) * 100}%"></div>
                    </div>
                    <div class="usage-text">
                        ${currentSubscription.projectsUsed} / ${currentSubscription.projectsLimit === -1 ? '∞' : currentSubscription.projectsLimit}
                    </div>
                </div>
                
                <div class="usage-item">
                    <div class="usage-label">团队成员</div>
                    <div class="usage-bar">
                        <div class="usage-fill" style="width: ${currentSubscription.teamMembersLimit === -1 ? 0 : (currentSubscription.teamMembersUsed / currentSubscription.teamMembersLimit) * 100}%"></div>
                    </div>
                    <div class="usage-text">
                        ${currentSubscription.teamMembersUsed} / ${currentSubscription.teamMembersLimit === -1 ? '∞' : currentSubscription.teamMembersLimit}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 订阅套餐
function subscribeToPlan(planType) {
    const plan = subscriptionPlans[planType];
    
    if (planType === 'enterprise') {
        alert('企业版请联系销售团队\n\n邮箱: sales@innoflow.com\n电话: 400-XXX-XXXX');
        return;
    }
    
    // 显示订阅确认弹窗
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    const priceMonthly = plan.price;
    const priceYearly = plan.priceYearly;
    const savings = (priceMonthly * 12) - priceYearly;
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>订阅 ${plan.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="billing-period-selector">
                    <label class="period-option">
                        <input type="radio" name="billingPeriod" value="monthly" checked onchange="updateBillingPrice()">
                        <div>
                            <div class="period-name">按月付费</div>
                            <div class="period-price">¥${priceMonthly}/月</div>
                        </div>
                    </label>
                    <label class="period-option">
                        <input type="radio" name="billingPeriod" value="yearly" onchange="updateBillingPrice()">
                        <div>
                            <div class="period-name">按年付费 <span class="savings-badge">省¥${savings}</span></div>
                            <div class="period-price">¥${priceYearly}/年</div>
                            <div class="period-note">相当于 ¥${Math.round(priceYearly/12)}/月</div>
                        </div>
                    </label>
                </div>
                
                <div class="payment-summary">
                    <div class="summary-row">
                        <span>套餐</span>
                        <span>${plan.name}</span>
                    </div>
                    <div class="summary-row">
                        <span>计费周期</span>
                        <span id="selectedPeriod">按月</span>
                    </div>
                    <div class="summary-row total">
                        <span>总计</span>
                        <span id="totalPrice">¥${priceMonthly}</span>
                    </div>
                </div>
                
                <div style="margin-top: 24px;">
                    <h4 style="margin-bottom: 12px;">支付方式</h4>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment" value="alipay" checked>
                            <span>💰 支付宝</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="wechat">
                            <span>💚 微信支付</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="card">
                            <span>💳 银行卡</span>
                        </label>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        取消
                    </button>
                    <button class="btn-primary" style="flex: 1;" onclick="confirmSubscribe('${planType}', this.closest('.modal'))">
                        确认订阅
                    </button>
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

// 更新计费价格显示
function updateBillingPrice() {
    const period = document.querySelector('input[name="billingPeriod"]:checked').value;
    const planType = document.querySelector('.modal').dataset.plan || 'pro';
    const plan = subscriptionPlans[planType];
    
    const periodText = period === 'monthly' ? '按月' : '按年';
    const price = period === 'monthly' ? plan.price : plan.priceYearly;
    
    document.getElementById('selectedPeriod').textContent = periodText;
    document.getElementById('totalPrice').textContent = `¥${price}${period === 'yearly' ? '/年' : ''}`;
}

// 确认订阅
function confirmSubscribe(planType, modal) {
    const plan = subscriptionPlans[planType];
    const period = document.querySelector('input[name="billingPeriod"]:checked').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const price = period === 'monthly' ? plan.price : plan.priceYearly;
    
    const btn = modal.querySelector('.btn-primary');
    btn.textContent = '处理中...';
    btn.disabled = true;
    
    // 模拟支付过程
    setTimeout(() => {
        // 更新订阅状态
        currentSubscription.plan = planType;
        currentSubscription.endDate = period === 'monthly' 
            ? getNextMonthDate() 
            : getNextYearDate();
        currentSubscription.aiCallsLimit = plan.features.aiCalls;
        currentSubscription.projectsLimit = plan.features.projects;
        currentSubscription.teamMembersLimit = plan.features.teamMembers;
        
        updateSubscriptionStatus();
        modal.remove();
        
        alert(`🎉 订阅成功！\n\n您已成功订阅 ${plan.name}，新功能已立即生效！`);
    }, 1500);
}

// 获取下个月日期
function getNextMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
}

// 获取明年日期
function getNextYearDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
}

// 切换 FAQ
function toggleFaq(element) {
    const item = element.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const toggle = element.querySelector('.faq-toggle');
    
    const isOpen = item.classList.contains('open');
    
    // 关闭所有其他 FAQ
    document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('open');
        faq.querySelector('.faq-answer').style.maxHeight = null;
        faq.querySelector('.faq-toggle').textContent = '+';
    });
    
    if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        toggle.textContent = '−';
    }
}

// 检查功能限制
function checkFeatureLimit(feature) {
    const limits = {
        aiCalls: {
            used: currentSubscription.aiCallsUsed,
            limit: currentSubscription.aiCallsLimit
        },
        projects: {
            used: currentSubscription.projectsUsed,
            limit: currentSubscription.projectsLimit
        },
        teamMembers: {
            used: currentSubscription.teamMembersUsed,
            limit: currentSubscription.teamMembersLimit
        }
    };
    
    const featureLimit = limits[feature];
    if (!featureLimit) return { allowed: true };
    
    if (featureLimit.limit === -1) {
        return { allowed: true }; // 无限
    }
    
    if (featureLimit.used >= featureLimit.limit) {
        return { 
            allowed: false, 
            message: getLimitMessage(feature),
            upgrade: true 
        };
    }
    
    return { allowed: true };
}

// 获取限制提示信息
function getLimitMessage(feature) {
    const messages = {
        aiCalls: 'AI 调用次数已达上限',
        projects: '项目数量已达上限',
        teamMembers: '团队成员数量已达上限'
    };
    
    return messages[feature] || '功能使用已达上限';
}

// 显示升级提示
function showUpgradePrompt(feature) {
    const limit = checkFeatureLimit(feature);
    if (!limit.allowed) {
        const upgradeModal = document.createElement('div');
        upgradeModal.className = 'modal active';
        upgradeModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>功能受限</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
                        <h3>${limit.message}</h3>
                        <p style="color: var(--text-secondary); margin-top: 8px;">
                            升级到专业版解锁更多功能
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                            稍后再说
                        </button>
                        <button class="btn-primary" style="flex: 1;" onclick="window.location.href='subscription.html'">
                            立即升级
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(upgradeModal);
        
        upgradeModal.addEventListener('click', function(e) {
            if (e.target === upgradeModal) {
                upgradeModal.remove();
            }
        });
    }
}

// 获取当前订阅信息
function getCurrentSubscription() {
    return currentSubscription;
}

// 确保函数在全局可用
window.checkFeatureLimit = checkFeatureLimit;
window.showUpgradePrompt = showUpgradePrompt;
window.getCurrentSubscription = getCurrentSubscription;
window.hasFeatureAccess = hasFeatureAccess;

// 检查是否有权限使用功能
function hasFeatureAccess(feature) {
    const plan = subscriptionPlans[currentSubscription.plan];
    
    switch(feature) {
        case 'unlimitedProjects':
            return plan.features.projects === -1;
        case 'unlimitedAICalls':
            return plan.features.aiCalls === -1;
        case 'unlimitedTeamMembers':
            return plan.features.teamMembers === -1;
        case 'advancedPlugins':
            return currentSubscription.plan !== 'free';
        case 'dataExport':
            return currentSubscription.plan !== 'free';
        case 'apiAccess':
            return currentSubscription.plan !== 'free';
        default:
            return false;
    }
}

