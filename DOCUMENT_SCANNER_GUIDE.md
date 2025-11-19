# Document Scanner for Calendar Events

## Overview
The Document Scanner feature allows users to automatically extract calendar events from uploaded documents such as syllabuses, schedules, or any text document containing dates and event information.

## Features

### AI-Powered Event Extraction
- **Sophisticated pattern matching** for dates and times
- **Context-aware parsing** that identifies event titles, locations, and descriptions
- **Multiple date format support**: MM/DD/YYYY, MM-DD-YYYY, Month DD YYYY, YYYY-MM-DD, and more
- **Time format support**: 12-hour (3:00 PM), 24-hour (15:00), and hour-only formats
- **Smart defaults**: Automatically uses current year if not specified, defaults to 9 AM for events without times

### Supported Document Types
- Plain text files (.txt)
- PDF documents (.pdf) - text-based only
- Word documents (.doc, .docx) - requires text extraction

### Event Detection
The AI scanner looks for:
- **Dates**: Various formats including with/without years
- **Times**: 12-hour and 24-hour formats
- **Event keywords**: exam, test, quiz, assignment, class, lecture, meeting, deadline, etc.
- **Location indicators**: room, building, hall, auditorium, online, zoom, etc.

## Usage

### Step 1: Access the Scanner
On the home page dashboard, find the calendar widget and click the **"Scan"** button next to **"Add Event"**.

### Step 2: Upload Document
- Click **"Choose File"** or drag and drop a document
- Supported formats: .txt, .pdf, .doc, .docx
- Maximum recommended size: 5 MB

### Step 3: Scan for Events
- The system will read the document content
- Click **"Scan for Events"** to analyze the document
- AI will extract dates, times, titles, locations, and descriptions

### Step 4: Review Extracted Events
- Preview all detected events with their details
- Each event shows: Title, Date, Time (if available), Location (if detected)

### Step 5: Add to Calendar
- Click **"Add All to Calendar"** to import all extracted events
- Events will be created with:
  - **Default duration**: 1 hour
  - **Default color**: Sage green (#A8B8A5)
  - **Event type**: Personal
  - **All-day flag**: Set based on whether time was detected

## Example Document Format

### Sample Syllabus
```
CS101 - Introduction to Computer Science
Spring 2025

Important Dates:

01/15/2025 - First Day of Class at 9:00 AM, Room 101
01/22/2025 - Quiz 1 at 10:00 AM, Room 101
02/05/2025 - Midterm Exam at 2:00 PM, Auditorium A
02/19/2025 - Project Deadline (no class)
03/12/2025 - Quiz 2 at 10:00 AM, Room 101
03/26/2025 - Final Project Presentation at 1:00 PM, Room 101
04/09/2025 - Final Exam at 2:00 PM, Auditorium A
```

### What Gets Extracted
The scanner would detect:
- **Event 1**: "First Day of Class" on 01/15/2025 at 9:00 AM in Room 101
- **Event 2**: "Quiz 1" on 01/22/2025 at 10:00 AM in Room 101
- **Event 3**: "Midterm Exam" on 02/05/2025 at 2:00 PM in Auditorium A
- **Event 4**: "Project Deadline" on 02/19/2025 (all-day)
- **Event 5**: "Quiz 2" on 03/12/2025 at 10:00 AM in Room 101
- **Event 6**: "Final Project Presentation" on 03/26/2025 at 1:00 PM in Room 101
- **Event 7**: "Final Exam" on 04/09/2025 at 2:00 PM in Auditorium A

## Tips for Best Results

### Document Formatting
1. **Clear date formatting**: Use consistent date formats throughout
2. **Explicit times**: Include times when known (e.g., "3:00 PM")
3. **Event keywords**: Use words like "exam", "meeting", "class" to help identify events
4. **Location details**: Include room numbers, building names, or online meeting links

### Common Patterns That Work Well
- "MM/DD/YYYY - Event Title at HH:MM AM/PM, Location"
- "Month DD, YYYY: Event Title (Time: HH:MM, Room: ###)"
- "YYYY-MM-DD Event Title HH:MM Location"

### What to Avoid
- Mixed date formats in the same document (can cause confusion)
- Dates embedded in long paragraphs (may be missed)
- Very short event titles (less than 3 characters)

## Technical Details

### Event Extraction Algorithm
1. **Text Preprocessing**: Splits document into lines, removes empty lines
2. **Date Detection**: Scans each line for date patterns
3. **Time Detection**: Looks for time patterns near dates
4. **Title Extraction**: Uses context and keywords to identify event titles
5. **Location Detection**: Searches for location-related keywords
6. **Description Building**: Captures additional context as event description
7. **Post-Processing**: Cleans and validates extracted data

### Date Parsing
- Supports formats with and without years
- Defaults to current year if not specified
- Handles both US (MM/DD) and ISO (YYYY-MM-DD) formats
- Can parse natural language dates like "January 15, 2025"

### Time Parsing
- Supports 12-hour format with AM/PM (e.g., "3:00 PM", "11 AM")
- Supports 24-hour format (e.g., "15:00", "23:30")
- Defaults to 9:00 AM for events without specified time

### Data Storage
- Events are saved to Supabase database
- Automatically tagged with tenant and project IDs for multi-tenant isolation
- Full CRUD operations available after creation

## Troubleshooting

### "No events found in the document"
- Check that your document contains clear dates
- Ensure dates are in a recognizable format (MM/DD/YYYY, etc.)
- Try adding event keywords near dates (exam, class, meeting)

### Events extracted incorrectly
- Simplify date formats in your document
- Separate dates and event titles more clearly
- Include explicit times to improve accuracy

### File upload fails
- Check file size (keep under 5 MB)
- Ensure file is in a supported format (.txt, .pdf, .doc, .docx)
- Try saving the file in plain text format

## Privacy & Security
- Documents are processed client-side
- Only extracted event data is sent to the database
- Original documents are not stored
- All data is tenant and project-isolated in the database

## Future Enhancements
- Integration with real AI/ML models (GPT-4, Claude, etc.) for improved accuracy
- Support for recurring events
- Ability to edit events before adding
- Batch upload multiple documents
- Calendar conflict detection
- Natural language queries ("Add all exams from syllabus")
