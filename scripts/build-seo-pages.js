const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data", "seo-catalog.json"), "utf8"));
const { site, categories, products } = catalog;
const productById = new Map(products.map((product) => [product.id, product]));
const gaMeasurementId = "G-FETFTBXF2P";

const LANGS = [
  { code: "en", dir: "ltr", label: "English", out: "", home: "index-en.html" },
  { code: "zh-CN", dir: "ltr", label: "中文", out: "zh", home: "index.html" },
  { code: "ar", dir: "rtl", label: "العربية", out: "ar", home: "index-ar.html" },
  { code: "vi", dir: "ltr", label: "Tiếng Việt", out: "vi", home: "index-vi.html" },
  { code: "th", dir: "ltr", label: "ไทย", out: "th", home: "index-th.html" },
  { code: "id", dir: "ltr", label: "Indonesia", out: "id", home: "index-id.html" },
];
const LANG = Object.fromEntries(LANGS.map((l) => [l.code, l]));

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function pick(obj, base, lang) {
  if (lang === "en") return obj[base];
  if (lang === "zh-CN") return obj["zh" + cap(base)] ?? obj[base];
  return obj[lang + cap(base)] ?? obj[base];
}
function T(lang, key) {
  return I18N[key][lang];
}

const I18N = {
  home: { en: "Home", "zh-CN": "首页", ar: "الرئيسية", vi: "Trang chủ", th: "หน้าแรก", id: "Beranda" },
  products: { en: "Products", "zh-CN": "产品", ar: "المنتجات", vi: "Sản phẩm", th: "สินค้า", id: "Produk" },
  standards: { en: "Leather & Standards", "zh-CN": "皮料与标准", ar: "الجلود والمعايير", vi: "Tiêu chuẩn da", th: "มาตรฐานหนัง", id: "Standar Kulit" },
  factory: { en: "Factory", "zh-CN": "工厂", ar: "المصنع", vi: "Nhà máy", th: "โรงงาน", id: "Pabrik" },
  inquiry: { en: "Inquiry Register", "zh-CN": "询盘登记", ar: "سجل الاستفسارات", vi: "Đăng ký báo giá", th: "ลงทะเบียนสอบถาม", id: "Daftar Inquiry" },
  whatsapp: { en: "WhatsApp", "zh-CN": "WhatsApp", ar: "WhatsApp", vi: "WhatsApp", th: "WhatsApp", id: "WhatsApp" },
  email: { en: "Email", "zh-CN": "邮箱", ar: "البريد الإلكتروني", vi: "Email", th: "อีเมล", id: "Email" },
  wechat: { en: "WeChat", "zh-CN": "WeChat", ar: "WeChat", vi: "WeChat", th: "WeChat", id: "WeChat" },
  chinaPhone: { en: "China phone", "zh-CN": "中国手机号", ar: "هاتف الصين", vi: "Số điện thoại TQ", th: "โทรศัพท์จีน", id: "Telepon Tiongkok" },
  downloadCsv: { en: "Download CSV template", "zh-CN": "下载 CSV 模板", ar: "تحميل قالب CSV", vi: "Tải mẫu CSV", th: "ดาวน์โหลดเทมเพลต CSV", id: "Unduh templat CSV" },
  sendInquiry: { en: "Send inquiry", "zh-CN": "发送询盘", ar: "أرسل استفسارا", vi: "Gửi yêu cầu", th: "ส่งการสอบถาม", id: "Kirim inquiry" },
  disclaimer: {
    en: "Static pages are written for crawlability and buyer review. Inquiry drafts are opened in your own WhatsApp or email app; the site does not claim successful submission.",
    "zh-CN": "静态页面用于搜索抓取和买家审阅。询盘草稿会在你的 WhatsApp 或邮箱中打开；网站不会把打开草稿说成发送成功。",
    ar: "الصفحات الثابتة مكتوبة لقابلية الزحف ومراجعة المشتري. تُفتح مسودات الاستفسار في تطبيق WhatsApp أو البريد الخاص بك؛ الموقع لا يدعي نجاح الإرسال.",
    vi: "Các trang tĩnh được viết để dễ thu thập và duyệt bởi người mua. Mở nháp yêu cầu trong ứng dụng WhatsApp hoặc email của bạn; trang web không coi việc mở nháp là gửi thành công.",
    th: "หน้าเว็บแบบคงที่เขียนขึ้นเพื่อให้เครื่องมือค้นหาเก็บข้อมูลและให้ผู้ซื้อตรวจสอบ เปิดร่างการสอบถามในแอป WhatsApp หรืออีเมลของคุณ โดยเว็บไซต์ไม่ถือว่าการเปิดร่างคือการส่งสำเร็จ",
    id: "Halaman statis ditulis agar mudah di-crawl dan ditinjau pembeli. Drafnya inquiry dibuka di aplikasi WhatsApp atau email Anda; situs tidak menganggap membuka draf sebagai pengiriman berhasil.",
  },
  procurementTitle: { en: "Procurement facts to confirm", "zh-CN": "采购需确认的信息", ar: "حقائق الشراء التي يجب تأكيدها", vi: "Thông tin cần xác nhận khi mua", th: "ข้อมูลจัดซื้อที่ต้องยืนยัน", id: "Fakta pengadaan yang harus dikonfirmasi" },
  materials: { en: "Materials", "zh-CN": "材料", ar: "المواد", vi: "Vật liệu", th: "วัสดุ", id: "Material" },
  construction: { en: "Construction", "zh-CN": "结构", ar: "البناء", vi: "Cấu tạo", th: "โครงสร้าง", id: "Konstruksi" },
  typicalUses: { en: "Typical uses", "zh-CN": "常见用途", ar: "الاستخدامات النموذจية", vi: "Công dụng điển hình", th: "การใช้งานทั่วไป", id: "Kegunaan umum" },
  customOptions: { en: "Custom options", "zh-CN": "可确认定制项", ar: "خيارات التخصيص", vi: "Tùy chọn tùy chỉnh", id: "Opsi kustom" },
  note: {
    en: "MOQ, lead time and certification claims are not listed here unless confirmed by current order evidence or a valid report for the exact product.",
    "zh-CN": "未取得当前订单证据或对应产品有效报告前，本页不填写具体起订量、交期或认证承诺。",
    ar: "لا تُدرج الحد الأدنى للطلب أو مدة التسليم أو ادعاءات الشهادات هنا ما لم يؤكدها دليل طلب حالي أو تقرير صالح للمنتج المحدد.",
    vi: "Không liệt kê MOQ, thời gian giao hàng hay cam kết chứng nhận tại đây trừ khi có bằng chứng đơn hàng hiện tại hoặc báo cáo hợp lệ cho sản phẩm chính xác.",
    th: "ไม่ระบุ MOQ ระยะเวลาส่ง หรือคำกล่าวอ้างการรับรองไว้ที่นี่ จนกว่าจะมีหลักฐานคำสั่งซื้อปัจจุบันหรือรายงานที่ถูกต้องสำหรับสินค้านั้น",
    id: "MOQ, waktu pengiriman, dan klaim sertifikasi tidak dicantumkan di sini kecuali dikonfirmasi oleh bukti pesanan saat ini atau laporan valid untuk produk yang tepat.",
  },
  referencesTitle: { en: "Crawlable product references", "zh-CN": "可抓取产品参考", ar: "مراجع المنتجات القابلة للزحف", vi: "Tham khảo sản phẩm có thể thu thập", th: "อ้างอิงสินค้าที่เครื่องมือค้นหาเก็บได้", id: "Referensi produk yang bisa di-crawl" },
  buyerFaqTitle: { en: "Buyer FAQ", "zh-CN": "采购问答", ar: "أسئلة المشتري الشائعة", vi: "Hỏi đáp mua hàng", th: "คำถามที่พบบ่อยสำหรับผู้ซื้อ", id: "FAQ Pembeli" },
  faq1q: { en: "Can Fulide quote OEM or private-label orders?", "zh-CN": "可以做 OEM 或贴牌吗？", ar: "هل يمكن لفوليدي تقديم عروض أسعار لطلبات OEM أو علامة خاصة؟", vi: "Fulide có báo giá được đơn OEM hoặc riêng nhãn không?", th: "Fulide สามารถเสนอราคาสำหรับคำสั่งซื้อ OEM หรือแบรนด์ของตนเองได้หรือไม่?", id: "Bisakah Fulide mem quotation untuk pesanan OEM atau private-label?" },
  faq1a: {
    en: "Yes. Send product direction, target market, quantity, logo or packing notes and required documents. The factory will quote only after the scope is clear.",
    "zh-CN": "可以。请发送产品方向、目标市场、数量、Logo 或包装要求以及文件需求；范围清楚后再报价。",
    ar: "نعم. أرسل اتجاه المنتج والسوق المستهدف والكمية وملاحظات الشعار أو التغليف والمستندات المطلوبة. المصنع لن يقدم عرض سعر إلا بعد وضوح النطاق.",
    vi: "Có. Gửi định hướng sản phẩm, thị trường mục tiêu, số lượng, ghi chú logo hoặc đóng gói và tài liệu cần thiết. Nhà máy chỉ báo giá sau khi phạm vi rõ ràng.",
    th: "ได้ ส่งทิศทางสินค้า ตลาดเป้าหมาย จำนวน หมายเหตุโลโก้หรือบรรจุภัณฑ์ และเอกสารที่ต้องการ โรงงานจะเสนอราคาเมื่อขอบเขตชัดเจน",
    id: "Ya. Kirim arah produk, pasar target, jumlah, catatan logo atau kemasan, dan dokumen yang diperlukan. Pabrik hanya akan quotation setelah ruang lingkup jelas.",
  },
  faq2q: { en: "Are leather grade and glove protection level the same thing?", "zh-CN": "皮料等级和手套防护等级是一回事吗？", ar: "هل درجة الجلد ومستوى حماية القفاز نفس الشيء؟", vi: "Cấp da và cấp bảo vệ găng tay có phải là một không?", th: "เกรดหนังกับระดับการป้องกันของถุงมือเป็นเรื่องเดียวกันหรือไม่?", id: "Apakah grad kulit dan level proteksi sarung tangan itu sama?" },
  faq2a: {
    en: "No. Leather grade is a commercial material selection concept. Glove protection level comes from tests such as EN 388, ANSI/ISEA 105, EN 407 or EN 12477 when applicable.",
    "zh-CN": "不是。皮料等级是商业选材概念；手套防护等级来自 EN 388、ANSI/ISEA 105、EN 407 或 EN 12477 等适用测试。",
    ar: "لا. درجة الجلد مفهوم تجاري لاختيار المادة. مستوى حماية القفاز يأتي من اختبارات مثل EN 388 و ANSI/ISEA 105 و EN 407 أو EN 12477 عند الانطباق.",
    vi: "Không. Cấp da là khái niệm thương mại chọn vật liệu. Cấp bảo vệ găng tay đến từ các bài kiểm EN 388, ANSI/ISEA 105, EN 407 hoặc EN 12477 khi áp dụng.",
    th: "ไม่ เกรดหนังเป็นแนวคิดเชิงพาณิชย์ในการเลือกวัสดุ ระดับการป้องกันของถุงมือมาจากการทดสอบเช่น EN 388 ANSI/ISEA 105 EN 407 หรือ EN 12477 เมื่อใช้ได้",
    id: "Tidak. Grad kulit adalah konsep pemilihan material komersial. Level proteksi sarung tangan berasal dari tes seperti EN 388, ANSI/ISEA 105, EN 407, atau EN 12477 bila berlaku.",
  },
  faq3q: {
    en: "What leather or materials do you use for safety gloves?",
    "zh-CN": "你们用的是什么皮料或材料？",
    ar: "ما الجلد أو المواد التي تستخدمونها للقفازات الواقية؟",
    vi: "Bạn dùng da hoặc vật liệu nào cho găng tay bảo hộ?",
    th: "คุณใช้หนังหรือวัสดุใดสำหรับถุงมือความปลอดภัย?",
    id: "Kulit atau material apa yang Anda gunakan untuk sarung tangan keselamatan?",
  },
  faq3a: {
    en: "Fulide selects leather by commercial grade — hide area, defect tolerance, thickness and hand feel — plus the lining, cuff and reinforcement materials matched to your target use. Confirm a sample before bulk so the feel and build match your market.",
    "zh-CN": "福立得按商业等级选材：皮胚部位、瑕疵容忍度、厚度与手感，以及匹配目标用途的内里、袖口与补强材料。大货前确认样品，确保手感与做工符合您的市场。",
    ar: "تختار فوليدي الجلد حسب الدرجة التجارية — منطقة الجلد وتحمل العيوب والسماكة والملمس — بالإضافة إلى البطانة والكفة ومواد التعزيز التي تطابق استخدامك المستهدف. أكد العينة قبل الإنتاج الكبير ليتطابق الملمس والبناء مع سوقك.",
    vi: "Fulide chọn da theo cấp thương mại — vị trí da, dung sai lỗi, độ dày và cảm giác cầm — cùng vật liệu lót, cổ tay và gia cường phù hợp với mục đích dùng. Hãy xác nhận mẫu trước khi sản xuất loạt để cảm giác và cấu tạo khớp với thị trường của bạn.",
    th: "Fulide เลือกหนังตามเกรดเชิงพาณิชย์ — พื้นที่หนัง ความทนทานต่อตำหนิ ความหนา และสัมผัส — รวมถึงวัสดุบุผิว ข้อมือ และการเสริมแรงที่สอดคล้องกับการใช้งานเป้าหมาย ยืนยันตัวอย่างก่อนผลิตจริงเพื่อให้สัมผัสและโครงสร้างตรงกับตลาดของคุณ",
    id: "Fulide memilih kulit menurut grad komersial — area kulit, toleransi cacat, ketebalan, dan tekstur — plus material pelapis, manset, dan penguat yang cocok dengan kegunaan target. Konfirmasi sampel sebelum bulk agar tekstur dan build cocok dengan pasar Anda.",
  },
  faq4q: {
    en: "Do you provide test reports or certifications?",
    "zh-CN": "你们提供测试报告或认证吗？",
    ar: "هل تقدمون تقارير اختبار أو شهادات؟",
    vi: "Có cung cấp báo cáo kiểm nghiệm hoặc chứng nhận không?",
    th: "คุณให้รายงานการทดสอบหรือการรับรองหรือไม่?",
    id: "Apakah Anda memberikan laporan tes atau sertifikasi?",
  },
  faq4a: {
    en: "The factory quotes only after the scope is clear. Tell us which standard your market needs — for example EN 388, ANSI/ISEA 105, EN 407 or EN 12477 — and which exact test and report it requires, and we will confirm what current evidence supports.",
    "zh-CN": "范围清楚后工厂才报价。请告知您的市场需要哪个标准（如 EN 388、ANSI/ISEA 105、EN 407 或 EN 12477）以及具体测试与报告要求，我们会确认当前证据能支持哪些。",
    ar: "لا يقدم المصنع عرض سعر إلا بعد وضوح النطاق. أخبرنا بالمعيار الذي يحتاجه سوقك — مثل EN 388 أو ANSI/ISEA 105 أو EN 407 أو EN 12477 — وما هو الاختبار والتقرير المطلوب تحديداً، وسنؤكد ما تدعمه الأدلة الحالية.",
    vi: "Nhà máy chỉ báo giá sau khi phạm vi rõ ràng. Hãy cho biết thị trường bạn cần tiêu chuẩn nào — ví dụ EN 388, ANSI/ISEA 105, EN 407 hay EN 12477 — và bài kiểm cùng báo cáo cụ thể cần thiết, chúng tôi sẽ xác nhận bằng chứng hiện có hỗ trợ những gì.",
    th: "โรงงานจะเสนอราคาเมื่อขอบเขตชัดเจน เบื้องต้นแจ้งมาตรฐานที่ตลาดคุณต้องการ เช่น EN 388 ANSI/ISEA 105 EN 407 หรือ EN 12477 รวมถึงการทดสอบและรายงานที่ระบุชัดเจน แล้วเราจะยืนยันว่าหลักฐานปัจจุบันรองรับอะไรบ้าง",
    id: "Pabrik hanya akan quotation setelah ruang lingkup jelas. Beri tahu standar yang pasar Anda butuhkan — misal EN 388, ANSI/ISEA 105, EN 407, atau EN 12477 — serta tes dan laporan pasti yang diperlukan, dan kami akan konfirmasi bukti saat ini mendukung apa.",
  },
  faq5q: {
    en: "How do I start an inquiry with Fulide?",
    "zh-CN": "如何向福立得发起询盘？",
    ar: "كيف أبدأ استفساراً مع فوليدي؟",
    vi: "Làm sao để bắt đầu gửi báo giá cho Fulide?",
    th: "ฉันเริ่มสอบถามกับ Fulide ได้อย่างไร?",
    id: "Bagaimana cara memulai inquiry ke Fulide?",
  },
  faq5a: {
    en: "Send your product direction, target market, quantity, logo or packing notes and required documents. A clear brief lets the factory quote faster and reduces sample rework.",
    "zh-CN": "请发送产品方向、目标市场、数量、Logo 或包装要求以及所需文件。简明的需求说明能让工厂更快报价，也减少打样返工。",
    ar: "أرسل اتجاه المنتج والسوق المستهدف والكمية وملاحظات الشعار أو التغليف والمستندات المطلوبة. الموجز الواضح يتيح للمصنع التسعير أسرع ويقلل إعادة عمل العينة.",
    vi: "Gửi định hướng sản phẩm, thị trường mục tiêu, số lượng, ghi chú logo hoặc đóng gói và tài liệu cần thiết. Một brief rõ ràng giúp nhà máy báo giá nhanh hơn và giảm làm lại mẫu.",
    th: "ส่งทิศทางสินค้า ตลาดเป้าหมาย จำนวน หมายเหตุโลโก้หรือบรรจุภัณฑ์ และเอกสารที่ต้องการ ไฟล์บรีฟที่ชัดเจนช่วยให้โรงงานเสนอราคาเร็วขึ้นและลดการทำตัวอย่างใหม่",
    id: "Kirim arah produk, pasar target, jumlah, catatan logo atau kemasan, dan dokumen yang diperlukan. Brief yang jelas membuat pabrik quotation lebih cepat dan mengurangi revisi sampel.",
  },
  openWhatsapp: { en: "Open WhatsApp inquiry draft", "zh-CN": "打开 WhatsApp 询盘草稿", ar: "افتح مسودة استفسار WhatsApp", vi: "Mở nháp yêu cầu WhatsApp", th: "เปิดร่างการสอบถาม WhatsApp", id: "Buka draf inquiry WhatsApp" },
  emailDraft: { en: "Email draft", "zh-CN": "邮箱草稿", ar: "مسودة بريد", vi: "Nháp email", th: "ร่างอีเมล", id: "Draf email" },
  viewDetails: { en: "View details", "zh-CN": "查看详情", ar: "عرض التفاصيل", vi: "Xem chi tiết", th: "ดูรายละเอียด", id: "Lihat detail" },
  askReference: { en: "Ask about this reference", "zh-CN": "按此参考询价", ar: "اسأل عن هذه المرجع", vi: "Hỏi về tham khảo này", th: "สอบถามเกี่ยวกับรายการนี้", id: "Tanya tentang referensi ini" },
  whatsappDraft: { en: "WhatsApp draft", "zh-CN": "WhatsApp 草稿", ar: "مسودة WhatsApp", vi: "Nháp WhatsApp", th: "ร่าง WhatsApp", id: "Draf WhatsApp" },
  quoteNotes: { en: "Quote-ready notes", "zh-CN": "报价前确认", ar: "ملاحظات جاهزة للتسعير", vi: "Ghi chú sẵn sàng báo giá", th: "บันทึกพร้อมเสนอราคา", id: "Catatan siap quotation" },
  categoryLabel: { en: "Category", "zh-CN": "品类", ar: "الفئة", vi: "Danh mục", th: "หมวดหมู่", id: "Kategori" },
  materialDirection: { en: "Material direction", "zh-CN": "材料方向", ar: "اتجاه المادة", vi: "Định hướng vật liệu", th: "ทิศทางวัสดุ", id: "Arah material" },
  constructionOptions: { en: "Construction options", "zh-CN": "结构选项", ar: "خيارات البناء", vi: "Tùy chọn cấu tạo", th: "ตัวเลือกโครงสร้าง", id: "Opsi konstruksi" },
  evidenceLimit: { en: "Evidence limit", "zh-CN": "证据边界", ar: "حدود الأدلة", vi: "Giới hạn bằng chứng", th: "ขอบเขตหลักฐาน", id: "Batas bukti" },
  evidenceLimitText: {
    en: "This page does not claim price, inventory, rating or certification. Confirm target tests and reports before using compliance language.",
    "zh-CN": "本页不声称价格、库存、评分或认证。使用合规表述前需确认目标测试和报告。",
    ar: "لا تدعي هذه الصفحة السعر أو المخزون أو التقييم أو الشهادة. أكد الاختبارات والتقارير المستهدفة قبل استخدام لغة الامتثال.",
    vi: "Trang này không tuyên bố giá, tồn kho, đánh giá hay chứng nhận. Xác nhận bài kiểm và báo cáo mục tiêu trước khi dùng ngôn ngữ tuân thủ.",
    th: "หน้านี้ไม่กล่าวอ้างราคา สต็อก การให้คะแนน หรือการรับรอง ยืนยันการทดสอบและรายงานเป้าหมายก่อนใช้ถ้อยคำการปฏิบัติตาม",
    id: "Halaman ini tidak mengklaim harga, stok, rating, atau sertifikasi. Konfirmasi tes dan laporan target sebelum menggunakan bahasa kepatuhan.",
  },
  openCompleteWhatsapp: { en: "Open complete WhatsApp draft", "zh-CN": "打开完整 WhatsApp 草稿", ar: "افتح مسودة WhatsApp الكاملة", vi: "Mở nháp WhatsApp đầy đủ", th: "เปิดร่าง WhatsApp ฉบับเต็ม", id: "Buka draf WhatsApp lengkap" },
  openEmailDraft: { en: "Open email draft", "zh-CN": "打开邮箱草稿", ar: "افتح مسودة البريد", vi: "Mở nháp email", th: "เปิดร่างอีเมล", id: "Buka draf email" },
  guideTitle: {
    en: "Leather Grades and Glove Protection Standards | Fulide Guide",
    "zh-CN": "皮料等级与手套防护标准 | 福立得指南",
    ar: "درجات الجلد ومعايير حماية القفازات | دليل فوليدي",
    vi: "Cấp da và tiêu chuẩn bảo vệ găng tay | Hướng dẫn Fulide",
    th: "เกรดหนังและมาตรฐานการป้องกันถุงมือ | คู่มือ Fulide",
    id: "Grade Kulit dan Standar Proteksi Sarung Tangan | Panduan Fulide",
  },
  guideDescription: {
    en: "A buyer guide explaining the difference between leather commercial grade and tested glove protection levels for leather safety glove sourcing.",
    "zh-CN": "采购指南：区分皮料商业等级和手套测试防护等级，用于皮革劳保手套选型。",
    ar: "دليل للمشتري يوضح الفرق بين درجة الجلد التجارية ومستويات حماية القفازات المختبرة عند مصادر القفازات الجلدية.",
    vi: "Hướng dẫn người mua giải thích sự khác biệt giữa cấp da thương mại và cấp bảo vệ găng tay đã kiểm cho nguồn cung găng tay da.",
    th: "คู่มือสำหรับผู้ซื้ออธิบายความแตกต่างระหว่างเกรดหนังเชิงพาณิชย์และระดับการป้องกันถุงมือที่ผ่านการทดสอบ สำหรับการจัดหาถุงมือหนัง",
    id: "Panduan pembeli yang menjelaskan perbedaan antara grad kulit komersial dan level proteksi sarung tangan teruji untuk pengadaan sarung tangan kulit.",
  },
  crumbGuides: { en: "Guides", "zh-CN": "指南", ar: "أدلة", vi: "Hướng dẫn", th: "คู่มือ", id: "Panduan" },
  directAnswerTitle: { en: "Direct answer", "zh-CN": "直接回答", ar: "إجابة مباشرة", vi: "Trả lời trực tiếp", th: "คำตอบโดยตรง", id: "Jawaban langsung" },
  directAnswerBody: {
    en: "Leather has commercial grades used for buying material, but there is no universal A/B/C grade that automatically proves glove protection. Protection levels come from glove tests and standards, and they must match the exact glove construction, sample and market.",
    "zh-CN": "皮革有商业分级用于采购材料，但不存在一个全球通用的 A/B/C 皮料等级可以自动证明手套防护等级。防护等级来自手套测试和标准，必须对应具体手套结构、样品和目标市场。",
    ar: "للجلد درجات تجارية تُستخدم لشراء المادة، لكن لا توجد درجة A/B/C عالمية تثبت تلقائياً حماية القفاز. مستويات الحماية تأتي من اختبارات ومعايير القفازات، ويجب أن تطابق البناء والعينة والسوق المحددين.",
    vi: "Da có cấp thương mại dùng để mua vật liệu, nhưng không có cấp A/B/C toàn cầu tự động chứng minh bảo vệ găng tay. Cấp bảo vệ đến từ bài kiểm và tiêu chuẩn găng tay, và phải khớp với cấu tạo, mẫu và thị trường cụ thể.",
    th: "หนังมีเกรดเชิงพาณิชย์สำหรับซื้อวัสดุ แต่ไม่มีเกรด A/B/C สากลที่พิสูจน์การป้องกันถุงมือโดยอัตโนมัติ ระดับการป้องกันมาจากการทดสอบและมาตรฐานถุงมือ และต้องสอดคล้องกับโครงสร้าง ตัวอย่าง และตลาดที่ระบุ",
    id: "Kulit memiliki grad komersial untuk membeli material, tapi tidak ada grad A/B/C universal yang otomatis membuktikan proteksi sarung tangan. Level proteksi berasal dari tes dan standar sarung tangan, dan harus cocok dengan konstruksi, sampel, dan pasar yang tepat.",
  },
  tableTopic: { en: "Topic", "zh-CN": "项目", ar: "الموضوع", vi: "Chủ đề", th: "หัวข้อ", id: "Topik" },
  tableMeans: { en: "What it means", "zh-CN": "含义", ar: "معناه", vi: "Ý nghĩa", th: "ความหมาย", id: "Artinya" },
  tableAction: { en: "Buyer action", "zh-CN": "采购动作", ar: "إجراء المشتري", vi: "Hành động", th: "การดำเนินการของผู้ซื้อ", id: "Tindakan pembeli" },
  row1Topic: { en: "Leather commercial grade", "zh-CN": "皮料商业等级", ar: "درجة الجلد التجارية", vi: "Cấp da thương mại", th: "เกรดหนังเชิงพาณิชย์", id: "Grad kulit komersial" },
  row1Means: {
    en: "Selection by hide area, defect tolerance, thickness, softness, usable area and finish.",
    "zh-CN": "按皮胚部位、瑕疵容忍度、厚度、柔软度、可用面积和表面处理选择。",
    ar: "الاختيار حسب منطقة الجلد وتحمل العيوب والسماكة والطراوة والمساحة القابلة للاستخدام والتشطيب.",
    vi: "Chọn theo vị trí da, dung sai lỗi, độ dày, độ mềm, diện tích dùng được và bề mặt.",
    th: "เลือกตามบริเวณหนัง ความทนทานต่อตำหนิ ความหนา ความนุ่ม พื้นที่ใช้สอย และผิวสัมผัส",
    id: "Pemilihan berdasarkan area kulit, toleransi cacat, ketebalan, kelembutan, area pakai, dan finishing.",
  },
  row1Action: {
    en: "Confirm sample, feel, thickness range and acceptable defects.",
    "zh-CN": "确认样品、手感、厚度范围和可接受瑕疵。",
    ar: "أكد العينة والملمس ونطاق السماكة والعيوب المقبولة.",
    vi: "Xác nhận mẫu, cảm giác, dải độ dày và lỗi chấp nhận được.",
    th: "ยืนยันตัวอย่าง สัมผัส พิสัยความหนา และตำหนิที่ยอมรับได้",
    id: "Konfirmasi sampel, tekstur, rentang ketebalan, dan cacat yang bisa diterima.",
  },
  row2Topic: { en: "EN 388 / ANSI/ISEA 105", "zh-CN": "EN 388 / ANSI/ISEA 105", ar: "EN 388 / ANSI/ISEA 105", vi: "EN 388 / ANSI/ISEA 105", th: "EN 388 / ANSI/ISEA 105", id: "EN 388 / ANSI/ISEA 105" },
  row2Means: {
    en: "Mechanical test performance such as abrasion, cut, tear and puncture.",
    "zh-CN": "耐磨、耐切割、撕裂、穿刺等机械性能测试。",
    ar: "أداء اختبار ميكانيكي مثل البلى والقطع والتمزق والثقب.",
    vi: "Hiệu năng kiểm cơ học như mài mòn, cắt, xé và đâm thủng.",
    th: "ประสิทธิภาพการทดสอบเชิงกล เช่น การสึกหรอ การตัด การฉีกขาด และการทะลุ",
    id: "Kinerja tes mekanik seperti abrasi, tahan potong, robek, dan tusuk.",
  },
  row2Action: {
    en: "Ask which exact test, target level, sample and report are needed.",
    "zh-CN": "确认具体测试、目标等级、样品和报告需求。",
    ar: "اسأل عن الاختبار الدقيق ومستوى الهدف والعينة والتقرير المطلوبة.",
    vi: "Hỏi kỹ bài kiểm, cấp mục tiêu, mẫu và báo cáo cần thiết.",
    th: "ถามว่าต้องการการทดสอบระดับเป้าหมาย ตัวอย่าง และรายงานใดบ้าง",
    id: "Tanyakan tes pasti, level target, sampel, dan laporan yang dibutuhkan.",
  },
  row3Topic: { en: "EN 12477", "zh-CN": "EN 12477", ar: "EN 12477", vi: "EN 12477", th: "EN 12477", id: "EN 12477" },
  row3Means: {
    en: "Welding glove requirements; Type A and Type B involve different performance tradeoffs.",
    "zh-CN": "焊接手套要求；Type A 与 Type B 有不同性能取舍。",
    ar: "متطلبات قفازات اللحام؛ يشمل النوع A والنوع B مفاضلات أداء مختلفة.",
    vi: "Yêu cầu găng tay hàn; Loại A và B có sự đánh đổi hiệu năng khác nhau.",
    th: "ข้อกำหนดถุงมือเชื่อม Type A และ Type B มีการแลกเปลี่ยนประสิทธิภาพต่างกัน",
    id: "Persyaratan sarung tangan las; Tipe A dan Tipe B memiliki pertukaran performa berbeda.",
  },
  row3Action: {
    en: "Match TIG/MIG/arc use, dexterity and heat exposure before quoting.",
    "zh-CN": "报价前匹配 TIG/MIG/电弧焊用途、灵活性和热暴露。",
    ar: "طابق استخدام TIG/MIG/القوس والبراعة والتعرض للحرارة قبل التسعير.",
    vi: "Khớp dụng TIG/MIG/hồ quang, độ linh hoạt và phơi nhiệt trước khi báo giá.",
    th: "จับคู่การใช้ TIG/MIG/เชื่อมอาร์ก ความคล่องแคล่ว และการสัมผัสความร้อนก่อนเสนอราคา",
    id: "Cocokkan penggunaan TIG/MIG/busur, kelincahan, dan paparan panas sebelum quotation.",
  },
  row4Topic: { en: "EN 407", "zh-CN": "EN 407", ar: "EN 407", vi: "EN 407", th: "EN 407", id: "EN 407" },
  row4Means: {
    en: "Thermal risk tests where applicable to heat contact or flame exposure.",
    "zh-CN": "适用于接触热或火焰暴露场景的热风险测试。",
    ar: "اختبارات مخاطر حرارية حيث تنطبق على تعرض الحرارة أو اللهب.",
    vi: "Bài kiểm rủi ro nhiệt khi áp dụng cho tiếp xúc nhiệt hoặc lửa.",
    th: "การทดสอบความเสี่ยงความร้อนเมื่อใช้กับการสัมผัสความร้อนหรือเปลวไฟ",
    id: "Tes risiko termal bila berlaku untuk paparan panas kontak atau nyala api.",
  },
  row4Action: {
    en: "Do not use thermal claims without exact tested properties.",
    "zh-CN": "没有具体测试项目时，不使用热防护承诺。",
    ar: "لا تستخدم ادعاءات حرارية دون خصائص مختبرة دقيقة.",
    vi: "Không dùng tuyên bố nhiệt nếu thiếu thuộc tính kiểm chính xác.",
    th: "อย่าอ้างความร้อนหากไม่มีคุณสมบัติที่ทดสอบ precisely",
    id: "Jangan gunakan klaim termal tanpa properti teruji yang tepat.",
  },
  factoryTitle: {
    en: "Fulide Factory Evidence and Quality Process",
    "zh-CN": "福立得工厂证据与质量流程",
    ar: "أدلة مصنع فوليدي وعملية الجودة",
    vi: "Bằng chứng nhà máy Fulide và quy trình chất lượng",
    th: "หลักฐานโรงงาน Fulide และกระบวนการคุณภาพ",
    id: "Bukti Pabrik Fulide dan Proses Kualitas",
  },
  factoryDescription: {
    en: "Fulide factory overview with visible production evidence, quality process and buyer FAQ without unsupported age or certification claims.",
    "zh-CN": "福立得工厂概况，展示生产证据、质量流程和采购问答，不使用未证实年限或认证承诺。",
    ar: "نظرة عامة على مصنع فوليدي مع أدلة إنتاج مرئية وعملية جودة وأسئلة المشتري دون ادعاءات عمر أو شهادات غير مدعومة.",
    vi: "Tổng quan nhà máy Fulide với bằng chứng sản xuất hiển thị, quy trình chất lượng và hỏi đáp mua hàng mà không có cam kết tuổi hoặc chứng nhận thiếu cơ sở.",
    th: "ภาพรวมโรงงาน Fulide พร้อมหลักฐานการผลิตที่เห็นได้ กระบวนการคุณภาพ และคำถามผู้ซื้อ โดยไม่มีข้อกล่าวอ้างอายุหรือการรับรองที่ไม่มีหลักฐาน",
    id: "Ikhtisar pabrik Fulide dengan bukti produksi terlihat, proses kualitas, dan FAQ pembeli tanpa klaim usia atau sertifikasi yang tidak didukung.",
  },
  crumbFactory: { en: "Factory", "zh-CN": "工厂", ar: "المصنع", vi: "Nhà máy", th: "โรงงาน", id: "Pabrik" },
  productionEvidence: { en: "Production evidence", "zh-CN": "生产证据", ar: "أدلة الإنتاج", vi: "Bằng chứng sản xuất", th: "หลักฐานการผลิต", id: "Bukti produksi" },
  evidenceText: {
    en: "Factory image used as visible sourcing evidence. Ask for current photos or video if your audit requires date-specific proof.",
    "zh-CN": "工厂图片作为可见采购证据。如买家审核需要日期证据，请索取当前照片或视频。",
    ar: "صورة المصنع كدليل توريد مرئي. اطلب صوراً أو فيديو حديثاً إذا كان تدقيقك يتطلب إثباتاً مؤرخاً.",
    vi: "Hình ảnh nhà máy làm bằng chứng nguồn cung hiển thị. Hãy yêu cầu ảnh hoặc video mới nhất nếu kiểm toán cần bằng chứng có ngày.",
    th: "รูปโรงงานใช้เป็นหลักฐานการจัดหาที่มองเห็นได้ ขอรูปหรือวิดีโอปัจจุบันหากการตรวจสอบของคุณต้องการหลักฐานระบุวันที่",
    id: "Gambar pabrik sebagai bukti sourcing yang terlihat. Minta foto atau video terkini jika audit Anda membutuhkan bukti bertanggal.",
  },
  qualityProcess: { en: "Quality process", "zh-CN": "质量流程", ar: "عملية الجودة", vi: "Quy trình chất lượng", th: "กระบวนการคุณภาพ", id: "Proses kualitas" },
  beforeQuote: { en: "Before quote", "zh-CN": "报价前", ar: "قبل التسعير", vi: "Trước báo giá", th: "ก่อนเสนอราคา", id: "Sebelum quotation" },
  beforeQuoteText: {
    en: "Confirm product use, target market, leather direction, construction and required documents.",
    "zh-CN": "确认产品用途、目标市场、皮料方向、结构和所需文件。",
    ar: "أكد استخدام المنتج والسوق المستهدف واتجاه الجلد والبناء والمستندات المطلوبة.",
    vi: "Xác nhận công dụng sản phẩm, thị trường mục tiêu, hướng da, cấu tạo và tài liệu cần thiết.",
    th: "ยืนยันการใช้งานสินค้า ตลาดเป้าหมาย ทิศทางหนัง โครงสร้าง และเอกสารที่ต้องการ",
    id: "Konfirmasi kegunaan produk, pasar target, arah kulit, konstruksi, dan dokumen yang diperlukan.",
  },
  sampleConfirm: { en: "Sample confirmation", "zh-CN": "样品确认", ar: "تأكيد العينة", vi: "Xác nhận mẫu", th: "การยืนยันตัวอย่าง", id: "Konfirmasi sampel" },
  sampleConfirmText: {
    en: "Confirm fit, leather feel, seam, cuff, lining, reinforcement and packaging direction.",
    "zh-CN": "确认版型、皮料手感、车线、袖口、内里、补强和包装方向。",
    ar: "أكد المقاس وملمس الجلد والخياطة والطوق والبطانة والتعزيز واتجاه التغليف.",
    vi: "Xác nhận form, cảm giác da, đường may, cổ tay, lớp lót, gia cường và hướng đóng gói.",
    th: "ยืนยันฟิต รู้สึกหนัง ตะเข็บ ข้อมือ วัสดุบุผิว การเสริมแรง และทิศทางบรรจุภัณฑ์",
    id: "Konfirmasi fit, tekstur kulit, jahitan, manset, pelapis, penguat, dan arah kemasan.",
  },
  bulkReview: { en: "Bulk review", "zh-CN": "大货检查", ar: "مراجعة الشحنات", vi: "Kiểm hàng loạt", th: "ตรวจสอบสินค้าลอตใหญ่", id: "Review bulk" },
  bulkReviewText: {
    en: "Check incoming materials, key stitching areas, pair matching, packing and buyer-specific notes.",
    "zh-CN": "检查来料、关键车线位置、配双、包装和买家专项要求。",
    ar: "افحص المواد الواردة ومناطق الخياطة الرئيسية ومطابقة الأزواج والتغليف وملاحظات المشتري الخاصة.",
    vi: "Kiểm vật liệu đầu vào, vị trí may chính, ghép đôi, đóng gói và ghi chú riêng của bên mua.",
    th: "ตรวจวัสดุที่เข้ามา จุดตะเข็บสำคัญ การจับคู่ คลัง และหมายเหตุเฉพาะผู้ซื้อ",
    id: "Periksa material masuk, area jahitan kunci, pencocokan pasangan, packing, dan catatan khusus pembeli.",
  },
  inquiryTitle: {
    en: "Free Inquiry Register Template | Fulide",
    "zh-CN": "免费询盘登记表模板 | 福立得",
    ar: "نموذج سجل استفسار مجاني | فوليدي",
    vi: "Mẫu đăng ký báo giá miễn phí | Fulide",
    th: "เทมเพลตลงทะเบียนสอบถามฟรี | Fulide",
    id: "Templat Daftar Inquiry Gratis | Fulide",
  },
  inquiryDescription: {
    en: "A free static inquiry register template for tracking source, product, quantity, quote, sample and order progress.",
    "zh-CN": "免费静态询盘登记表模板，用于记录来源、产品、数量、报价、寄样和订单进度。",
    ar: "نموذج سجل استفسار ثابت ومجاني لتتبع المصدر والمنتج والكمية والعرض والعينة وتقدم الطلب.",
    vi: "Mẫu đăng ký báo giá tĩnh miễn phí để theo dõi nguồn, sản phẩm, số lượng, báo giá, mẫu và tiến độ đơn hàng.",
    th: "เทมเพลตลงทะเบียนสอบถามแบบคงที่ฟรี สำหรับติดตามแหล่งที่มา สินค้า จำนวน ราคา ตัวอย่าง และความคืบหน้าคำสั่งซื้อ",
    id: "Templat daftar inquiry statis gratis untuk melacak sumber, produk, jumlah, quotation, sampel, dan progres pesanan.",
  },
  thSource: { en: "source", "zh-CN": "来源", ar: "المصدر", vi: "nguồn", th: "แหล่งที่มา", id: "sumber" },
  thProduct: { en: "product", "zh-CN": "产品", ar: "المنتج", vi: "sản phẩm", th: "สินค้า", id: "produk" },
  thQuantity: { en: "quantity", "zh-CN": "数量", ar: "الكمية", vi: "số lượng", th: "จำนวน", id: "jumlah" },
  thQuote: { en: "quote_status", "zh-CN": "报价状态", ar: "حالة العرض", vi: "trạng thái báo giá", th: "สถานะราคา", id: "status_quote" },
  thSample: { en: "sample_status", "zh-CN": "样品状态", ar: "حالة العينة", vi: "trạng thái mẫu", th: "สถานะตัวอย่าง", id: "status_sample" },
  thOrder: { en: "order_status", "zh-CN": "订单状态", ar: "حالة الطلب", vi: "trạng thái đơn", th: "สถานะคำสั่งซื้อ", id: "status_order" },
  rowSource: { en: "Google / ChatGPT / WhatsApp / XHS", "zh-CN": "Google / ChatGPT / WhatsApp / 小红书", ar: "Google / ChatGPT / WhatsApp / XHS", vi: "Google / ChatGPT / WhatsApp / XHS", th: "Google / ChatGPT / WhatsApp / XHS", id: "Google / ChatGPT / WhatsApp / XHS" },
  rowProduct: { en: "Product or category page URL", "zh-CN": "产品或品类页面 URL", ar: "رابط صفحة المنتج أو الفئة", vi: "URL trang sản phẩm hoặc danh mục", th: "URL หน้าสินค้าหรือหมวดหมู่", id: "URL halaman produk atau kategori" },
  rowQuantity: { en: "Buyer stated quantity", "zh-CN": "买家填写数量", ar: "الكمية التي حددها المشتري", vi: "Số lượng bên mua cung cấp", th: "จำนวนที่ผู้ซื้อระบุ", id: "Jumlah yang disebut pembeli" },
  rowQuote: { en: "not quoted / quoted / revised", "zh-CN": "未报价 / 已报价 / 已修改", ar: "غير مسعر / مسعر / منقح", vi: "chưa báo / đã báo / đã sửa", th: "ยังไม่เสนอราคา / เสนอแล้ว / แก้ไขแล้ว", id: "belum / sudah / revisi" },
  rowSample: { en: "not needed / requested / sent", "zh-CN": "不需要 / 已要求 / 已寄出", ar: "غير مطلوب / مطلوب / أُرسل", vi: "không cần / đã yêu cầu / đã gửi", th: "ไม่ต้องการ / ร้องขอแล้ว / ส่งแล้ว", id: "tidak perlu / diminta / dikirim" },
  rowOrder: { en: "open / won / lost / follow-up", "zh-CN": "进行中 / 成交 / 丢单 / 跟进", ar: "مفتوح / فوز / خسارة / متابعة", vi: "mở / thắng / thua / theo dõi", th: "เปิด / ได้งาน / เสียงาน / ติดตาม", id: "terbuka / menang / kalah / tindak lanjut" },
  inquiryNote: {
    en: "A button click is not counted as a qualified inquiry. Count an inquiry only when a buyer message includes enough product and business context for follow-up.",
    "zh-CN": "按钮点击不算有效询盘。只有买家消息包含足够产品和商务上下文、可以跟进时，才计为有效询盘。",
    ar: "لا يُحسب النقر على زر كاستفسار مؤهل. احسب الاستفسار فقط عندما تتضمن رسالة المشتري سياقاً كافياً من المنتج والأعمال للمتابعة.",
    vi: "Nhấp nút không được tính là yêu cầu đủ điều kiện. Chỉ tính khi tin nhắn người mua có đủ ngữ cảnh sản phẩm và kinh doanh để theo dõi.",
    th: "การคลิกปุ่มไม่นับเป็นการสอบถามที่มีคุณสมบัติ นับเมื่อข้อความผู้ซื้อมีบริบทสินค้าและธุรกิจเพียงพอสำหรับการติดตาม",
    id: "Klik tombol tidak dihitung sebagai inquiry yang memenuhi syarat. Hitung inquiry hanya bila pesan pembeli punya konteks produk dan bisnis cukup untuk tindak lanjut.",
  },
  catWhatsapp: { en: "Hello Fulide, please quote ", "zh-CN": "你好福立得，请报价：", ar: "مرحباً فوليدي، يرجى تسعير ", vi: "Xin chào Fulide, vui lòng báo giá: ", th: "สวัสดี Fulide กรุณาเสนอราคา: ", id: "Halo Fulide, mohon quotation: " },
  prodWhatsapp: { en: "Hello Fulide, I want to inquire about ", "zh-CN": "你好福立得，我想询价：", ar: "مرحباً فوليدي، أريد الاستفسار عن ", vi: "Xin chào Fulide, tôi muốn hỏi về ", th: "สวัสดี Fulide ฉันต้องการสอบถามเกี่ยวกับ ", id: "Halo Fulide, saya ingin menanyakan " },
  pageLabel: { en: "Page: ", "zh-CN": "页面：", ar: "الصفحة: ", vi: "Trang: ", th: "หน้า: ", id: "Halaman: " },
  emailSubjectPrefix: { en: "RFQ - ", "zh-CN": "询盘 - ", ar: "طلب عرض سعر - ", vi: "RFQ - ", th: "RFQ - ", id: "RFQ - " },
  emailBody: {
    en: "Product category: \nPage: \nQuantity:\nMarket:\nTarget use:\nRequired documents:\n",
    "zh-CN": "产品品类：\n页面：\n数量：\n市场：\n目标用途：\n所需文件：\n",
    ar: "فئة المنتج: \nالصفحة: \nالكمية:\nالسوق:\nالاستخدام المستهدف:\nالمستندات المطلوبة:\n",
    vi: "Danh mục sản phẩm: \nTrang: \nSố lượng:\nThị trường:\nMục đích dùng:\nTài liệu cần:\n",
    th: "หมวดหมู่สินค้า: \nหน้า: \nจำนวน:\nตลาด:\nการใช้งานเป้าหมาย:\nเอกสารที่ต้องการ:\n",
    id: "Kategori produk: \nHalaman: \nJumlah:\nPasar:\nKegunaan target:\nDokumen diperlukan:\n",
  },
  prodEmailBody: {
    en: "Product: \nPage: \nQuantity:\nMarket:\nMaterial/lining/cuff:\nLogo/packing:\nRequired documents:\n",
    "zh-CN": "产品：\n页面：\n数量：\n市场：\n材料/内里/袖口：\nLogo/包装：\n所需文件：\n",
    ar: "المنتج: \nالصفحة: \nالكمية:\nالسوق:\nالمادة/البطانة/الطوق:\nالشعار/التغليف:\nالمستندات المطلوبة:\n",
    vi: "Sản phẩm: \nTrang: \nSố lượng:\nThị trường:\nVật liệu/lớp lót/cổ tay:\nLogo/đóng gói:\nTài liệu cần:\n",
    th: "สินค้า: \nหน้า: \nจำนวน:\nตลาด:\nวัสดุ/วัสดุบุผิว/ข้อมือ:\nโลโก้/บรรจุภัณฑ์:\nเอกสารที่ต้องการ:\n",
    id: "Produk: \nHalaman: \nJumlah:\nPasar:\nMaterial/pelapis/manset:\nLogo/kemasan:\nDokumen diperlukan:\n",
  },
};

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
function outPrefix(lang) {
  return LANG[lang].out ? LANG[lang].out + "/" : "";
}
// Pages deeper than the root need enough "../" to reach root-level assets
// and sibling directories. en sub-pages sit one level deep (categories/),
// while zh/ar/vi/th/id sub-pages sit two levels deep (<lang>/categories/).
function depthPrefix(lang) {
  return LANG[lang].out ? "../../" : "../";
}
// factory.html / inquiry-register.html sit at the out-root (depth 0 for en,
// depth 1 for zh/ar/vi/th/id), so they need one fewer "../".
function rootPrefix(lang) {
  return LANG[lang].out ? "../" : "";
}
function homePath(lang) {
  return LANG[lang].home;
}
function catPath(cat, lang) {
  return outPrefix(lang) + "categories/" + pick(cat, "slug", lang) + ".html";
}
function prodPath(p, lang) {
  return outPrefix(lang) + "products/" + p.id + ".html";
}
function guidePath(lang) {
  return outPrefix(lang) + "guides/" + (lang === "zh-CN" ? "piliao-dengji-yu-shoutao-biaozhun" : "leather-grades-and-glove-standards") + ".html";
}
function factoryPath(lang) {
  return outPrefix(lang) + "factory.html";
}
function inquiryPath(lang) {
  return outPrefix(lang) + "inquiry-register.html";
}

