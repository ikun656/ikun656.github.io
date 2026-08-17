// ===== 政策同意管理 =====
(function() {
    'use strict';

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // 等待 DOM 加载完成后执行
    function initPolicy() {
        const overlay = document.getElementById('policyOverlay');
        const agreeBtn = document.getElementById('agreeBtn');
        if (!overlay || !agreeBtn) {
            console.warn('policyOverlay 或 agreeBtn 元素未找到，跳过初始化');
            return;
        }

        // 检查是否已同意
        if (getCookie('policy_agreed') === 'true') {
            overlay.classList.remove('show');
        } else {
            overlay.classList.add('show');
        }

        agreeBtn.addEventListener('click', function() {
            setCookie('policy_agreed', 'true', 365);
            overlay.classList.remove('show');
        });
    }

    // 如果 DOM 已加载则立即执行，否则监听 DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPolicy);
    } else {
        initPolicy();
    }
})();
