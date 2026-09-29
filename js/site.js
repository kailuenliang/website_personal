(() => {
    // ---- Content index. Add a project here and it appears on the homepage. ----
    // src: page whose <main> (or `sel`) holds the content. thumb: hover preview on desktop.
    const WORK = [
        { slug: 'ghostwork-is-self-actualization', title: 'Ghostwork Is Self Actualization', year: '2025', src: 'projects/work_ghostwork_is_self_actualization.html', thumb: 'media/images/ghostwork/main.JPG' },
        { slug: 'para-seedlings', title: 'Para-Seedlings', year: '2024', src: 'projects/work_seeds.html', thumb: 'media/images/seeds/seeds.gif' },
        { slug: 'banana-clouds', title: 'Banana Clouds', year: '2024', src: 'projects/work_banana_clouds.html', thumb: 'media/images/banana_clouds/opera_banana.jpg' },
        { slug: 'flow-and-oscillations', title: 'Flow and Oscillations', year: '2024', src: 'projects/work_flow_and_oscillations.html', thumb: 'media/images/flow_and_oscillations_thumbnail.png' },
        { slug: 'bridge-made-of-ashes', title: 'Bridge Made of Ashes', year: '2021', src: 'projects/work_bridge_made_of_ashes.html', thumb: 'media/images/bridge_gif.gif' },
        { slug: 'reverberations', title: 'Reverberations', year: '2020–21', src: 'projects/work_reverberations.html', thumb: 'media/images/reverberations.png' },
        { slug: 'audio-visual-experiments', title: 'Audio Visual Experiments', year: '2020', src: 'projects/work_audio_visual_experiments.html', thumb: 'media/images/sound_image.gif' },
        { slug: 'electronics-interfaces', title: 'Electronics / Interfaces', year: '2018', src: 'projects/work_electronics_interfaces.html', thumb: 'media/images/swarm.png' },
        { slug: 'whose-face-if-not-yours', title: 'Whose Face If Not Yours', year: '2017–18', src: 'projects/work_whose_face_if_not_yours.html', thumb: 'media/images/Whose_face/04/21.jpg' },
        { slug: 'void', title: '虚无 v7.0 (VOID)', year: '2016', src: 'projects/work_void.html', thumb: 'media/images/VOID.png' },
    ];
    const SOUND = [
        { slug: 'for-drifting-seas', title: 'For Drifting Seas', meta: 'album — Eating Music', src: 'content/sound/for-drifting-seas.html' },
        { slug: 'the-hollow-ghost', title: 'The Hollow Ghost', meta: 'album', src: 'content/sound/the-hollow-ghost.html' },
        { slug: 'techno-babble-sound-bath', title: 'Techno Babble Sound Bath', year: '2025', meta: 'performance — Oracle Egg, Los Angeles', src: 'content/sound/techno-babble-sound-bath.html', thumb: 'https://img.youtube.com/vi/5_aLGyVSh20/hqdefault.jpg' },
    ];
    const SOFTWARE = [
        { slug: 'image-scanner', title: 'Image Scanner', meta: 'openFrameworks / C++', src: 'content/software/image-scanner.html' },
        { slug: 'rgb-color-scanner', title: 'RGB Color Scanner', meta: 'Python / TouchDesigner', src: 'content/software/rgb-color-scanner.html' },
    ];
    const GROUPS = { work: WORK, sound: SOUND, software: SOFTWARE };
    const PAGES = {
        about: { title: 'About', src: 'content/about.html' },
        cv: { title: 'CV', src: 'cv.html', sel: '.cv-container' },
        teaching: { title: 'Teaching', src: 'content/teaching.html' },
        talks: { title: 'Talks & Residencies', src: 'content/talks.html' },
        contact: { title: 'Contact', src: 'content/contact.html' },
    };

    const $ = (s) => document.querySelector(s);
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const cache = new Map();
    let homeScroll = 0;

    // ---- Homepage index ----
    const index = $('#index');
    index.innerHTML = Object.entries(GROUPS).map(([group, items]) => `
        <section class="group">
            <h2 class="group-label">${group}</h2>
            <ul>${items.map((i) => `
                <li><a href="#/${group}/${i.slug}" data-thumb="${esc(i.thumb || '')}"><span>${esc(i.title)}</span></a></li>`).join('')}
            </ul>
        </section>`).join('');

    // Hover preview (desktop pointers only)
    const aside = $('#aside');
    const preview = $('#preview');
    const clearPreview = () => aside.classList.remove('previewing');
    if (matchMedia('(hover: hover)').matches) {
        index.addEventListener('mouseover', (e) => {
            const a = e.target.closest('a[data-thumb]');
            if (!a) return;
            if (!a.dataset.thumb) return clearPreview();
            preview.innerHTML = `<img src="${a.dataset.thumb}" alt="">`;
            aside.classList.add('previewing');
        });
        index.addEventListener('mouseleave', clearPreview);
    }

    // ---- Load + clean an existing page's content ----
    async function load(src, sel) {
        const key = src + (sel || '');
        if (cache.has(key)) return cache.get(key);
        const res = await fetch(src);
        if (!res.ok) throw new Error(res.status);
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const root = (sel && doc.querySelector(sel)) || doc.querySelector('main') || doc.body;

        root.querySelectorAll('script, style, link, .back-link, .modal, h1, header').forEach((el) => el.remove());
        // The page header shows the year, so drop the old "Year: ..." line
        root.querySelectorAll('div').forEach((d) => {
            if (!d.children.length || (d.children.length === 1 && d.firstElementChild.tagName === 'STRONG')) {
                if (/^\s*Year:/.test(d.textContent)) d.remove();
            }
        });
        root.querySelectorAll('strong').forEach((s) => {
            if (/^\s*Description:\s*$/.test(s.textContent)) s.remove();
        });
        // Resolve relative URLs against the source file, not index.html
        const base = new URL(src, location.href);
        root.querySelectorAll('[src], [href]').forEach((el) => {
            ['src', 'href'].forEach((attr) => {
                const v = el.getAttribute(attr);
                if (!v || /^(#|mailto:|tel:|https?:|data:|javascript:|\/\/)/i.test(v)) return;
                el.setAttribute(attr, new URL(v, base).href);
            });
        });
        root.querySelectorAll('a[href^="http"]').forEach((a) => {
            if (new URL(a.href).origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; }
        });
        root.querySelectorAll('iframe').forEach((f) => f.setAttribute('loading', 'lazy'));

        const html = root.innerHTML;
        cache.set(key, html);
        return html;
    }

    // ---- Router ----
    const view = { title: $('#page-title'), meta: $('#page-meta'), body: $('#page-body'), bar: $('#bar-right') };

    function setActive() {
        const h = location.hash;
        document.querySelectorAll('.nav a, .bar-right a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === h));
    }

    function showHome() {
        const wasPage = document.body.classList.contains('is-page');
        document.body.classList.remove('is-page');
        document.title = 'Kai-Luen Liang';
        clearPreview();
        setActive();
        if (wasPage) window.scrollTo(0, homeScroll);
    }

    async function route() {
        const hash = location.hash;
        const [a, b] = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
        const group = GROUPS[a];
        const item = group && group.find((i) => i.slug === b);
        const page = !group && PAGES[a];
        const entry = item || page;
        if (!entry) return showHome();

        if (!document.body.classList.contains('is-page')) homeScroll = window.scrollY;
        document.body.classList.add('is-page');
        document.title = `${entry.title} — Kai-Luen Liang`;
        view.title.textContent = entry.title;
        view.meta.textContent = item ? [item.year, item.meta].filter(Boolean).join(' — ') : '';

        if (item) {
            const i = group.indexOf(item);
            const prev = group[(i - 1 + group.length) % group.length];
            const next = group[(i + 1) % group.length];
            view.bar.className = 'bar-right';
            view.bar.innerHTML = `
                <a href="#/${a}/${prev.slug}" data-key="prev">&larr; <span class="lbl">prev</span></a>
                <span class="pos">${a} ${i + 1}/${group.length}</span>
                <a href="#/${a}/${next.slug}" data-key="next"><span class="lbl">next</span> &rarr;</a>`;
        } else {
            view.bar.className = 'bar-right info';
            view.bar.innerHTML = Object.keys(PAGES).map((k) => `<a href="#/${k}">${k}</a>`).join('');
        }
        setActive();
        window.scrollTo(0, 0);

        view.body.innerHTML = '<p class="loading">loading…</p>';
        try {
            const html = await load(entry.src, entry.sel);
            if (location.hash === hash) view.body.innerHTML = html;
        } catch (err) {
            if (location.hash === hash) view.body.innerHTML = '<p class="loading">Could not load this page.</p>';
        }
    }

    window.addEventListener('hashchange', route);
    route();

    // ---- Lightbox for images inside a page ----
    const box = $('#lightbox');
    const boxImg = box.querySelector('img');
    const openBox = (src, alt) => { boxImg.src = src; boxImg.alt = alt || ''; box.classList.add('open'); box.setAttribute('aria-hidden', 'false'); };
    const closeBox = () => { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); };
    view.body.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (!img || img.closest('a')) return;
        openBox(img.currentSrc || img.src, img.alt);
    });
    box.addEventListener('click', closeBox);
    // Old project pages call these from inline onclick handlers
    window.openModal = (img) => openBox(img.src, img.alt);
    window.closeModal = closeBox;

    // ---- Keyboard: ← → between projects, Esc back ----
    document.addEventListener('keydown', (e) => {
        if (box.classList.contains('open')) { if (e.key === 'Escape') closeBox(); return; }
        if (!document.body.classList.contains('is-page')) return;
        if (e.key === 'Escape') location.hash = '#/';
        const link = view.bar.querySelector(`[data-key="${e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : ''}"]`);
        if (link) location.hash = link.getAttribute('href');
    });
})();
