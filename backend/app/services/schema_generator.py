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
