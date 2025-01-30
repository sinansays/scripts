import os
import re
import csv

# Define the path to the ICS file and the output CSV file
home_directory = os.path.expanduser('~')
ics_file_path = os.path.join(home_directory, 'personal-calendar-export.ics')
output_file_path = os.path.join(home_directory, 'flattened_calendar.csv')

# Function to parse the ICS file
def parse_ics(file_path):
    events = []
    with open(file_path, 'r') as file:
        lines = file.readlines()

    event = {}
    for line in lines:
        line = line.strip()
        if line.startswith('BEGIN:VEVENT'):
            event = {}
        elif line.startswith('SUMMARY:'):
            event['SUMMARY'] = line.split(':', 1)[1]
        elif line.startswith('DTSTART'):
            event['DTSTART'] = parse_datetime(line)
        elif line.startswith('END:VEVENT'):
            events.append(event)
    
    return events

# Function to parse the datetime string
def parse_datetime(line):
    dt = line.split(':', 1)[1]
    # Match format like '20210521T093000Z', '20210521T093000', '2021-05-21T09:30:00Z' or '2021-05-21T09:30:00'
    match = re.match(r'(\d{4})-?(\d{2})-?(\d{2})T(\d{2})(\d{2})(\d{2})?', dt)
    if match:
        year, month, day, hour, minute = match.group(1), match.group(2), match.group(3), match.group(4), match.group(5)
        date = f"{year}-{month}-{day}"
        time = f"{hour}:{minute}"
        return date, time
    return None, None

# Parse the ICS file
events = parse_ics(ics_file_path)

# Write the parsed events to the output CSV file
with open(output_file_path, 'w', newline='') as output_file:
    csv_writer = csv.writer(output_file)
    # Write the header row
    csv_writer.writerow(['Date', 'Time', 'Summary'])
    for event in events:
        if 'DTSTART' in event and 'SUMMARY' in event:
            date, time = event['DTSTART']
            if date and time:
                csv_writer.writerow([date, time, event['SUMMARY']])

print(f'Flattened calendar written to {output_file_path}')
