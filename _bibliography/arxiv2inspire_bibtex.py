#!/usr/bin/env python3
"""
arxiv2inspire_bibtex.py  —  v5
––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
• Accepts a file of arXiv links (one per line)
• For each paper:
    – gets INSPIRE BibTeX (gives you the canonical key Surname:YYYYabc)
    – fetches LaTeX abstract + title from arXiv API
    – injects   abstract = {...},
    – injects   keywords = {...},   (chosen from VOCAB below, case‑insensitive)
• Appends ONLY the new entries to   _bibliography/papers.bib
  (creates dir / file as needed).

  usage: paste this into terminal
             python _bibliography/arxiv2inspire_bibtex.py _bibliography/more_urls.txt
  idk why u have to do it from the main directory, but it works
"""

from __future__ import annotations
import re
import sys
import time
import textwrap
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Iterable, List

import requests


# ─────────────────────────────────────────────────────────────────────────
# 1.  KEYWORD VOCABULARY  (unchanged list, but matching now truly case‑insensitive)
# ─────────────────────────────────────────────────────────────────────────
VOCAB: dict[str, list[str]] = {
    "Axions": ["axion"],
    "Beyond standard model (BSM)": ["bsm", "beyond standard model"],
    "Big-bang-nucleosynthesis (BBN)": ["bbn", "big bang nucleosynthesis"],
    "Chiral plasma instability (CPI) and chiral magnetic effect (CME)": [
        "chiral plasma instability",
        "cpi",
        "chiral magnetic effect",
        "cme",
    ],
    "Cosmological parameters": ["cosmological parameter"],
    "Cosmic microwave background (CMB)": ["cosmic microwave background", r"\bcmb\b"],
    "Ultra high energy cosmic rays (UHECR)": [
        "ultra high energy cosmic ray",
        r"\buhecr\b",
    ],
    "Dark energy (DE)": ["dark energy", r"\bde\b"],
    "Dark matter. (DM)": ["dark matter", r"\bdm\b"],
    "General relativity (GR) and modified gravity (MG)": [
        "general relativity",
        "modified gravity",
        r"\bgr\b",
        r"\bmg\b",
    ],
    "Gravitational waves (GWs) theory & observations": [
        "gravitational wave",
        r"\bgw\b",
        r"\bgws\b",
    ],
    "Inflation": ["inflationary", r"\binflation\b"],
    "Isotropy": ["isotropy", "anisotropy"],
    "Large-scale structure (LSS)": ["large-scale structure", r"\blss\b"],
    "Lorentz symmetry": [
        r"lorentz[- ]invariance",      # Lorentz invariance / Lorentz‑invariance
        r"lorentz[- ]invariance[- ]violation",
        r"lorentz[- ]violation",
        r"\bliv\b",                    # LIV acronym
        r"\blorentz\b",                # plain “Lorentz” (catch‑all)
    ],
    "Neutrinos": ["neutrino"],
    "Parity symmetry": ["parity"],
    "Perturbations": ["perturbation"],
    "Phase transitions (PTs)": ["phase transition", r"\bpts?\b"],
    "Primordial magnetic fields (PMFs)": [
        "primordial magnetic field",
        r"\bpmf\b",
        r"\bpmfs\b",
    ],
    "Turbulence": ["turbulence"],
}


# ─────────────────────────────────────────────────────────────────────────
# 2.  LOW‑LEVEL HELPERS
# ─────────────────────────────────────────────────────────────────────────
ARXIV_RE = re.compile(
    r"arxiv\.org/(?:abs|pdf)/(?P<id>\d{4}\.\d{4,5}(v\d+)?|[a-z\-]+/\d{7})",
    re.I,
)
INSPIRE_BASE = "https://inspirehep.net/api/arxiv/{}"
HEADERS_JSON = {"Accept": "application/json"}
HEADERS_BIBTEX = {"Accept": "application/x-bibtex"}
NEWLINE_RE = re.compile(r"\s*\n\s*")


def extract_arxiv_id(url: str) -> str:
    m = ARXIV_RE.search(url)
    if not m:
        raise ValueError(f"Could not recognise arXiv ID in: {url}")
    return m.group("id")


def inspire_bibtex(arxiv_id: str) -> str:
    url = f"{INSPIRE_BASE.format(arxiv_id)}?format=bibtex"
    r = requests.get(url, headers=HEADERS_BIBTEX, timeout=15)
    r.raise_for_status()
    return r.text.strip()


# ── arXiv API helpers ────────────────────────────────────────────────────
ATOM_NS = {"a": "http://www.w3.org/2005/Atom"}


