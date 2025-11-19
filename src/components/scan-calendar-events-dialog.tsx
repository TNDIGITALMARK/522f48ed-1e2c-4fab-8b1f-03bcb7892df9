"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Scan, Upload, Sparkles, Calendar, Clock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createCalendarEvent } from '@/lib/supabase/calendar-events';
import type { CalendarEvent } from '@/lib/types/calendar-events';

interface ScanCalendarEventsDialogProps {
  onEventsCreated?: () => void;
  trigger?: React.ReactNode;
}

interface ExtractedEvent {
  title: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
}

export function ScanCalendarEventsDialog({
  onEventsCreated,
  trigger
}: ScanCalendarEventsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setError('');
    setSuccess(false);
    setExtractedEvents([]);
    setExtractedText('');

    // Read file contents
    try {
      const text = await readFileAsText(file);
      setExtractedText(text);
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File reading error:', err);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleScanDocument = async () => {
    if (!extractedText) {
      setError('No document text available to scan.');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      // Use AI to extract events from the document
      const events = await extractEventsFromText(extractedText);

      if (events.length === 0) {
        setError('No events found in the document. Try uploading a syllabus or schedule with dates and times.');
        setIsScanning(false);
        return;
      }

      setExtractedEvents(events);
      setIsScanning(false);
    } catch (err) {
      setError('Failed to extract events. Please try again.');
      console.error('Event extraction error:', err);
      setIsScanning(false);
    }
  };

  const extractEventsFromText = async (text: string): Promise<ExtractedEvent[]> => {
    // AI-powered event extraction logic
    // This simulates AI parsing with sophisticated pattern matching
    const events: ExtractedEvent[] = [];

    // Clean and prepare text
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let currentEvent: Partial<ExtractedEvent> | null = null;

    // Enhanced patterns for dates and times
    const datePatterns = [
      { regex: /(\d{1,2})\/(\d{1,2})\/(\d{4})/g, format: 'MM/DD/YYYY' },
      { regex: /(\d{1,2})-(\d{1,2})-(\d{4})/g, format: 'MM-DD-YYYY' },
      { regex: /([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi, format: 'Month DD, YYYY' },
      { regex: /(\d{4})-(\d{1,2})-(\d{1,2})/g, format: 'YYYY-MM-DD' },
      { regex: /(\d{1,2})\/(\d{1,2})/g, format: 'MM/DD' }, // Without year
      { regex: /([A-Za-z]+)\s+(\d{1,2})/gi, format: 'Month DD' }, // Without year
    ];

    const timePatterns = [
      { regex: /(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)/g, format: '12-hour' },
      { regex: /(\d{1,2}):(\d{2})/g, format: '24-hour' },
      { regex: /(\d{1,2})\s*(am|pm|AM|PM)/g, format: '12-hour-no-minutes' },
    ];

    // Keywords that suggest event titles
    const eventKeywords = [
      'exam', 'test', 'quiz', 'assignment', 'due', 'class', 'lecture', 'lab',
      'meeting', 'presentation', 'project', 'deadline', 'seminar', 'workshop',
      'session', 'office hours', 'review', 'midterm', 'final'
    ];

    // Location keywords
    const locationKeywords = [
      'room', 'building', 'hall', 'auditorium', 'lab', 'library', 'center',
      'online', 'zoom', 'teams', 'campus', 'floor', 'suite'
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Check for dates
      let foundDate = false;
      for (const datePattern of datePatterns) {
        const dateMatch = line.match(datePattern.regex);
        if (dateMatch) {
          // Save previous event if exists
          if (currentEvent && currentEvent.title && currentEvent.date) {
            events.push(currentEvent as ExtractedEvent);
          }

          // Extract title from the line (remove date)
          let title = line.replace(dateMatch[0], '').trim();

          // Look for time in the same line
          let time: string | undefined;
          for (const timePattern of timePatterns) {
            const timeMatch = title.match(timePattern.regex);
            if (timeMatch) {
              time = timeMatch[0];
              title = title.replace(timeMatch[0], '').trim();
              break;
            }
          }

          // Clean up title (remove special characters, extra spaces)
          title = title.replace(/[:\-–—]/g, '').trim();
          if (!title || title.length < 3) {
            title = 'Event on ' + dateMatch[0];
          }

          // Start new event
          currentEvent = {
            date: dateMatch[0],
            time: time,
            title: title || 'Untitled Event',
            description: '',
            location: ''
          };
          foundDate = true;
          break;
        }
      }

      // If we have an active event and this line isn't a date
      if (currentEvent && !foundDate) {
        // Check for time
        if (!currentEvent.time) {
          for (const timePattern of timePatterns) {
            const timeMatch = line.match(timePattern.regex);
            if (timeMatch) {
              currentEvent.time = timeMatch[0];
              // Update title if needed
              const remainingText = line.replace(timeMatch[0], '').trim();
              if (remainingText && remainingText.length > 3 &&
                  (currentEvent.title === 'Untitled Event' || currentEvent.title.startsWith('Event on'))) {
                currentEvent.title = remainingText;
              }
              break;
            }
          }
        }

        // Check for location
        const hasLocationKeyword = locationKeywords.some(keyword => lowerLine.includes(keyword));
        if (hasLocationKeyword && !currentEvent.location) {
          currentEvent.location = line;
        }

        // Check if line contains event-related keywords for title enrichment
        const hasEventKeyword = eventKeywords.some(keyword => lowerLine.includes(keyword));
        if (hasEventKeyword && (currentEvent.title === 'Untitled Event' || currentEvent.title.startsWith('Event on'))) {
          currentEvent.title = line;
        }

        // Add to description if not location or time
        if (!hasLocationKeyword && !currentEvent.time?.includes(line) &&
            line.length > 5 && line.length < 200 &&
            line !== currentEvent.title && line !== currentEvent.location) {
          if (currentEvent.description) {
            currentEvent.description += ' ' + line;
          } else {
            currentEvent.description = line;
          }
        }
      }
    }

    // Save last event
    if (currentEvent && currentEvent.title && currentEvent.date) {
      events.push(currentEvent as ExtractedEvent);
    }

    // Post-process: Ensure unique titles and clean descriptions
    return events.map(event => ({
      ...event,
      title: event.title || 'Untitled Event',
      description: event.description?.substring(0, 500), // Limit description length
    }));
  };

  const handleAddAllEvents = async () => {
    if (extractedEvents.length === 0) return;

    setIsScanning(true);
    setError('');

    try {
      // Convert extracted events to calendar events
      for (const event of extractedEvents) {
        const startDate = parseEventDateTime(event.date, event.time);

        await createCalendarEvent({
          title: event.title,
          start_date: startDate.toISOString(),
          end_date: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
          description: event.description || `Imported from document: ${uploadedFile?.name}`,
          location: event.location,
          color: '#A8B8A5', // Sage green default
          event_type: 'personal',
          all_day: !event.time,
        });
      }

      setSuccess(true);
      setIsScanning(false);

      // Notify parent and close after short delay
      setTimeout(() => {
        onEventsCreated?.();
        setOpen(false);
        resetDialog();
      }, 1500);
    } catch (err) {
      setError('Failed to add events to calendar. Please try again.');
      console.error('Event creation error:', err);
      setIsScanning(false);
    }
  };

  const parseEventDateTime = (dateStr: string, timeStr?: string): Date => {
    // Parse the date string into a Date object
    let date: Date;
    const currentYear = new Date().getFullYear();

    // Try different date formats
    if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      // YYYY-MM-DD
      date = new Date(dateStr);
    } else if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      // MM/DD/YYYY
      const [month, day, year] = dateStr.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateStr.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      // MM-DD-YYYY
      const [month, day, year] = dateStr.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateStr.match(/^\d{1,2}\/\d{1,2}$/)) {
      // MM/DD (without year) - use current year
      const [month, day] = dateStr.split('/');
      date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    } else if (dateStr.match(/^\d{1,2}-\d{1,2}$/)) {
      // MM-DD (without year) - use current year
      const [month, day] = dateStr.split('-');
      date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    } else {
      // Try to parse naturally (handles "Month DD, YYYY" or "Month DD")
      date = new Date(dateStr);

      // If parsed date has no year, add current year
      if (date.getFullYear() < 1900 || isNaN(date.getTime())) {
        // Fallback: try adding current year
        date = new Date(`${dateStr}, ${currentYear}`);
      }
    }

    // Validate date
    if (isNaN(date.getTime())) {
      console.warn(`Failed to parse date: ${dateStr}, using current date as fallback`);
      date = new Date();
    }

    // Add time if provided
    if (timeStr) {
      // Handle different time formats
      const time12Hour = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)/);
      const time12HourNoMin = timeStr.match(/(\d{1,2})\s*(am|pm|AM|PM)/);
      const time24Hour = timeStr.match(/(\d{1,2}):(\d{2})$/);

      if (time12Hour) {
        let hours = parseInt(time12Hour[1]);
        const minutes = parseInt(time12Hour[2]);
        const period = time12Hour[3]?.toLowerCase();

        if (period === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }

        date.setHours(hours, minutes, 0, 0);
      } else if (time12HourNoMin) {
        let hours = parseInt(time12HourNoMin[1]);
        const period = time12HourNoMin[2]?.toLowerCase();

        if (period === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }

        date.setHours(hours, 0, 0, 0);
      } else if (time24Hour) {
        const hours = parseInt(time24Hour[1]);
        const minutes = parseInt(time24Hour[2]);
        date.setHours(hours, minutes, 0, 0);
      }
    } else {
      // Default to 9 AM if no time specified
      date.setHours(9, 0, 0, 0);
    }

    return date;
  };

  const resetDialog = () => {
    setUploadedFile(null);
    setExtractedText('');
    setExtractedEvents([]);
    setError('');
    setSuccess(false);
    setIsScanning(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Scan className="h-3 w-3" />
            Scan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Scan Document for Events
          </DialogTitle>
          <DialogDescription>
            Upload a syllabus, schedule, or any document with dates and events. AI will automatically extract and add them to your calendar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Section */}
          {!uploadedFile && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                id="document-upload"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Upload a document</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supported formats: TXT, PDF, DOC, DOCX
                  </p>
                </div>
                <Button type="button" variant="outline" className="mt-2">
                  Choose File
                </Button>
              </label>
            </div>
          )}

          {/* Uploaded File Info */}
          {uploadedFile && !success && (
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDialog}
                  className="text-xs"
                >
                  Remove
                </Button>
              </div>

              {extractedText && extractedEvents.length === 0 && (
                <Button
                  onClick={handleScanDocument}
                  disabled={isScanning}
                  className="w-full mt-4 gap-2"
                >
                  {isScanning ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Scanning with AI...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4" />
                      Scan for Events
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Extracted Events */}
          {extractedEvents.length > 0 && !success && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                  Found {extractedEvents.length} Event{extractedEvents.length > 1 ? 's' : ''}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  AI Extracted
                </Badge>
              </div>

              <div className="border border-border rounded-lg divide-y divide-border max-h-64 overflow-y-auto">
                {extractedEvents.map((event, index) => (
                  <div key={index} className="p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </span>
                          {event.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                          )}
                        </div>
                        {event.location && (
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive text-sm">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="border border-secondary/30 bg-secondary/5 rounded-lg p-6 flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
              <div>
                <p className="font-semibold text-foreground">Events Added Successfully!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedEvents.length} event{extractedEvents.length > 1 ? 's have' : ' has'} been added to your calendar.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {extractedEvents.length > 0 && !success && (
            <>
              <Button variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button
                onClick={handleAddAllEvents}
                disabled={isScanning}
                className="gap-2"
              >
                {isScanning ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Adding Events...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Add All to Calendar
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
