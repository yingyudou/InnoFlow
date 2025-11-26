// TRIZ 引擎（底层，不暴露给用户）

// 完整的39个TRIZ工程参数
const TRIZ_PARAMETERS = {
    // 几何类参数
    WEIGHT: 1,              // 运动物体的重量
    STATIONARY_WEIGHT: 2,   // 静止物体的重量
    LENGTH: 3,              // 运动物体的长度
    STATIONARY_LENGTH: 4,   // 静止物体的长度
    AREA: 5,                // 运动物体的面积
    STATIONARY_AREA: 6,     // 静止物体的面积
    VOLUME: 7,              // 运动物体的体积
    STATIONARY_VOLUME: 8,   // 静止物体的体积

    // 物理类参数
    SPEED: 9,               // 速度
    FORCE: 10,              // 力
    STRESS: 11,             // 应力或压力
    SHAPE: 12,              // 形状
    STABILITY: 13,          // 结构的稳定性
    STRENGTH: 14,           // 强度
    MOVING_TIME: 15,        // 运动物体作用时间
    STATIONARY_TIME: 16,    // 静止物体作用时间
    TEMPERATURE: 17,        // 温度
    ILLUMINATION: 18,       // 光照度

    // 功能类参数
    ENERGY_LOSS: 19,        // 运动物体的能量消耗
    STATIONARY_ENERGY: 20,  // 静止物体的能量消耗
    POWER_LOSS: 21,         // 功率
    WASTE_ENERGY: 22,       // 能量损失
    MATERIAL_LOSS: 23,      // 物质损失
    INFORMATION_LOSS: 24,   // 信息损失
    TIME_LOSS: 25,          // 时间损失
    MATERIAL_AMOUNT: 26,    // 物质数量

    // 系统类参数
    RELIABILITY: 27,        // 可靠性
    ACCURACY: 28,           // 测量精度
    MANUFACTURING_ACCURACY: 29, // 制造精度
    HARMFUL_FACTORS: 30,    // 物体外部有害因素作用的敏感性
    HARMFUL_SIDE_EFFECTS: 31, // 物体产生的有害因素
    MANUFACTURABILITY: 32,  // 可制造性
    CONVENIENCE: 33,        // 可操作性/使用便利性
    MAINTAINABILITY: 34,    // 可维修性
    ADAPTABILITY: 35,      // 适应性/通用性
    COMPLEXITY_CONTROL: 36, // 装置的复杂性
    MEASUREMENT_COMPLEXITY: 37, // 控制和测量的复杂性
    AUTOMATION: 38,        // 自动化程度
    PRODUCTIVITY: 39       // 生产率
};

