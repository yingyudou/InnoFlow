// TRIZ 引擎（底层，不暴露给用户）

// 39个工程参数（扩展版）
const TRIZ_PARAMETERS = {
    // 改善类参数
    SPEED: 9,           // 速度
    RELIABILITY: 27,    // 可靠性
    ACCURACY: 28,       // 测量精度
    MANUFACTURABILITY: 32, // 可制造性
    CONVENIENCE: 33,    // 使用便利性
    ADAPTABILITY: 35,   // 适应性
    COMPLEXITY_CONTROL: 36, // 系统复杂性
    AUTOMATION: 38,     // 自动化程度
    PRODUCTIVITY: 39,   // 生产率
    // 恶化类参数
    WEIGHT: 1,          // 运动物体的重量
    STATIONARY_WEIGHT: 2, // 静止物体的重量
    LENGTH: 3,          // 运动物体的长度
    AREA: 5,            // 运动物体的面积
    VOLUME: 7,          // 运动物体的体积
    ENERGY_LOSS: 19,    // 运动物体的能量消耗
    POWER_LOSS: 20,     // 功率损失
    MATERIAL_LOSS: 23,  // 物质损失
    TIME_LOSS: 25,      // 时间损失
    INFORMATION_LOSS: 24, // 信息损失
    NOISE: 30,          // 物体产生的有害因素
    HARMFUL_SIDE_EFFECTS: 31, // 物体产生的有害副作用
    WASTE: 19,          // 能量损失
    COST: 26,           // 成本
    STRESS: 11,         // 应力或压力
    STABILITY: 13,      // 稳定性
    STRENGTH: 14        // 强度
};

// 40个创新原理（完整映射到中性化表达）
const TRIZ_PRINCIPLES = {
    1: { name: '分割', neutral: '模块化', description: '将系统分解为独立模块，便于管理和优化' },
    2: { name: '抽取', neutral: '局部强化', description: '提取关键部分进行重点优化' },
    3: { name: '局部质量', neutral: '差异化设计', description: '不同部分采用不同特性以满足特定需求' },
    4: { name: '不对称', neutral: '非对称优化', description: '打破对称性以提升性能或功能' },
    5: { name: '合并', neutral: '功能整合', description: '合并相似或相邻功能，提高效率' },
    6: { name: '多功能性', neutral: '一物多用', description: '让一个对象执行多个功能' },
    7: { name: '嵌套', neutral: '层次化结构', description: '将对象放入另一个对象内，形成层次结构' },
    8: { name: '重量补偿', neutral: '平衡设计', description: '通过平衡机制抵消重量或力' },
    9: { name: '预先反作用', neutral: '预防性设计', description: '提前准备以应对可能出现的问题' },
    10: { name: '预先作用', neutral: '预置优化', description: '提前准备或预处理，减少后续工作量' },
    11: { name: '事先防范', neutral: '风险预防', description: '提前预防可能的故障或问题' },
    12: { name: '等势', neutral: '均衡设计', description: '消除工作对象中的高度差或势能差' },
    13: { name: '反向', neutral: '逆向思维', description: '采用相反的动作或方向解决问题' },
    14: { name: '曲面化', neutral: '柔性结构', description: '使用曲线或曲面替代直线和平面' },
    15: { name: '动态化', neutral: '自适应调节', description: '使系统能够动态调整以适应变化' },
    16: { name: '不足或过度作用', neutral: '适度设计', description: '如果难以达到100%的效果，稍微超过或不足一点' },
    17: { name: '多维化', neutral: '空间扩展', description: '将对象从一维变为二维或三维' },
    18: { name: '机械振动', neutral: '振动利用', description: '利用振动频率或共振效应' },
    19: { name: '周期性作用', neutral: '周期性优化', description: '采用周期性动作替代连续动作' },
    20: { name: '有效作用的连续性', neutral: '持续优化', description: '消除空闲和间歇性工作' },
    21: { name: '快速通过', neutral: '快速处理', description: '快速完成危险或有害的操作' },
    22: { name: '变害为利', neutral: '转化利用', description: '利用有害因素获得有益效果' },
    23: { name: '反馈', neutral: '反馈机制', description: '引入反馈机制以改善过程' },
    24: { name: '中介', neutral: '中介引入', description: '使用中介对象传递或执行动作' },
    25: { name: '自服务', neutral: '自我服务', description: '让对象自我服务或执行辅助功能' },
    26: { name: '复制', neutral: '资源再利用', description: '使用简单便宜的复制品替代复杂昂贵的对象' },
    27: { name: '廉价替代品', neutral: '成本优化', description: '用廉价对象替代昂贵对象' },
    28: { name: '机械系统替代', neutral: '系统替代', description: '用光学、声学、热学等系统替代机械系统' },
    29: { name: '气压和液压结构', neutral: '柔性结构', description: '使用气体或液体替代固体部件' },
    30: { name: '柔性外壳和薄膜', neutral: '柔性封装', description: '使用柔性外壳和薄膜替代刚性结构' },
    31: { name: '多孔材料', neutral: '多孔设计', description: '使对象多孔或添加多孔元素' },
    32: { name: '改变颜色', neutral: '视觉优化', description: '改变对象或其环境的颜色' },
    33: { name: '同质性', neutral: '材料统一', description: '让相互作用的对象使用相同材料' },
    34: { name: '抛弃与再生', neutral: '可回收设计', description: '让已完成功能的部分消失或再生' },
    35: { name: '参数变化', neutral: '参数优化', description: '改变物体的物理状态或参数' },
    36: { name: '相变', neutral: '状态转换', description: '利用相变过程中发生的现象' },
    37: { name: '热膨胀', neutral: '热效应利用', description: '利用材料的热膨胀或热收缩' },
    38: { name: '强氧化剂', neutral: '氧化增强', description: '使用富氧空气或纯氧替代普通空气' },
    39: { name: '惰性环境', neutral: '环境控制', description: '使用惰性环境替代普通环境' },
    40: { name: '复合材料', neutral: '材料优化', description: '使用复合材料替代单一材料' }
};

