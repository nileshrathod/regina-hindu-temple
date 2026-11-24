import { CalendarEvent } from '../types/temple';

function formatIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function downloadEventIcs(event: CalendarEvent): void {
  const startDate = formatIcsDate(event.date);
  // End date for all-day event in ICS is exclusive (next day)
  const endSource = event.endDate || event.date;
  const endObj = new Date(`${endSource}T12:00:00`);
  endObj.setDate(endObj.getDate() + 1);
  const endDate = endObj.toISOString().slice(0, 10).replace(/-/g, '');

  const uid = `${event.id}@reginahindutemple.ca`;
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hindu Samaj of Southern Saskatchewan//Regina Hindu Temple//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeIcsText(event.title)} — Regina Hindu Temple`,
    `LOCATION:Regina Hindu Temple\\, 3307 Pasqua St.\\, Regina\\, SK S4S 7G8`,
    `DESCRIPTION:${escapeIcsText(`${event.time ? `Timing: ${event.time}\n` : ''}${event.description}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
