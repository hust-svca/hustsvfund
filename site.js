/* 华中科技大学硅谷基金会 — 双语站脚本：注入导航/页脚 + 移动菜单 + 中英切换 */
(function(){
  const PAYPAL = "https://www.paypal.com/donate/?business=hustsvca@gmail.com&item_name=HUST+Silicon+Valley+Fund&currency_code=USD";
  const EMAIL = "hust.svca@gmail.com";
  const ALUMNI = "https://hustsv.org";
  const lang = document.body.dataset.lang || "en";
  const page = document.body.dataset.page || "index";
  const other = lang === "en" ? "zh" : "en";

  const T = {
    en: {
      brand: "HUST Silicon Valley Fund", tag: "501(c)(3) NONPROFIT · SILICON VALLEY",
      nav: [["index.html","Home","index"],["news.html","News","news"],["contact.html","Contact","contact"]],
      donate: "Donate", toggle: "中文",
      mission: "HUST Silicon Valley Fund is a 501(c)(3) nonprofit that provides community and educational services to professionals and students, including but not limited to the alumni of HUST.",
      fcol1: "Navigate", fcol2: "Get in touch",
      alumniLabel: "HUST NC Alumni Association", wechat: "WeChat: 华科北加校友会",
      note: "501(c)(3) Nonprofit · Donations 100% tax-deductible",
      newsBack: "← All news", source: "From the Wuhan United COVID-19 relief effort · 2020", related: "Links", tag: "RELIEF"
    },
    zh: {
      brand: "华中科技大学硅谷基金会", tag: "501(c)(3) 非营利组织 · 硅谷",
      nav: [["index.html","首页","index"],["news.html","新闻","news"],["contact.html","联系我们","contact"]],
      donate: "捐款", toggle: "EN",
      mission: "华中科技大学硅谷基金会是一个 501(c)(3) 非营利组织，为专业人士与学生提供社区与教育服务，包括但不限于华中科技大学的校友。",
      fcol1: "导航", fcol2: "联系方式",
      alumniLabel: "华科北加州校友会", wechat: "微信公众号：华科北加校友会",
      note: "501(c)(3) 非营利组织 · 捐赠 100% 免税抵扣",
      newsBack: "← 返回新闻", source: "来自 Wuhan United 抗击新冠疫情行动 · 2020", related: "相关链接", tag: "公益"
    }
  }[lang];
  const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---- 导航 ---- */
  const header = document.getElementById("nav");
  if(header){
    header.className = "nav";
    header.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="index.html">
          <span class="chip mono">SVF</span>
          <span><b>${T.brand}</b><small>${T.tag}</small></span>
        </a>
        <button class="burger" aria-label="menu"><span></span><span></span><span></span></button>
        <ul class="nav-links">
          ${T.nav.map(([h,t,k])=>`<li><a href="${h}" class="${k===page?'active':''}">${t}</a></li>`).join("")}
          <li><a class="lang-toggle mono" href="../${other}/${page}.html">${T.toggle}</a></li>
          <li><a class="nav-cta" href="${PAYPAL}" target="_blank" rel="noopener">${T.donate} →</a></li>
        </ul>
      </div>`;
    const burger = header.querySelector(".burger");
    const links = header.querySelector(".nav-links");
    burger.addEventListener("click",()=>{burger.classList.toggle("open");links.classList.toggle("show");});
    links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{burger.classList.remove("open");links.classList.remove("show");}));
  }

  /* ---- 页脚 ---- */
  const footer = document.getElementById("footer");
  if(footer){
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-inner">
        <div>
          <div class="ft-name">${T.brand}<small>HUST SILICON VALLEY FUND</small></div>
          <p>${T.mission}</p>
        </div>
        <div class="footer-col">
          <h4>${T.fcol1}</h4>
          ${T.nav.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}
          <a href="${ALUMNI}" target="_blank" rel="noopener">${T.alumniLabel} ↗</a>
        </div>
        <div class="footer-col">
          <h4>${T.fcol2}</h4>
          <a href="mailto:${EMAIL}">${EMAIL}</a>
          <a href="#">${T.wechat}</a>
          <a href="${PAYPAL}" target="_blank" rel="noopener">${T.donate} ↗</a>
        </div>
      </div>
      <div class="footer-base">${T.note} · © 2018–2026 HUST Silicon Valley Fund · hustsvfund.org</div>`;
  }

  const NEWS = window.NEWS || [];

  /* ---- News 列表 ---- */
  const listBox = document.getElementById("news-list");
  if(listBox){
    listBox.innerHTML = NEWS.map(n=>{
      const a = n[lang];
      const excerpt = (a.blocks.find(b=>b.k==="p")||{}).v || "";
      return `<a class="entry" href="article.html?id=${n.id}">
        <div class="d">${n.date}</div>
        <div><div class="tt">${esc(a.title)}</div><div class="ex">${esc(excerpt.slice(0,90))}${excerpt.length>90?"…":""}</div></div>
        <div class="tag mono">${T.tag}</div>
      </a>`;
    }).join("");
  }

  /* ---- News 文章详情 ---- */
  const artBox = document.getElementById("article");
  if(artBox){
    const id = new URLSearchParams(location.search).get("id");
    const n = NEWS.find(x=>x.id===id);
    if(!n){ artBox.innerHTML = `<p class="center"><a href="news.html">${T.newsBack}</a></p>`; }
    else{
      const a = n[lang];
      document.title = a.title + " · " + T.brand;
      const body = a.blocks.map(b=>{
        if(b.k==="h")  return `<h2 class="art-h">${esc(b.v)}</h2>`;
        if(b.k==="q")  return `<p class="art-q">${esc(b.v)}</p>`;
        if(b.k==="ul") return `<ul class="art-ul">${b.v.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`;
        if(b.k==="img")return `<img loading="lazy" src="${b.v}" alt="">`;
        return `<p>${esc(b.v)}</p>`;
      }).join("");
      const links = (a.links && a.links.length)
        ? `<div class="art-links"><span class="mono">${T.related}</span>${a.links.map(l=>`<a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join("")}</div>` : "";
      artBox.innerHTML = `
        <a class="back mono" href="news.html">${T.newsBack}</a>
        <div class="art-cat mono">[${T.tag}]</div>
        <h1>${esc(a.title)}</h1>
        <div class="art-date mono">${n.date} · ${T.source}</div>
        ${n.cover?`<img class="art-cover" src="${n.cover}" alt="">`:""}
        <div class="art-body">${body}</div>
        ${links}
        <a class="back mono" href="news.html">${T.newsBack}</a>`;
    }
  }

  /* 供页面按钮使用 */
  window.FUND = { PAYPAL, EMAIL, ALUMNI };
})();
