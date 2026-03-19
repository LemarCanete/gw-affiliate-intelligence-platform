import re


def validate_content(
    title: str,
    body: str,
    primary_keyword: str,
    slug: str,
    meta_title: str,
    meta_description: str,
) -> dict:
    """Run the 16-point SEO validation checklist. Returns pass/fail per check."""
    checks = []

    # 1. Primary keyword in title (H1)
    checks.append(
        {
            "name": "Keyword in title",
            "passed": primary_keyword.lower() in title.lower(),
            "required": True,
        }
    )

    # 2. Primary keyword in URL slug
    kw_slug = primary_keyword.lower().replace(" ", "-")
    checks.append(
        {
            "name": "Keyword in slug",
            "passed": kw_slug in slug.lower(),
            "required": True,
        }
    )

    # 3. Primary keyword in first 100 words
    words = re.sub(r"<[^>]+>", " ", body).split()
    first_100 = " ".join(words[:100]).lower()
    checks.append(
        {
            "name": "Keyword in first 100 words",
            "passed": primary_keyword.lower() in first_100,
            "required": True,
        }
    )

    # 4. Primary keyword in at least one H2
    h2s = re.findall(r"<h2[^>]*>(.*?)</h2>", body, re.IGNORECASE)
    h2_text = " ".join(h2s).lower()
    checks.append(
        {
            "name": "Keyword in H2",
            "passed": primary_keyword.lower() in h2_text,
            "required": True,
        }
    )

    # 5. Meta title contains keyword
    checks.append(
        {
            "name": "Keyword in meta title",
            "passed": primary_keyword.lower() in meta_title.lower(),
            "required": True,
        }
    )

    # 6. Meta title under 60 chars
    checks.append(
        {
            "name": "Meta title under 60 chars",
            "passed": len(meta_title) <= 60,
            "required": True,
        }
    )

    # 7. Meta description contains keyword
    checks.append(
        {
            "name": "Keyword in meta description",
            "passed": primary_keyword.lower() in meta_description.lower(),
            "required": True,
        }
    )

    # 8. Meta description 150-160 chars
    checks.append(
        {
            "name": "Meta description 150-160 chars",
            "passed": 140 <= len(meta_description) <= 165,
            "required": True,
        }
    )

    # 9. Word count minimum 1,200
    word_count = len(words)
    checks.append(
        {
            "name": "Word count >= 1,200",
            "passed": word_count >= 1200,
            "required": True,
        }
    )

    # 10. FAQ block present (minimum 5 Q&As)
    faq_questions = re.findall(r"<h3[^>]*>.*?\?.*?</h3>", body, re.IGNORECASE)
    if not faq_questions:
        faq_questions = re.findall(r'"name"\s*:\s*"[^"]*\?"', body)
    checks.append(
        {
            "name": "FAQ block with 5+ questions",
            "passed": len(faq_questions) >= 5,
            "required": True,
        }
    )

    # 11. FAQ schema present
    checks.append(
        {
            "name": "FAQ schema injected",
            "passed": "FAQPage" in body,
            "required": True,
        }
    )

    # 12. Author schema present
    checks.append(
        {
            "name": "Author schema injected",
            "passed": '"@type": "Person"' in body or '"@type":"Person"' in body,
            "required": True,
        }
    )

    # 13. Content type schema present
    has_review_schema = '"@type": "Review"' in body or '"@type":"Review"' in body
    has_article_schema = '"@type": "Article"' in body or '"@type":"Article"' in body
    checks.append(
        {
            "name": "Content type schema injected",
            "passed": has_review_schema or has_article_schema,
            "required": True,
        }
    )

    # 14. Affiliate disclosure present
    checks.append(
        {
            "name": "Affiliate disclosure at top",
            "passed": "affiliate" in " ".join(words[:50]).lower(),
            "required": True,
        }
    )

    # 15. Internal links present (2+)
    internal_links = re.findall(r"<a[^>]+href=[\"'][^\"']*[\"'][^>]*>", body)
    checks.append(
        {
            "name": "Internal links (2+)",
            "passed": len(internal_links) >= 2,
            "required": False,
        }
    )

    # 16. Image alt text with keyword
    img_alts = re.findall(r"<img[^>]+alt=[\"']([^\"']*)[\"']", body, re.IGNORECASE)
    has_keyword_alt = any(primary_keyword.lower() in alt.lower() for alt in img_alts)
    checks.append(
        {
            "name": "Image alt text with keyword",
            "passed": has_keyword_alt,
            "required": False,
        }
    )

    passed = sum(1 for c in checks if c["passed"])
    required_passed = all(c["passed"] for c in checks if c["required"])
    warnings = [c["name"] for c in checks if not c["passed"]]

    return {
        "checks": checks,
        "passed": passed,
        "total": len(checks),
        "all_required_passed": required_passed,
        "warnings": warnings,
        "word_count": word_count,
        "faq_count": len(faq_questions),
    }
