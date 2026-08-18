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

    function initPolicy() {
        const overlay = document.getElementById('policyOverlay');
        const agreeBtn = document.getElementById('agreeBtn');
        if (!overlay || !agreeBtn) {
            console.warn('policyOverlay 或 agreeBtn 元素未找到，跳过初始化');
            return;
        }

        if (getCookie('policy_agreed') === 'true') {
            overlay.classList.remove('show');
        } else {
            overlay.classList.add('show');
        }

        agreeBtn.addEventListener('click', function() {
            setCookie('policy_agreed', 'true', 365);
            overlay.classList.remove('show');
        });

        // 供主页“查看隐私政策”按钮调用：重新打开政策说明（不影响已同意状态）
        window.openPolicy = function() {
            overlay.classList.add('show');
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPolicy);
    } else {
        initPolicy();
    }
})();
