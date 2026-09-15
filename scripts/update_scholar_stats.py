#!/usr/bin/env python3
"""Refresh the site's public Google Scholar metrics snapshot."""

import html
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path


PROFILE_URL = "https://scholar.google.com/citations?user=sfbEbZEAAAAJ&hl=en"
TEXT_PROXY_URL = f"https://r.jina.ai/http://{PROFILE_URL.removeprefix('https://')}"
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "data" / "scholar-stats.json"


def fetch(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; PhongDangWebsiteMetrics/1.0)",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def metrics_from_profile(page):
    values = [
        int(html.unescape(value).replace(",", ""))
        for value in re.findall(r'<td class="gsc_rsb_std">\s*([\d,]+)\s*</td>', page)
    ]
    if len(values) < 6:
        raise ValueError("metrics table not found")
    return values[0], values[2], values[4]


def metrics_from_citations(markdown):
    citation_counts = [
        int(value.replace(",", ""))
        for value in re.findall(
            r"\[([\d,]+)\]\(https?://scholar\.google\.com/scholar\?oi=bibs&[^)]*\)",
            markdown,
        )
    ]
    if not citation_counts:
        raise ValueError("publication citation counts not found")
    citation_counts.sort(reverse=True)
    citations = sum(citation_counts)
    h_index = sum(count >= rank for rank, count in enumerate(citation_counts, start=1))
    i10_index = sum(count >= 10 for count in citation_counts)
    return citations, h_index, i10_index


try:
    citations, h_index, i10_index = metrics_from_profile(fetch(PROFILE_URL))
except Exception as direct_error:
    print(f"Direct Scholar request unavailable: {direct_error}", file=sys.stderr)
    try:
        citations, h_index, i10_index = metrics_from_citations(fetch(TEXT_PROXY_URL))
    except Exception as proxy_error:
        print(
            f"Scholar fallback unavailable: {proxy_error}. Keeping the existing snapshot.",
            file=sys.stderr,
        )
        raise SystemExit(0)

stats = {
    "citations": citations,
    "h_index": h_index,
    "i10_index": i10_index,
    "updated_at": date.today().isoformat(),
    "profile_url": PROFILE_URL,
}

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
