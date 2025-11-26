// 评价系统功能模块

// 评价数据（模拟）
let ratingsData = {
    'ai-assistant': [
        {
            id: 1,
            userId: 'user1',
            userName: '张伟',
            rating: 5,
            comment: '非常好用的工具，会议摘要生成很准确！',
            date: '2025-01-15',
            helpful: 12
        },
        {
            id: 2,
            userId: 'user2',
            userName: '李娜',
            rating: 4,
            comment: '功能不错，但有时候识别不够准确',
            date: '2025-01-14',
            helpful: 8
        }
    ],
    'doc-generator': [
        {
            id: 3,
            userId: 'user3',
            userName: '王强',
            rating: 5,
            comment: '自动生成文档节省了大量时间',
            date: '2025-01-13',
            helpful: 15
        }
    ],
    'code-reviewer': [
        {
            id: 4,
            userId: 'user4',
            userName: '刘洋',
            rating: 4,
            comment: '代码审查很细致，发现了不少问题',
            date: '2025-01-12',
            helpful: 10
        }
    ]
};

// 获取工具的平均评分
function getAverageRating(toolId) {
    const ratings = ratingsData[toolId] || [];
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
}

// 获取工具的评价数量
function getRatingCount(toolId) {
    return (ratingsData[toolId] || []).length;
}

// 获取评分的分布
function getRatingDistribution(toolId) {
    const ratings = ratingsData[toolId] || [];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return distribution;
}

// 提交评价
function submitRating(toolId, rating, comment) {
    if (!ratingsData[toolId]) {
        ratingsData[toolId] = [];
    }

    const newRating = {
        id: Date.now(),
        userId: 'currentUser', // 实际应从登录状态获取
        userName: '当前用户',
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0
    };

    ratingsData[toolId].unshift(newRating);

    // 更新工具的评分（在storeTools中）
    if (typeof storeTools !== 'undefined') {
        const tool = storeTools.find(t => t.id === toolId);
        if (tool) {
            tool.rating = parseFloat(getAverageRating(toolId));
        }
    }

    return newRating;
}

// 标记评价为有用
function markRatingHelpful(toolId, ratingId) {
    const ratings = ratingsData[toolId];
    if (!ratings) return;

    const rating = ratings.find(r => r.id === ratingId);
    if (rating) {
        rating.helpful = (rating.helpful || 0) + 1;
    }
}

// 显示评价弹窗
function showRatingModal(toolId) {
    const tool = typeof storeTools !== 'undefined'
        ? storeTools.find(t => t.id === toolId)
        : { name: '工具', icon: '🔧' };

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>评价 ${tool.name || '工具'}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600;">评分</label>
                    <div class="rating-input" id="ratingInput">
                        <span class="star" data-rating="1">☆</span>
                        <span class="star" data-rating="2">☆</span>
                        <span class="star" data-rating="3">☆</span>
                        <span class="star" data-rating="4">☆</span>
                        <span class="star" data-rating="5">☆</span>
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600;">评价内容</label>
                    <textarea id="ratingComment" placeholder="分享你的使用体验..."
                              style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        取消
                    </button>
                    <button class="btn-primary" style="flex: 1;" onclick="confirmRating('${toolId}', this.closest('.modal'))">
                        提交评价
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 星级评分交互
    let selectedRating = 0;
    const stars = modal.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            stars.forEach((s, i) => {
                s.textContent = i < rating ? '★' : '☆';
                s.style.color = i < rating ? '#FFC107' : '#E5E7EB';
            });
        });

        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach((s, i) => {
                s.textContent = i < selectedRating ? '★' : '☆';
                s.style.color = i < selectedRating ? '#FFC107' : '#E5E7EB';
            });
        });
    });

    modal.querySelector('.rating-input').addEventListener('mouseleave', () => {
        stars.forEach((s, i) => {
            s.textContent = i < selectedRating ? '★' : '☆';
            s.style.color = i < selectedRating ? '#FFC107' : '#E5E7EB';
        });
    });

    // 保存选中的评分
    modal.selectedRating = () => selectedRating;

    // 点击外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 确认提交评价
function confirmRating(toolId, modal) {
    const selectedRating = modal.selectedRating();
    const comment = document.getElementById('ratingComment').value.trim();

    if (selectedRating === 0) {
        alert('请选择评分');
        return;
    }

    if (!comment) {
        alert('请输入评价内容');
        return;
    }

    submitRating(toolId, selectedRating, comment);
    modal.remove();

    // 刷新工具商店
    if (typeof initToolStore !== 'undefined') {
        initToolStore();
    }

    // 如果打开了评价列表，刷新它
    if (typeof showRatingList !== 'undefined') {
        showRatingList(toolId);
    }

    alert('评价提交成功！');
}