// 40个创新原理（完整映射到中性化表达，包含案例和应用示例）
const TRIZ_PRINCIPLES = {
    1: {
        name: '分割', neutral: '模块化',
        description: '将系统分解为独立模块，便于管理和优化',
        example: '微服务架构将单体应用拆分为多个独立服务，每个服务可独立开发、部署和扩展',
        application: '适用于需要提高系统可维护性、可扩展性的场景'
    },
    2: {
        name: '抽取', neutral: '局部强化',
        description: '提取关键部分进行重点优化',
        example: '数据库查询优化中，对热点数据建立索引，提升查询性能',
        application: '适用于系统存在明显瓶颈，需要重点优化的场景'
    },
    3: {
        name: '局部质量', neutral: '差异化设计',
        description: '不同部分采用不同特性以满足特定需求',
        example: '手机屏幕采用高分辨率，而背板采用耐磨材料，不同部位差异化设计',
        application: '适用于需要同时满足多种不同需求的场景'
    },
    4: {
        name: '不对称', neutral: '非对称优化',
        description: '打破对称性以提升性能或功能',
        example: '读写分离架构，读操作和写操作使用不同的服务器，提升系统吞吐量',
        application: '适用于操作类型有明显差异的场景'
    },
    5: {
        name: '合并', neutral: '功能整合',
        description: '合并相似或相邻功能，提高效率',
        example: '统一身份认证系统，一次登录可访问多个关联服务',
        application: '适用于存在功能重复或需要统一管理的场景'
    },
    6: {
        name: '多功能性', neutral: '一物多用',
        description: '让一个对象执行多个功能',
        example: '智能手机集成了电话、相机、导航、支付等多种功能',
        application: '适用于需要减少对象数量、提高资源利用率的场景'
    },
    7: {
        name: '嵌套', neutral: '层次化结构',
        description: '将对象放入另一个对象内，形成层次结构',
        example: '多级缓存体系：本地缓存、分布式缓存、CDN，逐级命中',
        application: '适用于需要分层管理或逐级处理的场景'
    },
    8: {
        name: '重量补偿', neutral: '平衡设计',
        description: '通过平衡机制抵消重量或力',
        example: '负载均衡器将请求均匀分配到各服务器，避免单点过载',
        application: '适用于需要平衡负载或资源的场景'
    },
    9: {
        name: '预先反作用', neutral: '预防性设计',
        description: '提前准备以应对可能出现的问题',
        example: '系统健康检查机制，定期检测组件状态，提前发现潜在问题',
        application: '适用于需要预防故障或问题的场景'
    },
    10: {
        name: '预先作用', neutral: '预置优化',
        description: '提前准备或预处理，减少后续工作量',
        example: '系统启动时预加载热点数据到缓存，避免冷启动性能瓶颈',
        application: '适用于可以提前准备以提升性能的场景'
    },
    11: {
        name: '事先防范', neutral: '风险预防',
        description: '提前预防可能的故障或问题',
        example: '多重验证机制，在关键操作前进行身份、权限、二次确认',
        application: '适用于需要降低风险或提高安全性的场景'
    },
    12: {
        name: '等势', neutral: '均衡设计',
        description: '消除工作对象中的高度差或势能差',
        example: '数据均衡分布到多个存储节点，避免数据倾斜',
        application: '适用于需要均衡分配资源或负载的场景'
    },
    13: {
        name: '反向', neutral: '逆向思维',
        description: '采用相反的动作或方向解决问题',
        example: '反向代理架构，客户端请求先到代理服务器，由代理转发到后端',
        application: '适用于常规方法效果不佳，需要反向思考的场景'
    },
    14: {
        name: '曲面化', neutral: '柔性结构',
        description: '使用曲线或曲面替代直线和平面',
        example: '弹性伸缩架构，系统可根据负载自动伸缩，灵活应对流量变化',
        application: '适用于需要灵活适应变化的场景'
    },
    15: {
        name: '动态化', neutral: '自适应调节',
        description: '使系统能够动态调整以适应变化',
        example: '智能负载均衡，根据服务器实时负载动态调整请求分配',
        application: '适用于环境或需求经常变化的场景'
    },
    16: {
        name: '不足或过度作用', neutral: '适度设计',
        description: '如果难以达到100%的效果，稍微超过或不足一点',
        example: '渐进式功能发布，新功能先小范围测试，逐步扩大范围',
        application: '适用于难以达到完美效果，需要平衡的场景'
    },
    17: {
        name: '多维化', neutral: '空间扩展',
        description: '将对象从一维变为二维或三维',
        example: '从单机扩展到分布式架构，通过水平扩展提升系统容量',
        application: '适用于需要扩展系统规模或能力的场景'
    },
    18: {
        name: '机械振动', neutral: '振动利用',
        description: '利用振动频率或共振效应',
        example: '心跳检测机制，利用定期心跳监控服务状态，快速发现故障',
        application: '适用于需要周期性检测或利用周期性特征的场景'
    },
    19: {
        name: '周期性作用', neutral: '周期性优化',
        description: '采用周期性动作替代连续动作',
        example: '定时任务优化，将连续运行的任务改为定时执行，降低系统负载',
        application: '适用于可以批量处理或周期性处理的场景'
    },
    20: {
        name: '有效作用的连续性', neutral: '持续优化',
        description: '消除空闲和间歇性工作',
        example: '持续集成部署，代码变更自动构建、测试、部署，持续优化开发效率',
        application: '适用于需要持续改进或消除空闲时间的场景'
    },
    21: {
        name: '快速通过', neutral: '快速处理',
        description: '快速完成危险或有害的操作',
        example: '异步处理机制，将耗时操作改为异步处理，快速响应用户请求',
        application: '适用于需要快速响应或处理耗时操作的场景'
    },
    22: {
        name: '变害为利', neutral: '转化利用',
        description: '利用有害因素获得有益效果',
        example: '错误日志分析，将错误日志转化为有价值的信息，分析错误模式优化系统',
        application: '适用于存在有害因素，可以转化为有益的场景'
    },
    23: {
        name: '反馈', neutral: '反馈机制',
        description: '引入反馈机制以改善过程',
        example: '实时反馈系统，用户操作立即得到反馈，提升交互体验',
        application: '适用于需要实时调整或改进的场景'
    },
    24: {
        name: '中介', neutral: '中介引入',
        description: '使用中介对象传递或执行动作',
        example: 'API网关作为统一入口，统一处理认证、限流、路由等横切关注点',
        application: '适用于需要统一处理或解耦的场景'
    },
    25: {
        name: '自服务', neutral: '自我服务',
        description: '让对象自我服务或执行辅助功能',
        example: '自动化运维，系统自动监控、诊断、修复常见问题，减少人工干预',
        application: '适用于需要自动化或减少人工干预的场景'
    },
    26: {
        name: '复制', neutral: '资源再利用',
        description: '使用简单便宜的复制品替代复杂昂贵的对象',
        example: '对象池技术，复用数据库连接、线程等资源，避免频繁创建销毁',
        application: '适用于需要提高资源利用率的场景'
    },
    27: {
        name: '廉价替代品', neutral: '成本优化',
        description: '用廉价对象替代昂贵对象',
        example: '按需资源分配，根据实际需求动态分配资源，避免资源浪费',
        application: '适用于需要降低成本的场景'
    },
    28: {
        name: '机械系统替代', neutral: '系统替代',
        description: '用光学、声学、热学等系统替代机械系统',
        example: '用微服务架构替代单体架构，用NoSQL替代关系型数据库',
        application: '适用于需要改变系统架构或技术的场景'
    },
    29: {
        name: '气压和液压结构', neutral: '柔性结构',
        description: '使用气体或液体替代固体部件',
        example: '容器化部署，使用容器技术实现环境隔离，每个服务运行在独立环境中',
        application: '适用于需要灵活部署或隔离的场景'
    },
    30: {
        name: '柔性外壳和薄膜', neutral: '柔性封装',
        description: '使用柔性外壳和薄膜替代刚性结构',
        example: 'API版本管理，通过版本控制实现向后兼容，新老版本共存',
        application: '适用于需要兼容性或灵活性的场景'
    },
    31: {
        name: '多孔材料', neutral: '多孔设计',
        description: '使对象多孔或添加多孔元素',
        example: '分布式存储，数据分散存储到多个节点，提高存储容量和访问性能',
        application: '适用于需要分布式或分散处理的场景'
    },
    32: {
        name: '改变颜色', neutral: '视觉优化',
        description: '改变对象或其环境的颜色',
        example: '界面色彩优化，通过颜色、大小、位置等视觉元素区分信息层次',
        application: '适用于需要视觉区分或优化的场景'
    },
    33: {
        name: '同质性', neutral: '材料统一',
        description: '让相互作用的对象使用相同材料',
        example: '统一技术栈，全栈采用统一的技术栈，降低学习成本',
        application: '适用于需要统一标准或规范的场景'
    },
    34: {
        name: '抛弃与再生', neutral: '可回收设计',
        description: '让已完成功能的部分消失或再生',
        example: '资源自动回收，系统自动回收不再使用的资源，避免资源泄漏',
        application: '适用于需要资源回收或再利用的场景'
    },
    35: {
        name: '参数变化', neutral: '参数优化',
        description: '改变物体的物理状态或参数',
        example: '性能参数调优，根据实际运行情况调整系统参数，优化性能',
        application: '适用于可以通过调整参数优化的场景'
    },
    36: {
        name: '相变', neutral: '状态转换',
        description: '利用相变过程中发生的现象',
        example: '状态机设计，使用状态机管理对象状态转换，状态转换逻辑清晰',
        application: '适用于需要状态管理的场景'
    },
    37: {
        name: '热膨胀', neutral: '热效应利用',
        description: '利用材料的热膨胀或热收缩',
        example: '热点数据识别，识别系统中的热点数据，优先缓存和优化',
        application: '适用于存在热点或重点区域的场景'
    },
    38: {
        name: '强氧化剂', neutral: '氧化增强',
        description: '使用富氧空气或纯氧替代普通空气',
        example: '功能增强机制，通过插件、扩展等方式增强系统功能',
        application: '适用于需要增强功能或能力的场景'
    },
    39: {
        name: '惰性环境', neutral: '环境控制',
        description: '使用惰性环境替代普通环境',
        example: '多环境管理，统一管理开发、测试、生产等多环境，环境隔离',
        application: '适用于需要环境隔离或控制的场景'
    },
    40: {
        name: '复合材料', neutral: '材料优化',
        description: '使用复合材料替代单一材料',
        example: '技术选型优化，选择最适合的技术栈，平衡性能、成本、可维护性',
        application: '适用于需要优化技术选型或材料选择的场景'
    }
};