// 扩展版矛盾矩阵（覆盖更多参数组合）
const CONTRADICTION_MATRIX = {
    // [改善参数][恶化参数] = [推荐原理ID数组]
    [TRIZ_PARAMETERS.SPEED]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 15, 19], // 速度↑ 重量↑ → 模块化、自适应调节、周期性优化
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 5], // 速度↑ 复杂性↑ → 模块化、局部强化、功能整合
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 20], // 速度↑ 能耗↑ → 自适应调节、周期性优化、持续优化
        [TRIZ_PARAMETERS.RELIABILITY]: [11, 27], // 速度↑ 可靠性↓ → 风险预防、成本优化
        [TRIZ_PARAMETERS.ACCURACY]: [15, 19, 23], // 速度↑ 精度↓ → 自适应调节、周期性优化、反馈机制
        [TRIZ_PARAMETERS.COST]: [26, 27, 35], // 速度↑ 成本↑ → 资源再利用、成本优化、参数优化
        [TRIZ_PARAMETERS.TIME_LOSS]: [20, 21, 25] // 速度↑ 时间损失↑ → 持续优化、快速处理、自我服务
    },
    [TRIZ_PARAMETERS.RELIABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 10], // 可靠性↑ 复杂性↑ → 模块化、局部强化、预置优化
        [TRIZ_PARAMETERS.WEIGHT]: [1, 8, 26], // 可靠性↑ 重量↑ → 模块化、平衡设计、资源再利用
        [TRIZ_PARAMETERS.COST]: [26, 27, 35], // 可靠性↑ 成本↑ → 资源再利用、成本优化、参数优化
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 20], // 可靠性↑ 速度↓ → 自适应调节、周期性优化、持续优化
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 31], // 可靠性↑ 体积↑ → 模块化、层次化结构、多孔设计
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 25] // 可靠性↑ 能耗↑ → 自适应调节、周期性优化、自我服务
    },
    [TRIZ_PARAMETERS.CONVENIENCE]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 5, 6], // 便利性↑ 复杂性↑ → 模块化、功能整合、一物多用
        [TRIZ_PARAMETERS.WEIGHT]: [1, 7, 26], // 便利性↑ 重量↑ → 模块化、层次化结构、资源再利用
        [TRIZ_PARAMETERS.COST]: [26, 27, 6], // 便利性↑ 成本↑ → 资源再利用、成本优化、一物多用
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 30], // 便利性↑ 体积↑ → 模块化、层次化结构、柔性封装
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: [1, 5, 35] // 便利性↑ 可制造性↓ → 模块化、功能整合、参数优化
    },
    [TRIZ_PARAMETERS.ACCURACY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [2, 10, 15], // 精度↑ 复杂性↑ → 局部强化、预置优化、自适应调节
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 23], // 精度↑ 速度↓ → 自适应调节、周期性优化、反馈机制
        [TRIZ_PARAMETERS.COST]: [2, 26, 35], // 精度↑ 成本↑ → 局部强化、资源再利用、参数优化
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: [2, 10, 35], // 精度↑ 可制造性↓ → 局部强化、预置优化、参数优化
        [TRIZ_PARAMETERS.TIME_LOSS]: [15, 20, 23] // 精度↑ 时间损失↑ → 自适应调节、持续优化、反馈机制
    },
    [TRIZ_PARAMETERS.ADAPTABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 15, 35], // 适应性↑ 复杂性↑ → 模块化、自适应调节、参数优化
        [TRIZ_PARAMETERS.COST]: [15, 26, 35], // 适应性↑ 成本↑ → 自适应调节、资源再利用、参数优化
        [TRIZ_PARAMETERS.RELIABILITY]: [1, 11, 15] // 适应性↑ 可靠性↓ → 模块化、风险预防、自适应调节
    },
    [TRIZ_PARAMETERS.PRODUCTIVITY]: {
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 20], // 生产率↑ 能耗↑ → 自适应调节、周期性优化、持续优化
        [TRIZ_PARAMETERS.COST]: [26, 27, 35], // 生产率↑ 成本↑ → 资源再利用、成本优化、参数优化
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 5, 20] // 生产率↑ 复杂性↑ → 模块化、功能整合、持续优化
    },
    [TRIZ_PARAMETERS.AUTOMATION]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 23, 25], // 自动化↑ 复杂性↑ → 模块化、反馈机制、自我服务
        [TRIZ_PARAMETERS.COST]: [26, 27, 28], // 自动化↑ 成本↑ → 资源再利用、成本优化、系统替代
        [TRIZ_PARAMETERS.RELIABILITY]: [1, 11, 23] // 自动化↑ 可靠性↓ → 模块化、风险预防、反馈机制
    }
};

