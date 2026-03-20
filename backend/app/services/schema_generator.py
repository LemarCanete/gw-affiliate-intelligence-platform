import json
from datetime import datetime


def generate_review_schema(
    product_name: str,
    category: str,
    author_name: str,
    author_url: str,
    rating: float,
    review_body: str,
    published_url: str,
) -> str:
    """Generate Review schema JSON-LD."""
    schema = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": product_name,
            "applicationCategory": category,
        },
        "author": {
            "@type": "Person",
            "name": author_name,
            "url": author_url,
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": str(rating),
            "bestRating": "5",
        },
        "datePublished": datetime.utcnow().strftime("%Y-%m-%d"),
        "reviewBody": review_body[:200],
        "url": published_url,
    }
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'


def generate_faq_schema(faqs: list[dict]) -> str:
    """Generate FAQ schema JSON-LD. Each FAQ is {question: str, answer: str}."""
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": faq["question"],
                "acceptedAnswer": {"@type": "Answer", "text": faq["answer"]},
            }
            for faq in faqs
        ],
    }
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'


def generate_author_schema(
    name: str,
    url: str,
    bio: str,
    job_title: str = "",
    linkedin: str = "",
    twitter: str = "",
) -> str:
    """Generate Author schema JSON-LD."""
    schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": name,
        "url": url,
        "description": bio,
    }
    if job_title:
        schema["jobTitle"] = job_title
    same_as = [s for s in [linkedin, twitter] if s]
    if same_as:
        schema["sameAs"] = same_as
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'


def generate_local_business_schema(
    business_name: str,
    description: str,
    city: str,
    region: str,
    country: str,
    url: str,
    phone: str = "",
    price_range: str = "",
) -> str:
    """Generate LocalBusiness schema JSON-LD (Module B)."""
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business_name,
        "description": description[:150],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city,
            "addressRegion": region,
            "addressCountry": country,
        },
        "url": url,
        "areaServed": city,
    }
    if phone:
        schema["telephone"] = phone
    if price_range:
        schema["priceRange"] = price_range
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'


def generate_breadcrumb_schema(
    items: list[dict],
) -> str:
    """Generate BreadcrumbList schema JSON-LD. Required on ALL posts.
    Each item is {name: str, url: str}. First item is Home, last is current page."""
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": item["name"],
                "item": item["url"],
            }
            for i, item in enumerate(items)
        ],
    }
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'


def generate_article_schema(
    headline: str,
    author_name: str,
    author_url: str,
    published_url: str,
    image_url: str = "",
    keywords: str = "",
    date_published: str = "",
    date_modified: str = "",
    publisher_name: str = "",
    publisher_logo: str = "",
) -> str:
    """Generate Article schema JSON-LD for Explainer, How-To, Comparison content types."""
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline[:110],
        "author": {
            "@type": "Person",
            "name": author_name,
            "url": author_url,
        },
        "url": published_url,
        "datePublished": date_published or datetime.utcnow().strftime("%Y-%m-%d"),
        "dateModified": date_modified or datetime.utcnow().strftime("%Y-%m-%d"),
    }
    if image_url:
        schema["image"] = image_url
    if keywords:
        schema["keywords"] = keywords
    if publisher_name:
        schema["publisher"] = {
            "@type": "Organization",
            "name": publisher_name,
        }
        if publisher_logo:
            schema["publisher"]["logo"] = {
                "@type": "ImageObject",
                "url": publisher_logo,
            }
    return f'<script type="application/ld+json">{json.dumps(schema, indent=2)}</script>'