// 扩展版矛盾矩阵（覆盖更多参数组合）
// 基于标准TRIZ矛盾矩阵，扩展了常见参数组合
const CONTRADICTION_MATRIX = {
    // [改善参数][恶化参数] = [推荐原理ID数组]
    [TRIZ_PARAMETERS.SPEED]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 15, 19], // 速度↑ 重量↑
        [TRIZ_PARAMETERS.STATIONARY_WEIGHT]: [1, 15, 19],
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 5],
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 20],
        [TRIZ_PARAMETERS.RELIABILITY]: [11, 27],
        [TRIZ_PARAMETERS.ACCURACY]: [15, 19, 23],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.TIME_LOSS]: [20, 21, 25],
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 15],
        [TRIZ_PARAMETERS.STRENGTH]: [1, 8, 15]
    },
    [TRIZ_PARAMETERS.RELIABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 10],
        [TRIZ_PARAMETERS.WEIGHT]: [1, 8, 26],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 20],
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 31],
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 25],
        [TRIZ_PARAMETERS.AUTOMATION]: [1, 11, 23],
        [TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY]: [1, 10, 23]
    },
    [TRIZ_PARAMETERS.CONVENIENCE]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 5, 6],
        [TRIZ_PARAMETERS.WEIGHT]: [1, 7, 26],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 6],
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 30],
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: [1, 5, 35],
        [TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY]: [1, 5, 6]
    },
    [TRIZ_PARAMETERS.ACCURACY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [2, 10, 15],
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 23],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [2, 26, 35],
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: [2, 10, 35],
        [TRIZ_PARAMETERS.TIME_LOSS]: [15, 20, 23],
        [TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY]: [2, 10, 23]
    },
    [TRIZ_PARAMETERS.ADAPTABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 15, 35],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [15, 26, 35],
        [TRIZ_PARAMETERS.RELIABILITY]: [1, 11, 15],
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: [1, 15, 35]
    },
    [TRIZ_PARAMETERS.PRODUCTIVITY]: {
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 20],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 5, 20],
        [TRIZ_PARAMETERS.TIME_LOSS]: [20, 25, 35],
        [TRIZ_PARAMETERS.AUTOMATION]: [15, 25, 38]
    },
    [TRIZ_PARAMETERS.AUTOMATION]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 23, 25],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 28],
        [TRIZ_PARAMETERS.RELIABILITY]: [1, 11, 23],
        [TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY]: [1, 23, 28]
    },
    [TRIZ_PARAMETERS.STRENGTH]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 8, 40],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 40],
        [TRIZ_PARAMETERS.VOLUME]: [1, 7, 40],
        [TRIZ_PARAMETERS.SPEED]: [1, 15, 19]
    },
    [TRIZ_PARAMETERS.STABILITY]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 8, 12],
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 8, 12],
        [TRIZ_PARAMETERS.SPEED]: [1, 8, 15]
    },
    [TRIZ_PARAMETERS.MANUFACTURABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 5],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.ACCURACY]: [2, 10, 35],
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 20]
    },
    [TRIZ_PARAMETERS.MAINTAINABILITY]: {
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: [1, 2, 5],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.CONVENIENCE]: [1, 5, 6]
    },
    [TRIZ_PARAMETERS.FORCE]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 8, 15],
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 20],
        [TRIZ_PARAMETERS.STRESS]: [1, 8, 15]
    },
    [TRIZ_PARAMETERS.TEMPERATURE]: {
        [TRIZ_PARAMETERS.ENERGY_LOSS]: [15, 19, 37],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [26, 27, 35],
        [TRIZ_PARAMETERS.SPEED]: [15, 19, 37]
    },
    [TRIZ_PARAMETERS.VOLUME]: {
        [TRIZ_PARAMETERS.WEIGHT]: [1, 7, 31],
        [TRIZ_PARAMETERS.SPEED]: [1, 7, 15],
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: [1, 7, 26]
    }
};