// 扩展的问题关键词到工程参数的映射规则
const KEYWORD_TO_PARAMETER = {
    // 速度相关
    '速度': TRIZ_PARAMETERS.SPEED,
    '快速': TRIZ_PARAMETERS.SPEED,
    '效率': TRIZ_PARAMETERS.SPEED,
    '响应': TRIZ_PARAMETERS.SPEED,
    '延迟': TRIZ_PARAMETERS.SPEED,
    '慢': TRIZ_PARAMETERS.SPEED,
    '迟缓': TRIZ_PARAMETERS.SPEED,
    '卡顿': TRIZ_PARAMETERS.SPEED,
    '流畅': TRIZ_PARAMETERS.SPEED,
    '吞吐': TRIZ_PARAMETERS.SPEED,
    '处理速度': TRIZ_PARAMETERS.SPEED,
    '执行速度': TRIZ_PARAMETERS.SPEED,
    // 重量相关
    '重量': TRIZ_PARAMETERS.WEIGHT,
    '轻': TRIZ_PARAMETERS.WEIGHT,
    '重': TRIZ_PARAMETERS.WEIGHT,
    '体积': TRIZ_PARAMETERS.VOLUME,
    '大小': TRIZ_PARAMETERS.VOLUME,
    '尺寸': TRIZ_PARAMETERS.VOLUME,
    '占用空间': TRIZ_PARAMETERS.VOLUME,
    '内存占用': TRIZ_PARAMETERS.VOLUME,
    '存储空间': TRIZ_PARAMETERS.VOLUME,
    // 可靠性相关
    '可靠': TRIZ_PARAMETERS.RELIABILITY,
    '稳定': TRIZ_PARAMETERS.RELIABILITY,
    '故障': TRIZ_PARAMETERS.RELIABILITY,
    '错误': TRIZ_PARAMETERS.RELIABILITY,
    '崩溃': TRIZ_PARAMETERS.RELIABILITY,
    '异常': TRIZ_PARAMETERS.RELIABILITY,
    '宕机': TRIZ_PARAMETERS.RELIABILITY,
    '容错': TRIZ_PARAMETERS.RELIABILITY,
    '健壮': TRIZ_PARAMETERS.RELIABILITY,
    '可用性': TRIZ_PARAMETERS.RELIABILITY,
    // 复杂性相关
    '复杂': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '简单': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '繁琐': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难用': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难懂': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难维护': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '耦合': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '模块化': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '架构': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    // 成本相关
    '成本': TRIZ_PARAMETERS.COST,
    '价格': TRIZ_PARAMETERS.COST,
    '便宜': TRIZ_PARAMETERS.COST,
    '昂贵': TRIZ_PARAMETERS.COST,
    '费用': TRIZ_PARAMETERS.COST,
    '开销': TRIZ_PARAMETERS.COST,
    '投入': TRIZ_PARAMETERS.COST,
    '预算': TRIZ_PARAMETERS.COST,
    // 能耗相关
    '能耗': TRIZ_PARAMETERS.ENERGY_LOSS,
    '节能': TRIZ_PARAMETERS.ENERGY_LOSS,
    '耗电': TRIZ_PARAMETERS.ENERGY_LOSS,
    '功率': TRIZ_PARAMETERS.POWER_LOSS,
    '资源消耗': TRIZ_PARAMETERS.ENERGY_LOSS,
    'CPU占用': TRIZ_PARAMETERS.ENERGY_LOSS,
    '性能开销': TRIZ_PARAMETERS.ENERGY_LOSS,
    // 便利性相关
    '便利': TRIZ_PARAMETERS.CONVENIENCE,
    '方便': TRIZ_PARAMETERS.CONVENIENCE,
    '易用': TRIZ_PARAMETERS.CONVENIENCE,
    '操作': TRIZ_PARAMETERS.CONVENIENCE,
    '用户体验': TRIZ_PARAMETERS.CONVENIENCE,
    '交互': TRIZ_PARAMETERS.CONVENIENCE,
    '界面': TRIZ_PARAMETERS.CONVENIENCE,
    '友好': TRIZ_PARAMETERS.CONVENIENCE,
    // 精度相关
    '精度': TRIZ_PARAMETERS.ACCURACY,
    '准确': TRIZ_PARAMETERS.ACCURACY,
    '误差': TRIZ_PARAMETERS.ACCURACY,
    '偏差': TRIZ_PARAMETERS.ACCURACY,
    '精确': TRIZ_PARAMETERS.ACCURACY,
    '匹配度': TRIZ_PARAMETERS.ACCURACY,
    // 时间相关
    '时间': TRIZ_PARAMETERS.TIME_LOSS,
    '耗时': TRIZ_PARAMETERS.TIME_LOSS,
    '等待': TRIZ_PARAMETERS.TIME_LOSS,
    '延迟': TRIZ_PARAMETERS.TIME_LOSS,
    '响应时间': TRIZ_PARAMETERS.TIME_LOSS,
    '处理时间': TRIZ_PARAMETERS.TIME_LOSS,
    // 适应性相关
    '适应': TRIZ_PARAMETERS.ADAPTABILITY,
    '灵活': TRIZ_PARAMETERS.ADAPTABILITY,
    '扩展': TRIZ_PARAMETERS.ADAPTABILITY,
    '兼容': TRIZ_PARAMETERS.ADAPTABILITY,
    '可配置': TRIZ_PARAMETERS.ADAPTABILITY,
    // 生产率相关
    '生产率': TRIZ_PARAMETERS.PRODUCTIVITY,
    '产出': TRIZ_PARAMETERS.PRODUCTIVITY,
    '效率': TRIZ_PARAMETERS.PRODUCTIVITY,
    '吞吐量': TRIZ_PARAMETERS.PRODUCTIVITY,
    // 自动化相关
    '自动化': TRIZ_PARAMETERS.AUTOMATION,
    '自动': TRIZ_PARAMETERS.AUTOMATION,
    '智能': TRIZ_PARAMETERS.AUTOMATION,
    // 可制造性相关
    '制造': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '生产': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '加工': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '工艺': TRIZ_PARAMETERS.MANUFACTURABILITY
};

