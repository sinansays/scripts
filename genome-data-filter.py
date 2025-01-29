# Script: Filter Specific rsIDs from a Large Raw Genome Data Text File
# Description:
# This Python script processes a large tab-separated text file (`raw_data.txt`) and filters rows
# that contain specific rsIDs in the first column. The output is saved in `filtered_data.txt`,
# with the same tab-separated format as the original file.

# How It Works:
# - This Python script defines a set of target rsIDs for quick lookup.
# - It reads `raw_data.txt` line-by-line to optimize performance.
# - Note that if the file is from 23andMe or any other service, you need to remove any header information and only preserve the data for this script to work properly.
# - The first column (rsID) is extracted from each line.
# - If the rsID matches one in the predefined set, the entire line is written to the output file.
# - The output preserves the input format (tab-separated, no header row).

# Prerequisites:
# - Ensure `raw_data.txt` is in the same directory as this script.
# - The file should be tab-separated and contain rsIDs in the first column.

# Usage: Run the script in the same directory as `raw_data.txt`

import os

# Define the rsIDs to filter
rsid_filter = {
    "rs4680", "rs4633", "rs769224", "rs1544410", "rs731236", "rs1801133", "rs1801131", "rs1805087", 
    "rs1801394", "rs162036", "rs2287780", "rs567754", "rs234706", "rs1979277", "rs6323", "rs3741049", 
    "rs2066470", "rs10380", "rs1802059", "rs617219", "rs651852", "rs819147", "rs819134", "rs819171", 
    "rs1801181", "rs2298758"
}

# Define file names
input_file = "raw_data.txt" # Ensure this file is in the same working directory as this script
output_file = "filtered_data.txt" # This script will output its file to the same working directory

# Process the file
with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
    for line in infile:
        columns = line.strip().split("\t")  # Split by tab
        if columns and columns[0] in rsid_filter:  # Check if rsID is in the list
            outfile.write(line)  # Write the matching line to output file

print(f"Filtering complete. The output is saved in '{output_file}'.")
