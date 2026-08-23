// ===== 政策同意管理（自包含：页面若无遮罩则自动注入样式、内容与图标）=====
(function () {
    'use strict';

    var POLICY_TEXT = [
        '<strong>一、声明与适用范围</strong>',
        '欢迎使用 ikun656 工具站。本页说明本站如何处理你的信息，以及使用各工具时数据会去到哪里。本站是一个纯前端、个人维护的轻量工具集合，部署在 GitHub Pages 上，没有后端服务器，也不存在账号体系。只要你继续使用本站的任意页面，即表示你已阅读并理解本说明。',
        '',
        '<strong>二、我们到底收集了什么</strong>',
        '在工具层面：我们什么都没收。本站运行在你自己的浏览器里，所有工具的计算、解析、格式化都在本地完成。我们不会在服务器端保存你粘贴的文本内容，不会写入任何与你个人相关的数据库，也不会把你的操作上报给任何第三方。你产生的一切数据，从输入到结果，都只停留在你当前打开的这个浏览器标签页里，关掉页面即消失。',
        '',
        '在访问统计层面：为了粗略了解站点有多少人来过（仅显示“总访客数 / 总浏览数”两个数字，不含任何个人身份），本站使用了第三方服务“不蒜子（busuanzi）”。它依靠你浏览器里的 Cookie 做去重，同一台设备重复访问只算一次，不会采集你的姓名、IP 归属地等可识别信息。统计仅用于展示，不参与任何工具功能。',
        '',
        '<strong>三、各个工具的数据流向</strong>',
        'JSON 格式化器：完全离线。你粘贴的 JSON 在浏览器内解析、压缩、校验，不经过任何网络请求。',
        'VSIX 下载加速器：当你输入扩展标识并点击获取版本时，浏览器会向 Visual Studio Marketplace 的公开接口请求版本列表。由于浏览器跨域限制，这一步通常借助第三方 CORS 代理（如 corsproxy.io、api.allorigins.win 等）中转；这些代理只是转发请求，本站不会把你的标识用于其他用途。下载 VSIX 安装包时，浏览器直接向你指定的 Marketplace 地址发起请求。以上过程不会向我们回传任何内容。',
        'Cloud 文件下载：文件列表通过 GitHub 官方 API 直连获取，不经过代理；下载文件时你可以自行选择是否通过 GitHub 代理加速。列表与文件均来自本仓库公开目录，不涉及你的个人信息。',
        '软件下载站：页面上的下载链接指向 F-Droid、Termux、NewPipe 等第三方提供的安装包；对 GitHub 资源会按你的选择自动附加代理前缀，对清华源等镜像直连。点击下载即跳转或拉取对应第三方资源，本站仅做汇总，不托管这些安装包。',
        '',
        '<strong>四、Cookie 与本地存储</strong>',
        '本站会写入以下 Cookie：policy_agreed（记住你是否看过本说明，有效期 365 天，只记录“已同意”状态）；以及不蒜子统计服务写入的匿名计数 Cookie（用于访问去重，不含身份信息）。除此之外，本站不使用 LocalStorage、SessionStorage 或其他追踪技术。你可以在浏览器设置中随时清除这些 Cookie，清除 policy_agreed 后再次访问会重新弹出本说明。',
        '',
        '<strong>五、第三方服务与免责</strong>',
        '使用本站时，部分功能会依赖 GitHub、Visual Studio Marketplace，以及若干公开 CORS 代理和镜像站点；访问统计依赖“不蒜子（busuanzi）”。这些服务由各自运营方提供，其可用性、安全性与隐私实践不在本站控制范围内。若因第三方服务中断、变更或数据问题导致你无法使用某个工具，本站不承担责任。请通过官方渠道获取重要软件，并注意核对来源与完整性。',
        '',
        '<strong>六、开源与版权</strong>',
        '本站的代码（HTML / CSS / JavaScript）以公开方式托管在 GitHub 上，供学习参考。你可以根据个人需求对代码进行修改和二次开发，但不得用于商业用途或恶意传播。页面中的品牌标识与原创内容版权归原作者所有；各工具所涉及的第三方软件，其版权归相应上游项目所有，请遵守各自的许可协议。',
        '',
        '<strong>七、总体免责声明</strong>',
        '本站所有工具均“按现状”提供，不对其可用性、准确性或适用性作出任何明示或默示担保。使用本站所产生的任何风险由你自己承担，包括但不限于数据丢失、下载内容的安全性，以及因依赖本工具而导致的任何后果。对于通过本站跳转或下载的第三方软件，其安全性与合规性由提供方负责，请自行判断并核实。',
        '',
        '<strong>八、政策变更</strong>',
        '我们可能不时更新本说明。更新后，本页内容即为最新版本，并在你下一次访问时生效；如果你此前已同意，不会因此重复打扰，但你随时可以在主页“查看隐私政策”中重新阅读。',
        '',
        '<strong>九、联系我们</strong>',
        '如对本说明或本站有任何疑问，可通过邮箱 djh2551706251@outlook.com 与我们联系。'
    ].join('\n\n');

    var POLICY_CSS = '' +
        '.policy-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .3s}' +
        '.policy-overlay.show{opacity:1;pointer-events:auto}' +
        '.policy-card{background:#fff;max-width:680px;width:90%;max-height:85vh;border-radius:24px;padding:32px 36px;box-shadow:0 24px 60px rgba(0,0,0,.3);overflow-y:auto;transform:scale(.95);transition:transform .3s}' +
        '.policy-overlay.show .policy-card{transform:scale(1)}' +
        '.policy-card h2{font-size:24px;margin-bottom:16px;color:#0f172a;display:flex;align-items:center;gap:10px}' +
        '.policy-card .policy-text{font-size:15px;line-height:1.7;color:#334155;margin-bottom:20px;white-space:pre-wrap;word-break:break-word;border:1px solid #eef2f8;border-radius:12px;padding:16px;background:#f8fafc;max-height:300px;overflow-y:auto}' +
        '.policy-card .policy-text strong{color:#2563eb}' +
        '.policy-card .btn-agree{background:#2563eb;color:#fff;border:none;padding:14px 40px;border-radius:40px;font-size:18px;font-weight:600;cursor:pointer;transition:background .2s;width:100%}' +
        '.policy-card .btn-agree:hover{background:#1d4ed8}' +
        '@media(max-width:480px){.policy-card{padding:24px 20px}.policy-card h2{font-size:20px}}';

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function injectOverlay() {
        if (document.getElementById('policyOverlay')) return; // 已有遮罩则不重复注入
        var style = document.createElement('style');
        style.id = 'policyStyle';
        style.textContent = POLICY_CSS;
        document.head.appendChild(style);

        var overlay = document.createElement('div');
        overlay.className = 'policy-overlay';
        overlay.id = 'policyOverlay';
        overlay.innerHTML =
            '<div class="policy-card">' +
                '<h2><span class="ico" style="--ico:url(/assets/icons/file-text.svg)"></span> 请先同意政策</h2>' +
                '<div class="policy-text">' + POLICY_TEXT + '</div>' +
                '<button class="btn-agree" id="agreeBtn">同意并继续</button>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    function initPolicy() {
        injectOverlay();

        var overlay = document.getElementById('policyOverlay');
        var agreeBtn = document.getElementById('agreeBtn');
        if (!overlay || !agreeBtn) {
            console.warn('policyOverlay 或 agreeBtn 元素未找到，跳过初始化');
            return;
        }

        if (getCookie('policy_agreed') === 'true') {
            overlay.classList.remove('show');
        } else {
            overlay.classList.add('show');
        }

        agreeBtn.addEventListener('click', function () {
            setCookie('policy_agreed', 'true', 365);
            overlay.classList.remove('show');
        });

        // 供主页“查看隐私政策”按钮调用：重新打开政策说明（不影响已同意状态）
        window.openPolicy = function () {
            overlay.classList.add('show');
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPolicy);
    } else {
        initPolicy();
    }
})();