// 扩展的问题关键词到工程参数的映射规则
const KEYWORD_TO_PARAMETER = {
    // 速度相关 (9)
    '速度': TRIZ_PARAMETERS.SPEED,
    '快速': TRIZ_PARAMETERS.SPEED,
    '响应': TRIZ_PARAMETERS.SPEED,
    '慢': TRIZ_PARAMETERS.SPEED,
    '迟缓': TRIZ_PARAMETERS.SPEED,
    '卡顿': TRIZ_PARAMETERS.SPEED,
    '流畅': TRIZ_PARAMETERS.SPEED,
    '吞吐': TRIZ_PARAMETERS.SPEED,
    '处理速度': TRIZ_PARAMETERS.SPEED,
    '执行速度': TRIZ_PARAMETERS.SPEED,
    '运行速度': TRIZ_PARAMETERS.SPEED,
    // 重量相关 (1, 2)
    '重量': TRIZ_PARAMETERS.WEIGHT,
    '轻': TRIZ_PARAMETERS.WEIGHT,
    '重': TRIZ_PARAMETERS.WEIGHT,
    '质量': TRIZ_PARAMETERS.WEIGHT,
    // 长度相关 (3, 4)
    '长度': TRIZ_PARAMETERS.LENGTH,
    '距离': TRIZ_PARAMETERS.LENGTH,
    '宽度': TRIZ_PARAMETERS.LENGTH,
    '高度': TRIZ_PARAMETERS.LENGTH,
    // 面积相关 (5, 6)
    '面积': TRIZ_PARAMETERS.AREA,
    '表面积': TRIZ_PARAMETERS.AREA,
    // 体积相关 (7, 8)
    '体积': TRIZ_PARAMETERS.VOLUME,
    '大小': TRIZ_PARAMETERS.VOLUME,
    '尺寸': TRIZ_PARAMETERS.VOLUME,
    '占用空间': TRIZ_PARAMETERS.VOLUME,
    '内存占用': TRIZ_PARAMETERS.VOLUME,
    '存储空间': TRIZ_PARAMETERS.VOLUME,
    '容量': TRIZ_PARAMETERS.VOLUME,
    // 力相关 (10)
    '力': TRIZ_PARAMETERS.FORCE,
    '压力': TRIZ_PARAMETERS.STRESS,
    '应力': TRIZ_PARAMETERS.STRESS,
    '负载': TRIZ_PARAMETERS.FORCE,
    '承载力': TRIZ_PARAMETERS.FORCE,
    // 形状相关 (12)
    '形状': TRIZ_PARAMETERS.SHAPE,
    '外形': TRIZ_PARAMETERS.SHAPE,
    '结构': TRIZ_PARAMETERS.SHAPE,
    // 稳定性相关 (13)
    '稳定': TRIZ_PARAMETERS.STABILITY,
    '稳定性': TRIZ_PARAMETERS.STABILITY,
    '平衡': TRIZ_PARAMETERS.STABILITY,
    '失衡': TRIZ_PARAMETERS.STABILITY,
    // 强度相关 (14)
    '强度': TRIZ_PARAMETERS.STRENGTH,
    '坚固': TRIZ_PARAMETERS.STRENGTH,
    '脆弱': TRIZ_PARAMETERS.STRENGTH,
    '耐用': TRIZ_PARAMETERS.STRENGTH,
    // 时间相关 (15, 16, 25)
    '时间': TRIZ_PARAMETERS.TIME_LOSS,
    '耗时': TRIZ_PARAMETERS.TIME_LOSS,
    '等待': TRIZ_PARAMETERS.TIME_LOSS,
    '延迟': TRIZ_PARAMETERS.TIME_LOSS,
    '响应时间': TRIZ_PARAMETERS.TIME_LOSS,
    '处理时间': TRIZ_PARAMETERS.TIME_LOSS,
    '执行时间': TRIZ_PARAMETERS.TIME_LOSS,
    '周期': TRIZ_PARAMETERS.MOVING_TIME,
    // 温度相关 (17)
    '温度': TRIZ_PARAMETERS.TEMPERATURE,
    '热': TRIZ_PARAMETERS.TEMPERATURE,
    '冷': TRIZ_PARAMETERS.TEMPERATURE,
    '过热': TRIZ_PARAMETERS.TEMPERATURE,
    '冷却': TRIZ_PARAMETERS.TEMPERATURE,
    // 光照度相关 (18)
    '亮度': TRIZ_PARAMETERS.ILLUMINATION,
    '光照': TRIZ_PARAMETERS.ILLUMINATION,
    '照明': TRIZ_PARAMETERS.ILLUMINATION,
    // 能耗相关 (19, 20, 21, 22)
    '能耗': TRIZ_PARAMETERS.ENERGY_LOSS,
    '节能': TRIZ_PARAMETERS.ENERGY_LOSS,
    '耗电': TRIZ_PARAMETERS.ENERGY_LOSS,
    '功率': TRIZ_PARAMETERS.POWER_LOSS,
    '资源消耗': TRIZ_PARAMETERS.ENERGY_LOSS,
    'CPU占用': TRIZ_PARAMETERS.ENERGY_LOSS,
    '性能开销': TRIZ_PARAMETERS.ENERGY_LOSS,
    '能量': TRIZ_PARAMETERS.ENERGY_LOSS,
    '电力': TRIZ_PARAMETERS.ENERGY_LOSS,
    // 物质相关 (23, 26)
    '材料': TRIZ_PARAMETERS.MATERIAL_LOSS,
    '物质': TRIZ_PARAMETERS.MATERIAL_LOSS,
    '资源': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '数量': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    // 信息相关 (24)
    '信息': TRIZ_PARAMETERS.INFORMATION_LOSS,
    '数据': TRIZ_PARAMETERS.INFORMATION_LOSS,
    '信号': TRIZ_PARAMETERS.INFORMATION_LOSS,
    // 可靠性相关 (27)
    '可靠': TRIZ_PARAMETERS.RELIABILITY,
    '可靠性': TRIZ_PARAMETERS.RELIABILITY,
    '故障': TRIZ_PARAMETERS.RELIABILITY,
    '错误': TRIZ_PARAMETERS.RELIABILITY,
    '崩溃': TRIZ_PARAMETERS.RELIABILITY,
    '异常': TRIZ_PARAMETERS.RELIABILITY,
    '宕机': TRIZ_PARAMETERS.RELIABILITY,
    '容错': TRIZ_PARAMETERS.RELIABILITY,
    '健壮': TRIZ_PARAMETERS.RELIABILITY,
    '可用性': TRIZ_PARAMETERS.RELIABILITY,
    // 精度相关 (28, 29)
    '精度': TRIZ_PARAMETERS.ACCURACY,
    '准确': TRIZ_PARAMETERS.ACCURACY,
    '误差': TRIZ_PARAMETERS.ACCURACY,
    '偏差': TRIZ_PARAMETERS.ACCURACY,
    '精确': TRIZ_PARAMETERS.ACCURACY,
    '匹配度': TRIZ_PARAMETERS.ACCURACY,
    '测量精度': TRIZ_PARAMETERS.ACCURACY,
    '制造精度': TRIZ_PARAMETERS.MANUFACTURING_ACCURACY,
    // 有害因素相关 (30, 31)
    '噪声': TRIZ_PARAMETERS.HARMFUL_FACTORS,
    '干扰': TRIZ_PARAMETERS.HARMFUL_FACTORS,
    '副作用': TRIZ_PARAMETERS.HARMFUL_SIDE_EFFECTS,
    '有害': TRIZ_PARAMETERS.HARMFUL_SIDE_EFFECTS,
    '污染': TRIZ_PARAMETERS.HARMFUL_SIDE_EFFECTS,
    // 可制造性相关 (32)
    '制造': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '生产': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '加工': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '工艺': TRIZ_PARAMETERS.MANUFACTURABILITY,
    '可制造': TRIZ_PARAMETERS.MANUFACTURABILITY,
    // 便利性相关 (33)
    '便利': TRIZ_PARAMETERS.CONVENIENCE,
    '方便': TRIZ_PARAMETERS.CONVENIENCE,
    '易用': TRIZ_PARAMETERS.CONVENIENCE,
    '操作': TRIZ_PARAMETERS.CONVENIENCE,
    '用户体验': TRIZ_PARAMETERS.CONVENIENCE,
    '交互': TRIZ_PARAMETERS.CONVENIENCE,
    '界面': TRIZ_PARAMETERS.CONVENIENCE,
    '友好': TRIZ_PARAMETERS.CONVENIENCE,
    '易操作': TRIZ_PARAMETERS.CONVENIENCE,
    // 可维修性相关 (34)
    '维修': TRIZ_PARAMETERS.MAINTAINABILITY,
    '维护': TRIZ_PARAMETERS.MAINTAINABILITY,
    '保养': TRIZ_PARAMETERS.MAINTAINABILITY,
    '可维修': TRIZ_PARAMETERS.MAINTAINABILITY,
    // 适应性相关 (35)
    '适应': TRIZ_PARAMETERS.ADAPTABILITY,
    '灵活': TRIZ_PARAMETERS.ADAPTABILITY,
    '扩展': TRIZ_PARAMETERS.ADAPTABILITY,
    '兼容': TRIZ_PARAMETERS.ADAPTABILITY,
    '可配置': TRIZ_PARAMETERS.ADAPTABILITY,
    '通用': TRIZ_PARAMETERS.ADAPTABILITY,
    // 复杂性相关 (36, 37)
    '复杂': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '简单': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '繁琐': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难用': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难懂': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '难维护': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '耦合': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '模块化': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '架构': TRIZ_PARAMETERS.COMPLEXITY_CONTROL,
    '测量复杂': TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY,
    '控制复杂': TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY,
    // 自动化相关 (38)
    '自动化': TRIZ_PARAMETERS.AUTOMATION,
    '自动': TRIZ_PARAMETERS.AUTOMATION,
    '智能': TRIZ_PARAMETERS.AUTOMATION,
    // 生产率相关 (39)
    '生产率': TRIZ_PARAMETERS.PRODUCTIVITY,
    '产出': TRIZ_PARAMETERS.PRODUCTIVITY,
    '效率': TRIZ_PARAMETERS.PRODUCTIVITY,
    '吞吐量': TRIZ_PARAMETERS.PRODUCTIVITY,
    // 成本相关（映射到物质数量26）
    '成本': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '价格': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '便宜': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '昂贵': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '费用': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '开销': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '投入': TRIZ_PARAMETERS.MATERIAL_AMOUNT,
    '预算': TRIZ_PARAMETERS.MATERIAL_AMOUNT
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

// 辅助函数：提取改善项（增强版）
function extractImprovements(text) {
    // 扩展的改善关键词，包括否定形式
    const improvementKeywords = [
        '提升', '改善', '增强', '优化', '加快', '提高', '增加', '改进', '加强',
        '更快', '更好', '更优', '更高效', '更稳定', '更可靠', '更准确',
        '减少', '降低', '缩短', '简化', '减轻', '缩小',
        '需要', '希望', '想要', '期望', '要求',
        '提升', '改善', '优化', '增强', '改进'
    ];

    const improvements = [];
    const sentences = text.split(/[。，、；！？\n]/);

    // 模式匹配：寻找"提升/改善/优化 + 名词"的结构
    const improvementPatterns = [
        /(?:提升|改善|优化|增强|改进|加快|提高|加强|减少|降低|缩短|简化)\s*([^，。；！？\s]{2,10})/g,
        /([^，。；！？\s]{2,10})\s*(?:更快|更好|更优|更高效|更稳定|更可靠|更准确)/g,
        /(?:需要|希望|想要|期望|要求)\s*([^，。；！？\s]{2,10})/g
    ];

    sentences.forEach(sentence => {
        // 使用模式匹配
        improvementPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(sentence)) !== null) {
                const extracted = match[1] || match[0];
                if (extracted && extracted.length >= 2 && extracted.length <= 15) {
                    if (!improvements.includes(extracted)) {
                        improvements.push(extracted);
                    }
                }
            }
        });

        // 关键词匹配（作为补充）
        improvementKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                const index = sentence.indexOf(keyword);
                const before = sentence.substring(Math.max(0, index - 8), index).trim();
                const after = sentence.substring(index + keyword.length, Math.min(sentence.length, index + keyword.length + 12)).trim();
                const context = (before + ' ' + keyword + ' ' + after).trim();
                if (context.length > 0 && context.length < 30 && !improvements.includes(context)) {
                    improvements.push(context);
                }
            }
        });
    });

    // 去重和清理
    const cleaned = improvements
        .filter(item => item && item.trim().length > 0)
        .map(item => item.trim())
        .filter((item, index, self) => self.indexOf(item) === index)
        .slice(0, 5); // 最多保留5个

    return cleaned.length > 0 ? cleaned : ['系统性能'];
}