function pageShell({ lang, title, description, body, schema, lpFn }) {
  const L = LANG[lang];
  const canonical = `${site.baseUrl}/${lpFn(lang)}`;
  const hreflang = LANGS.map((l) => `    <link rel="alternate" hreflang="${l.code}" href="${site.baseUrl}/${lpFn(l.code)}">`).join("\n");
  const xdefault = `    <link rel="alternate" hreflang="x-default" href="${site.baseUrl}/${lpFn("en")}">`;
  const rtlCss = L.dir === "rtl" ? `\n    [dir="rtl"] body{text-align:right}[dir="rtl"] .crumbs{text-align:right}[dir="rtl"] .nav{gap:14px}` : "";
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${L.dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${canonical}">
${hreflang}
${xdefault}
  <link rel="icon" href="${site.baseUrl}/favicon.ico" sizes="any">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.baseUrl}/assets/hero-glove-wall.jpg">
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "${gaMeasurementId}");
  </script>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  <style>
    :root{--red:#8b1e1e;--ink:#121826;--muted:#596275;--line:#e5e7eb;--paper:#f7f4ef;--green:#176c3a}
    *{box-sizing:border-box}html,body{max-width:100%;overflow-x:hidden}body{margin:0;font-family:Arial,"Noto Sans SC","Microsoft YaHei",sans-serif;color:var(--ink);line-height:1.58;background:#fff}a{color:inherit}img{max-width:100%;display:block;height:auto}.container{width:min(1120px,calc(100% - 32px));margin:auto}.header{border-bottom:1px solid var(--line);background:#fff;position:sticky;top:0;z-index:5}.nav{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.brand{font-weight:900;text-decoration:none}.navlinks{display:flex;gap:14px;flex-wrap:wrap;font-size:14px;font-weight:700;max-width:100%;align-items:center}.lang-switch{display:flex;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700;border-left:1px solid var(--line);padding-left:12px;margin-left:4px}.lang-switch a{text-decoration:none;color:var(--muted)}.lang-switch a[aria-current="true"]{color:var(--red)}.hero{background:var(--paper);padding:56px 0 34px}.crumbs{font-size:13px;color:var(--muted);margin-bottom:20px}.crumbs a{color:var(--red)}h1{font-size:clamp(34px,5vw,58px);line-height:1.05;margin:0 0 16px;overflow-wrap:anywhere}h2{font-size:26px;margin:0 0 14px;overflow-wrap:anywhere}.lead{font-size:18px;color:#303847;max-width:820px;overflow-wrap:anywhere}.band{padding:42px 0;border-bottom:1px solid var(--line)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.card{border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}.card-body{padding:16px}.card h3{margin:0 0 8px;font-size:18px}.pill{display:inline-block;padding:4px 8px;border-radius:4px;background:#fff;border:1px solid var(--line);font-size:12px;font-weight:800;color:var(--red);margin-bottom:10px}.table{width:100%;border-collapse:collapse;background:#fff;table-layout:fixed}.table th,.table td{border:1px solid var(--line);padding:12px;text-align:left;vertical-align:top;overflow-wrap:anywhere}.table th{width:30%}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:900;background:var(--red);color:#fff;white-space:normal;text-align:center}.btn.secondary{background:#fff;color:var(--red);border:1px solid var(--red)}.btn.green{background:var(--green);color:#fff}.note{font-size:13px;color:var(--muted);margin-top:14px}.footer{border-top:1px solid var(--line);padding:26px 0;font-size:14px;color:var(--muted)}.footer strong{color:var(--ink)}${rtlCss}
    .faq{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:18px}.faq-item{border:1px solid var(--line);border-radius:8px;padding:16px 18px;background:#fff}.faq-q{margin:0 0 8px;font-size:17px;line-height:1.3;overflow-wrap:anywhere}.faq-a{margin:0;color:var(--muted);font-size:14px}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function header(lang, lpFn) {
  const brandHref = `${site.baseUrl}/${homePath(lang)}`;
  const nav = [
    { label: T(lang, "products"), href: `${site.baseUrl}/${catPath(categories[0], lang)}` },
    { label: T(lang, "standards"), href: `${site.baseUrl}/${guidePath(lang)}` },
    { label: T(lang, "factory"), href: `${site.baseUrl}/${factoryPath(lang)}` },
    { label: T(lang, "inquiry"), href: `${site.baseUrl}/${inquiryPath(lang)}` },
  ];
  const switcher = LANGS.map((l) => {
    const href = `${site.baseUrl}/${lpFn(l.code)}`;
    const current = l.code === lang ? ' aria-current="true"' : "";
    return `<a href="${href}" lang="${l.code}"${current}>${l.label}</a>`;
  }).join("");
  return `<header class="header"><div class="container nav"><a class="brand" href="${brandHref}">Fulide</a><nav class="navlinks">${nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}<span class="lang-switch">${switcher}</span></nav></div></header>`;
}

function footer(lang) {
  const contactLine = `${T(lang, "whatsapp")}: <a href="${whatsappLink("")}" target="_blank" rel="noopener">${site.whatsappDisplay}</a> · ${T(lang, "wechat")}: ${site.wechat} · ${T(lang, "chinaPhone")}: ${site.chinaPhone} · ${T(lang, "email")}: <a href="mailto:${site.email}">${site.email}</a>`;
  return `<footer class="footer"><div class="container"><strong>${site.company}</strong><p>${contactLine}</p><p>${T(lang, "disclaimer")}</p></div></footer>`;
}

// --- FAQ rich-result helpers (FAQPage schema + visible PAA-style FAQ) ---
const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4", "faq5"];
function faqItems(lang, keys = FAQ_KEYS) {
  return keys.map((k) => ({ q: T(lang, k + "q"), a: T(lang, k + "a") }));
}
function faqSchema(lang, keys = FAQ_KEYS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems(lang, keys).map((it) => ({
      "@type": "Question",
      "name": it.q,
      "acceptedAnswer": { "@type": "Answer", "text": it.a },
    })),
  };
}
function breadcrumbSchema(lang, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": it.name,
      "item": it.url,
    })),
  };
}
function faqSection(lang, opts = {}) {
  const keys = opts.keys || FAQ_KEYS;
  const title = opts.title || T(lang, "buyerFaqTitle");
  const items = faqItems(lang, keys).map((it) => `
      <div class="faq-item">
        <h3 class="faq-q">${escapeHtml(it.q)}</h3>
        <div class="faq-a">${escapeHtml(it.a)}</div>
      </div>`).join("");
  const cta = `<div class="actions"><a class="btn green" href="${whatsappLink("")}" target="_blank" rel="noopener">${escapeHtml(T(lang, "openWhatsapp"))}</a></div>`;
  return `    <section class="band" id="faq"><div class="container"><h2>${escapeHtml(title)}</h2><div class="faq">${items}</div>${cta}</div></section>`;
}

