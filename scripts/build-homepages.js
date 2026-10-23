// Generates the 4 additional-language homepages (ar, vi, th, id) from the
// shared catalog + I18N model, reusing the hover/scroll-reveal disclosure UX
// already shipped on index-en.html / index.html.
//
// en (index-en.html) and zh-CN (index.html) are hand-authored and kept as-is;
// this script only writes the 4 new language homepages.

const fs = require("fs");
const path = require("path");
const shared = require("./build-seo-pages.js");

const {
  LANGS, LANG, pick, T, I18N, site, categories, products, productById,
  homePath, catPath, prodPath, guidePath, factoryPath, inquiryPath,
  whatsappLink, escapeHtml, gaMeasurementId,
  faqItems, faqSchema,
} = shared;

const root = path.resolve(__dirname, "..");

// Homepage-specific UI strings (the shared I18N covers nav/footer/product labels).
const HOME = {
  meta: {
    en: "Fulide is a Gaozhou, China leather work glove factory developing OEM/ODM welding, driver and general work gloves by leather grade, construction, branding and target protection standard.",
    "zh-CN": "福立得是中国高州的皮革劳保手套工厂，按皮料等级、结构、品牌与目标防护标准开发 OEM/ODM 焊接、驾驶与通用劳保手套。",
    ar: "فوليدي مصنع قفازات عمل جلدية في جاوتشو بالصين، يطوّر قفازات لحام وسائق وعمل عامة بتصنيع OEM/ODM حسب درجة الجلد والبناء والعلامة ومعيار الحماية المستهدف.",
    vi: "Fulide là nhà máy găng tay da công tác tại Gaozhou, Trung Quốc, phát triển găng tay hàn, lái xe và công tác chung OEM/ODM theo cấp da, cấu tạo, thương hiệu và tiêu chuẩn bảo hộ mục tiêu.",
    th: "Fulide เป็นโรงงานถุงมือหนังความปลอดภัยในเกาโจว ประเทศจีน พัฒนาถุงมือเชื่อม ขับรถ และงานทั่วไปแบบ OEM/ODM ตามเกรดหนัง โครงสร้าง แบรนด์ และมาตรฐานป้องกันเป้าหมาย",
    id: "Fulide adalah pabrik sarung tangan kulit kerja di Gaozhou, Tiongkok, mengembangkan sarung tangan las, sopir, dan kerja umum OEM/ODM menurut grad kulit, konstruksi, branding, dan standar proteksi target.",
  },
  heroKicker: {
    en: "Gaozhou, Guangdong, China · Leather safety glove factory",
    "zh-CN": "中国广东高州 · 皮革劳保手套工厂",
    ar: "جاوتشو، قوانغدونغ، الصين · مصنع قفازات سلامة جلدية",
    vi: "Gaozhou, Quảng Đông, Trung Quốc · Nhà máy găng tay bảo hộ da",
    th: "เกาโจว มณฑลกวางตุ้ง ประเทศจีน · โรงงานถุงมือหนังความปลอดภัย",
    id: "Gaozhou, Guangdong, Tiongkok · Pabrik sarung tangan kulit keselamatan",
  },
  heroH1: {
    en: "Leather work gloves, built to your market specification.",
    "zh-CN": "按您的市场规格定制的皮革劳保手套。",
    ar: "قفازات عمل جلدية، مصممة حسب مواصفات سوقك.",
    vi: "Găng tay da công tác, làm theo thông số thị trường của bạn.",
    th: "ถุงมือหนังทำงาน ออกแบบตามมาตรฐานตลาดของคุณ",
    id: "Sarung tangan kulit kerja, dibuat sesuai spesifikasi pasar Anda.",
  },
  heroP: {
    en: "Fulide develops OEM / ODM gloves around the buyer's use case: species and leather grade, thickness and hand feel, lining, cuff, reinforcement, color, logo, packing and target test requirements.",
    "zh-CN": "福立得围绕买家的使用场景开发 OEM / ODM 手套：皮种与皮料等级、厚度与手感、内里、袖口、加固、颜色、Logo、包装与目标测试要求。",
    ar: "تطوّر فوليدي قفازات OEM / ODM حول حالة استخدام المشتري: نوع الجلد ودرجته، السماكة والملمس، البطانة، الكفّة، التعزيز، اللون، الشعار، التغليف ومتطلبات الاختبار المستهدفة.",
    vi: "Fulide phát triển găng tay OEM / ODM quanh tình huống sử dụng của người mua: loài da và cấp da, độ dày và cảm giác cầm, lót, cổ tay, gia cường, màu, logo, đóng gói và yêu cầu kiểm nghiệm mục tiêu.",
    th: "Fulide พัฒนากถุงมือ OEM / ODM ตามการใช้งานของผู้ซื้อ: ชนิดและเกรดหนัง ความหนาและสัมผัส การบุ ปลายแขน การเสริมแรง สี โลโก้ การบรรจุ และข้อกำหนดการทดสอบเป้าหมาย",
    id: "Fulide mengembangkan sarung tangan OEM / ODM berdasarkan kasus pemakaian pembeli: jenis dan grad kulit, ketebalan dan tekstur, lining, manset, penguatan, warna, logo, kemasan, dan persyaratan uji target.",
  },
  heroCta1: { en: "View Product Matrix", "zh-CN": "查看产品矩阵", ar: "عرض مصفوفة المنتجات", vi: "Xem ma trận sản phẩm", th: "ดูเมทริกซ์สินค้า", id: "Lihat Matriks Produk" },
  heroCta2: { en: "Build Inquiry List", "zh-CN": "建立询盘清单", ar: "أنشئ قائمة استفسارات", vi: "Tạo danh sách báo giá", th: "สร้างรายการสอบถาม", id: "Buat Daftar Inquiry" },
  proof: [
    { v: "10+", l: { en: "years focused on leather work gloves", "zh-CN": "专注皮革劳保手套超 10 年", ar: "سنوات من التركيز على قفازات العمل الجلدية", vi: "năm tập trung vào găng tay da công tác", th: "ปีที่มุ่งเน้นถุงมือหนังงาน", id: "tahun fokus pada sarung tangan kulit kerja" } },
    { v: "6", l: { en: "curated SKU primary categories", "zh-CN": "精选 SKU 主品类", ar: "فئات منتجات SKU رئيسية مختارة", vi: "các danh mục SKU chính được tuyển chọn", th: "หมวดหมู่สินค้า SKU หลักที่คัดสรร", id: "kategori SKU utama yang kurasi" } },
    { v: "OEM", l: { en: "branding, color, size range and packaging", "zh-CN": "品牌、颜色、尺码与包装", ar: "العلامة التجارية واللون ونطاق المقاس والتغليف", vi: "thương hiệu, màu sắc, dải kích cỡ và bao bì", th: "แบรนด์ สี ช่วงไซส์ และบรรจุภัณฑ์", id: "branding, warna, rentang ukuran, kemasan" } },
    { v: "ODM", l: { en: "material, construction and performance-target development", "zh-CN": "材料、结构与性能目标开发", ar: "تطوير المادة والبناء وأهداف الأداء", vi: "phát triển vật liệu, cấu tạo và mục tiêu hiệu năng", th: "พัฒนาวัสดุ โครงสร้าง และเป้าสมรรถนะ", id: "pengembangan material, konstruksi, target performa" } },
  ],
  buyerKicker: { en: "For glove buyers & importers", "zh-CN": "面向手套采购与进口商", ar: "لمشتري ومستوردي القفازات", vi: "Dành cho nhà mua và nhập khẩu găng tay", th: "สำหรับผู้ซื้อและนำเข้าถุงมือ", id: "Untuk pembeli & importir sarung tangan" },
  buyerTitle: { en: "Built for glove buyers and importers", "zh-CN": "为手套采购与进口商量身打造", ar: "مصمم لمشتري ومستوردي القفازات", vi: "Được xây dựng cho nhà mua và nhập khẩu găng tay", th: "ออกแบบมาสำหรับผู้ซื้อและผู้นำเข้าถุงมือ", id: "Dibangun untuk pembeli & importir sarung tangan" },
  buyerItems: [
    { b: "OEM / ODM", strong: { en: "Branded & private-label", "zh-CN": "品牌与贴牌", ar: "ذو علامة تجارية وخاصة", vi: "Thương hiệu & riêng nhãn", th: "แบรนด์และสินค้าแบรนด์ของคุณ", id: "Branded & private-label" }, span: { en: "Your logo, color, size range and packaging", "zh-CN": "Logo、颜色、尺码与包装", ar: "شعارك ولونك ونطاق مقاسك وتغليفك", vi: "Logo, màu, dải kích cỡ và bao bì của bạn", th: "โลโก้ สี ช่วงไซส์ และบรรจุภัณฑ์ของคุณ", id: "Logo, warna, rentang ukuran, kemasan Anda" } },
    { b: "LEATHER GRADE", strong: { en: "Material to spec", "zh-CN": "按需选材", ar: "مادة حسب المواصفات", vi: "Vật liệu theo yêu cầu", th: "วัสดุตามสเปก", id: "Material sesuai spesifikasi" }, span: { en: "Species, split, thickness, hand feel", "zh-CN": "皮种、剖层、厚度、手感", ar: "النوع، الطبقة، السماكة، الملمس", vi: "Loài da, lớp, độ dày, cảm giác", th: "ชนิดหนัง ชั้นหนัง ความหนา สัมผัส", id: "Jenis, split, ketebalan, tekstur" } },
    { b: "SAMPLES", strong: { en: "Trial before bulk", "zh-CN": "大货前打样", ar: "تجربة قبل الشحنة الكبيرة", vi: "Thử trước khi sản xuất loạt", th: "ทดลองก่อนผลิตจริง", id: "Trial sebelum bulk" }, span: { en: "Confirm hand feel and build", "zh-CN": "确认手感与做工", ar: "تأكيد الملمس والبناء", vi: "Xác nhận cảm giác và cấu tạo", th: "ยืนยันสัมผัสและโครงสร้าง", id: "Konfirmasi tekstur dan build" } },
    { b: "EXPORT", strong: { en: "Ready to ship", "zh-CN": "可出货", ar: "جاهز للشحن", vi: "Sẵn sàng giao hàng", th: "พร้อมจัดส่ง", id: "Siap kirim" }, span: { en: "Cartons, marks and documents", "zh-CN": "纸箱、唛头与单证", ar: "الكراتين والعلامات والمستندات", vi: "Thùng, nhãn và chứng từ", th: "กล่อง เครื่องหมาย และเอกสาร", id: "Karton, mark, dokumen" } },
  ],
  catsKicker: { en: "Product matrix", "zh-CN": "产品矩阵", ar: "مصفوفة المنتجات", vi: "Ma trận sản phẩm", th: "เมทริกซ์สินค้า", id: "Matriks Produk" },
  catsTitle: { en: "Leather glove categories for importers", "zh-CN": "面向进口商的皮革手套品类", ar: "فئات قفازات الجلد للمستوردين", vi: "Các danh mục găng tay da cho nhà nhập khẩu", th: "หมวดหมู่ถุงมือหนังสำหรับผู้นำเข้า", id: "Kategori sarung tangan kulit untuk importir" },
  catsIntro: {
    en: "Four primary categories, each with build options confirmed by sample. Open a card to see the reference SKUs.",
    "zh-CN": "四大主品类，每个都有可按样品确认的工艺选项。展开卡片查看参考 SKU。",
    ar: "أربع فئات رئيسية، لكل منها خيارات بناء تُؤكد بالعينة. افتح البطاقة لرؤية مراجع SKU.",
    vi: "Bốn danh mục chính, mỗi danh mục có tùy chọn chế tạo được xác nhận qua mẫu. Mở thẻ để xem SKU tham khảo.",
    th: "สี่หมวดหมู่หลัก แต่ละหมวดมีตัวเลือกการผลิตที่ยืนยันด้วยตัวอย่าง เปิดการ์ดเพื่อดู SKU อ้างอิง",
    id: "Empat kategori utama, masing-masing dengan opsi build yang dikonfirmasi sampel. Buka kartu untuk melihat SKU referensi.",
  },
  refSku: { en: "Reference SKUs", "zh-CN": "参考 SKU", ar: "مراجع SKU", vi: "SKU tham khảo", th: "SKU อ้างอิง", id: "SKU Referensi" },
  capKicker: { en: "Factory & capability", "zh-CN": "工厂与产能", ar: "المصنع والقدرة", vi: "Nhà máy & năng lực", th: "โรงงานและความสามารถ", id: "Pabrik & kapasitas" },
  capTitle: { en: "One Guangdong leather glove source, built around your order", "zh-CN": "一家围绕您的订单打造的广东皮革手套源头工厂", ar: "مصدر واحد لقفازات الجلد في قوانغدونغ، مبني حول طلبك", vi: "Một nguồn găng tay da Quảng Đông, xây quanh đơn hàng của bạn", th: "แหล่งถุงมือหนังกวางตุ้งแห่งเดียว สร้างรอบคำสั่งซื้อของคุณ", id: "Satu sumber sarung tangan kulit Guangdong, dibangun di sekitar pesanan Anda" },
  capText: {
    en: "Fulide is a Gaozhou leather glove factory handling cutting, sewing, assembly, finishing and packing in-house. Buyers confirm material, construction and target performance, then Fulide builds samples before bulk.",
    "zh-CN": "福立得是高州的皮革手套工厂，裁断、缝制、组装、后处理与包装均在厂内完成。买家确认材料、结构与目标性能后，福立得先打样再量产。",
    ar: "فوليدي مصنع قفازات جلدية في جاوتشو يتولى القطع والخياطة والتجميع والتشطيب والتغليف داخلياً. يؤكد المشتري المادة والبناء والأداء المستهدف، ثم تبني فوليدي العينات قبل الإنتاج الضخم.",
    vi: "Fulide là nhà máy găng tay da Gaozhou thực hiện cắt, may, lắp ráp, hoàn thiện và đóng gói tại chỗ. Người mua xác nhận vật liệu, cấu tạo và hiệu năng mục tiêu, rồi Fulide làm mẫu trước khi sản xuất loạt.",
    th: "Fulide เป็นโรงงานถุงมือหนังเกาโจว จัดการตัด เย็บ ประกอบ ตกแต่ง และบรรจุในโรงงาน ผู้ซื้อยืนยันวัสดุ โครงสร้าง และสมรรถนะเป้าหมาย จากนั้น Fulide ทำตัวอย่างก่อนผลิตจริง",
    id: "Fulide adalah pabrik sarung tangan kulit Gaozhou yang menangani pemotongan, jahit, perakitan, finishing, dan kemasan di internal. Pembeli mengonfirmasi material, konstruksi, dan performa target, lalu Fulide membuat sampel sebelum produksi massal.",
  },
  features: [
    { strong: { en: "In-house cutting & sewing", "zh-CN": "厂内裁断与缝制", ar: "قطع وخياطة داخليان", vi: "Cắt & may tại chỗ", th: "ตัดและเย็บในโรงงาน", id: "Pemotongan & jahit internal" }, p: { en: "Tighter lead time and build control.", "zh-CN": "更紧的交期与工艺控制。", ar: "مدة تسليم وأفضل تحكم في البناء.", vi: "Thời gian giao hàng chặt hơn và kiểm soát chế tạo tốt hơn.", th: "ระยะนำส่งสั้นลงและควบคุมการผลิตดีขึ้น", id: "Lead time lebih ketat dan kontrol build lebih baik." } },
    { strong: { en: "Material confirmation by sample", "zh-CN": "按样品确认材料", ar: "تأكيد المادة بالعينة", vi: "Xác nhận vật liệu bằng mẫu", th: "ยืนยันวัสดุด้วยตัวอย่าง", id: "Konfirmasi material via sampel" }, p: { en: "Leather grade, thickness and hand feel agreed before bulk.", "zh-CN": "大货前确认皮料等级、厚度与手感。", ar: "تُتفق درجة الجلد والسماكة والملمس قبل الإنتاج الكبير.", vi: "Cấp da, độ dày và cảm giác được thống nhất trước loạt.", th: "เกรดหนัง ความหนา และสัมผัสตกลงก่อนผลิตจริง", id: "Grad kulit, ketebalan, tekstur disepakati sebelum bulk." } },
    { strong: { en: "OEM branding", "zh-CN": "OEM 品牌", ar: "علامة OEM", vi: "Thương hiệu OEM", th: "แบรนด์ OEM", id: "Branding OEM" }, p: { en: "Logo, color, size range and packaging to your spec.", "zh-CN": "Logo、颜色、尺码与包装按您规格。", ar: "الشعار واللون ونطاق المقاس والتغليف حسب مواصفاتك.", vi: "Logo, màu, dải kích cỡ và bao bì theo yêu cầu.", th: "โลโก้ สี ช่วงไซส์ และบรรจุภัณฑ์ตามสเปกคุณ", id: "Logo, warna, rentang ukuran, kemasan sesuai spesifikasi." } },
    { strong: { en: "Export documentation", "zh-CN": "出口单证", ar: "وثائق التصدير", vi: "Chứng từ xuất khẩu", th: "เอกสารส่งออก", id: "Dokumen ekspor" }, p: { en: "Carton marks, packing list and shipment support.", "zh-CN": "箱唛、装箱单与出货支持。", ar: "علامات الكراتين وقائمة التعبئة ودعم الشحن.", vi: "Nhãn thùng, phiếu đóng gói và hỗ trợ vận chuyển.", th: "เครื่องหมายกล่อง สเปคบรรจุ และสนับสนุนการจัดส่ง", id: "Mark karton, packing list, dukungan pengiriman." } },
  ],
  processTitle: { en: "How an order develops", "zh-CN": "订单如何推进", ar: "كيف يتطور الطلب", vi: "Cách một đơn hàng phát triển", th: "คำสั่งซื้อพัฒนาอย่างไร", id: "Bagaimana pesanan berkembang" },
  processSteps: [
    { b: "01", strong: { en: "Brief & spec", "zh-CN": "需求与规格", ar: "الموجز والمواصفات", vi: "Brief & thông số", th: "บรีฟและสเปก", id: "Brief & spesifikasi" }, p: { en: "Share use case, market, quantity and documents.", "zh-CN": "提供使用场景、市场、数量与文件。", ar: "شارك حالة الاستخدام والسوق والكمية والمستندات.", vi: "Chia sẻ tình huống, thị trường, số lượng và tài liệu.", th: "แชร์การใช้งาน ตลาด จำนวน และเอกสาร", id: "Bagikan kasus pakai, pasar, jumlah, dokumen." } },
    { b: "02", strong: { en: "Sample build", "zh-CN": "打样", ar: "بناء العينة", vi: "Làm mẫu", th: "ทำตัวอย่าง", id: "Pembuatan sampel" }, p: { en: "Confirm leather, construction and hand feel.", "zh-CN": "确认皮料、结构与手感。", ar: "تأكيد الجلد والبناء والملمس.", vi: "Xác nhận da, cấu tạo và cảm giác.", th: "ยืนยันหนัง โครงสร้าง และสัมผัส", id: "Konfirmasi kulit, konstruksi, tekstur." } },
    { b: "03", strong: { en: "Bulk production", "zh-CN": "量产", ar: "الإنتاج الضخم", vi: "Sản xuất loạt", th: "ผลิตจริง", id: "Produksi massal" }, p: { en: "In-house cutting, sewing, finishing and packing.", "zh-CN": "厂内裁断、缝制、后处理与包装。", ar: "قطع وخياطة وتشطيب وتغليف داخليون.", vi: "Cắt, may, hoàn thiện và đóng gói tại chỗ.", th: "ตัด เย็บ ตกแต่ง และบรรจุในโรงงาน", id: "Pemotongan, jahit, finishing, kemasan internal." } },
    { b: "04", strong: { en: "Ship & documents", "zh-CN": "出货与单证", ar: "الشحن والمستندات", vi: "Giao hàng & chứng từ", th: "จัดส่งและเอกสาร", id: "Kirim & dokumen" }, p: { en: "Marks, packing list and export support.", "zh-CN": "箱唛、装箱单与出口支持。", ar: "العلامات وقائمة التعبئة ودعم التصدير.", vi: "Nhãn thùng, phiếu đóng gói và hỗ trợ xuất khẩu.", th: "เครื่องหมายกล่อง สเปคบรรจุ และสนับสนุนส่งออก", id: "Mark, packing list, dukungan ekspor." } },
  ],
  factoryKicker: { en: "Visit the source", "zh-CN": "探访源头", ar: "زر المصدر", vi: "Ghé thăm nguồn", th: "เยี่ยมชมแหล่งกำเนิด", id: "Kunjungi sumber" },
  factoryTitle: { en: "See the Gaozhou leather glove factory", "zh-CN": "参观高州皮革手套工厂", ar: "شاهد مصنع قفازات الجلد في جاوتشو", vi: "Thăm nhà máy găng tay da Gaozhou", th: "เยี่ยมชมโรงงานถุงมือหนังเกาโจว", id: "Lihat pabrik sarung tangan kulit Gaozhou" },
  factoryText: {
    en: "Photos, workflow and equipment from the Gaozhou workshop, and the people behind each glove.",
    "zh-CN": "高州车间的照片、工序与设备，以及每双手套背后的人。",
    ar: "صور وسير العمل والمعدات من ورشة جاوتشو، وأيضاً الأشخاص وراء كل قفاز.",
    vi: "Ảnh, quy trình và thiết bị từ xưởng Gaozhou, cùng những người đứng sau mỗi đôi găng.",
    th: "ภาพ ขั้นตอนการทำงาน และอุปกรณ์จากโรงงานเกาโจว รวมถึงคนเบื้องหลังทุกถุงมือ",
    id: "Foto, alur kerja, dan peralatan dari bengkel Gaozhou, serta orang di balik setiap sarung tangan.",
  },
  factoryCta1: { en: "View factory", "zh-CN": "查看工厂", ar: "عرض المصنع", vi: "Xem nhà máy", th: "ดูโรงงาน", id: "Lihat pabrik" },
  factoryCta2: { en: "Register inquiry", "zh-CN": "登记询盘", ar: "سجّل استفساراً", vi: "Đăng ký báo giá", th: "ลงทะเบียนสอบถาม", id: "Daftar inquiry" },
  contactKicker: { en: "Start an inquiry", "zh-CN": "发起询盘", ar: "ابدأ استفساراً", vi: "Bắt đầu báo giá", th: "เริ่มการสอบถาม", id: "Mulai inquiry" },
  contactTitle: { en: "Send Fulide your glove requirement", "zh-CN": "把您的手套需求发给福立得", ar: "أرسل متطلب قفازاتك إلى فوليدي", vi: "Gửi yêu cầu găng tay của bạn cho Fulide", th: "ส่งความต้องการถุงมือของคุณถึง Fulide", id: "Kirim kebutuhan sarung tangan Anda ke Fulide" },
  contactText: {
    en: "Open the inquiry register to list products, quantity and target market, then send it on WhatsApp or email.",
    "zh-CN": "打开询盘登记表，列出产品、数量与目标市场，然后通过 WhatsApp 或邮箱发送。",
    ar: "افتح سجل الاستفسارات لإدراج المنتجات والكمية والسوق المستهدف، ثم أرسله عبر WhatsApp أو البريد.",
    vi: "Mở đăng ký báo giá để liệt kê sản phẩm, số lượng và thị trường mục tiêu, rồi gửi qua WhatsApp hoặc email.",
    th: "เปิดการลงทะเบียนสอบถามเพื่อระบุสินค้า จำนวน และตลาดเป้าหมาย แล้วส่งผ่าน WhatsApp หรืออีเมล",
    id: "Buka daftar inquiry untuk mencatat produk, jumlah, dan pasar target, lalu kirim via WhatsApp atau email.",
  },
  waPre: { en: "Inquiry about: ", "zh-CN": "询盘：", ar: "استفسار حول: ", vi: "Yêu cầu về: ", th: "สอบถามเรื่อง: ", id: "Pertanyaan tentang: " },
  faqKicker: { en: "Common buyer questions", "zh-CN": "买家常见问题", ar: "أسئلة المشتري الشائعة", vi: "Câu hỏi người mua phổ biến", th: "คำถามผู้ซื้อที่พบบ่อย", id: "Pertanyaan pembeli umum" },
};

