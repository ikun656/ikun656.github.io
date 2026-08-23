// ===== 主题管理（暗色模式，偏好存 Cookie，不用 LocalStorage）=====
(function () {
    'use strict';

    var THEME_KEY = 'theme_pref';

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // 防闪：在 <head> 内联脚本已调用过，这里只做兜底
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function toggleTheme() {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setCookie(THEME_KEY, next, 365);
        updateToggle();
    }

    function updateToggle() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var isDark = currentTheme() === 'dark';
        btn.textContent = isDark ? '日间模式' : '夜间模式';
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    // 供主页/子页调用，绑定切换按钮
    window.initThemeToggle = function () {
        var btn = document.getElementById('themeToggle');
        if (btn) btn.addEventListener('click', toggleTheme);
        updateToggle();
    };

    // 读取已存偏好（兜底，正常由 head 内联脚本提前应用）
    var saved = getCookie(THEME_KEY);
    if (saved === 'dark' || saved === 'light') applyTheme(saved);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initThemeToggle);
    } else {
        window.initThemeToggle();
    }
})();