function productCards(category, lang) {
  const assetPrefix = depthPrefix(lang);
  return category.products
    .map((id, index) => {
      const product = productById.get(id);
      const pageForInquiry = `${site.baseUrl}/${prodPath(product, lang)}`;
      const href = product.detail ? depthPrefix(lang) + `products/${product.id}.html` : "#inquiry";
      const name = pick(product, "name", lang);
      const summary = pick(product, "summary", lang);
      const catName = pick(category, "name", lang);
      const waMsg = T(lang, "prodWhatsapp") + name + " - " + pageForInquiry;
      const btnLabel = product.detail ? T(lang, "viewDetails") : T(lang, "askReference");
      return `<article class="card">
      ${imageTag(product.image, name, index === 0, assetPrefix)}
      <div class="card-body"><span class="pill">${escapeHtml(catName)}</span><h3>${escapeHtml(name)}</h3><p>${escapeHtml(summary)}</p><div class="actions"><a class="btn secondary" href="${href}">${btnLabel}</a><a class="btn green" href="${whatsappLink(waMsg)}" target="_blank" rel="noopener">${T(lang, "whatsappDraft")}</a></div></div>
    </article>`;
    })
    .join("\n");
}

function categoryPage(cat, lang) {
  const lp = (l) => outPrefix(l) + "categories/" + pick(cat, "slug", l) + ".html";
  const canonical = `${site.baseUrl}/${lp(lang)}`;
  const title = `${pick(cat, "name", lang)} | Fulide OEM/ODM`;
  const description = pick(cat, "summary", lang);
  const catName = pick(cat, "name", lang);
  const waMsg = T(lang, "catWhatsapp") + catName + " - " + canonical;
  const emailSubject = T(lang, "emailSubjectPrefix") + catName;
  const emailBody = T(lang, "emailBody") + canonical;
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description: description, url: canonical },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: T(lang, "home"), item: `${site.baseUrl}/${homePath(lang)}` },
      { "@type": "ListItem", position: 2, name: T(lang, "products"), item: canonical },
    ] },
    { "@context": "https://schema.org", "@type": "ItemList", name: title, itemListElement: cat.products.map((id, idx) => {
      const product = productById.get(id);
      const url = product.detail ? `${site.baseUrl}/${prodPath(product, lang)}` : canonical;
      return { "@type": "ListItem", position: idx + 1, name: pick(product, "name", lang), url: url };
    }) },
    faqSchema(lang, ["faq1", "faq2"]),
  ];
  const body = `${header(lang, lp)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${site.baseUrl}/${homePath(lang)}">${T(lang, "home")}</a> / ${T(lang, "products")} / ${escapeHtml(catName)}</div><h1>${escapeHtml(catName)}</h1><p class="lead">${escapeHtml(description)}</p><div class="actions"><a class="btn green" href="${whatsappLink(waMsg)}" target="_blank" rel="noopener">${T(lang, "openWhatsapp")}</a><a class="btn secondary" href="${mailtoLink(emailSubject, emailBody)}">${T(lang, "emailDraft")}</a></div></div></section>
    <section class="band"><div class="container"><h2>${T(lang, "procurementTitle")}</h2><table class="table"><tbody><tr><th>${T(lang, "materials")}</th><td>${escapeHtml(pick(cat, "materials", lang))}</td></tr><tr><th>${T(lang, "construction")}</th><td>${escapeHtml(pick(cat, "construction", lang))}</td></tr><tr><th>${T(lang, "typicalUses")}</th><td>${escapeHtml(pick(cat, "uses", lang))}</td></tr><tr><th>${T(lang, "customOptions")}</th><td>${escapeHtml(pick(cat, "custom", lang))}</td></tr></tbody></table><p class="note">${escapeHtml(T(lang, "note"))}</p></div></section>
    <section class="band"><div class="container"><h2>${T(lang, "referencesTitle")}</h2><div class="grid">${productCards(cat, lang)}</div></div></section>
    <section class="band" id="inquiry"><div class="container"><h2>${T(lang, "buyerFaqTitle")}</h2><table class="table"><tbody><tr><th>${escapeHtml(T(lang, "faq1q"))}</th><td>${escapeHtml(T(lang, "faq1a"))}</td></tr><tr><th>${escapeHtml(T(lang, "faq2q"))}</th><td>${escapeHtml(T(lang, "faq2a"))}</td></tr></tbody></table></div></section>
  </main>${footer(lang)}`;
  return pageShell({ lang, title, description, body, schema, lpFn: lp });
}

