const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data", "seo-catalog.json"), "utf8"));
const { site, categories, products } = catalog;
const productById = new Map(products.map((product) => [product.id, product]));
const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mkdirp(relative) {
  fs.mkdirSync(path.join(root, relative), { recursive: true });
}

function readImageSize(relative) {
  const file = path.join(root, relative);
  const buffer = fs.readFileSync(file);
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  return { width: 800, height: 800 };
}

function imageTag(src, alt, eager = false, prefix = "") {
  const size = readImageSize(src);
  return `<img src="${prefix}${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${size.width}" height="${size.height}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
}

function whatsappLink(message) {
  return `https://wa.me/85255778242?text=${encodeURIComponent(message)}`;
}

function mailtoLink(subject, body) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function pageShell({ lang, title, description, canonical, alternate, body, schema }) {
  const otherLang = lang === "en" ? "zh-CN" : "en";
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}">
  <link rel="alternate" hreflang="${otherLang}" href="${alternate}">
  <link rel="alternate" hreflang="x-default" href="${lang === "en" ? canonical : alternate}">
  <link rel="icon" href="${site.baseUrl}/favicon.ico" sizes="any">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.baseUrl}/assets/hero-glove-wall.jpg">
  <title>${escapeHtml(title)}</title>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    :root{--red:#8b1e1e;--ink:#121826;--muted:#596275;--line:#e5e7eb;--paper:#f7f4ef;--green:#176c3a}
    *{box-sizing:border-box}html,body{max-width:100%;overflow-x:hidden}body{margin:0;font-family:Arial,"Noto Sans SC","Microsoft YaHei",sans-serif;color:var(--ink);line-height:1.58;background:#fff}a{color:inherit}img{max-width:100%;display:block;height:auto}.container{width:min(1120px,calc(100% - 32px));margin:auto}.header{border-bottom:1px solid var(--line);background:#fff;position:sticky;top:0;z-index:5}.nav{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{font-weight:900;text-decoration:none}.navlinks{display:flex;gap:18px;flex-wrap:wrap;font-size:14px;font-weight:700;max-width:100%}.hero{background:var(--paper);padding:56px 0 34px}.crumbs{font-size:13px;color:var(--muted);margin-bottom:20px}.crumbs a{color:var(--red)}h1{font-size:clamp(34px,5vw,58px);line-height:1.05;margin:0 0 16px;overflow-wrap:anywhere}h2{font-size:26px;margin:0 0 14px;overflow-wrap:anywhere}.lead{font-size:18px;color:#303847;max-width:820px;overflow-wrap:anywhere}.band{padding:42px 0;border-bottom:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.card{border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}.card-body{padding:16px}.card h3{margin:0 0 8px;font-size:18px}.pill{display:inline-block;padding:4px 8px;border-radius:4px;background:#fff;border:1px solid var(--line);font-size:12px;font-weight:800;color:var(--red);margin-bottom:10px}.table{width:100%;border-collapse:collapse;background:#fff;table-layout:fixed}.table th,.table td{border:1px solid var(--line);padding:12px;text-align:left;vertical-align:top;overflow-wrap:anywhere}.table th{width:30%}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:900;background:var(--red);color:#fff;white-space:normal;text-align:center}.btn.secondary{background:#fff;color:var(--ink);border:1px solid var(--line)}.btn.green{background:var(--green)}.note{padding:14px;border-left:4px solid var(--red);background:#fff;color:#303847}.footer{padding:30px 0;background:#121826;color:#fff}.footer a{color:#fff}@media(max-width:720px){.container{width:100%;max-width:390px;padding:0 16px}.nav{align-items:flex-start;flex-direction:column;padding:14px 16px}.navlinks{display:grid;grid-template-columns:1fr;gap:8px;width:100%;line-height:1.25}.navlinks a{min-width:0;overflow-wrap:anywhere}.hero{padding-top:34px}h1{font-size:30px;line-height:1.12}.lead{font-size:16px}.actions{display:grid;grid-template-columns:1fr}.btn{width:100%}.table,.table tbody,.table tr,.table th,.table td{display:block;width:100%}.table tr{border:1px solid var(--line);margin-bottom:12px}.table th,.table td{border:0;padding:10px}.table th{background:#f8fafc}.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function header(lang) {
  const en = lang === "en";
  return `<header class="header"><div class="container nav"><a class="brand" href="${en ? `${site.baseUrl}/index-en.html` : `${site.baseUrl}/`}">Fulide</a><nav class="navlinks"><a href="${en ? `${site.baseUrl}/categories/welding-gloves.html` : `${site.baseUrl}/zh/categories/dianshan-shoutao.html`}">${en ? "Products" : "产品"}</a><a href="${en ? `${site.baseUrl}/guides/leather-grades-and-glove-standards.html` : `${site.baseUrl}/zh/guides/piliao-dengji-yu-shoutao-biaozhun.html`}">${en ? "Leather & Standards" : "皮料与标准"}</a><a href="${en ? `${site.baseUrl}/factory.html` : `${site.baseUrl}/zh/factory.html`}">${en ? "Factory" : "工厂"}</a><a href="${en ? `${site.baseUrl}/inquiry-register.html` : `${site.baseUrl}/zh/inquiry-register.html`}">${en ? "Inquiry Register" : "询盘登记"}</a><a href="${en ? `${site.baseUrl}/` : `${site.baseUrl}/index-en.html`}">${en ? "中文" : "English"}</a></nav></div></header>`;
}

function footer(lang) {
  const en = lang === "en";
  const message = en ? "Hello Fulide, I found your website and want to discuss a leather glove inquiry." : "你好福立得，我通过官网找到你们，想咨询皮革手套。";
  return `<footer class="footer"><div class="container"><strong>${site.company}</strong><p>${en ? "WhatsApp" : "WhatsApp"}: <a href="${whatsappLink(message)}" target="_blank" rel="noopener">${site.whatsappDisplay}</a> · WeChat: ${site.wechat} · ${en ? "China phone" : "中国手机号"}: ${site.chinaPhone} · Email: <a href="mailto:${site.email}">${site.email}</a></p><p>${en ? "Static pages are written for crawlability and buyer review. Inquiry drafts are opened in your own WhatsApp or email app; the site does not claim successful submission." : "静态页面用于搜索抓取和买家审阅。询盘草稿会在你的 WhatsApp 或邮箱中打开；网站不会把打开草稿说成发送成功。"}</p></div></footer>`;
}

function productCards(category, lang) {
  const en = lang === "en";
  const assetPrefix = en ? "../" : "../../";
  return category.products.map((id, index) => {
    const product = productById.get(id);
    const detailPath = en ? `products/${product.id}.html` : `zh/products/${product.id}.html`;
    const pageForInquiry = product.detail
      ? `${site.baseUrl}/${detailPath}`
      : `${site.baseUrl}/${en ? `categories/${category.slug}.html` : `zh/categories/${category.zhSlug}.html`}`;
    const href = product.detail
      ? (en ? `../products/${product.id}.html` : `../products/${product.id}.html`)
      : "#inquiry";
    return `<article class="card">
      ${imageTag(product.image, en ? product.name : product.zhName, index === 0, assetPrefix)}
      <div class="card-body"><span class="pill">${en ? category.name : category.zhName}</span><h3>${escapeHtml(en ? product.name : product.zhName)}</h3><p>${escapeHtml(en ? product.summary : product.zhSummary)}</p><div class="actions"><a class="btn secondary" href="${href}">${en && product.detail ? "View details" : product.detail ? "查看详情" : en ? "Ask about this reference" : "按此参考询价"}</a><a class="btn green" href="${whatsappLink((en ? "Hello Fulide, I want to inquire about " : "你好福立得，我想询价：") + (en ? product.name : product.zhName) + " - " + pageForInquiry)}" target="_blank" rel="noopener">${en ? "WhatsApp draft" : "WhatsApp 草稿"}</a></div></div>
    </article>`;
  }).join("\n");
}

function categoryPage(category, lang) {
  const en = lang === "en";
  const pathPart = en ? `categories/${category.slug}.html` : `zh/categories/${category.zhSlug}.html`;
  const alternate = en ? `${site.baseUrl}/zh/categories/${category.zhSlug}.html` : `${site.baseUrl}/categories/${category.slug}.html`;
  const title = `${en ? category.name : category.zhName} | Fulide OEM/ODM`;
  const description = en ? category.summary : category.zhSummary;
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", "name": title, "description": description, "url": `${site.baseUrl}/${pathPart}` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": en ? "Home" : "首页", "item": en ? `${site.baseUrl}/index-en.html` : `${site.baseUrl}/` },
      { "@type": "ListItem", "position": 2, "name": en ? "Products" : "产品", "item": `${site.baseUrl}/${pathPart}` }
    ] },
    { "@context": "https://schema.org", "@type": "ItemList", "name": title, "itemListElement": category.products.map((id, idx) => {
      const product = productById.get(id);
      const url = product.detail
        ? `${site.baseUrl}/${en ? "products" : "zh/products"}/${product.id}.html`
        : `${site.baseUrl}/${pathPart}`;
      return { "@type": "ListItem", "position": idx + 1, "name": en ? product.name : product.zhName, "url": url };
    }) }
  ];
  const body = `${header(lang)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${en ? "../index-en.html" : "../../"}">${en ? "Home" : "首页"}</a> / ${en ? "Products" : "产品"} / ${escapeHtml(en ? category.name : category.zhName)}</div><h1>${escapeHtml(en ? category.name : category.zhName)}</h1><p class="lead">${escapeHtml(description)}</p><div class="actions"><a class="btn green" href="${whatsappLink((en ? "Hello Fulide, please quote " : "你好福立得，请报价：") + (en ? category.name : category.zhName) + " - " + site.baseUrl + "/" + pathPart)}" target="_blank" rel="noopener">${en ? "Open WhatsApp inquiry draft" : "打开 WhatsApp 询盘草稿"}</a><a class="btn secondary" href="${mailtoLink(`RFQ - ${en ? category.name : category.zhName}`, `Product category: ${en ? category.name : category.zhName}\nPage: ${site.baseUrl}/${pathPart}\nQuantity:\nMarket:\nTarget use:\nRequired documents:\n`)}">${en ? "Email draft" : "邮箱草稿"}</a></div></div></section>
    <section class="band"><div class="container"><h2>${en ? "Procurement facts to confirm" : "采购需确认的信息"}</h2><table class="table"><tbody><tr><th>${en ? "Materials" : "材料"}</th><td>${escapeHtml(en ? category.materials : category.zhMaterials)}</td></tr><tr><th>${en ? "Construction" : "结构"}</th><td>${escapeHtml(en ? category.construction : category.zhConstruction)}</td></tr><tr><th>${en ? "Typical uses" : "常见用途"}</th><td>${escapeHtml(en ? category.uses : category.zhUses)}</td></tr><tr><th>${en ? "Custom options" : "可确认定制项"}</th><td>${escapeHtml(en ? category.custom : category.zhCustom)}</td></tr></tbody></table><p class="note">${en ? "MOQ, lead time and certification claims are not listed here unless confirmed by current order evidence or a valid report for the exact product." : "未取得当前订单证据或对应产品有效报告前，本页不填写具体起订量、交期或认证承诺。"}</p></div></section>
    <section class="band"><div class="container"><h2>${en ? "Crawlable product references" : "可抓取产品参考"}</h2><div class="grid">${productCards(category, lang)}</div></div></section>
    <section class="band" id="inquiry"><div class="container"><h2>${en ? "Buyer FAQ" : "采购问答"}</h2><table class="table"><tbody><tr><th>${en ? "Can Fulide quote OEM or private-label orders?" : "可以做 OEM 或贴牌吗？"}</th><td>${en ? "Yes. Send product direction, target market, quantity, logo or packing notes and required documents. The factory will quote only after the scope is clear." : "可以。请发送产品方向、目标市场、数量、Logo 或包装要求以及文件需求；范围清楚后再报价。"}</td></tr><tr><th>${en ? "Are leather grade and glove protection level the same thing?" : "皮料等级和手套防护等级是一回事吗？"}</th><td>${en ? "No. Leather grade is a commercial material selection concept. Glove protection level comes from tests such as EN 388, ANSI/ISEA 105, EN 407 or EN 12477 when applicable." : "不是。皮料等级是商业选材概念；手套防护等级来自 EN 388、ANSI/ISEA 105、EN 407 或 EN 12477 等适用测试。"}</td></tr></tbody></table></div></section>
  </main>${footer(lang)}`;
  return pageShell({ lang, title, description, canonical: `${site.baseUrl}/${pathPart}`, alternate, body, schema });
}

