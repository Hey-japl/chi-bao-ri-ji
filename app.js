/**
 * 吃包日记 - 完整交互逻辑
 * 包含：城市选择、评论功能、点赞功能、发帖功能、二维码生成、弹窗管理、Toast提示
 */

// ===== 城市数据 - 按拼音首字母分组（60+城市） =====
const ALL_CITIES = {
    A: ['安庆', '安阳', '鞍山'],
    B: ['北京', '保定', '包头', '蚌埠'],
    C: ['成都', '重庆', '长沙', '常州', '长春'],
    D: ['大连', '东莞', '大同'],
    F: ['福州', '佛山'],
    G: ['广州', '贵阳', '桂林'],
    H: ['杭州', '合肥', '海口', '哈尔滨', '呼和浩特', '惠州', '湖州'],
    J: ['济南', '金华', '嘉兴', '江门'],
    K: ['昆明', '开封'],
    L: ['兰州', '洛阳', '临沂', '柳州', '拉萨'],
    N: ['南京', '宁波', '南昌', '南宁', '南通'],
    Q: ['青岛', '泉州', '秦皇岛'],
    S: ['上海', '深圳', '苏州', '沈阳', '石家庄', '绍兴', '三亚'],
    T: ['天津', '太原', '台州', '唐山'],
    W: ['武汉', '无锡', '温州', '乌鲁木齐', '威海', '潍坊'],
    X: ['西安', '厦门', '徐州', '湘潭', '襄阳'],
    Y: ['烟台', '扬州', '银川', '宜昌'],
    Z: ['郑州', '珠海', '中山', '株洲']
};

// 热门城市列表
const HOT_CITIES = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '南京', '武汉', '西安', '苏州', '天津'];

// ===== 面包店数据 =====
const SHOP_DATA = {
    '好利来': {
        name: '好利来',
        type: 'offline',
        rating: 4.7,
        desc: '半熟芝士、冰山熔岩蛋糕',
        address: '北京市朝阳区建国路88号SOHO现代城D座1层',
        phone: '400-700-5999',
        hours: '08:00-22:00',
        tags: ['连锁品牌', '蛋糕', '甜品', '网红'],
        features: '好利来是知名烘焙连锁品牌，以半熟芝士、冰山熔岩蛋糕等网红产品闻名。店内环境温馨，适合购买生日蛋糕和日常面包。',
        distance: '1.2km',
        price: '人均 ¥35'
    },
    '原麦山丘': {
        name: '原麦山丘',
        type: 'offline',
        rating: 4.8,
        desc: '全麦面包、欧包、吐司',
        address: '北京市朝阳区三里屯太古里南区B1层',
        phone: '010-64178899',
        hours: '09:00-21:30',
        tags: ['健康', '全麦', '欧包', '网红'],
        features: '原麦山丘主打健康全麦面包，使用天然酵母发酵，口感扎实有嚼劲。招牌产品包括高纤杂粮面包、蔓越莓欧包等。',
        distance: '2.5km',
        price: '人均 ¥42'
    },
    '味多美外卖': {
        name: '味多美外卖',
        type: 'delivery',
        rating: 4.5,
        desc: '法棍、老婆饼、生日蛋糕',
        address: '北京市海淀区中关村大街1号',
        phone: '400-010-0808',
        hours: '07:30-21:00',
        tags: ['外卖', '快捷', '蛋糕'],
        features: '味多美提供便捷的外卖服务，覆盖北京大部分地区。招牌老婆饼酥脆可口，生日蛋糕款式多样，支持在线预订。',
        distance: '约30分钟',
        price: '起送 ¥20'
    },
    '社区团购 · 王姐面包': {
        name: '社区团购 · 王姐面包',
        type: 'group',
        rating: 4.9,
        desc: '手工吐司、蛋挞、肉松小贝',
        address: '北京市朝阳区各小区自提点',
        phone: '138****8888',
        hours: '每天截团，次日自提',
        tags: ['团购', '手工', '社区', '新鲜'],
        features: '王姐手工烘焙，每天现做现卖。招牌手工吐司松软香甜，蛋挞外酥里嫩。支持社区团购，价格优惠，新鲜直达。',
        distance: '明天自提',
        price: '已团 328份'
    },
    '社区团购 · 李叔烘焙': {
        name: '社区团购 · 李叔烘焙',
        type: 'group',
        rating: 4.7,
        desc: '可颂、脏脏包、泡芙',
        address: '北京市海淀区各小区自提点',
        phone: '139****6666',
        hours: '每周二、五截团',
        tags: ['团购', '法式', '手工'],
        features: '李叔曾在法国学习烘焙，可颂层次分明，黄油香气浓郁。脏脏包是招牌产品，巧克力控必试！',
        distance: '后天自提',
        price: '已团 256份'
    }
};

// ===== App 主类 =====
class App {
    constructor() {
        this.currentCity = '北京';
        this.records = [];       // 打卡记录
        this.posts = [];         // 用户帖子
        this.rating = 0;         // 当前评分
        this.selectedTags = [];  // 当前选中的标签
        this.likedPosts = {};    // 点赞状态 { postId: true/false }
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.loadData();
        this.bindEvents();
        this.generateQR();
        this.renderHotCities();
        this.renderAllCities();
        this.renderPosts();
        this.loadComments();
        this.updateCityDisplay();
        this.initProfile();
    }

    // ==================== 数据持久化 ====================

    /**
     * 从 localStorage 加载数据
     */
    loadData() {
        try {
            const city = localStorage.getItem('breadDiaryCity');
            if (city) this.currentCity = city;

            const posts = localStorage.getItem('breadDiaryPosts');
            if (posts) this.posts = JSON.parse(posts);

            const records = localStorage.getItem('breadDiaryRecords');
            if (records) this.records = JSON.parse(records);

            const liked = localStorage.getItem('breadDiaryLiked');
            if (liked) this.likedPosts = JSON.parse(liked);
        } catch (e) {
            console.warn('加载数据失败:', e);
        }
    }

    /**
     * 保存数据到 localStorage
     */
    saveData() {
        try {
            localStorage.setItem('breadDiaryCity', this.currentCity);
            localStorage.setItem('breadDiaryPosts', JSON.stringify(this.posts));
            localStorage.setItem('breadDiaryRecords', JSON.stringify(this.records));
            localStorage.setItem('breadDiaryLiked', JSON.stringify(this.likedPosts));
        } catch (e) {
            console.warn('保存数据失败:', e);
        }
    }

    // ==================== 城市选择功能 ====================

