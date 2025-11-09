# Utility Scripts Collection

A collection of utility scripts for various data processing and automation tasks.

## Scripts

### 1. Calendar File Parser to CSV (`calendar-file-parser-to-csv.py`)

Converts ICS (iCalendar) files to CSV format for easy analysis and manipulation.

**Features:**
- Parses ICS calendar files
- Extracts event summaries, dates, and times
- Outputs formatted CSV with Date, Time, and Summary columns
- Handles various datetime formats

**Usage:**
```bash
python calendar-file-parser-to-csv.py
```

**Requirements:**
- Input file: `~/personal-calendar-export.ics`
- Output file: `~/flattened_calendar.csv`

### 2. Genome Data Filter (`genome-data-filter.py`)

Filters specific rsIDs from large genome data text files, useful for processing genetic testing results.

**Features:**
- Efficient line-by-line processing for large files
- Filters 26 predefined rsIDs related to various genetic markers
- Tab-separated format support
- Optimized for performance with large datasets

**Usage:**
```bash
python genome-data-filter.py
```

**Requirements:**
- Input file: `raw_data.txt` (tab-separated genome data)
- Output file: `filtered_data.txt`
- Note: Remove header information from raw data files before processing

**Filtered rsIDs:**
- rs4680, rs4633, rs769224, rs1544410, rs731236, rs1801133, rs1801131, rs1805087
- rs1801394, rs162036, rs2287780, rs567754, rs234706, rs1979277, rs6323, rs3741049
- rs2066470, rs10380, rs1802059, rs617219, rs651852, rs819147, rs819134, rs819171
- rs1801181, rs2298758

### 3. Keynote PNG Stitcher (`keynote-png-stitcher.scpt`)

AppleScript that automatically creates a Keynote presentation from PNG images.

**Features:**
- Reads all PNG files from a specified folder
- Creates a new Keynote presentation with blank slides
- Adds one image per slide
- Uses standard 16:9 slide dimensions (1920x1080)

**Usage:**
```bash
osascript keynote-png-stitcher.scpt
```

**Requirements:**
- macOS with Keynote installed
- Input folder: `~/stitcher/` containing PNG files
- Images will be added in the order found by the system

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Requirements

- Python 3.x (for Python scripts)
- macOS with Keynote (for AppleScript)

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.
