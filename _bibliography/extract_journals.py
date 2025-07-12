#!/usr/bin/env python3
"""
extract_journals.py

Reads a BibTeX (.bib) file and writes a text file listing all journal names found.

Usage:
    pip install bibtexparser
    python extract_journals.py input.bib output.txt
"""
import sys
try:
    import bibtexparser
except ImportError:
    sys.exit("Missing bibtexparser. Install with: pip install bibtexparser")

def main(bib_path, out_path):
    # Load the .bib file
    with open(bib_path, 'r', encoding='utf-8') as bib_file:
        bib_database = bibtexparser.load(bib_file)

    # Collect unique journal names
    journals = set()
    for entry in bib_database.entries:
        journal = entry.get('journal')
        if journal:
            journals.add(journal)

    # Write to output file
    with open(out_path, 'w', encoding='utf-8') as out_file:
        for name in sorted(journals):
            out_file.write(f"{name}\n")

    print(f"Extracted {len(journals)} unique journals to '{out_path}'")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} input.bib output.txt")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