def arxiv_api_metadata(arxiv_id: str) -> tuple[str, str]:
    """
    Return (title, latex_abstract) from arXiv API.
    We drop any version suffix for the API call (2312.03932v2 → 2312.03932).
    """
    bare = arxiv_id.split("v")[0]
    url = f"http://export.arxiv.org/api/query?id_list={bare}"
    r = requests.get(url, timeout=15)
    r.raise_for_status()

    root = ET.fromstring(r.text)
    entry = root.find("a:entry", ATOM_NS)
    if entry is None:
        raise ValueError("arXiv API returned no entry")

    title = (
        entry.find("a:title", ATOM_NS).text
        .replace("\n", " ")
        .strip()
    )
    abstract = (
        entry.find("a:summary", ATOM_NS).text
        .replace("\n", " ")
        .strip()
    )
    return title, abstract


# ─────────────────────────────────────────────────────────────────────────
# 3.  KEYWORD DETECTION  (case‑insensitive, title+abstract)
# ─────────────────────────────────────────────────────────────────────────
def find_keywords(text: str) -> list[str]:
    text_low = text.lower()
    found = []
    for canon, pats in VOCAB.items():
        for pat in pats:
            if re.search(pat.lower(), text_low):
                found.append(canon)
                break
    return found


# ─────────────────────────────────────────────────────────────────────────
# 4.  FIELD INJECTION (NO REGEX === NO ESCAPE ERRORS)
# ─────────────────────────────────────────────────────────────────────────
def inject_fields(bib: str, extras: dict[str, str]) -> str:
    """
    Insert each   field = {value},   before the final '}'.
    Ensures the line just before the injection ends with a comma.
    """
    lines = bib.rstrip().splitlines()
    # index of closing brace
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip().startswith("}"):
            close_idx = i
            break
    else:
        raise RuntimeError("Could not find closing brace in BibTeX entry")

    # penultimate line must end with ','
    pen = close_idx - 1
    if pen >= 0 and not lines[pen].rstrip().endswith(","):
        lines[pen] = lines[pen].rstrip() + ","

    # insert fields in the order provided
    for k, v in extras.items():
        lines.insert(close_idx, f"  {k} = {{{v}}},")
        close_idx += 1

    return "\n".join(lines) + "\n"


# ─────────────────────────────────────────────────────────────────────────
# 5.  BUILD A COMPLETE ENTRY   ←  replace the old function with this one
# ─────────────────────────────────────────────────────────────────────────
def build_entry(arxiv_id: str) -> str:
    bib = inspire_bibtex(arxiv_id)
    title, latex_abs = arxiv_api_metadata(arxiv_id)

    # tidy abstract (collapse whitespace, wrap 80 columns)
    abs_single = NEWLINE_RE.sub(" ", latex_abs)
    tidy_abs = textwrap.fill(abs_single, width=80)

    # keywords (always present)
    kw_list = find_keywords(f"{title} {latex_abs}")
    if not kw_list:
        kw_list = ["Miscellaneous"]

    fields = {
        "abstract": tidy_abs,
        "keywords": ", ".join(kw_list),
    }

    return inject_fields(bib, fields)


# ─────────────────────────────────────────────────────────────────────────
# 6.  APPEND‑ONLY LOGIC
# ─────────────────────────────────────────────────────────────────────────
TARGET = Path("_bibliography/papers.bib")


def existing_keys() -> set[str]:
    if not TARGET.exists():
        return set()
    txt = TARGET.read_text()
    return {m.group(1) for m in re.finditer(r"@\w+\{([^,]+),", txt)}


def entries_from_links(links: Iterable[str], pause: float = 0.35) -> list[str]:
    seen = existing_keys()
    new_entries = []
    for link in links:
        aid = extract_arxiv_id(link)
        try:
            entry = build_entry(aid)
            key = re.match(r"@\w+\{([^,]+),", entry).group(1)
            if key not in seen:
                new_entries.append(entry)
                seen.add(key)
            else:
                sys.stderr.write(f"[skip] {key} already in bibliography\n")
        except Exception as e:
            sys.stderr.write(f"[warn] {aid}: {e}\n")
        time.sleep(pause)  # play nice with both APIs
    return new_entries


def save(entries: list[str]) -> None:
    if not entries:
        print("Nothing new to add ✨")
        return
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    with TARGET.open("a") as f:
        if TARGET.stat().st_size:
            f.write("\n\n")
        f.write("\n\n".join(entries))
    print(f"Appended {len(entries)} entr{'y' if len(entries)==1 else 'ies'} → {TARGET}")


# ─────────────────────────────────────────────────────────────────────────
# 7.  CLI
# ─────────────────────────────────────────────────────────────────────────
def main(argv: List[str] | None = None) -> None:
    if argv is None:
        argv = sys.argv[1:]
    if not argv:
        print("Usage: python arxiv2inspire_bibtex.py urls.txt")
        sys.exit(1)

    links = Path(argv[0]).read_text().splitlines()
    save(entries_from_links(links))


if __name__ == "__main__":
    main()