function productPage(product, lang) {
  const en = lang === "en";
  const assetPrefix = en ? "../" : "../../";
  const category = categoryBySlug.get(product.category);
  const pathPart = en ? `products/${product.id}.html` : `zh/products/${product.id}.html`;
  const alternate = en ? `${site.baseUrl}/zh/products/${product.id}.html` : `${site.baseUrl}/products/${product.id}.html`;
  const title = `${en ? product.name : product.zhName} | Fulide`;
  const description = en ? product.summary : product.zhSummary;
  const message = `${en ? "Hello Fulide, I want to request a quote.\nProduct: " : "你好福立得，我想询价。\n产品："}${en ? product.name : product.zhName}\nPage: ${site.baseUrl}/${pathPart}\nQuantity:\nMarket:\nMaterial/lining/cuff:\nLogo/packing:\nRequired documents:\n`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Product", "name": en ? product.name : product.zhName, "description": description, "image": `${site.baseUrl}/${product.image}`, "brand": { "@type": "Brand", "name": "Fulide" }, "manufacturer": { "@type": "Organization", "name": site.company } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": en ? "Home" : "首页", "item": en ? `${site.baseUrl}/index-en.html` : `${site.baseUrl}/` },
      { "@type": "ListItem", "position": 2, "name": en ? category.name : category.zhName, "item": `${site.baseUrl}/${en ? "categories/" + category.slug : "zh/categories/" + category.zhSlug}.html` },
      { "@type": "ListItem", "position": 3, "name": en ? product.name : product.zhName, "item": `${site.baseUrl}/${pathPart}` }
    ] }
  ];
  const body = `${header(lang)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${en ? "../index-en.html" : "../../"}">${en ? "Home" : "首页"}</a> / <a href="${en ? `../categories/${category.slug}.html` : `../categories/${category.zhSlug}.html`}">${escapeHtml(en ? category.name : category.zhName)}</a> / ${escapeHtml(en ? product.name : product.zhName)}</div><h1>${escapeHtml(en ? product.name : product.zhName)}</h1><p class="lead">${escapeHtml(description)}</p></div></section>
    <section class="band"><div class="container grid"><div>${imageTag(product.image, en ? product.name : product.zhName, true, assetPrefix)}</div><div><h2>${en ? "Quote-ready notes" : "报价前确认"}</h2><table class="table"><tbody><tr><th>${en ? "Category" : "品类"}</th><td>${escapeHtml(en ? category.name : category.zhName)}</td></tr><tr><th>${en ? "Material direction" : "材料方向"}</th><td>${escapeHtml(en ? category.materials : category.zhMaterials)}</td></tr><tr><th>${en ? "Construction options" : "结构选项"}</th><td>${escapeHtml(en ? category.construction : category.zhConstruction)}</td></tr><tr><th>${en ? "Evidence limit" : "证据边界"}</th><td>${en ? "This page does not claim price, inventory, rating or certification. Confirm target tests and reports before using compliance language." : "本页不声称价格、库存、评分或认证。使用合规表述前需确认目标测试和报告。"}</td></tr></tbody></table><div class="actions"><a class="btn green" href="${whatsappLink(message)}" target="_blank" rel="noopener">${en ? "Open complete WhatsApp draft" : "打开完整 WhatsApp 草稿"}</a><a class="btn secondary" href="${mailtoLink(`RFQ - ${en ? product.name : product.zhName}`, message)}">${en ? "Open email draft" : "打开邮箱草稿"}</a></div></div></div></section>
  </main>${footer(lang)}`;
  return pageShell({ lang, title, description, canonical: `${site.baseUrl}/${pathPart}`, alternate, body, schema });
}