function productPage(product, lang) {
  const lp = (l) => outPrefix(l) + "products/" + product.id + ".html";
  const canonical = `${site.baseUrl}/${lp(lang)}`;
  const category = categoryBySlugOrId(product.category);
  const title = `${pick(product, "name", lang)} | Fulide`;
  const description = pick(product, "summary", lang);
  const pName = pick(product, "name", lang);
  const cName = pick(category, "name", lang);
  const waMsg = T(lang, "prodWhatsapp") + pName + " - " + canonical + "\n" + T(lang, "pageLabel") + canonical;
  const emailSubject = T(lang, "emailSubjectPrefix") + pName;
  const emailBody = T(lang, "prodEmailBody") + T(lang, "pageLabel") + canonical;
  const schema = [
    { "@context": "https://schema.org", "@type": "Product", name: pName, description: description, image: `${site.baseUrl}/${product.image}`, brand: { "@type": "Brand", name: "Fulide" }, manufacturer: { "@type": "Organization", name: site.company } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: T(lang, "home"), item: `${site.baseUrl}/${homePath(lang)}` },
      { "@type": "ListItem", position: 2, name: cName, item: `${site.baseUrl}/${catPath(category, lang)}` },
      { "@type": "ListItem", position: 3, name: pName, item: canonical },
    ] },
  ];
  const backHref = depthPrefix(lang) + `categories/${pick(category, "slug", lang)}.html`;
  const body = `${header(lang, lp)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${site.baseUrl}/${homePath(lang)}">${T(lang, "home")}</a> / <a href="${site.baseUrl}/${catPath(category, lang)}">${escapeHtml(cName)}</a> / ${escapeHtml(pName)}</div><h1>${escapeHtml(pName)}</h1><p class="lead">${escapeHtml(description)}</p></div></section>
    <section class="band"><div class="container grid"><div>${imageTag(product.image, pName, true, depthPrefix(lang))}</div><div><h2>${T(lang, "quoteNotes")}</h2><table class="table"><tbody><tr><th>${T(lang, "categoryLabel")}</th><td>${escapeHtml(cName)}</td></tr><tr><th>${T(lang, "materialDirection")}</th><td>${escapeHtml(pick(category, "materials", lang))}</td></tr><tr><th>${T(lang, "constructionOptions")}</th><td>${escapeHtml(pick(category, "construction", lang))}</td></tr><tr><th>${T(lang, "evidenceLimit")}</th><td>${escapeHtml(T(lang, "evidenceLimitText"))}</td></tr></tbody></table><div class="actions"><a class="btn green" href="${whatsappLink(waMsg)}" target="_blank" rel="noopener">${T(lang, "openCompleteWhatsapp")}</a><a class="btn secondary" href="${mailtoLink(emailSubject, emailBody)}">${T(lang, "openEmailDraft")}</a></div></div></div></section>
  </main>${footer(lang)}`;
  return pageShell({ lang, title, description, body, schema, lpFn: lp });
}