// 辅助函数：提取受损项（增强版）
function extractDeteriorations(text) {
    // 扩展的受损关键词
    const deteriorationKeywords = [
        '增加', '变差', '恶化', '降低', '变慢', '变重', '变复杂', '变贵', '变难',
        '影响', '导致', '造成', '引起', '带来',
        '更慢', '更差', '更重', '更复杂', '更贵', '更难',
        '问题', '困难', '挑战', '瓶颈', '障碍'
    ];

    const deteriorations = [];
    const sentences = text.split(/[。，、；！？\n]/);

    // 模式匹配
    const deteriorationPatterns = [
        /(?:增加|变差|恶化|降低|变慢|变重|变复杂|变贵|变难)\s*([^，。；！？\s]{2,10})/g,
        /([^，。；！？\s]{2,10})\s*(?:更慢|更差|更重|更复杂|更贵|更难)/g,
        /(?:导致|造成|引起|带来)\s*([^，。；！？\s]{2,10})/g,
        /([^，。；！？\s]{2,10})\s*(?:问题|困难|挑战|瓶颈|障碍)/g
    ];

    sentences.forEach(sentence => {
        // 使用模式匹配
        deteriorationPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(sentence)) !== null) {
                const extracted = match[1] || match[0];
                if (extracted && extracted.length >= 2 && extracted.length <= 15) {
                    if (!deteriorations.includes(extracted)) {
                        deteriorations.push(extracted);
                    }
                }
            }
        });

        // 关键词匹配（作为补充）
        deteriorationKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                const index = sentence.indexOf(keyword);
                const before = sentence.substring(Math.max(0, index - 8), index).trim();
                const after = sentence.substring(index + keyword.length, Math.min(sentence.length, index + keyword.length + 12)).trim();
                const context = (before + ' ' + keyword + ' ' + after).trim();
                if (context.length > 0 && context.length < 30 && !deteriorations.includes(context)) {
                    deteriorations.push(context);
                }
            }
        });
    });

    // 去重和清理
    const cleaned = deteriorations
        .filter(item => item && item.trim().length > 0)
        .map(item => item.trim())
        .filter((item, index, self) => self.indexOf(item) === index)
        .slice(0, 5); // 最多保留5个

    return cleaned.length > 0 ? cleaned : ['系统复杂度'];
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
        [TRIZ_PARAMETERS.WEIGHT]: '运动物体重量',
        [TRIZ_PARAMETERS.STATIONARY_WEIGHT]: '静止物体重量',
        [TRIZ_PARAMETERS.LENGTH]: '运动物体长度',
        [TRIZ_PARAMETERS.STATIONARY_LENGTH]: '静止物体长度',
        [TRIZ_PARAMETERS.AREA]: '运动物体面积',
        [TRIZ_PARAMETERS.STATIONARY_AREA]: '静止物体面积',
        [TRIZ_PARAMETERS.VOLUME]: '运动物体体积',
        [TRIZ_PARAMETERS.STATIONARY_VOLUME]: '静止物体体积',
        [TRIZ_PARAMETERS.SPEED]: '速度',
        [TRIZ_PARAMETERS.FORCE]: '力',
        [TRIZ_PARAMETERS.STRESS]: '应力/压力',
        [TRIZ_PARAMETERS.SHAPE]: '形状',
        [TRIZ_PARAMETERS.STABILITY]: '稳定性',
        [TRIZ_PARAMETERS.STRENGTH]: '强度',
        [TRIZ_PARAMETERS.MOVING_TIME]: '运动物体作用时间',
        [TRIZ_PARAMETERS.STATIONARY_TIME]: '静止物体作用时间',
        [TRIZ_PARAMETERS.TEMPERATURE]: '温度',
        [TRIZ_PARAMETERS.ILLUMINATION]: '光照度',
        [TRIZ_PARAMETERS.ENERGY_LOSS]: '能量消耗',
        [TRIZ_PARAMETERS.STATIONARY_ENERGY]: '静止物体能量',
        [TRIZ_PARAMETERS.POWER_LOSS]: '功率',
        [TRIZ_PARAMETERS.WASTE_ENERGY]: '能量损失',
        [TRIZ_PARAMETERS.MATERIAL_LOSS]: '物质损失',
        [TRIZ_PARAMETERS.INFORMATION_LOSS]: '信息损失',
        [TRIZ_PARAMETERS.TIME_LOSS]: '时间损失',
        [TRIZ_PARAMETERS.MATERIAL_AMOUNT]: '物质数量/成本',
        [TRIZ_PARAMETERS.RELIABILITY]: '可靠性',
        [TRIZ_PARAMETERS.ACCURACY]: '测量精度',
        [TRIZ_PARAMETERS.MANUFACTURING_ACCURACY]: '制造精度',
        [TRIZ_PARAMETERS.HARMFUL_FACTORS]: '有害因素敏感性',
        [TRIZ_PARAMETERS.HARMFUL_SIDE_EFFECTS]: '有害副作用',
        [TRIZ_PARAMETERS.MANUFACTURABILITY]: '可制造性',
        [TRIZ_PARAMETERS.CONVENIENCE]: '可操作性',
        [TRIZ_PARAMETERS.MAINTAINABILITY]: '可维修性',
        [TRIZ_PARAMETERS.ADAPTABILITY]: '适应性',
        [TRIZ_PARAMETERS.COMPLEXITY_CONTROL]: '装置复杂性',
        [TRIZ_PARAMETERS.MEASUREMENT_COMPLEXITY]: '测量复杂性',
        [TRIZ_PARAMETERS.AUTOMATION]: '自动化程度',
        [TRIZ_PARAMETERS.PRODUCTIVITY]: '生产率'
    };
    return paramNames[param] || '性能';
}