function guidePage(lang) {
  const en = lang === "en";
  const pathPart = en ? "guides/leather-grades-and-glove-standards.html" : "zh/guides/piliao-dengji-yu-shoutao-biaozhun.html";
  const alternate = en ? `${site.baseUrl}/zh/guides/piliao-dengji-yu-shoutao-biaozhun.html` : `${site.baseUrl}/guides/leather-grades-and-glove-standards.html`;
  const title = en ? "Leather Grades and Glove Protection Standards | Fulide Guide" : "皮料等级与手套防护标准 | 福立得指南";
  const description = en ? "A buyer guide explaining the difference between leather commercial grade and tested glove protection levels for leather safety glove sourcing." : "采购指南：区分皮料商业等级和手套测试防护等级，用于皮革劳保手套选型。";
  const body = `${header(lang)}<main><section class="hero"><div class="container"><div class="crumbs"><a href="${en ? "../index-en.html" : "../../"}">${en ? "Home" : "首页"}</a> / ${en ? "Guides" : "指南"}</div><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p></div></section><section class="band"><div class="container"><h2>${en ? "Direct answer" : "直接回答"}</h2><p>${en ? "Leather has commercial grades used for buying material, but there is no universal A/B/C grade that automatically proves glove protection. Protection levels come from glove tests and standards, and they must match the exact glove construction, sample and market." : "皮革有商业分级用于采购材料，但不存在一个全球通用的 A/B/C 皮料等级可以自动证明手套防护等级。防护等级来自手套测试和标准，必须对应具体手套结构、样品和目标市场。"}</p><table class="table"><thead><tr><th>${en ? "Topic" : "项目"}</th><th>${en ? "What it means" : "含义"}</th><th>${en ? "Buyer action" : "采购动作"}</th></tr></thead><tbody><tr><td>${en ? "Leather commercial grade" : "皮料商业等级"}</td><td>${en ? "Selection by hide area, defect tolerance, thickness, softness, usable area and finish." : "按皮胚部位、瑕疵容忍度、厚度、柔软度、可用面积和表面处理选择。"}</td><td>${en ? "Confirm sample, feel, thickness range and acceptable defects." : "确认样品、手感、厚度范围和可接受瑕疵。"}</td></tr><tr><td>EN 388 / ANSI/ISEA 105</td><td>${en ? "Mechanical test performance such as abrasion, cut, tear and puncture." : "耐磨、耐切割、撕裂、穿刺等机械性能测试。"}</td><td>${en ? "Ask which exact test, target level, sample and report are needed." : "确认具体测试、目标等级、样品和报告需求。"}</td></tr><tr><td>EN 12477</td><td>${en ? "Welding glove requirements; Type A and Type B involve different performance tradeoffs." : "焊接手套要求；Type A 与 Type B 有不同性能取舍。"}</td><td>${en ? "Match TIG/MIG/arc use, dexterity and heat exposure before quoting." : "报价前匹配 TIG/MIG/电弧焊用途、灵活性和热暴露。"}</td></tr><tr><td>EN 407</td><td>${en ? "Thermal risk tests where applicable to heat contact or flame exposure." : "适用于接触热或火焰暴露场景的热风险测试。"}</td><td>${en ? "Do not use thermal claims without exact tested properties." : "没有具体测试项目时，不使用热防护承诺。"}</td></tr></tbody></table><p class="note">${en ? "References to standards here are selection guidance, not certification claims for Fulide products. Official standard texts are copyrighted; buyers should use current official editions or test lab guidance for compliance decisions." : "本页提到标准是选型说明，不是福立得产品认证声明。官方标准文本有版权，合规决策应使用当前官方版本或检测机构建议。"}</p></div></section></main>${footer(lang)}`;
  return pageShell({ lang, title, description, canonical: `${site.baseUrl}/${pathPart}`, alternate, body, schema: { "@context": "https://schema.org", "@type": "WebPage", "name": title, "description": description, "url": `${site.baseUrl}/${pathPart}` } });
}