function categoryBySlugOrId(key) {
  return categories.find((c) => c.slug === key || c.zhSlug === key || c.arSlug === key || c.viSlug === key || c.thSlug === key || c.idSlug === key || c.name === key) || categories[0];
}

function guidePage(lang) {
  const lp = (l) => outPrefix(l) + "guides/" + (l === "zh-CN" ? "piliao-dengji-yu-shoutao-biaozhun" : "leather-grades-and-glove-standards") + ".html";
  const canonical = `${site.baseUrl}/${lp(lang)}`;
  const title = T(lang, "guideTitle");
  const description = T(lang, "guideDescription");
  const body = `${header(lang, lp)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${site.baseUrl}/${homePath(lang)}">${T(lang, "home")}</a> / ${T(lang, "crumbGuides")}</div><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p></div></section>
    <section class="band"><div class="container"><h2>${T(lang, "directAnswerTitle")}</h2><p>${escapeHtml(T(lang, "directAnswerBody"))}</p>
    <table class="table"><thead><tr><th>${T(lang, "tableTopic")}</th><th>${T(lang, "tableMeans")}</th><th>${T(lang, "tableAction")}</th></tr></thead><tbody>
    <tr><td>${T(lang, "row1Topic")}</td><td>${escapeHtml(T(lang, "row1Means"))}</td><td>${escapeHtml(T(lang, "row1Action"))}</td></tr>
    <tr><td>${T(lang, "row2Topic")}</td><td>${escapeHtml(T(lang, "row2Means"))}</td><td>${escapeHtml(T(lang, "row2Action"))}</td></tr>
    <tr><td>${T(lang, "row3Topic")}</td><td>${escapeHtml(T(lang, "row3Means"))}</td><td>${escapeHtml(T(lang, "row3Action"))}</td></tr>
    <tr><td>${T(lang, "row4Topic")}</td><td>${escapeHtml(T(lang, "row4Means"))}</td><td>${escapeHtml(T(lang, "row4Action"))}</td></tr>
    </tbody></table></div></section>
${faqSection(lang)}
  </main>${footer(lang)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description: description, url: canonical },
    breadcrumbSchema(lang, [
      { name: T(lang, "home"), url: `${site.baseUrl}/${homePath(lang)}` },
      { name: T(lang, "crumbGuides"), url: canonical },
    ]),
    faqSchema(lang),
  ];
  return pageShell({ lang, title, description, body, schema, lpFn: lp });
}

function factoryPage(lang) {
  const lp = (l) => outPrefix(l) + "factory.html";
  const canonical = `${site.baseUrl}/${lp(lang)}`;
  const title = T(lang, "factoryTitle");
  const description = T(lang, "factoryDescription");
  const assetPrefix = rootPrefix(lang);
  const imgs = ["assets/factory-floor.jpg", "assets/cutting-room.jpg", "assets/factory-strength/sewing-line.jpg", "assets/factory-strength/warehouse-batches.jpg"];
  const body = `${header(lang, lp)}
  <main>
    <section class="hero"><div class="container"><div class="crumbs"><a href="${site.baseUrl}/${homePath(lang)}">${T(lang, "home")}</a> / ${T(lang, "crumbFactory")}</div><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p></div></section>
    <section class="band"><div class="container"><h2>${T(lang, "productionEvidence")}</h2><div class="grid">${imgs.map((src) => `<article class="card">${imageTag(src, T(lang, "factoryTitle"), false, assetPrefix)}<div class="card-body"><p>${escapeHtml(T(lang, "evidenceText"))}</p></div></article>`).join("")}</div></div></section>
    <section class="band"><div class="container"><h2>${T(lang, "qualityProcess")}</h2><table class="table"><tbody><tr><th>${T(lang, "beforeQuote")}</th><td>${escapeHtml(T(lang, "beforeQuoteText"))}</td></tr><tr><th>${T(lang, "sampleConfirm")}</th><td>${escapeHtml(T(lang, "sampleConfirmText"))}</td></tr><tr><th>${T(lang, "bulkReview")}</th><td>${escapeHtml(T(lang, "bulkReviewText"))}</td></tr></tbody></table></div></section>
  </main>${footer(lang)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "AboutPage", name: title, description: description, url: canonical },
    breadcrumbSchema(lang, [
      { name: T(lang, "home"), url: `${site.baseUrl}/${homePath(lang)}` },
      { name: T(lang, "crumbFactory"), url: canonical },
    ]),
  ];
  return pageShell({ lang, title, description, body, schema, lpFn: lp });
}