const OG_LOCALE = { en: "en_US", "zh-CN": "zh_CN", ar: "ar_AR", vi: "vi_VN", th: "th_TH", id: "id_ID" };

function hp(lang, value) {
  const v = typeof value === "string" ? HOME[value] : value;
  if (v == null) return "";
  return typeof v === "string" ? v : (v[lang] ?? "");
}

function langSwitch(lang) {
  return LANGS.map((l) => {
    const current = l.code === lang ? ' aria-current="true"' : "";
    return `<a href="${homePath(l.code)}" lang="${l.code}" hreflang="${l.code}"${current}>${l.label}</a>`;
  }).join("");
}

function proofItems(lang) {
  return HOME.proof.map((p) => `<div class="hp-proof-item"><strong>${p.v}</strong><span>${hp(lang, p.l)}</span></div>`).join("");
}

function buyerItems(lang) {
  return HOME.buyerItems.map((it) => `<div class="hp-buyer-item"><b>${it.b}</b><strong>${hp(lang, it.strong)}</strong><span>${hp(lang, it.span)}</span></div>`).join("");
}

function categoryCards(lang) {
  return categories.map((cat) => {
    const catName = escapeHtml(pick(cat, "name", lang));
    const catSummary = escapeHtml(pick(cat, "summary", lang));
    const catHref = catPath(cat, lang);
    const waMsg = HOME.waPre[lang] + pick(cat, "name", lang) + " - " + site.baseUrl + "/" + catPath(cat, lang);
    const skus = cat.products.map((id) => {
      const p = productById.get(id);
      if (!p) return "";
      const name = escapeHtml(pick(p, "name", lang));
      const href = p.detail ? prodPath(p, lang) : "#contact";
      return `<li><a href="${href}">${name}</a></li>`;
    }).join("");
    return `<article class="hp-card">
      <div class="hp-card-media"><img src="${cat.image}" alt="${catName}" loading="lazy"></div>
      <div class="hp-card-body">
        <span class="hp-pill">${T(lang, "categoryLabel")}</span>
        <h3><button class="hp-toggle" type="button" aria-expanded="false">${catName}<span class="hp-plus" aria-hidden="true"></span></button></h3>
        <p>${catSummary}</p>
        <ul class="hp-spec">${skus}</ul>
        <div class="hp-actions">
          <a class="btn" href="${catHref}">${T(lang, "viewDetails")}</a>
          <a class="btn green" href="${whatsappLink(waMsg)}" target="_blank" rel="noopener">${T(lang, "whatsappDraft")}</a>
        </div>
      </div>
    </article>`;
  }).join("\n");
}