function factoryPage(lang) {
  const en = lang === "en";
  const assetPrefix = en ? "" : "../";
  const pathPart = en ? "factory.html" : "zh/factory.html";
  const alternate = en ? `${site.baseUrl}/zh/factory.html` : `${site.baseUrl}/factory.html`;
  const title = en ? "Fulide Factory Evidence and Quality Process" : "福立得工厂证据与质量流程";
  const description = en ? "Fulide factory overview with visible production evidence, quality process and buyer FAQ without unsupported age or certification claims." : "福立得工厂概况，展示生产证据、质量流程和采购问答，不使用未证实年限或认证承诺。";
  const body = `${header(lang)}<main><section class="hero"><div class="container"><div class="crumbs"><a href="${en ? "index-en.html" : "../"}">${en ? "Home" : "首页"}</a> / ${en ? "Factory" : "工厂"}</div><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p></div></section><section class="band"><div class="container"><h2>${en ? "Production evidence" : "生产证据"}</h2><div class="grid">${["assets/factory-floor.jpg","assets/cutting-room.jpg","assets/factory-strength/sewing-line.jpg","assets/factory-strength/warehouse-batches.jpg"].map((src) => `<article class="card">${imageTag(src, en ? "Fulide factory production evidence" : "福立得工厂生产证据", false, assetPrefix)}<div class="card-body"><p>${en ? "Factory image used as visible sourcing evidence. Ask for current photos or video if your audit requires date-specific proof." : "工厂图片作为可见采购证据。如买家审核需要日期证据，请索取当前照片或视频。"}</p></div></article>`).join("")}</div></div></section><section class="band"><div class="container"><h2>${en ? "Quality process" : "质量流程"}</h2><table class="table"><tbody><tr><th>${en ? "Before quote" : "报价前"}</th><td>${en ? "Confirm product use, target market, leather direction, construction and required documents." : "确认产品用途、目标市场、皮料方向、结构和所需文件。"}</td></tr><tr><th>${en ? "Sample confirmation" : "样品确认"}</th><td>${en ? "Confirm fit, leather feel, seam, cuff, lining, reinforcement and packaging direction." : "确认版型、皮料手感、车线、袖口、内里、补强和包装方向。"}</td></tr><tr><th>${en ? "Bulk review" : "大货检查"}</th><td>${en ? "Check incoming materials, key stitching areas, pair matching, packing and buyer-specific notes." : "检查来料、关键车线位置、配双、包装和买家专项要求。"}</td></tr></tbody></table></div></section></main>${footer(lang)}`;
  return pageShell({ lang, title, description, canonical: `${site.baseUrl}/${pathPart}`, alternate, body, schema: { "@context": "https://schema.org", "@type": "AboutPage", "name": title, "description": description, "url": `${site.baseUrl}/${pathPart}` } });
}

