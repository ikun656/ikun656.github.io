// ===== 站点内容渲染（数据驱动：从 /content.json 读取并渲染）=====
(function () {
    'use strict';

    var CONTENT_URL = '/content.json';

    function el(id) { return document.getElementById(id); }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    function switchPage(pageId) {
        var allPages = document.querySelectorAll('.main .page');
        for (var i = 0; i < allPages.length; i++) allPages[i].classList.remove('active');
        var target = el('page-' + pageId);
        if (target) target.classList.add('active');
        var navItems = document.querySelectorAll('#navList li');
        for (var j = 0; j < navItems.length; j++) {
            navItems[j].classList.remove('active');
            if (navItems[j].dataset.page === pageId) navItems[j].classList.add('active');
        }
        var main = document.querySelector('.main');
        if (main) main.scrollTop = 0;
        if (history.replaceState) history.replaceState(null, '', '#' + pageId);
    }

    function renderNav(nav) {
        var ul = el('navList');
        if (!ul || !nav) return;
        ul.innerHTML = '';
        for (var i = 0; i < nav.length; i++) {
            var item = nav[i];
            var li = document.createElement('li');
            if (i === 0) li.className = 'active';
            li.dataset.page = item.page;
            var ico = '<span class="ico" style="--ico:url(assets/icons/' + escapeHtml(item.icon || 'ellipsis') + '.svg)"></span>';
            li.innerHTML = ico + ' ' + escapeHtml(item.label);
            ul.appendChild(li);
        }
        var lis = ul.querySelectorAll('li');
        for (var k = 0; k < lis.length; k++) {
            lis[k].addEventListener('click', function () {
                var pid = this.dataset.page;
                if (pid) switchPage(pid);
            });
        }
    }

    function renderPages(pages) {
        if (!pages) return;
        Object.keys(pages).forEach(function (k) {
            var p = pages[k];
            var sec = el('page-' + k);
            if (!sec) return;
            var h2 = sec.querySelector('h2');
            if (h2 && p.title != null) h2.textContent = p.title;
            var desc = sec.querySelector('.page-desc');
            if (desc && p.desc != null) desc.textContent = p.desc;
            var meta = sec.querySelector('.page-meta');
            if (meta && p.meta != null) meta.textContent = p.meta;
        });
    }

    function renderBrand(c) {
        if (!c) return;
        var logo = document.querySelector('.brand .logo');
        if (logo && c.brand != null) logo.innerHTML = '<img src="home.jpg" alt="logo"> ' + escapeHtml(c.brand);
        var sub = document.querySelector('.brand .sub');
        if (sub && c.brandSub != null) sub.textContent = c.brandSub;
        var foot = document.querySelector('.footer-nav');
        if (foot && c.footer != null) foot.textContent = c.footer;
    }

    function renderAnnounce(a) {
        var bar = el('announceBar');
        if (!bar) return;
        if (a && a.enabled && a.text) {
            bar.textContent = a.text;
            bar.style.display = 'block';
        } else {
            bar.style.display = 'none';
        }
    }

    function bindHash() {
        var hash = location.hash.replace('#', '');
        if (hash && el('page-' + hash)) switchPage(hash);
        window.addEventListener('hashchange', function () {
            var h = location.hash.replace('#', '');
            if (h && el('page-' + h)) switchPage(h);
        });
    }

    function applyData(data) {
        if (data.nav) renderNav(data.nav);
        if (data.pages) renderPages(data.pages);
        renderBrand(data);
        renderAnnounce(data.announce);
        bindHash();
    }

    function bindFallbackNav() {
        var items = document.querySelectorAll('#navList li');
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function () {
                var pid = this.dataset.page;
                if (pid) switchPage(pid);
            });
        }
        bindHash();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            fetchContent();
        });
    } else {
        fetchContent();
    }

    function fetchContent() {
        fetch(CONTENT_URL)
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(applyData)
            .catch(function (e) {
                console.warn('[cms] content.json 加载失败，使用静态兜底内容：', e);
                bindFallbackNav();
            });
    }
})();