// 显示评价列表
function showRatingList(toolId) {
    const tool = typeof storeTools !== 'undefined'
        ? storeTools.find(t => t.id === toolId)
        : { name: '工具', icon: '🔧' };

    const ratings = ratingsData[toolId] || [];
    const avgRating = getAverageRating(toolId);
    const distribution = getRatingDistribution(toolId);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header">
                <h2>${tool.name || '工具'} - 用户评价</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 32px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color);">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; font-weight: 700; color: var(--primary-color);">
                            ${avgRating}
                        </div>
                        <div class="rating-stars" style="margin: 8px 0;">
                            ${renderStars(parseFloat(avgRating))}
                        </div>
                        <div style="color: var(--text-secondary); font-size: 14px;">
                            ${ratings.length} 条评价
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: 14px;">5星</span>
                            <div style="display: inline-block; width: 200px; height: 8px; background: #E5E7EB; border-radius: 4px; margin: 0 12px; vertical-align: middle;">
                                <div style="width: ${ratings.length > 0 ? (distribution[5] / ratings.length * 100) : 0}%; height: 100%; background: #FFC107; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-secondary);">${distribution[5]}</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: 14px;">4星</span>
                            <div style="display: inline-block; width: 200px; height: 8px; background: #E5E7EB; border-radius: 4px; margin: 0 12px; vertical-align: middle;">
                                <div style="width: ${ratings.length > 0 ? (distribution[4] / ratings.length * 100) : 0}%; height: 100%; background: #FFC107; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-secondary);">${distribution[4]}</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: 14px;">3星</span>
                            <div style="display: inline-block; width: 200px; height: 8px; background: #E5E7EB; border-radius: 4px; margin: 0 12px; vertical-align: middle;">
                                <div style="width: ${ratings.length > 0 ? (distribution[3] / ratings.length * 100) : 0}%; height: 100%; background: #FFC107; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-secondary);">${distribution[3]}</span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="font-size: 14px;">2星</span>
                            <div style="display: inline-block; width: 200px; height: 8px; background: #E5E7EB; border-radius: 4px; margin: 0 12px; vertical-align: middle;">
                                <div style="width: ${ratings.length > 0 ? (distribution[2] / ratings.length * 100) : 0}%; height: 100%; background: #FFC107; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-secondary);">${distribution[2]}</span>
                        </div>
                        <div>
                            <span style="font-size: 14px;">1星</span>
                            <div style="display: inline-block; width: 200px; height: 8px; background: #E5E7EB; border-radius: 4px; margin: 0 12px; vertical-align: middle;">
                                <div style="width: ${ratings.length > 0 ? (distribution[1] / ratings.length * 100) : 0}%; height: 100%; background: #FFC107; border-radius: 4px;"></div>
                            </div>
                            <span style="font-size: 14px; color: var(--text-secondary);">${distribution[1]}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <button class="btn-primary" onclick="showRatingModal('${toolId}'); this.closest('.modal').remove();">
                        ✍️ 写评价
                    </button>
                </div>

                <div class="rating-list">
                    ${ratings.length > 0
                        ? ratings.map(r => `
                            <div class="rating-item" style="padding: 16px; border-bottom: 1px solid var(--border-color);">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <div>
                                        <div style="font-weight: 600; margin-bottom: 4px;">${r.userName}</div>
                                        <div class="rating-stars" style="margin-bottom: 4px;">
                                            ${renderStars(r.rating)}
                                        </div>
                                    </div>
                                    <div style="color: var(--text-secondary); font-size: 14px;">${r.date}</div>
                                </div>
                                <div style="color: var(--text-primary); margin-bottom: 8px;">${r.comment}</div>
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <button class="btn-text" onclick="markRatingHelpful('${toolId}', ${r.id}); this.textContent = '👍 有用 (' + (${r.helpful} + 1) + ')';"
                                            style="padding: 4px 8px; font-size: 13px;">
                                        👍 有用 (${r.helpful})
                                    </button>
                                </div>
                            </div>
                        `).join('')
                        : '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">暂无评价</div>'
                    }
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

// 渲染星级
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = '';

    for (let i = 0; i < fullStars; i++) {
        html += '<span style="color: #FFC107; font-size: 16px;">★</span>';
    }
    if (hasHalfStar) {
        html += '<span style="color: #FFC107; font-size: 16px;">☆</span>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        html += '<span style="color: #E5E7EB; font-size: 16px;">☆</span>';
    }

    return html;
}

// 导出全局函数
window.showRatingModal = showRatingModal;
window.showRatingList = showRatingList;
window.confirmRating = confirmRating;
window.markRatingHelpful = markRatingHelpful;
window.getAverageRating = getAverageRating;
window.getRatingCount = getRatingCount;