function inquiryPage(lang) {
  const en = lang === "en";
  const pathPart = en ? "inquiry-register.html" : "zh/inquiry-register.html";
  const alternate = en ? `${site.baseUrl}/zh/inquiry-register.html` : `${site.baseUrl}/inquiry-register.html`;
  const title = en ? "Free Inquiry Register Template | Fulide" : "免费询盘登记表模板 | 福立得";
  const description = en ? "A free static inquiry register template for tracking source, product, quantity, quote, sample and order progress." : "免费静态询盘登记表模板，用于记录来源、产品、数量、报价、寄样和订单进度。";
  const body = `${header(lang)}<main><section class="hero"><div class="container"><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p><div class="actions"><a class="btn" href="${en ? "docs/inquiry-register-template.csv" : "../docs/inquiry-register-template.csv"}">${en ? "Download CSV template" : "下载 CSV 模板"}</a><a class="btn secondary" href="${en ? "index-en.html#contact" : "../#contact"}">${en ? "Send inquiry" : "发送询盘"}</a></div></div></section><section class="band"><div class="container"><table class="table"><thead><tr><th>source</th><th>product</th><th>quantity</th><th>quote_status</th><th>sample_status</th><th>order_status</th></tr></thead><tbody><tr><td>Google / ChatGPT / WhatsApp / XHS</td><td>${en ? "Product or category page URL" : "产品或品类页面 URL"}</td><td>${en ? "Buyer stated quantity" : "买家填写数量"}</td><td>${en ? "not quoted / quoted / revised" : "未报价 / 已报价 / 已修改"}</td><td>${en ? "not needed / requested / sent" : "不需要 / 已要求 / 已寄出"}</td><td>${en ? "open / won / lost / follow-up" : "进行中 / 成交 / 丢单 / 跟进"}</td></tr></tbody></table><p class="note">${en ? "A button click is not counted as a qualified inquiry. Count an inquiry only when a buyer message includes enough product and business context for follow-up." : "按钮点击不算有效询盘。只有买家消息包含足够产品和商务上下文、可以跟进时，才计为有效询盘。"}</p></div></section></main>${footer(lang)}`;
  return pageShell({ lang, title, description, canonical: `${site.baseUrl}/${pathPart}`, alternate, body, schema: { "@context": "https://schema.org", "@type": "WebPage", "name": title, "description": description, "url": `${site.baseUrl}/${pathPart}` } });
}