    /**
     * 渲染热门城市网格
     */
    renderHotCities() {
        const grid = document.getElementById('hotCityGrid');
        if (!grid) return;

        grid.innerHTML = HOT_CITIES.map(city => {
            const isActive = city === this.currentCity ? ' active' : '';
            return `<button class="city-btn${isActive}" data-city="${city}">${city}</button>`;
        }).join('');

        // 绑定热门城市按钮点击事件
        grid.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCity(btn.dataset.city);
            });
        });
    }

    /**
     * 渲染全部城市（字母索引列表）
     */
    renderAllCities() {
        const container = document.getElementById('allCitiesList');
        if (!container) return;

        let html = '';
        for (const letter of Object.keys(ALL_CITIES).sort()) {
            html += `<div class="city-letter">${letter}</div>`;
            ALL_CITIES[letter].forEach(city => {
                html += `<div class="city-list-item" data-city="${city}">${city}</div>`;
            });
        }
        container.innerHTML = html;

        // 绑定城市列表项点击事件
        container.querySelectorAll('.city-list-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCity(item.dataset.city);
            });
        });
    }

    /**
     * 搜索城市（支持中文和拼音首字母）
     * @param {string} keyword - 搜索关键词
     */
    searchCities(keyword) {
        const container = document.getElementById('allCitiesList');
        const hotGrid = document.getElementById('hotCityGrid');
        if (!keyword.trim()) {
            // 清空搜索时恢复原始显示
            this.renderHotCities();
            this.renderAllCities();
            return;
        }

        const kw = keyword.trim().toUpperCase();
        const results = [];

        // 按字母搜索
        if (ALL_CITIES[kw]) {
            results.push(...ALL_CITIES[kw].map(c => ({ letter: kw, city: c })));
        }

        // 按城市名搜索
        for (const [letter, cities] of Object.entries(ALL_CITIES)) {
            cities.forEach(city => {
                if (city.includes(keyword.trim()) && !results.find(r => r.city === city)) {
                    results.push({ letter, city });
                }
            });
        }

        // 隐藏热门城市
        if (hotGrid) hotGrid.style.display = 'none';

        if (results.length === 0) {
            container.innerHTML = '<div class="city-empty">未找到匹配的城市</div>';
            return;
        }

        // 按字母分组显示搜索结果
        let html = '';
        const grouped = {};
        results.forEach(r => {
            if (!grouped[r.letter]) grouped[r.letter] = [];
            grouped[r.letter].push(r.city);
        });

        for (const letter of Object.keys(grouped).sort()) {
            html += `<div class="city-letter">${letter}</div>`;
            grouped[letter].forEach(city => {
                html += `<div class="city-list-item" data-city="${city}">${city}</div>`;
            });
        }
        container.innerHTML = html;

        // 重新绑定点击事件
        container.querySelectorAll('.city-list-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCity(item.dataset.city);
            });
        });
    }

    /**
     * 选择城市
     * @param {string} name - 城市名称
     */
    selectCity(name) {
        this.currentCity = name;
        this.updateCityDisplay();
        this.saveData();
        this.closePopup('cityPopup');
        this.toast(`已切换到 ${name}`);

        // 更新热门城市按钮选中态
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.city === name);
        });
    }

    /**
     * 更新城市显示
     */
    updateCityDisplay() {
        const cityNameEl = document.getElementById('cityName');
        const currentCityNameEl = document.getElementById('currentCityName');

        if (cityNameEl) cityNameEl.textContent = this.currentCity;
        if (currentCityNameEl) currentCityNameEl.textContent = this.currentCity;
    }

    // ==================== 评论功能 ====================

    /**
     * 加载评论数据
     */
    loadComments() {
        try {
            const comments = localStorage.getItem('breadDiaryComments');
            if (comments) {
                const commentData = JSON.parse(comments);
                // 为每个帖子的评论区渲染已有评论
                for (const [postId, list] of Object.entries(commentData)) {
                    if (list && list.length > 0) {
                        const commentListEl = document.querySelector(`.comment-list[data-post-id="${postId}"]`);
                        if (commentListEl) {
                            // 只添加不在DOM中的评论
                            const existingTexts = Array.from(commentListEl.querySelectorAll('.comment-text'))
                                .map(el => el.textContent);
                            list.forEach(c => {
                                if (!existingTexts.includes(c.text)) {
                                    const div = document.createElement('div');
                                    div.className = 'comment-item';
                                    div.innerHTML = `
                                        <span class="comment-user">${this.escapeHtml(c.user)}</span>
                                        <span class="comment-text">${this.escapeHtml(c.text)}</span>
                                        <span class="comment-time">${this.escapeHtml(c.time)}</span>
                                    `;
                                    commentListEl.appendChild(div);
                                }
                            });

                            // 更新评论数
                            this.updateCommentCount(postId, list.length);
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('加载评论失败:', e);
        }
    }

    /**
     * 从 localStorage 读取评论
     * @returns {Object} 评论数据
     */
    loadCommentsData() {
        try {
            const comments = localStorage.getItem('breadDiaryComments');
            return comments ? JSON.parse(comments) : {};
        } catch (e) {
            return {};
        }
    }

    /**
     * 添加评论
     * @param {string} postId - 帖子ID
     * @param {string} text - 评论内容
     */
    addComment(postId, text) {
        if (!text.trim()) {
            this.toast('请输入评论内容');
            return;
        }

        const comments = this.loadCommentsData();
        if (!comments[postId]) comments[postId] = [];

        const newComment = {
            id: Date.now(),
            user: '我',
            text: text.trim(),
            time: '刚刚'
        };

        comments[postId].unshift(newComment);
        localStorage.setItem('breadDiaryComments', JSON.stringify(comments));

        // 更新DOM - 在评论列表顶部插入新评论
        const list = document.querySelector(`.comment-list[data-post-id="${postId}"]`);
        if (list) {
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                <span class="comment-user">我</span>
                <span class="comment-text">${this.escapeHtml(text.trim())}</span>
                <span class="comment-time">刚刚</span>
            `;
            // 添加入场动画
            div.style.opacity = '0';
            div.style.transform = 'translateY(-10px)';
            div.style.transition = 'all 0.3s ease';
            list.insertBefore(div, list.firstChild);

            // 触发动画
            requestAnimationFrame(() => {
                div.style.opacity = '1';
                div.style.transform = 'translateY(0)';
            });
        }

        // 更新评论数
        const currentCount = comments[postId].length;
        this.updateCommentCount(postId, currentCount);

        this.toast('评论成功');
    }

    /**
     * 更新评论数显示
     * @param {string} postId - 帖子ID
     * @param {number} count - 评论数
     */
    updateCommentCount(postId, count) {
        // 尝试通过 data-post-id 找到帖子卡片
        const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
        if (card) {
            const countEl = card.querySelector('.comment-count');
            if (countEl) {
                countEl.textContent = count;
            }
        }
    }

    /**
     * 切换评论区显示/隐藏
     * @param {string} postId - 帖子ID
     */
    toggleCommentSection(postId) {
        const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
        if (!card) return;

        const section = card.querySelector('.comment-section');
        const commentBtn = card.querySelector('.comment-btn');

        if (section) {
            section.classList.toggle('show');
            if (commentBtn) {
                commentBtn.classList.toggle('active', section.classList.contains('show'));
            }

            // 展开时自动聚焦输入框
            if (section.classList.contains('show')) {
                const input = section.querySelector('.comment-input');
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            }
        }
    }

    // ==================== 点赞功能 ====================

    /**
     * 切换点赞状态
     * @param {string} postId - 帖子ID
     */
    toggleLike(postId) {
        const card = document.querySelector(`.post-card[data-post-id="${postId}"]`);
        if (!card) return;

        const likeBtn = card.querySelector('.like-btn');
        const likeCountEl = card.querySelector('.like-count');
        if (!likeBtn || !likeCountEl) return;

        let count = parseInt(likeCountEl.textContent) || 0;

        if (this.likedPosts[postId]) {
            // 取消点赞
            this.likedPosts[postId] = false;
            count = Math.max(0, count - 1);
            likeBtn.classList.remove('liked');
        } else {
            // 点赞
            this.likedPosts[postId] = true;
            count += 1;
            likeBtn.classList.add('liked');

            // 点赞动画
            likeBtn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                likeBtn.style.transform = 'scale(1)';
            }, 200);
        }

        likeCountEl.textContent = count;
        this.saveData();
    }

    // ==================== 发帖功能 ====================

    /**
     * 渲染帖子列表（用户发的帖子显示在顶部）
     */
    renderPosts() {
        const list = document.getElementById('postList');
        if (!list || this.posts.length === 0) return;

        // 获取现有示例帖子的HTML
        const existingHtml = list.innerHTML;

        // 生成用户帖子HTML
        const userPostsHtml = this.posts.map(post => this.createPostHtml(post)).join('');

        // 用户帖子在顶部
        list.innerHTML = userPostsHtml + existingHtml;

        // 为新渲染的帖子绑定事件
        this.bindPostEvents();
    }

    /**
     * 创建帖子HTML
     * @param {Object} post - 帖子数据
     * @returns {string} HTML字符串
     */
    createPostHtml(post) {
        const typeLabels = {
            'share': '分享',
            'group': '快团团',
            'ask': '求推荐',
            'checkin': '打卡'
        };

        const typeTagClass = {
            'share': 'tag-share',
            'group': 'tag-group',
            'ask': 'tag-ask',
            'checkin': 'tag-checkin'
        };

        const typeColors = {
            'share': { bg: '#FFF8E1', color: '#F5A623' },
            'group': { bg: '#E8F5E9', color: '#4CAF50' },
            'ask': { bg: '#E3F2FD', color: '#2196F3' },
            'checkin': { bg: '#FFF3E0', color: '#FF9800' }
        };

        const style = typeColors[post.type] || typeColors['share'];
        const tagClass = typeTagClass[post.type] || 'tag-share';
        const isMyPost = post.isUser;
        const postId = post.id || Date.now();
        const isLiked = this.likedPosts[postId];

        // 加载该帖子的评论
        const comments = this.loadCommentsData();
        const postComments = comments[postId] || [];
        const commentCount = postComments.length;

        let contentHtml = `<p class="post-text">${this.escapeHtml(post.content)}</p>`;

        // 打卡类型 - 显示打卡卡片
        if (post.type === 'checkin' && post.checkinData) {
            contentHtml += `
                <div class="post-checkin-card">
                    <div class="checkin-emoji">🍞</div>
                    <div class="checkin-info">
                        <strong>${this.escapeHtml(post.checkinData.name)}</strong>
                        <span>${post.checkinData.rating > 0 ? '⭐'.repeat(post.checkinData.rating) : ''} ${post.checkinData.tags.join(' ')}</span>
                    </div>
                </div>
            `;
        }

        // 图片
        if (post.image) {
            contentHtml += `
                <div class="post-images">
                    <div class="post-img" style="background:#FFF3E0">
                        <img src="${post.image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="">
                    </div>
                </div>
            `;
        }

        // 位置信息
        if (post.location) {
            contentHtml += `<div class="post-location">📍 ${this.escapeHtml(post.location)}</div>`;
        }

        // 评论区HTML
        const commentsHtml = postComments.map(c => `
            <div class="comment-item">
                <span class="comment-user">${this.escapeHtml(c.user)}</span>
                <span class="comment-text">${this.escapeHtml(c.text)}</span>
                <span class="comment-time">${this.escapeHtml(c.time)}</span>
            </div>
        `).join('');

        return `
            <div class="post-card ${isMyPost ? 'my-post' : ''}" data-post-id="${postId}">
                <div class="post-header">
                    <div class="post-user">
                        <div class="avatar" style="background:${isMyPost ? '#F5A623' : '#FFD93D'}">${isMyPost ? '我' : '🧑'}</div>
                        <div>
                            <span class="username">${isMyPost ? '我' : this.escapeHtml(post.username || '用户')}${isMyPost ? '<span class="my-post-badge">我的</span>' : ''}</span>
                            <span class="post-time">${post.time} · ${post.city || this.currentCity}</span>
                        </div>
                    </div>
                    <span class="post-tag ${tagClass}">${typeLabels[post.type] || '分享'}</span>
                </div>
                ${contentHtml}
                <div class="post-footer">
                    <button class="post-action like-btn${isLiked ? ' liked' : ''}" data-post-id="${postId}">
                        <span class="like-icon">👍</span> <span class="like-count">${post.likes || 0}</span>
                    </button>
                    <button class="post-action comment-btn" data-post-id="${postId}">
                        <span>💬</span> <span class="comment-count">${commentCount}</span>
                    </button>
                    <button class="post-action"><span>↗️</span> 分享</button>
                </div>
                <div class="comment-section">
                    <div class="comment-list" data-post-id="${postId}">
                        ${commentsHtml}
                    </div>
                    <div class="comment-input-bar">
                        <input type="text" placeholder="写评论..." class="comment-input" data-post-id="${postId}">
                        <button class="comment-send" data-post-id="${postId}">发送</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 为动态渲染的帖子绑定事件
     */
    bindPostEvents() {
        // 点赞按钮
        document.querySelectorAll('.like-btn').forEach(btn => {
            // 移除旧的事件监听器（通过克隆节点）
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                this.toggleLike(newBtn.dataset.postId);
            });
        });

        // 评论按钮 - 展开/收起评论区
        document.querySelectorAll('.comment-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                this.toggleCommentSection(newBtn.dataset.postId);
            });
        });

        // 评论发送按钮
        document.querySelectorAll('.comment-send').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                const postId = newBtn.dataset.postId;
                const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                if (input && input.value.trim()) {
                    this.addComment(postId, input.value);
                    input.value = '';
                }
            });
        });

        // 评论输入框 - 回车发送
        document.querySelectorAll('.comment-input').forEach(input => {
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);

            newInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const postId = newInput.dataset.postId;
                    if (newInput.value.trim()) {
                        this.addComment(postId, newInput.value);
                        newInput.value = '';
                    }
                }
            });
        });
    }

    /**
     * 提交打卡
     */
    submitCheckin() {
        const name = document.getElementById('checkinName').value.trim();
        const note = document.getElementById('checkinNote').value.trim();
        const photoArea = document.getElementById('checkinPhoto');

        if (!name) {
            this.toast('请输入面包名称');
            return;
        }

        const img = photoArea.querySelector('img');
        const imageData = img ? img.src : '';

        // 保存打卡记录
        const record = {
            id: Date.now(),
            name,
            date: new Date().toISOString().split('T')[0],
            rating: this.rating,
            tags: [...this.selectedTags],
            note,
            image: imageData,
            timestamp: Date.now()
        };
        this.records.unshift(record);

        // 同时发布到社区
        const postId = Date.now();
        const post = {
            id: postId,
            type: 'checkin',
            content: note || `今天吃了 ${name}，真不错！`,
            checkinData: {
                name,
                rating: this.rating,
                tags: [...this.selectedTags]
            },
            image: imageData,
            location: this.currentCity,
            city: this.currentCity,
            time: '刚刚',
            likes: 0,
            comments: 0,
            isUser: true,
            username: '我'
        };

        this.posts.unshift(post);
        this.saveData();

        // 添加到帖子列表顶部
        const list = document.getElementById('postList');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.createPostHtml(post);
        const newCard = tempDiv.firstElementChild;
        list.insertBefore(newCard, list.firstElementChild);

        // 为新帖子绑定事件
        this.bindPostEvents();

        this.closePopup('checkinPopup');
        this.resetCheckinForm();
        this.toast('打卡成功！已发布到吃包圈');

        // 更新个人中心数据
        this.userData.checkins++;
        this.userData.checkinRecords.push(record);
        this.userData.posts++;
        this.userData.postRecords.push({ type: 'checkin', title: `打卡: ${name}`, date: record.date });
        this.saveUserData();
        this.renderProfile();
    }

    /**
     * 提交帖子
     */
    submitPost() {
        const type = document.querySelector('input[name="postType"]:checked').value;
        const title = document.getElementById('postTitle').value.trim();
        const content = document.getElementById('postContent').value.trim();
        const location = document.getElementById('postLocation').value.trim();
        const photoArea = document.getElementById('postPhoto');

        if (!title) {
            this.toast('请输入标题');
            return;
        }
        if (!content) {
            this.toast('请输入内容');
            return;
        }

        const img = photoArea.querySelector('img');
        const imageData = img ? img.src : '';

        const postId = Date.now();
        const post = {
            id: postId,
            type,
            title,
            content,
            image: imageData,
            location: location || this.currentCity,
            city: this.currentCity,
            time: '刚刚',
            likes: 0,
            comments: 0,
            isUser: true,
            username: '我'
        };

        this.posts.unshift(post);
        this.saveData();

        // 添加到帖子列表顶部
        const list = document.getElementById('postList');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.createPostHtml(post);
        const newCard = tempDiv.firstElementChild;
        list.insertBefore(newCard, list.firstElementChild);

        // 为新帖子绑定事件
        this.bindPostEvents();

        this.closePopup('postPopup');
        this.resetPostForm();
        this.toast('帖子发布成功！');

        // 更新个人中心数据
        this.userData.posts++;
        this.userData.postRecords.push({ type, title, date: new Date().toISOString().split('T')[0] });
        this.saveUserData();
        this.renderProfile();
    }

    // ==================== 二维码生成 ====================

    /**
     * 生成模拟二维码图案
     */
    generateQR() {
        document.querySelectorAll('.qr-grid').forEach(grid => {
            grid.innerHTML = '';
            for (let i = 0; i < 256; i++) {
                const cell = document.createElement('div');
                const row = Math.floor(i / 16);
                const col = i % 16;

                // 三个定位角
                const isTopLeft = row < 4 && col < 4;
                const isTopRight = row < 4 && col >= 12;
                const isBottomLeft = row >= 12 && col < 4;

                // 定位角内部空白
                const isTopLeftInner = row >= 1 && row <= 2 && col >= 1 && col <= 2;
                const isTopRightInner = row >= 1 && row <= 2 && col >= 13 && col <= 14;
                const isBottomLeftInner = row >= 13 && row <= 14 && col >= 1 && col <= 2;

                const isCorner = (isTopLeft || isTopRight || isBottomLeft) && !isTopLeftInner && !isTopRightInner && !isBottomLeftInner;
                const isRandom = Math.random() > 0.5;

                if (isCorner || isRandom) {
                    cell.style.cssText = 'background:#333;border-radius:1px';
                } else {
                    cell.style.cssText = 'background:#fff';
                }
                grid.appendChild(cell);
            }
        });
    }

    // ==================== 面包店详情弹窗 ====================

    /**
     * 打开面包店详情弹窗
     * @param {string} shopName - 面包店名称
     */
    openShopDetail(shopName) {
        const shop = SHOP_DATA[shopName];
        if (!shop) {
            this.toast('店铺信息加载中...');
            return;
        }

        const content = document.getElementById('shopDetailContent');
        if (!content) return;

        const typeLabels = {
            'offline': '线下门店',
            'delivery': '外卖配送',
            'group': '社区团购'
        };

        const typeClass = {
            'offline': 'offline',
            'delivery': 'delivery',
            'group': 'group'
        };

        const emojiMap = {
            '好利来': '🥐',
            '原麦山丘': '🍞',
            '味多美外卖': '🛵',
            '社区团购 · 王姐面包': '👥',
            '社区团购 · 李叔烘焙': '👥'
        };

        // 生成地图导航链接
        const mapLinks = this.generateMapLinks(shop.address, shop.name);

        content.innerHTML = `
            <div class="shop-detail-header">
                <div class="shop-detail-img">${emojiMap[shop.name] || '🍞'}</div>
                <div class="shop-detail-info">
                    <h4>${shop.name}</h4>
                    <div class="shop-detail-rating">⭐ ${shop.rating}</div>
                    <span class="shop-detail-type ${typeClass[shop.type]}">${typeLabels[shop.type]}</span>
                </div>
            </div>

            <div class="shop-detail-section">
                <h5>📍 地址</h5>
                <div class="shop-detail-address">
                    <span>📍</span>
                    <p>${shop.address}</p>
                </div>
                <div class="map-nav-buttons">
                    <a href="${mapLinks.amap}" class="map-nav-btn amap" target="_blank">
                        <span>🗺️</span> 高德地图
                    </a>
                    <a href="${mapLinks.bmap}" class="map-nav-btn bmap" target="_blank">
                        <span>🗺️</span> 百度地图
                    </a>
                    <a href="${mapLinks.tencent}" class="map-nav-btn tencent" target="_blank">
                        <span>🗺️</span> 腾讯地图
                    </a>
                </div>
            </div>

            <div class="shop-detail-section">
                <h5>📝 店铺介绍</h5>
                <p>${shop.features}</p>
            </div>

            <div class="shop-detail-section">
                <h5>🏷️ 标签</h5>
                <div class="shop-detail-tags">
                    ${shop.tags.map(tag => `<span class="shop-detail-tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div class="shop-detail-section">
                <h5>🕐 营业时间</h5>
                <div class="shop-detail-hours">
                    <span>⏰</span> ${shop.hours}
                </div>
            </div>

            <div class="shop-detail-section">
                <h5>📞 联系电话</h5>
                <div class="shop-detail-phone">
                    <span>${shop.phone}</span>
                    <a href="tel:${shop.phone.replace(/[^0-9]/g, '')}">拨打电话</a>
                </div>
            </div>

            <div class="shop-detail-action">
                <button class="btn-primary" onclick="app.navigateToShop('${shop.name}')">导航前往</button>
                <button class="btn-secondary" onclick="app.closePopup('shopDetailPopup')">关闭</button>
            </div>
        `;

        this.openPopup('shopDetailPopup');
    }

    /**
     * 生成地图导航链接
     * @param {string} address - 地址
     * @param {string} name - 店铺名称
     * @returns {Object} 各平台地图链接
     */
    generateMapLinks(address, name) {
        const encodedAddress = encodeURIComponent(address);
        const encodedName = encodeURIComponent(name);

        return {
            // 高德地图 - 搜索地址
            amap: `https://uri.amap.com/search?keyword=${encodedAddress}`,
            // 百度地图 - 搜索地址
            bmap: `https://api.map.baidu.com/geocoder?address=${encodedAddress}&output=html`,
            // 腾讯地图 - 搜索地址
            tencent: `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.90469,116.40717;title:${encodedName};addr:${encodedAddress}&key=yourkey&referer=myapp`
        };
    }

    /**
     * 导航到店铺
     * @param {string} shopName - 店铺名称
     */
    navigateToShop(shopName) {
        const shop = SHOP_DATA[shopName];
        if (!shop) return;

        // 优先使用高德地图
        const mapLinks = this.generateMapLinks(shop.address, shop.name);
        window.open(mapLinks.amap, '_blank');
        this.toast('正在打开地图导航...');
    }

    // ==================== 弹窗管理 ====================

    /**
     * 打开弹窗
     * @param {string} id - 弹窗元素ID
     */
    openPopup(id) {
        const popup = document.getElementById(id);
        if (popup) {
            popup.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * 关闭弹窗
     * @param {string} id - 弹窗元素ID
     */
    closePopup(id) {
        const popup = document.getElementById(id);
        if (popup) {
            popup.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ==================== Toast 提示 ====================

    /**
     * 显示 Toast 提示
     * @param {string} msg - 提示消息
     * @param {number} duration - 显示时长（毫秒）
     */
    toast(msg, duration = 2000) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);

        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transition = 'opacity 0.3s';
            setTimeout(() => t.remove(), 300);
        }, duration);
    }

    // ==================== 表单重置 ====================

    /**
     * 重置打卡表单
     */
    resetCheckinForm() {
        document.getElementById('checkinName').value = '';
        document.getElementById('checkinNote').value = '';
        document.getElementById('checkinPhoto').innerHTML = `
            <input type="file" accept="image/*" id="photoInput">
            <div class="photo-placeholder">
                <span>📷</span>
                <p>拍照记录</p>
            </div>
        `;
        // 重新绑定图片上传事件
        const photoInput = document.getElementById('photoInput');
        const photoArea = document.getElementById('checkinPhoto');
        photoInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, photoArea, 'photoInput');
        });

        this.rating = 0;
        this.selectedTags = [];
        document.querySelectorAll('.rate-star').forEach(s => {
            s.textContent = '☆';
            s.classList.remove('active');
        });
        document.querySelectorAll('.ctag').forEach(t => t.classList.remove('selected'));
    }

    /**
     * 重置发帖表单
     */
    resetPostForm() {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postLocation').value = '';
        document.getElementById('postPhoto').innerHTML = `
            <input type="file" accept="image/*" id="postPhotoInput">
            <div class="photo-placeholder">
                <span>📷</span>
                <p>添加图片</p>
            </div>
        `;
        // 重新绑定图片上传事件
        const postPhotoInput = document.getElementById('postPhotoInput');
        const postPhotoArea = document.getElementById('postPhoto');
        postPhotoInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, postPhotoArea, 'postPhotoInput');
        });
    }

    // ==================== 图片上传处理 ====================

    /**
     * 处理图片上传
     * @param {Event} e - 文件选择事件
     * @param {HTMLElement} area - 图片显示区域
     * @param {string} inputId - input元素ID
     */
    handleImageUpload(e, area, inputId) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            area.innerHTML = `
                <img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:12px" alt="">
                <input type="file" accept="image/*" id="${inputId}">
            `;
            // 重新绑定事件
            document.getElementById(inputId).addEventListener('change', (newE) => {
                this.handleImageUpload(newE, area, inputId);
            });
        };
        reader.readAsDataURL(file);
    }

    // ==================== 页面切换功能 ====================

    /**
     * 切换页面
     * @param {string} pageName - 页面名称: home/shops/community/profile
     */
    switchPage(pageName) {
        // 如果点击"我的"页面，直接切换
        if (pageName === 'profile') {
            // 更新底部导航状态
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageName) item.classList.add('active');
            });
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById('pageProfile');
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.scrollTop = 0;
            }
            // 刷新个人中心数据
            this.renderProfile();
            return;
        }

        // 更新底部导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pageName) {
                item.classList.add('active');
            }
        });

        // 切换页面显示
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(`page${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`);
        if (targetPage) {
            targetPage.classList.add('active');
            // 滚动到页面顶部
            targetPage.scrollTop = 0;
        }

        // 更新顶部标题（可选）
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) {
            const titles = {
                'home': '🍞 吃包日记',
                'shops': '🏪 面包店',
                'community': '💬 吃包圈'
            };
            headerTitle.textContent = titles[pageName] || '🍞 吃包日记';
        }
    }

    // ==================== 吃包圈筛选功能 ====================

    /**
     * 筛选帖子
     * @param {string} filter - 筛选类型: all/share/group/ask/checkin
     */
    filterPosts(filter) {
        const posts = document.querySelectorAll('.post-card');

        posts.forEach((post, index) => {
            // 添加淡出动画
            post.style.opacity = '0';
            post.style.transform = 'translateY(10px)';

            setTimeout(() => {
                if (filter === 'all') {
                    post.style.display = 'block';
                } else {
                    // 根据帖子内容判断类型
                    const tagEl = post.querySelector('.post-tag');
                    const text = post.textContent.toLowerCase();

                    let shouldShow = false;
                    if (filter === 'share' && (tagEl?.textContent === '分享' || text.includes('分享'))) {
                        shouldShow = true;
                    } else if (filter === 'group' && (tagEl?.textContent === '快团团' || text.includes('团购'))) {
                        shouldShow = true;
                    } else if (filter === 'ask' && (tagEl?.textContent === '求推荐' || text.includes('推荐') || text.includes('?'))) {
                        shouldShow = true;
                    } else if (filter === 'checkin' && post.querySelector('.post-checkin-card')) {
                        shouldShow = true;
                    }

                    post.style.display = shouldShow ? 'block' : 'none';
                }

                // 添加淡入动画
                requestAnimationFrame(() => {
                    post.style.transition = 'all 0.3s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                });
            }, index * 50);
        });

        // 显示筛选结果提示
        const visiblePosts = Array.from(posts).filter(p => p.style.display !== 'none');
        if (filter !== 'all') {
            this.toast(`已筛选: ${visiblePosts.length} 条帖子`);
        }
    }

    // ==================== 工具方法 ====================

    /**
     * HTML转义 - 防止XSS
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== 个人中心功能 ====================

    /**
     * 成就徽章定义
     */
    static BADGES = [
        { id: 'first_checkin', name: '初次打卡', icon: '📸', bg: '#FFF3E0', desc: '完成第一次打卡', check: (d) => d.checkins >= 1 },
        { id: 'checkin_5', name: '打卡达人', icon: '🔥', bg: '#FFEBEE', desc: '累计打卡5次', check: (d) => d.checkins >= 5 },
        { id: 'checkin_20', name: '面包狂人', icon: '💪', bg: '#E8F5E9', desc: '累计打卡20次', check: (d) => d.checkins >= 20 },
        { id: 'checkin_50', name: '面包大师', icon: '👑', bg: '#FFF8E1', desc: '累计打卡50次', check: (d) => d.checkins >= 50 },
        { id: 'first_post', name: '初来乍到', icon: '✏️', bg: '#E3F2FD', desc: '发布第一条帖子', check: (d) => d.posts >= 1 },
        { id: 'post_10', name: '社区活跃', icon: '💬', bg: '#F3E5F5', desc: '发布10条帖子', check: (d) => d.posts >= 10 },
        { id: 'likes_50', name: '人气之星', icon: '⭐', bg: '#FFF3E0', desc: '累计获得50个赞', check: (d) => d.likes >= 50 },
        { id: 'likes_200', name: '万人迷', icon: '💖', bg: '#FFEBEE', desc: '累计获得200个赞', check: (d) => d.likes >= 200 },
        { id: 'comment_10', name: '话痨面包', icon: '🗣️', bg: '#E0F7FA', desc: '累计评论10次', check: (d) => d.comments >= 10 },
        { id: 'days_7', name: '一周坚持', icon: '📅', bg: '#F1F8E9', desc: '连续使用7天', check: (d) => d.days >= 7 },
        { id: 'days_30', name: '月度常客', icon: '🗓️', bg: '#E8EAF6', desc: '连续使用30天', check: (d) => d.days >= 30 },
        { id: 'all_badge', name: '全能面包家', icon: '🏆', bg: '#FFF8E1', desc: '解锁所有其他徽章', check: (d) => d.unlockedCount >= 10 },
    ];

    /**
     * 称号定义
     */
    static TITLES = [
        { name: '初入面包圈', icon: '🍞', minLevel: 1 },
        { name: '面包爱好者', icon: '🥐', minLevel: 2 },
        { name: '面包鉴赏家', icon: '🥖', minLevel: 3 },
        { name: '面包达人', icon: '🥯', minLevel: 5 },
        { name: '面包大师', icon: '👑', minLevel: 7 },
        { name: '面包之神', icon: '🌟', minLevel: 10 },
    ];

    /**
     * 初始化个人中心
     */
    initProfile() {
        // 加载用户数据
        const userData = JSON.parse(localStorage.getItem('breadUser') || '{}');
        this.userData = {
            nickname: userData.nickname || '面包爱好者',
            avatar: userData.avatar || '🍞',
            checkins: userData.checkins || 0,
            posts: userData.posts || 0,
            likes: userData.likes || 0,
            comments: userData.comments || 0,
            days: userData.days || 1,
            joinDate: userData.joinDate || new Date().toISOString(),
            unlockedBadges: userData.unlockedBadges || [],
            checkinRecords: userData.checkinRecords || [],
            postRecords: userData.postRecords || [],
            likedPosts: userData.likedPosts || [],
        };

        // 更新连续使用天数
        this.updateDaysUsed();
        // 渲染个人中心
        this.renderProfile();
    }

    /**
     * 更新连续使用天数
     */
    updateDaysUsed() {
        const joinDate = new Date(this.userData.joinDate);
        const now = new Date();
        const diffDays = Math.max(1, Math.ceil((now - joinDate) / (1000 * 60 * 60 * 24)));
        this.userData.days = diffDays;
        this.saveUserData();
    }

    /**
     * 保存用户数据
     */
    saveUserData() {
        localStorage.setItem('breadUser', JSON.stringify(this.userData));
    }

    /**
     * 渲染个人中心
     */
    renderProfile() {
        const d = this.userData;

        // 头像和昵称
        const avatarEl = document.getElementById('profileAvatar');
        const nicknameEl = document.getElementById('profileNickname');
        if (avatarEl) avatarEl.textContent = d.avatar;
        if (nicknameEl) nicknameEl.textContent = d.nickname;

        // 计算等级
        const level = this.calcLevel();
        const levelEl = document.getElementById('profileLevel');
        if (levelEl) levelEl.textContent = `Lv.${level}`;

        // 称号
        const title = this.getCurrentTitle(level);
        const titleEl = document.getElementById('profileTitle');
        if (titleEl) titleEl.textContent = title.name;

        const currentTitleNameEl = document.getElementById('currentTitleName');
        if (currentTitleNameEl) currentTitleNameEl.textContent = title.name;
        const currentTitleCard = document.getElementById('currentTitleCard');
        if (currentTitleCard) {
            currentTitleCard.querySelector('.title-icon').textContent = title.icon;
            currentTitleCard.querySelector('span').textContent = `Lv.${level} 解锁`;
        }

        // 统计数据
        document.getElementById('statCheckins').textContent = d.checkins;
        document.getElementById('statPosts').textContent = d.posts;
        document.getElementById('statLikes').textContent = d.likes;
        document.getElementById('statComments').textContent = d.comments;
        document.getElementById('statDays').textContent = d.days;

        // 菜单徽章
        document.getElementById('menuCheckinCount').textContent = d.checkins;
        document.getElementById('menuPostCount').textContent = d.posts;

        // 渲染成就徽章
        this.renderBadges();
    }

    /**
     * 计算等级
     */
    calcLevel() {
        const d = this.userData;
        const score = d.checkins * 2 + d.posts * 3 + d.likes * 1 + d.comments * 1 + d.days * 0.5;
        return Math.max(1, Math.floor(score / 10) + 1);
    }

    /**
     * 获取当前称号
     */
    getCurrentTitle(level) {
        let title = App.TITLES[0];
        for (const t of App.TITLES) {
            if (level >= t.minLevel) title = t;
        }
        return title;
    }

    /**
     * 渲染成就徽章
     */
    renderBadges() {
        const wall = document.getElementById('badgeWall');
        if (!wall) return;

        const d = this.userData;
        let unlockedCount = 0;

        wall.innerHTML = App.BADGES.map(badge => {
            const unlocked = badge.check(d);
            if (unlocked) unlockedCount++;

            if (!d.unlockedBadges.includes(badge.id) && unlocked) {
                d.unlockedBadges.push(badge.id);
            }

            return `
                <div class="badge-item ${unlocked ? '' : 'locked'}" data-badge="${badge.id}" title="${badge.desc}">
                    <div class="badge-icon" style="background:${badge.bg}">${badge.icon}</div>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `;
        }).join('');

        // 更新徽章计数
        document.getElementById('badgeCount').textContent = `${unlockedCount}/${App.BADGES.length}`;

        // 保存
        this.saveUserData();

        // 徽章点击事件
        wall.querySelectorAll('.badge-item').forEach(item => {
            item.addEventListener('click', () => {
                const badgeId = item.dataset.badge;
                const badge = App.BADGES.find(b => b.id === badgeId);
                if (badge) {
                    const unlocked = badge.check(d);
                    this.toast(unlocked ? `${badge.icon} ${badge.name}：${badge.desc}` : `🔒 ${badge.name}：${badge.desc}（未解锁）`);
                }
            });
        });
    }

    /**
     * 显示我的打卡记录
     */
    showMyCheckins() {
        const records = this.userData.checkinRecords;
        let content = '';

        if (records.length === 0) {
            content = `<div class="empty-state"><div class="empty-icon">📸</div><p>还没有打卡记录哦~<br>快去打卡吧！</p></div>`;
        } else {
            content = `<div class="record-list">${records.map(r => `
                <div class="record-item">
                    <div class="record-emoji">${r.emoji || '🍞'}</div>
                    <div class="record-info">
                        <strong>${this.escapeHtml(r.name)}</strong>
                        <span>${r.date} · ${r.tags ? r.tags.join(' ') : ''}</span>
                    </div>
                    <div class="record-stars">${'★'.repeat(r.rating || 0)}${'☆'.repeat(5 - (r.rating || 0))}</div>
                </div>
            `).reverse().join('')}</div>`;
        }

        this.showRecordPopup('📸 我的打卡', content);
    }

    /**
     * 显示我的帖子
     */
    showMyPosts() {
        const records = this.userData.postRecords;
        let content = '';

        if (records.length === 0) {
            content = `<div class="empty-state"><div class="empty-icon">📝</div><p>还没有发过帖子哦~<br>去吃包圈分享吧！</p></div>`;
        } else {
            content = `<div class="record-list">${records.map(r => `
                <div class="record-item">
                    <div class="record-emoji">${r.type === 'share' ? '🏪' : r.type === 'group' ? '👥' : r.type === 'ask' ? '❓' : '📝'}</div>
                    <div class="record-info">
                        <strong>${this.escapeHtml(r.title)}</strong>
                        <span>${r.date}</span>
                    </div>
                </div>
            `).reverse().join('')}</div>`;
        }

        this.showRecordPopup('📝 我的帖子', content);
    }

    /**
     * 显示记录弹窗
     */
    showRecordPopup(title, content) {
        // 创建弹窗
        let popup = document.getElementById('recordPopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'recordPopup';
            popup.className = 'popup';
            popup.innerHTML = `
                <div class="popup-mask"></div>
                <div class="popup-body">
                    <div class="popup-header"><h3 id="recordPopupTitle"></h3><button class="popup-close" id="recordPopupClose">×</button></div>
                    <div class="popup-scroll" id="recordPopupContent"></div>
                </div>
            `;
            document.querySelector('.app').appendChild(popup);

            popup.querySelector('.popup-close').addEventListener('click', () => this.closePopup('recordPopup'));
            popup.querySelector('.popup-mask').addEventListener('click', () => this.closePopup('recordPopup'));
        }

        document.getElementById('recordPopupTitle').textContent = title;
        document.getElementById('recordPopupContent').innerHTML = content;
        this.openPopup('recordPopup');
    }

    /**
     * 修改昵称
     */
    showEditNickname() {
        let popup = document.getElementById('nicknamePopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'nicknamePopup';
            popup.className = 'popup';
            popup.innerHTML = `
                <div class="popup-mask"></div>
                <div class="popup-body" style="max-height:40vh">
                    <div class="popup-header"><h3>修改昵称</h3><button class="popup-close" id="nicknameClose">×</button></div>
                    <div style="padding:20px">
                        <input type="text" class="nickname-input" id="nicknameInput" placeholder="输入新昵称" maxlength="12">
                        <button class="nickname-save" id="nicknameSave">保存</button>
                    </div>
                </div>
            `;
            document.querySelector('.app').appendChild(popup);

            popup.querySelector('.popup-close').addEventListener('click', () => this.closePopup('nicknamePopup'));
            popup.querySelector('.popup-mask').addEventListener('click', () => this.closePopup('nicknamePopup'));
            popup.querySelector('#nicknameSave').addEventListener('click', () => {
                const input = document.getElementById('nicknameInput');
                const name = input.value.trim();
                if (name) {
                    this.userData.nickname = name;
                    this.saveUserData();
                    this.renderProfile();
                    this.closePopup('nicknamePopup');
                    this.toast('昵称修改成功！');
                } else {
                    this.toast('昵称不能为空');
                }
            });
        }

        document.getElementById('nicknameInput').value = this.userData.nickname;
        this.openPopup('nicknamePopup');
    }

    /**
     * 更换头像
     */
    showEditAvatar() {
        const avatars = ['🍞', '🥐', '🥖', '🥯', '🧁', '🍰', '🍩', '🥧', '🫓', '🥨', '🍪', '🎂'];
        let popup = document.getElementById('avatarPopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'avatarPopup';
            popup.className = 'popup';
            popup.innerHTML = `
                <div class="popup-mask"></div>
                <div class="popup-body" style="max-height:50vh">
                    <div class="popup-header"><h3>选择头像</h3><button class="popup-close" id="avatarClose">×</button></div>
                    <div class="popup-scroll">
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px" id="avatarGrid"></div>
                    </div>
                </div>
            `;
            document.querySelector('.app').appendChild(popup);

            popup.querySelector('.popup-close').addEventListener('click', () => this.closePopup('avatarPopup'));
            popup.querySelector('.popup-mask').addEventListener('click', () => this.closePopup('avatarPopup'));
        }

        const grid = document.getElementById('avatarGrid');
        grid.innerHTML = avatars.map(a => `
            <div class="badge-item ${a === this.userData.avatar ? '' : 'locked'}" style="cursor:pointer" data-avatar="${a}">
                <div class="badge-icon" style="background:#FFF8E1;font-size:28px">${a}</div>
            </div>
        `).join('');

        grid.querySelectorAll('.badge-item').forEach(item => {
            item.addEventListener('click', () => {
                this.userData.avatar = item.dataset.avatar;
                this.saveUserData();
                this.renderProfile();
                this.closePopup('avatarPopup');
                this.toast('头像更换成功！');
            });
        });

        this.openPopup('avatarPopup');
    }

    /**
     * 关于
     */
    showAbout() {
        this.showRecordPopup('关于吃包日记', `
            <div class="about-content">
                <div class="about-logo">🍞</div>
                <h3>吃包日记</h3>
                <p>记录每一口美味的面包<br>发现身边的宝藏面包店<br>和面包爱好者一起分享</p>
                <div class="about-version">v1.0.0 · 全部功能免费</div>
            </div>
        `);
    }

    /**
     * 清空数据
     */
    clearData() {
        if (confirm('确定要清空所有数据吗？\n包括打卡记录、帖子、评论等，此操作不可恢复！')) {
            localStorage.removeItem('breadUser');
            localStorage.removeItem('breadPosts');
            localStorage.removeItem('breadComments');
            this.userData = {
                nickname: '面包爱好者',
                avatar: '🍞',
                checkins: 0, posts: 0, likes: 0, comments: 0, days: 1,
                joinDate: new Date().toISOString(),
                unlockedBadges: [], checkinRecords: [], postRecords: [], likedPosts: [],
            };
            this.saveUserData();
            this.renderProfile();
            this.toast('数据已清空');
        }
    }

    // ==================== 事件绑定 ====================

    /**
     * 绑定所有事件
     */
    bindEvents() {
        // --- 城市选择器 ---
        document.getElementById('citySelector').addEventListener('click', () => {
            this.openPopup('cityPopup');
        });

        // 城市选择弹窗关闭
        document.getElementById('cityClose').addEventListener('click', () => {
            this.closePopup('cityPopup');
        });
        document.querySelector('#cityPopup .popup-mask').addEventListener('click', () => {
            this.closePopup('cityPopup');
        });

        // 城市搜索
        const citySearchInput = document.getElementById('citySearchInput');
        if (citySearchInput) {
            let searchTimer = null;
            citySearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    this.searchCities(e.target.value);
                }, 300);
            });
        }

        // --- 底部导航中间 + 按钮 ---
        document.getElementById('navPlus').addEventListener('click', () => {
            this.openPopup('publishPopup');
        });

        // --- 发布选择弹窗 ---
        document.getElementById('publishClose').addEventListener('click', () => {
            this.closePopup('publishPopup');
        });
        document.querySelector('#publishPopup .popup-mask').addEventListener('click', () => {
            this.closePopup('publishPopup');
        });

        // 发布选项点击
        document.querySelectorAll('.publish-option').forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                this.closePopup('publishPopup');

                if (type === 'checkin') {
                    this.openPopup('checkinPopup');
                } else {
                    this.openPopup('postPopup');
                    // 设置对应的帖子类型
                    const radio = document.querySelector(`input[name="postType"][value="${type}"]`);
                    if (radio) radio.checked = true;
                }
            });
        });

        // --- 打卡弹窗 ---
        document.getElementById('checkinClose').addEventListener('click', () => {
            this.closePopup('checkinPopup');
        });
        document.querySelector('#checkinPopup .popup-mask').addEventListener('click', () => {
            this.closePopup('checkinPopup');
        });

        // --- 发帖子弹窗 ---
        document.getElementById('postClose').addEventListener('click', () => {
            this.closePopup('postPopup');
        });
        document.querySelector('#postPopup .popup-mask').addEventListener('click', () => {
            this.closePopup('postPopup');
        });

        // --- 快捷入口 ---
        document.querySelectorAll('.entry-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'checkin') {
                    this.openPopup('checkinPopup');
                } else if (action === 'community') {
                    // 滚动到吃包圈
                    const communitySection = document.getElementById('communitySection');
                    if (communitySection) {
                        communitySection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (action === 'shops') {
                    // 滚动到面包店
                    const shopsSection = document.getElementById('shopsSection');
                    if (shopsSection) {
                        shopsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else if (action === 'ranking') {
                    this.toast('排行榜功能开发中...');
                }
            });
        });

        // --- 评分 ---
        document.querySelectorAll('.rate-star').forEach(star => {
            star.addEventListener('click', () => {
                this.rating = parseInt(star.dataset.v);
                document.querySelectorAll('.rate-star').forEach((s, i) => {
                    s.textContent = i < this.rating ? '★' : '☆';
                    s.classList.toggle('active', i < this.rating);
                });
            });
        });

        // --- 标签选择 ---
        document.querySelectorAll('.ctag').forEach(tag => {
            tag.addEventListener('click', () => {
                const t = tag.dataset.t;
                if (this.selectedTags.includes(t)) {
                    this.selectedTags = this.selectedTags.filter(x => x !== t);
                    tag.classList.remove('selected');
                } else {
                    this.selectedTags.push(t);
                    tag.classList.add('selected');
                }
            });
        });

        // --- 图片上传 - 打卡 ---
        const photoInput = document.getElementById('photoInput');
        const photoArea = document.getElementById('checkinPhoto');
        photoInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, photoArea, 'photoInput');
        });

        // --- 图片上传 - 发帖 ---
        const postPhotoInput = document.getElementById('postPhotoInput');
        const postPhotoArea = document.getElementById('postPhoto');
        postPhotoInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, postPhotoArea, 'postPhotoInput');
        });

        // --- 提交打卡 ---
        document.getElementById('checkinSubmit').addEventListener('click', () => {
            this.submitCheckin();
        });

        // --- 提交帖子 ---
        document.getElementById('postSubmit').addEventListener('click', () => {
            this.submitPost();
        });

        // --- 面包店Tab筛选 ---
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const type = tab.dataset.type;
                document.querySelectorAll('.shop-card').forEach(card => {
                    if (type === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.toggle('hidden', card.dataset.type !== type);
                    }
                });
            });
        });

        // --- 面包店卡片点击事件 ---
        document.querySelectorAll('.shop-card').forEach(card => {
            // 获取店铺名称
            const shopNameEl = card.querySelector('.shop-top h4');
            if (shopNameEl) {
                const shopName = shopNameEl.textContent.trim();

                // 点击整个卡片打开详情
                card.addEventListener('click', (e) => {
                    // 如果点击的是按钮，不触发卡片点击
                    if (e.target.closest('.shop-btn') || e.target.closest('.qr-section')) {
                        return;
                    }
                    this.openShopDetail(shopName);
                });

                // 详情按钮点击
                const detailBtn = card.querySelector('.shop-btn:not(.primary)');
                if (detailBtn) {
                    detailBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.openShopDetail(shopName);
                    });
                }

                // 导航/下单按钮点击
                const actionBtn = card.querySelector('.shop-btn.primary');
                if (actionBtn) {
                    actionBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const shop = SHOP_DATA[shopName];
                        if (shop) {
                            if (shop.type === 'offline') {
                                this.navigateToShop(shopName);
                            } else if (shop.type === 'delivery') {
                                this.toast('正在跳转外卖平台...');
                            } else if (shop.type === 'group') {
                                // 显示二维码
                                const qrModal = card.querySelector('.qr-modal');
                                if (qrModal) {
                                    qrModal.classList.add('show');
                                } else {
                                    this.toast('请查看二维码跟团');
                                }
                            }
                        }
                    });
                }
            }
        });

        // --- 面包店详情弹窗关闭 ---
        const shopDetailClose = document.getElementById('shopDetailClose');
        if (shopDetailClose) {
            shopDetailClose.addEventListener('click', () => {
                this.closePopup('shopDetailPopup');
            });
        }
        const shopDetailPopup = document.getElementById('shopDetailPopup');
        if (shopDetailPopup) {
            shopDetailPopup.querySelector('.popup-mask').addEventListener('click', () => {
                this.closePopup('shopDetailPopup');
            });
        }

        // --- 二维码弹窗 ---
        document.querySelectorAll('.qr-placeholder').forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                const modal = placeholder.closest('.qr-section').querySelector('.qr-modal');
                if (modal) modal.classList.add('show');
            });
        });

        document.querySelectorAll('.qr-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.qr-modal').classList.remove('show');
            });
        });

        document.querySelectorAll('.qr-overlay').forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.closest('.qr-modal').classList.remove('show');
            });
        });

        // --- 底部导航切换 ---
        document.querySelectorAll('.nav-item:not(.nav-center)').forEach((item) => {
            item.addEventListener('click', () => {
                const pageName = item.dataset.page;
                if (pageName) {
                    this.switchPage(pageName);
                }
            });
        });

        // --- 搜索 ---
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.shop-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.classList.toggle('hidden', q && !text.includes(q));
            });
        });

        // --- 发帖按钮 ---
        const postNowBtn = document.getElementById('postNowBtn');
        if (postNowBtn) {
            postNowBtn.addEventListener('click', () => {
                this.openPopup('publishPopup');
            });
        }

        // --- 吃包圈页面发帖按钮 ---
        const postNowBtnCommunity = document.getElementById('postNowBtnCommunity');
        if (postNowBtnCommunity) {
            postNowBtnCommunity.addEventListener('click', () => {
                this.openPopup('publishPopup');
            });
        }

        // --- 吃包圈筛选标签 ---
        document.querySelectorAll('.community-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // 切换激活状态
                document.querySelectorAll('.community-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 筛选帖子
                const filter = tab.dataset.filter;
                this.filterPosts(filter);
            });
        });

        // --- 热门话题点击 ---
        document.querySelectorAll('.topic-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const topic = tag.textContent.replace(/[🔥🥐💰🍞]\s*/, '');
                this.toast(`正在筛选: ${topic}`);
                // 这里可以实现话题筛选逻辑
            });
        });

        // --- 帖子交互事件（示例帖子） ---
        this.bindPostEvents();

        // --- 个人中心菜单事件 ---
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                switch (action) {
                    case 'myCheckins': this.showMyCheckins(); break;
                    case 'myPosts': this.showMyPosts(); break;
                    case 'myLikes': this.toast('我的点赞功能开发中...'); break;
                    case 'myCollection': this.toast('我的收藏功能开发中...'); break;
                    case 'editNickname': this.showEditNickname(); break;
                    case 'editAvatar': this.showEditAvatar(); break;
                    case 'about': this.showAbout(); break;
                    case 'clearData': this.clearData(); break;
                }
            });
        });

        // --- 个人中心编辑按钮 ---
        const profileEditBtn = document.getElementById('profileEditBtn');
        if (profileEditBtn) {
            profileEditBtn.addEventListener('click', () => {
                this.showEditNickname();
            });
        }
    }
}

// ===== 启动应用 =====
document.addEventListener('DOMContentLoaded', () => new App());