function featureItems(lang) {
  return HOME.features.map((f) => `<div class="hp-feature"><strong>${hp(lang, f.strong)}</strong><p>${hp(lang, f.p)}</p></div>`).join("");
}

function processSteps(lang) {
  return HOME.processSteps.map((s) => `<div class="hp-step"><b>${s.b}</b><strong>${hp(lang, s.strong)}</strong><p>${hp(lang, s.p)}</p></div>`).join("");
}

function faqSectionHome(lang) {
  const items = faqItems(lang).map((it) => `<div class="hp-faq-item"><h3>${escapeHtml(it.q)}</h3><p>${escapeHtml(it.a)}</p></div>`).join("");
  const cta = `<div class="hp-hero-actions"><a class="btn green" href="https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" rel="noopener">WhatsApp</a><a class="btn" href="${inquiryPath(lang)}">${T(lang, "inquiry")}</a></div>`;
  return `    <section class="hp-faq" id="faq"><div class="hp-container"><div class="hp-section-head"><div><p class="hp-kicker">${escapeHtml(hp(lang, "faqKicker"))}</p><h2>${escapeHtml(T(lang, "buyerFaqTitle"))}</h2></div></div><div class="hp-faq-grid">${items}</div>${cta}</div></section>`;
}

function homePage(lang) {
  const isRtl = LANG[lang].dir === "rtl";
  const lpFn = (code) => homePath(code);
  const hreflang = LANGS.map((l) => `    <link rel="alternate" hreflang="${l.code}" href="${site.baseUrl}/${lpFn(l.code)}">`).join("\n");
  const xdefault = `    <link rel="alternate" hreflang="x-default" href="${site.baseUrl}/${lpFn("en")}">`;
  const canonical = `${site.baseUrl}/${homePath(lang)}`;
  const title = `${site.company} | ${T(lang, "products")}`;
  const css = styleSheet(isRtl);
  const nav = [
    { label: T(lang, "products"), href: catPath(categories[0], lang) },
    { label: T(lang, "standards"), href: guidePath(lang) },
    { label: T(lang, "factory"), href: factoryPath(lang) },
    { label: T(lang, "inquiry"), href: inquiryPath(lang) },
  ];
  const navHtml = nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("");

  return `<!DOCTYPE html>
<html lang="${lang}"${isRtl ? ' dir="rtl"' : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(hp(lang, "meta"))}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${canonical}" />
${hreflang}
${xdefault}
  <link rel="icon" href="favicon.ico" sizes="any" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(hp(lang, "heroP"))}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${site.baseUrl}/assets/hero-glove-wall.jpg" />
  <meta property="og:locale" content="${OG_LOCALE[lang]}" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${escapeHtml(title)}</title>
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "${gaMeasurementId}");
  </script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${site.company}",
      "description": "${escapeHtml(hp(lang, "meta"))}",
      "url": "${site.baseUrl}/",
      "email": "${site.email}",
      "telephone": "${site.whatsapp}",
      "address": { "@type": "PostalAddress", "addressLocality": "Gaozhou", "addressRegion": "Guangdong", "addressCountry": "CN" }
    }
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(faqSchema(lang))}
  </script>
  <style>${css}</style>
</head>
<body id="top">
  <header class="hp-site-header">
    <div class="hp-container">
      <nav class="hp-nav" aria-label="Primary">
        <a class="hp-brand" href="${homePath(lang)}">
          <span class="hp-brand-mark">Fulide</span>
          <span class="hp-brand-sub">${escapeHtml(site.company)}</span>
        </a>
        <div class="hp-nav-links">${navHtml}</div>
        <div class="hp-nav-actions">
          <a class="btn secondary" href="https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn" href="#contact">${T(lang, "sendInquiry")}</a>
        </div>
        <span class="hp-lang-switch" aria-label="Language">${langSwitch(lang)}</span>
      </nav>
    </div>
  </header>

  <main>
    <section class="hp-hero" aria-label="Fulide factory hero">
      <div class="hp-container">
        <div class="hp-hero-content">
          <div class="hp-eyebrow">${escapeHtml(hp(lang, "heroKicker"))}</div>
          <h1>${escapeHtml(hp(lang, "heroH1"))}</h1>
          <p>${escapeHtml(hp(lang, "heroP"))}</p>
          <div class="hp-hero-actions">
            <a class="btn" href="#categories">${escapeHtml(hp(lang, "heroCta1"))}</a>
            <a class="btn secondary" href="#contact">${escapeHtml(hp(lang, "heroCta2"))}</a>
          </div>
          <div class="hp-proof">${proofItems(lang)}</div>
        </div>
      </div>
    </section>

    <section class="hp-buyer">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <p class="hp-kicker">${escapeHtml(hp(lang, "buyerKicker"))}</p>
            <h2>${escapeHtml(hp(lang, "buyerTitle"))}</h2>
          </div>
        </div>
        <div class="hp-buyer-grid">${buyerItems(lang)}</div>
      </div>
    </section>

    <section class="hp-cats" id="categories">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <p class="hp-kicker">${escapeHtml(hp(lang, "catsKicker"))}</p>
            <h2>${escapeHtml(hp(lang, "catsTitle"))}</h2>
            <p class="hp-lead">${escapeHtml(hp(lang, "catsIntro"))}</p>
          </div>
        </div>
        <div class="hp-card-grid">${categoryCards(lang)}</div>
      </div>
    </section>

    <section class="hp-capability">
      <div class="hp-container hp-split">
        <figure class="hp-media-card">
          <img src="assets/factory-floor.jpg" alt="${escapeHtml(hp(lang, "capTitle"))}" loading="lazy" />
          <figcaption>${escapeHtml(hp(lang, "capKicker"))}</figcaption>
        </figure>
        <div>
          <p class="hp-kicker">${escapeHtml(hp(lang, "capKicker"))}</p>
          <h2>${escapeHtml(hp(lang, "capTitle"))}</h2>
          <p class="hp-lead">${escapeHtml(hp(lang, "capText"))}</p>
          <div class="hp-feature-grid">${featureItems(lang)}</div>
        </div>
      </div>
    </section>

    <section class="hp-process">
      <div class="hp-container">
        <div class="hp-section-head">
          <div>
            <p class="hp-kicker">${escapeHtml(hp(lang, "capKicker"))}</p>
            <h2>${escapeHtml(hp(lang, "processTitle"))}</h2>
          </div>
        </div>
        <div class="hp-process-grid">${processSteps(lang)}</div>
      </div>
    </section>

    <section class="hp-factory">
      <div class="hp-container hp-split">
        <div>
          <p class="hp-kicker">${escapeHtml(hp(lang, "factoryKicker"))}</p>
          <h2>${escapeHtml(hp(lang, "factoryTitle"))}</h2>
          <p class="hp-lead">${escapeHtml(hp(lang, "factoryText"))}</p>
          <div class="hp-hero-actions">
            <a class="btn" href="${factoryPath(lang)}">${escapeHtml(hp(lang, "factoryCta1"))}</a>
            <a class="btn secondary" href="${inquiryPath(lang)}">${escapeHtml(hp(lang, "factoryCta2"))}</a>
          </div>
        </div>
        <figure class="hp-media-card">
          <img src="assets/cutting-room.jpg" alt="${escapeHtml(hp(lang, "factoryTitle"))}" loading="lazy" />
        </figure>
      </div>
    </section>

    <section class="hp-contact" id="contact">
      <div class="hp-container hp-contact-inner">
        <p class="hp-kicker">${escapeHtml(hp(lang, "contactKicker"))}</p>
        <h2>${escapeHtml(hp(lang, "contactTitle"))}</h2>
        <p class="hp-lead">${escapeHtml(hp(lang, "contactText"))}</p>
        <div class="hp-hero-actions">
          <a class="btn" href="${inquiryPath(lang)}">${T(lang, "inquiry")}</a>
          <a class="btn green" href="https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </section>
${faqSectionHome(lang)}
  </main>

  ${shared.footer(lang)}

  <script>
    (function () {
      var grid = document.querySelector(".hp-card-grid");
      if (!grid) return;
      var cards = grid.querySelectorAll(".hp-card");
      function toggle(card, open) {
        var btn = card.querySelector(".hp-toggle");
        if (!btn) return;
        var next = open === undefined ? !card.classList.contains("is-open") : open;
        card.classList.toggle("is-open", next);
        btn.setAttribute("aria-expanded", String(next));
      }
      cards.forEach(function (card) {
        var btn = card.querySelector(".hp-toggle");
        if (btn) btn.addEventListener("click", function () { toggle(card); });
      });
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
          });
        }, { threshold: 0.15 });
        cards.forEach(function (c) { io.observe(c); });
      } else {
        cards.forEach(function (c) { c.classList.add("in-view"); });
      }
    })();
  </script>
</body>
</html>`;
}

