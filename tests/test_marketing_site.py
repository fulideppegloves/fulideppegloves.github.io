import unittest
from html.parser import HTMLParser
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SITE_ROOT = PROJECT_ROOT


class StructureParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.local_references = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        for attribute in ("src", "href"):
            value = values.get(attribute, "")
            if value and not value.startswith(("#", "http:", "https:", "mailto:", "tel:", "data:")):
                self.local_references.append(value.split("?", 1)[0])


class MarketingSiteTests(unittest.TestCase):
    def test_bilingual_inquiry_paths_expose_reviewable_email_draft(self):
        for filename in ("index-en.html", "index.html"):
            content = (SITE_ROOT / filename).read_text(encoding="utf-8")
            self.assertIn("delivervalue95@gmail.com", content, filename)
            self.assertIn('id="openEmailInquiry"', content, filename)
            self.assertIn("mailto:delivervalue95@gmail.com", content, filename)
            self.assertIn("buildInquiryMessage(document.getElementById(\"inquiryForm\"))", content, filename)
            self.assertIn("marketingAttribution", content, filename)
            self.assertIn("utm_campaign", content, filename)
            for field in ("company", "name", "email", "whatsapp", "market", "quantity", "buyerType", "targetPrice", "documentation", "deadline"):
                self.assertIn(f'name="{field}"', content, filename)
                self.assertIn(f'data.get("{field}")', content, filename)

    def test_bilingual_site_exposes_authority_and_application_flow(self):
        for filename in ("index-en.html", "index.html"):
            content = (SITE_ROOT / filename).read_text(encoding="utf-8")
            self.assertIn('href="b2b-authority.css"', content, filename)
            self.assertIn('src="b2b-authority.js"', content, filename)
            self.assertNotIn('class="verification-strip"', content, filename)
            required_sections = ("documents", "contact") if filename == "index-en.html" else ("find-glove", "quality", "documents", "contact")
            for section_id in required_sections:
                self.assertIn(f'id="{section_id}"', content, filename)
            expected_guides = 2 if filename == "index-en.html" else 6
            self.assertGreaterEqual(content.count("data-guide-category="), expected_guides, filename)
            self.assertIn("delivervalue95@gmail.com", content, filename)
            self.assertIn("https://wa.me/85255778242", content, filename)
            self.assertNotIn("www.[official-domain].com", content, filename)
            self.assertNotIn("sales@[official-domain].com", content, filename)
            self.assertIn("inquiry-register.html", content, filename)
            self.assertIn("factory.html", content, filename)
            for field in ("company", "name", "email", "market", "quantity"):
                self.assertRegex(content, rf'<input[^>]+name="{field}"[^>]+required', filename)
        authority_script = (SITE_ROOT / "b2b-authority.js").read_text(encoding="utf-8")
        self.assertIn("window.requestAnimationFrame(animate)", authority_script)
        self.assertIn("autoPosition += elapsed", authority_script)
        self.assertIn("track.scrollLeft = autoPosition", authority_script)
        self.assertNotIn("prefers-reduced-motion: reduce", authority_script.split("function initializeHeroSkuRail", 1)[1].split("function initializeProgressiveRfq", 1)[0])

    def test_reserved_documents_do_not_link_to_unverified_files(self):
        for filename in ("index-en.html", "index.html"):
            content = (SITE_ROOT / filename).read_text(encoding="utf-8")
            documents = content.split('id="documents"', 1)[1].split("</section>", 1)[0]
            self.assertNotIn('href="assets/', documents, filename)
            self.assertIn("data-document-request=", documents, filename)
            self.assertNotIn("Download certificate", documents, filename)

    def test_html_structure_and_local_references_are_valid(self):
        for filename in ("index-en.html", "index.html"):
            content = (SITE_ROOT / filename).read_text(encoding="utf-8")
            parser = StructureParser()
            parser.feed(content)
            duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
            self.assertEqual([], duplicates, f"{filename} duplicate IDs")
            missing = sorted(
                reference
                for reference in set(parser.local_references)
                if not (SITE_ROOT / reference).is_file()
            )
            self.assertEqual([], missing, f"{filename} missing local files")


if __name__ == "__main__":
    unittest.main()
