import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.local_refs = []
        self.canonicals = []
        self.hreflang = []
        self.json_ld = []
        self.in_script = False
        self.script_type = ""
        self.script_text = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "script":
            self.in_script = True
            self.script_type = values.get("type", "")
            self.script_text = []
        if tag == "link" and values.get("rel") == "canonical":
            self.canonicals.append(values.get("href"))
        if tag == "link" and values.get("rel") == "alternate":
            self.hreflang.append(values.get("hreflang"))
        for attr in ("src", "href"):
            value = values.get(attr)
            if value and not value.startswith(("#", "http:", "https:", "mailto:", "tel:", "data:")):
                self.local_refs.append(value.split("?", 1)[0])

    def handle_data(self, data):
        if self.in_script and self.script_type == "application/ld+json":
            self.script_text.append(data)

    def handle_endtag(self, tag):
        if tag == "script":
            if self.script_type == "application/ld+json":
                self.json_ld.append("".join(self.script_text).strip())
            self.in_script = False
            self.script_type = ""
            self.script_text = []


class SeoStaticPagesTests(unittest.TestCase):
    def generated_pages(self):
        catalog = json.loads((ROOT / "data" / "seo-catalog.json").read_text(encoding="utf-8"))
        pages = [
            "factory.html",
            "inquiry-register.html",
            "guides/leather-grades-and-glove-standards.html",
            "zh/factory.html",
            "zh/inquiry-register.html",
            "zh/guides/piliao-dengji-yu-shoutao-biaozhun.html",
        ]
        for category in catalog["categories"]:
            pages.append(f"categories/{category['slug']}.html")
            pages.append(f"zh/categories/{category['zhSlug']}.html")
        for product in catalog["products"]:
            if product["detail"]:
                pages.append(f"products/{product['id']}.html")
                pages.append(f"zh/products/{product['id']}.html")
        return pages

    def test_generated_pages_are_static_and_have_metadata(self):
        for page in self.generated_pages():
            parser = LinkParser()
            content = (ROOT / page).read_text(encoding="utf-8")
            parser.feed(content)
            self.assertIn("delivervalue95@gmail.com", content, page)
            self.assertIn("https://wa.me/85255778242?text=", content, page)
            self.assertEqual(1, len(parser.canonicals), page)
            self.assertIn("en", parser.hreflang, page)
            self.assertIn("zh-CN", parser.hreflang, page)
            self.assertIn("x-default", parser.hreflang, page)
            self.assertTrue(parser.json_ld, page)
            for block in parser.json_ld:
                json.loads(block)
            for reference in parser.local_refs:
                clean_reference = reference.split("#", 1)[0]
                if not clean_reference:
                    continue
                if clean_reference.endswith("/"):
                    continue
                if clean_reference.startswith("../"):
                    target = (ROOT / page).parent / clean_reference
                else:
                    target = (ROOT / page).parent / clean_reference
                self.assertTrue(target.resolve().is_file(), f"{page} -> {reference}")

            for absolute in [ref for ref in content.split('"') if ref.startswith("https://fulideppegloves.github.io/")]:
                path = urlparse(absolute).path.lstrip("/")
                if path:
                    self.assertTrue((ROOT / path).is_file(), f"{page} -> {absolute}")

    def test_sitemap_includes_generated_pages(self):
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        for page in self.generated_pages():
            self.assertIn(f"https://fulideppegloves.github.io/{page}", sitemap)
        self.assertIn('hreflang="x-default"', sitemap)

    def test_category_pages_expose_products_without_javascript(self):
        for page in (
            "categories/welding-gloves.html",
            "categories/driver-gloves.html",
            "categories/semi-leather-gloves.html",
            "categories/pet-handling-gloves.html",
            "zh/categories/dianshan-shoutao.html",
            "zh/categories/siji-shoutao.html",
            "zh/categories/banpi-shoutao.html",
            "zh/categories/chongwu-fanghu-shoutao.html",
        ):
            content = (ROOT / page).read_text(encoding="utf-8")
            self.assertIn("<article class=\"card\">", content, page)
            self.assertIn("<img ", content, page)
            self.assertIn("WhatsApp", content, page)
            self.assertNotIn("const products =", content, page)

    def test_catalog_avoids_unsupported_business_claims(self):
        catalog = (ROOT / "data" / "seo-catalog.json").read_text(encoding="utf-8").lower()
        for unsupported in ("moq", "lead time", "certified", "10+", "6 categories"):
            self.assertNotIn(unsupported, catalog)

    def test_search_crawlers_are_not_blocked(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn("User-agent: Googlebot\nAllow: /", robots)
        self.assertIn("User-agent: Bingbot\nAllow: /", robots)
        self.assertIn("User-agent: OAI-SearchBot\nAllow: /", robots)
        self.assertIn("Sitemap: https://fulideppegloves.github.io/sitemap.xml", robots)


if __name__ == "__main__":
    unittest.main()