function styleSheet(isRtl) {
  const dir = isRtl ? "rtl" : "ltr";
  return `
    :root {
      --red: #8b1e1e; --red-dark: #681717; --ink: #121826; --muted: #596275;
      --line: #e5e7eb; --paper: #f7f4ef; --white: #ffffff; --green: #176c3a;
      --radius: 8px; --shadow: 0 24px 60px rgba(18,24,38,0.14);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: Arial, "Noto Sans SC", "Microsoft YaHei", sans-serif; color: var(--ink); background: #fff; line-height: 1.55; direction: ${dir}; }
    img { display: block; max-width: 100%; }
    a { color: inherit; text-decoration: none; }
    button { font: inherit; }
    .hp-container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 18px; border: 1px solid transparent; border-radius: var(--radius); background: var(--red); color: #fff; font-weight: 900; cursor: pointer; white-space: nowrap; transition: 0.18s ease; }
    .btn:hover { background: var(--red-dark); transform: translateY(-1px); }
    .btn.secondary { background: #fff; color: var(--ink); border-color: var(--line); }
    .btn.secondary:hover { background: #f5f5f5; }
    .btn.green { background: var(--green); }
    .btn.green:hover { background: #12592f; }
    .hp-site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.96); border-bottom: 1px solid var(--line); backdrop-filter: blur(16px); }
    .hp-nav { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
    .hp-brand { display: flex; flex-direction: column; line-height: 1.1; }
    .hp-brand-mark { font-size: 20px; font-weight: 900; color: var(--red); }
    .hp-brand-sub { font-size: 11px; color: var(--muted); font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
    .hp-nav-links { display: flex; gap: 22px; font-size: 14px; font-weight: 800; color: #303847; flex-wrap: wrap; }
    .hp-nav-links a:hover { color: var(--red); }
    .hp-nav-actions { display: flex; gap: 10px; align-items: center; }
    .hp-lang-switch { display: flex; gap: 10px; align-items: center; border-${isRtl ? "right" : "left"}: 1px solid var(--line); padding-${isRtl ? "right" : "left"}: 14px; margin-${isRtl ? "right" : "left"}: 6px; font-size: 13px; font-weight: 800; }
    .hp-lang-switch a { color: var(--muted); }
    .hp-lang-switch a[aria-current="true"] { color: var(--red); }
    .hp-hero { position: relative; display: grid; align-items: end; overflow: hidden; background: #111827; color: #fff; min-height: calc(100vh - 76px); }
    .hp-hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,14,23,0.88), rgba(10,14,23,0.5), rgba(10,14,23,0.2)), url("assets/hero-glove-wall.jpg") center / cover no-repeat; transform: scale(1.01); }
    .hp-hero-content { position: relative; z-index: 1; padding: 84px 0 72px; width: min(820px, 100%); }
    .hp-eyebrow { display: inline-flex; padding: 7px 10px; border: 1px solid rgba(255,255,255,0.22); background: rgba(139,30,30,0.84); border-radius: 4px; color: #fff; font-size: 12px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; margin: 0 0 18px; }
    .hp-hero h1 { margin: 0; font-size: clamp(38px, 6vw, 70px); line-height: 1.02; }
    .hp-hero p { max-width: 640px; margin: 22px 0 0; color: rgba(255,255,255,0.86); font-size: clamp(16px, 2vw, 20px); }
    .hp-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
    .hp-proof { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px; margin-top: 44px; border: 1px solid rgba(255,255,255,0.16); border-radius: var(--radius); overflow: hidden; max-width: 820px; background: rgba(255,255,255,0.16); }
    .hp-proof-item { padding: 18px; background: rgba(10,14,23,0.58); min-height: 92px; }
    .hp-proof-item strong { display: block; font-size: 24px; line-height: 1; }
    .hp-proof-item span { display: block; margin-top: 8px; color: rgba(255,255,255,0.74); font-size: 13px; font-weight: 700; }
    section { padding: 80px 0; }
    .hp-buyer { border-bottom: 1px solid var(--line); }
    .hp-section-head { margin-bottom: 30px; }
    .hp-kicker { margin: 0 0 8px; color: var(--red); font-size: 12px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
    h2 { margin: 0; font-size: clamp(28px, 4vw, 44px); line-height: 1.1; }
    .hp-lead { max-width: 760px; margin: 14px 0 0; color: var(--muted); font-size: 17px; }
    .hp-buyer-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
    .hp-buyer-item { padding: 22px; background: #fff; min-height: 120px; }
    .hp-buyer-item b { display: block; color: var(--red); font-size: 12px; letter-spacing: 0.12em; }
    .hp-buyer-item strong { display: block; margin: 8px 0; font-size: 18px; }
    .hp-buyer-item span { display: block; color: var(--muted); font-size: 13px; font-weight: 700; }
    .hp-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
    .hp-card { border: 1px solid var(--line); border-radius: var(--radius); background: #fff; overflow: hidden; opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .hp-card.in-view { opacity: 1; transform: translateY(0); }
    .hp-card-media img { width: 100%; height: 200px; object-fit: cover; }
    .hp-card-body { padding: 18px; }
    .hp-pill { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #f2e6e2; color: var(--red); font-size: 12px; font-weight: 900; margin-bottom: 10px; }
    .hp-card-body h3 { margin: 0 0 10px; font-size: 20px; line-height: 1.2; }
    .hp-toggle { display: flex; align-items: baseline; gap: 8px; width: 100%; margin: 0; padding: 0; border: 0; background: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; }
    .hp-toggle .hp-plus { position: relative; flex: none; align-self: center; width: 17px; height: 17px; margin-${isRtl ? "right" : "left"}: auto; border-radius: 50%; transition: transform 0.28s ease, background-color 0.28s ease; }
    .hp-toggle .hp-plus::before, .hp-toggle .hp-plus::after { content: ""; position: absolute; top: 50%; left: 50%; width: 10px; height: 2px; border-radius: 1px; background: var(--red); transform: translate(-50%, -50%); }
    .hp-toggle .hp-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
    .hp-card.is-open .hp-toggle .hp-plus { transform: rotate(45deg); background-color: rgba(139,30,30,0.08); }
    .hp-card-body p { margin: 0 0 14px; color: var(--muted); font-size: 14px; }
    .hp-spec { display: grid; gap: 7px; margin: 0 0 16px; padding: 0; list-style: none; color: #303847; font-size: 13px; font-weight: 700; max-height: 0; opacity: 0; overflow: hidden; transform: translateY(-6px); transition: max-height 0.34s ease, opacity 0.26s ease, transform 0.34s ease, margin 0.34s ease; }
    .hp-spec li::before { content: "+"; margin-${isRtl ? "left" : "right"}: 8px; color: var(--red); font-weight: 900; }
    .hp-spec li a:hover { color: var(--red); }
    .hp-card.is-open .hp-spec { max-height: 320px; opacity: 1; margin: 0 0 14px; transform: translateY(0); }
    @media (hover: hover) and (pointer: fine) {
      .hp-card:hover .hp-spec, .hp-card:focus-within .hp-spec { max-height: 320px; opacity: 1; margin: 0 0 14px; transform: translateY(0); }
    }
    .hp-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .hp-capability { background: var(--paper); }
    .hp-split { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(320px,0.95fr); gap: 42px; align-items: center; }
    .hp-media-card { position: relative; overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow); background: #ddd; margin: 0; }
    .hp-media-card img { width: 100%; min-height: 360px; object-fit: cover; }
    .hp-media-card figcaption { position: absolute; left: 14px; right: 14px; bottom: 14px; padding: 12px 14px; border-radius: 6px; background: rgba(18,24,38,0.82); color: #fff; font-size: 13px; font-weight: 800; }
    .hp-feature-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; margin-top: 24px; }
    .hp-feature { padding: 18px; border: 1px solid rgba(18,24,38,0.1); border-radius: var(--radius); background: #fff; }
    .hp-feature strong { display: block; margin-bottom: 6px; font-size: 17px; }
    .hp-feature p { margin: 0; color: var(--muted); font-size: 14px; }
    .hp-process-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; margin-top: 28px; }
    .hp-step { padding: 22px; background: #fff; }
    .hp-step b { color: var(--red); font-size: 13px; letter-spacing: 0.08em; }
    .hp-step strong { display: block; margin: 8px 0; font-size: 18px; }
    .hp-step p { margin: 0; color: var(--muted); font-size: 14px; }
    .hp-factory .hp-media-card { order: 2; }
    .hp-contact { background: var(--red); color: #fff; text-align: center; }
    .hp-contact .hp-kicker { color: rgba(255,255,255,0.8); }
    .hp-contact .hp-lead { color: rgba(255,255,255,0.86); margin-left: auto; margin-right: auto; }
    .hp-contact-inner { display: flex; flex-direction: column; align-items: center; }
    .hp-contact .hp-hero-actions { justify-content: center; }
    .hp-contact .btn { background: #fff; color: var(--red); }
    .hp-contact .btn:hover { background: #f1e9e9; }
    .hp-contact .btn.green { background: var(--green); color: #fff; }
    .hp-faq { background: var(--paper); }
    .hp-faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 26px 0 22px; }
    .hp-faq-item { border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; background: #fff; }
    .hp-faq-item h3 { margin: 0 0 8px; font-size: 17px; line-height: 1.3; overflow-wrap: anywhere; }
    .hp-faq-item p { margin: 0; color: var(--muted); font-size: 14px; }
    .footer { border-top: 1px solid var(--line); padding: 26px 0; font-size: 14px; color: var(--muted); }
    .footer strong { color: var(--ink); }
    @media (prefers-reduced-motion: reduce) {
      .hp-spec, .hp-toggle .hp-plus, .hp-card { transition: none; }
      html { scroll-behavior: auto; }
    }
    @media (max-width: 900px) {
      .hp-proof, .hp-buyer-grid, .hp-process-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .hp-split { grid-template-columns: 1fr; }
      .hp-factory .hp-media-card { order: 0; }
    }
    @media (max-width: 560px) {
      .hp-nav-links { display: none; }
      .hp-proof, .hp-buyer-grid, .hp-process-grid { grid-template-columns: 1fr; }
    }
  `;
}

function main() {
  const targets = LANGS.filter((l) => l.code !== "en" && l.code !== "zh-CN");
  for (const l of targets) {
    const file = homePath(l.code);
    fs.writeFileSync(path.join(root, file), homePage(l.code), "utf8");
    console.log("Wrote", file);
  }
}

if (require.main === module) main();
module.exports = { homePage, main };