/**
 * 理想解（IFR - Ideal Final Result）分析
 * TRIZ中的理想解是指系统在理想状态下应该达到的效果
 * @param {string} problemText - 问题描述
 * @param {Object} analysis - TRIZ分析结果
 * @returns {Object} 理想解分析结果
 */
function analyzeIdealSolution(problemText, analysis) {
    // 提取核心功能需求
    const coreFunctions = extractCoreFunctions(problemText);

    // 生成理想解描述
    const idealSolution = {
        description: generateIdealDescription(coreFunctions, analysis),
        keyPoints: [
            '系统自动完成所需功能，无需人工干预',
            '不消耗额外资源，甚至产生额外价值',
            '不产生有害副作用',
            '系统自身具备所需能力，无需外部辅助'
        ],
        constraints: extractConstraints(problemText),
        suggestions: generateIFRSuggestions(analysis)
    };

    return idealSolution;
}

// 提取核心功能
function extractCoreFunctions(text) {
    const functionKeywords = ['功能', '需求', '需要', '实现', '完成', '提供', '支持'];
    const functions = [];
    const sentences = text.split(/[。，、；！？\n]/);

    sentences.forEach(sentence => {
        functionKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                const index = sentence.indexOf(keyword);
                const context = sentence.substring(Math.max(0, index - 8), Math.min(sentence.length, index + 15));
                if (context.trim() && !functions.includes(context.trim())) {
                    functions.push(context.trim());
                }
            }
        });
    });

    return functions.length > 0 ? functions : ['提升系统性能'];
}

