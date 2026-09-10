#!/usr/bin/env python3
"""Refresh the site's public Google Scholar metrics snapshot."""

import html
import json
import re
import urllib.request
from datetime import date
from pathlib import Path


PROFILE_URL = "https://scholar.google.com/citations?user=sfbEbZEAAAAJ&hl=en"
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "data" / "scholar-stats.json"


request = urllib.request.Request(
    PROFILE_URL,
    headers={
        "User-Agent": "Mozilla/5.0 (compatible; PhongDangWebsiteMetrics/1.0)",
        "Accept-Language": "en-US,en;q=0.9",
    },
)

with urllib.request.urlopen(request, timeout=30) as response:
    page = response.read().decode("utf-8")

values = [
    int(html.unescape(value).replace(",", ""))
    for value in re.findall(r'<td class="gsc_rsb_std">\s*([\d,]+)\s*</td>', page)
]

if len(values) < 6:
    raise RuntimeError("Google Scholar metrics table was not found; keeping the existing snapshot.")

stats = {
    "citations": values[0],
    "h_index": values[2],
    "i10_index": values[4],
    "updated_at": date.today().isoformat(),
    "profile_url": PROFILE_URL,
}

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text(json.dumps(stats, indent=2) + "\n", encoding="utf-8")