/**
 * TRIZ 问题分析引擎（核心函数）
 * @param {string} problemText - 用户输入的问题描述
 * @returns {Object} 分析结果
 */
function analyzeProblemWithTRIZ(problemText) {
    // Step 1: 识别改善项和受损项
    const improvements = extractImprovements(problemText);
    const deteriorations = extractDeteriorations(problemText);

    // Step 2: 映射到工程参数
    const improveParams = mapToParameters(improvements);
    const deteriorateParams = mapToParameters(deteriorations);

    // Step 3: 识别矛盾
    const contradictions = identifyContradictions(improveParams, deteriorateParams);

    // Step 4: 从矛盾矩阵获取推荐原理
    const recommendedPrinciples = getRecommendedPrinciples(contradictions);

    // Step 5: 转换为中性化方向
    const directions = convertToNeutralDirections(recommendedPrinciples);

    return {
        improvements: improvements,
        deteriorations: deteriorations,
        improveParams: improveParams,
        deteriorateParams: deteriorateParams,
        conflicts: contradictions,
        directions: directions,
        rawPrinciples: recommendedPrinciples // 内部使用，不展示
    };
}

// 辅助函数：提取改善项
function extractImprovements(text) {
    const improvementKeywords = ['提升', '改善', '增强', '优化', '加快', '减少', '降低', '提高', '增加', '改进', '加强'];
    const improvements = [];
    const sentences = text.split(/[。，、；！？]/);

    sentences.forEach(sentence => {
        improvementKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                // 提取关键词前后的内容
                const index = sentence.indexOf(keyword);
                const context = sentence.substring(Math.max(0, index - 10), Math.min(sentence.length, index + 20));
                if (context.trim() && !improvements.includes(context.trim())) {
                    improvements.push(context.trim());
                }
            }
        });
    });

    return improvements.length > 0 ? improvements : ['系统性能'];
}