// 生成理想解描述
function generateIdealDescription(coreFunctions, analysis) {
    const mainFunction = coreFunctions[0] || '系统功能';
    return `理想情况下，${mainFunction}应该自动、高效地完成，无需消耗额外资源，不产生任何副作用，系统自身具备所需的所有能力。`;
}

// 提取约束条件
function extractConstraints(text) {
    const constraintKeywords = ['不能', '必须', '需要', '要求', '限制', '约束'];
    const constraints = [];
    const sentences = text.split(/[。，、；！？\n]/);

    sentences.forEach(sentence => {
        constraintKeywords.forEach(keyword => {
            if (sentence.includes(keyword)) {
                constraints.push(sentence.trim());
            }
        });
    });

    return constraints.length > 0 ? constraints : ['需要考虑实际技术限制'];
}

// 生成IFR建议
function generateIFRSuggestions(analysis) {
    const suggestions = [];

    // 基于推荐的方向生成IFR建议
    if (analysis.directions && analysis.directions.length > 0) {
        analysis.directions.forEach(dir => {
            suggestions.push({
                direction: dir.name,
                suggestion: `考虑采用${dir.name}的方式，逐步接近理想解，在满足功能需求的同时减少资源消耗和副作用`
            });
        });
    }

    // 通用IFR建议
    suggestions.push({
        direction: '自我服务',
        suggestion: '让系统自身具备所需能力，减少对外部资源的依赖'
    });

    suggestions.push({
        direction: '资源再利用',
        suggestion: '充分利用现有资源，避免消耗额外资源'
    });

    return suggestions.slice(0, 5);
}

// 导出全局函数和常量
window.analyzeProblemWithTRIZ = analyzeProblemWithTRIZ;
window.analyzeIdealSolution = analyzeIdealSolution;
window.getParameterName = getParameterName;
window.TRIZ_PARAMETERS = TRIZ_PARAMETERS;
window.TRIZ_PRINCIPLES = TRIZ_PRINCIPLES;