function inquiryPage(lang) {
  const lp = (l) => outPrefix(l) + "inquiry-register.html";
  const canonical = `${site.baseUrl}/${lp(lang)}`;
  const title = T(lang, "inquiryTitle");
  const description = T(lang, "inquiryDescription");
  const csvHref = rootPrefix(lang) + "docs/inquiry-register-template.csv";
  const sendHref = rootPrefix(lang) + "#contact";
  const body = `${header(lang, lp)}
  <main>
    <section class="hero"><div class="container"><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p><div class="actions"><a class="btn" href="${csvHref}">${T(lang, "downloadCsv")}</a><a class="btn secondary" href="${sendHref}">${T(lang, "sendInquiry")}</a></div></div></section>
    <section class="band"><div class="container"><table class="table"><thead><tr><th>${T(lang, "thSource")}</th><th>${T(lang, "thProduct")}</th><th>${T(lang, "thQuantity")}</th><th>${T(lang, "thQuote")}</th><th>${T(lang, "thSample")}</th><th>${T(lang, "thOrder")}</th></tr></thead><tbody><tr><td>${T(lang, "rowSource")}</td><td>${T(lang, "rowProduct")}</td><td>${T(lang, "rowQuantity")}</td><td>${T(lang, "rowQuote")}</td><td>${T(lang, "rowSample")}</td><td>${T(lang, "rowOrder")}</td></tr></tbody></table><p class="note">${escapeHtml(T(lang, "inquiryNote"))}</p></div></section>
  </main>${footer(lang)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "WebPage", name: title, description: description, url: canonical },
    breadcrumbSchema(lang, [
      { name: T(lang, "home"), url: `${site.baseUrl}/${homePath(lang)}` },
      { name: T(lang, "inquiry"), url: canonical },
    ]),
  ];
  return pageShell({ lang, title, description, body, schema, lpFn: lp });
}

function write(relative, content) {
  mkdirp(path.dirname(relative));
  fs.writeFileSync(path.join(root, relative), content, "utf8");
}

function sitemapPaths() {
  const out = [""].concat(LANGS.map((l) => l.home));
  for (const l of LANGS) {
    out.push(factoryPath(l.code));
    out.push(inquiryPath(l.code));
    out.push(guidePath(l.code));
  }
  for (const cat of categories) {
    for (const l of LANGS) out.push(catPath(cat, l.code));
  }
  for (const p of products.filter((p) => p.detail)) {
    for (const l of LANGS) out.push(prodPath(p, l.code));
  }
  return out;
}
function sitemapUrl(locPath) {
  return locPath === "" ? `${site.baseUrl}/` : `${site.baseUrl}/${locPath}`;
}
function buildSitemap() {
  const urls = sitemapPaths();
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((locPath) => `  <url>\n    <loc>${sitemapUrl(locPath)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`;
}
function buildTextSitemap() {
  return `${sitemapPaths().map(sitemapUrl).join("\n")}\n`;
}

function main() {
  for (const cat of categories) {
    for (const l of LANGS) write(catPath(cat, l.code), categoryPage(cat, l.code));
  }
  for (const p of products.filter((p) => p.detail)) {
    for (const l of LANGS) write(prodPath(p, l.code), productPage(p, l.code));
  }
  for (const l of LANGS) {
    write(guidePath(l.code), guidePage(l.code));
    write(factoryPath(l.code), factoryPage(l.code));
    write(inquiryPath(l.code), inquiryPage(l.code));
  }
  write("docs/inquiry-register-template.csv", "date,source,landing_page,contact_channel,buyer_company,buyer_name,country_or_market,product_or_category,quantity,target_price,quote_status,sample_status,order_status,next_action,notes\n");
  write("sitemap.xml", buildSitemap());
  write("sitemap.txt", buildTextSitemap());
  console.log("Generated pages for", LANGS.length, "languages:", LANGS.map((l) => l.code).join(", "));
}

module.exports = {
  LANGS, LANG, cap, pick, T, I18N, site, categories, products, productById,
  outPrefix, homePath, catPath, prodPath, guidePath, factoryPath, inquiryPath,
  whatsappLink, mailtoLink, imageTag, escapeHtml, gaMeasurementId,
  header, footer, pageShell,
  FAQ_KEYS, faqItems, faqSchema, faqSection, breadcrumbSchema,
};

if (require.main === module) main();