// 辅助函数：提取受损项
function extractDeteriorations(text) {
    const deteriorationKeywords = ['增加', '变差', '恶化', '降低', '变慢', '变重', '变复杂', '变贵', '变难', '影响'];
    const deteriorations = [];
    const sentences = text.split(/[。，、；！？]/);

    sentences.forEach(sentence => {
        deteriorationKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                const index = sentence.indexOf(keyword);
                const context = sentence.substring(Math.max(0, index - 10), Math.min(sentence.length, index + 20));
                if (context.trim() && !deteriorations.includes(context.trim())) {
                    deteriorations.push(context.trim());
                }
            }
        });
    });

    return deteriorations.length > 0 ? deteriorations : ['系统复杂度'];
}

// 辅助函数：映射到工程参数
function mapToParameters(keywords) {
    const params = [];
    const keywordText = keywords.join(' ');

    Object.keys(KEYWORD_TO_PARAMETER).forEach(key => {
        if (keywordText.includes(key)) {
            const param = KEYWORD_TO_PARAMETER[key];
            if (!params.includes(param)) {
                params.push(param);
            }
        }
    });

    // 如果没有匹配到，使用默认参数
    if (params.length === 0) {
        params.push(TRIZ_PARAMETERS.SPEED);
    }

    return params;
}