function write(relative, content) {
  mkdirp(path.dirname(relative));
  fs.writeFileSync(path.join(root, relative), content, "utf8");
}

function buildSitemap() {
  const urls = [
    ["", "", "index-en.html"],
    ["index-en.html", "", "index-en.html"],
    ["factory.html", "zh/factory.html"],
    ["inquiry-register.html", "zh/inquiry-register.html"],
    ["guides/leather-grades-and-glove-standards.html", "zh/guides/piliao-dengji-yu-shoutao-biaozhun.html"],
    ...categories.map((category) => [`categories/${category.slug}.html`, `zh/categories/${category.zhSlug}.html`]),
    ...products.filter((product) => product.detail).map((product) => [`products/${product.id}.html`, `zh/products/${product.id}.html`])
  ];
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map(([locPath, zhPath, enPath = locPath]) => {
    const loc = locPath === "" ? `${site.baseUrl}/` : `${site.baseUrl}/${locPath}`;
    const zhHref = zhPath === "" ? `${site.baseUrl}/` : `${site.baseUrl}/${zhPath}`;
    const enHref = enPath === "" ? `${site.baseUrl}/` : `${site.baseUrl}/${enPath}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${enPath === "" || enPath === "index-en.html" ? "1.0" : "0.8"}</priority>\n    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhHref}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}" />\n  </url>`;
  }).join("\n")}\n</urlset>\n`;
}

function main() {
  categories.forEach((category) => {
    write(`categories/${category.slug}.html`, categoryPage(category, "en"));
    write(`zh/categories/${category.zhSlug}.html`, categoryPage(category, "zh-CN"));
  });
  products.filter((product) => product.detail).forEach((product) => {
    write(`products/${product.id}.html`, productPage(product, "en"));
    write(`zh/products/${product.id}.html`, productPage(product, "zh-CN"));
  });
  write("guides/leather-grades-and-glove-standards.html", guidePage("en"));
  write("zh/guides/piliao-dengji-yu-shoutao-biaozhun.html", guidePage("zh-CN"));
  write("factory.html", factoryPage("en"));
  write("zh/factory.html", factoryPage("zh-CN"));
  write("inquiry-register.html", inquiryPage("en"));
  write("zh/inquiry-register.html", inquiryPage("zh-CN"));
  write("docs/inquiry-register-template.csv", "date,source,landing_page,contact_channel,buyer_company,buyer_name,country_or_market,product_or_category,quantity,target_price,quote_status,sample_status,order_status,next_action,notes\n");
  write("sitemap.xml", buildSitemap());
}

main();
