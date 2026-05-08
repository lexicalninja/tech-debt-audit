#!/usr/bin/env python3
# Simple internal tool for converting CSV to JSON
import csv
import json
import sys

def convert_csv_to_json(csv_file, json_file):
    """Convert CSV to JSON file."""
    try:
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            data = list(reader)
        with open(json_file, 'w') as f:
            json.dump(data, f, indent=2)
    except:
        print("Error processing file")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: app.py <input.csv> <output.json>")
        sys.exit(1)
    convert_csv_to_json(sys.argv[1], sys.argv[2])