// 辅助函数：识别矛盾
function identifyContradictions(improveParams, deteriorateParams) {
    const contradictions = [];

    improveParams.forEach(improve => {
        deteriorateParams.forEach(deteriorate => {
            contradictions.push({
                improve: improve,
                deteriorate: deteriorate,
                improveName: getParameterName(improve),
                deteriorateName: getParameterName(deteriorate)
            });
        });
    });

    return contradictions;
}

// 辅助函数：获取推荐原理
function getRecommendedPrinciples(contradictions) {
    const principles = new Set();

    contradictions.forEach(contradiction => {
        const matrixEntry = CONTRADICTION_MATRIX[contradiction.improve]?.[contradiction.deteriorate];
        if (matrixEntry) {
            matrixEntry.forEach(principleId => {
                principles.add(principleId);
            });
        }
    });

    // 如果没有找到匹配的原理，使用通用原理
    if (principles.size === 0) {
        principles.add(1); // 模块化
        principles.add(15); // 自适应调节
        principles.add(5); // 功能整合
    }

    return Array.from(principles).slice(0, 6); // 最多返回6个
}

// 辅助函数：转换为中性化方向
function convertToNeutralDirections(principleIds) {
    return principleIds.map(id => {
        const principle = TRIZ_PRINCIPLES[id];
        if (!principle) {
            // 如果原理不存在，使用默认值
            return {
                id: id,
                name: '系统优化',
                description: '通过系统化方法优化解决方案',
                _trizName: '未知原理'
            };
        }
        return {
            id: id,
            name: principle.neutral, // 使用中性化名称
            description: principle.description,
            _trizName: principle.name // 内部标记，不展示
        };
    });
}

// 辅助函数：获取参数名称
function getParameterName(param) {
    const paramNames = {
        [TRIZ_PARAMETERS.SPEED]: '速度',
        [TRIZ_PARAMETERS.WEIGHT]: '重量',
        [TRIZ_PARAMETERS.RELIABILITY]: '可靠性',
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: '复杂性',
        [TRIZ_PARAMETERS.ENERGY_LOSS]: '能耗',
        [TRIZ_PARAMETERS.CONVENIENCE]: '便利性',
        [TRIZ_PARAMETERS.ACCURACY]: '精度',
        [TRIZ_PARAMETERS.TIME_LOSS]: '时间',
        [TRIZ_PARAMETERS.COST]: '成本',
        [TRIZ_PARAMETERS.VOLUME]: '体积',
        [TRIZ_PARAMETERS.ADAPTABILITY]: '适应性',
        [TRIZ_PARAMETERS.PRODUCTIVITY]: '生产率',
        [TRIZ_PARAMETERS.AUTOMATION]: '自动化',
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: '可制造性',
        [TRIZ_PARAMETERS.POWER_LOSS]: '功率',
        [TRIZ_PARAMETERS.MATERIAL_LOSS]: '材料',
        [TRIZ_PARAMETERS.INFORMATION_LOSS]: '信息',
        [TRIZ_PARAMETERS.NOISE]: '噪声',
        [TRIZ_PARAMETERS.HARMFUL_SIDE_EFFECTS]: '副作用'
    };
    return paramNames[param] || '性能';
}

// 导出全局函数和常量
window.analyzeProblemWithTRIZ = analyzeProblemWithTRIZ;
window.getParameterName = getParameterName;
window.TRIZ_PRINCIPLES = TRIZ_PRINCIPLES;
