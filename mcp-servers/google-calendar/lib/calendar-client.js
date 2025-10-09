/**
 * Google Calendar API Client
 * Simple wrapper for calendar operations
 */

import { google } from 'googleapis';

export class CalendarClient {
  constructor(credentials) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      credentials.redirectUri
    );

    this.oauth2Client.setCredentials({
      refresh_token: credentials.refreshToken
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    this.calendarId = credentials.calendarId || 'primary';
  }

  /**
   * List events in date range
   */
  async listEvents({ startDate, endDate, maxResults = 50 }) {
    try {
      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: new Date(startDate).toISOString(),
        timeMax: new Date(endDate).toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return {
        success: true,
        events: response.data.items || [],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a new calendar event
   */
  async createEvent({ summary, description, start, end, colorId, reminders, location }) {
    try {
      const event = {
        summary,
        description,
        start: { dateTime: new Date(start).toISOString(), timeZone: 'America/New_York' },
        end: { dateTime: new Date(end).toISOString(), timeZone: 'America/New_York' },
      };

      if (colorId) event.colorId = colorId;
      if (location) event.location = location;
      if (reminders) event.reminders = reminders;

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        resource: event,
      });

      return {
        success: true,
        event: {
          id: response.data.id,
          htmlLink: response.data.htmlLink,
          status: response.data.status,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId, updates) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: this.calendarId,
        eventId: eventId,
        resource: updates,
      });

      return {
        success: true,
        event: {
          id: response.data.id,
          updated: response.data.updated,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      return {
        success: true,
        eventId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Find free time slots
   */
  async findFreeSlots({ date, durationMinutes, preferredTimeRanges = [{ start: '09:00', end: '17:00' }], bufferMinutes = 15 }) {
    try {
      // Get events for the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { events } = await this.listEvents({
        startDate: startOfDay,
        endDate: endOfDay,
      });

      // Find gaps between events
      const slots = [];

      for (const range of preferredTimeRanges) {
        const [startHour, startMin] = range.start.split(':').map(Number);
        const [endHour, endMin] = range.end.split(':').map(Number);

        const rangeStart = new Date(date);
        rangeStart.setHours(startHour, startMin, 0, 0);

        const rangeEnd = new Date(date);
        rangeEnd.setHours(endHour, endMin, 0, 0);

        let currentTime = rangeStart;

        while (currentTime < rangeEnd) {
          const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);

          // Check if slot conflicts with any event
          const hasConflict = events.some(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date);
            const eventEnd = new Date(event.end.dateTime || event.end.date);

            return (currentTime < eventEnd && slotEnd > eventStart);
          });

          if (!hasConflict && slotEnd <= rangeEnd) {
            const score = this._calculateSlotScore(currentTime, range);
            slots.push({
              start: currentTime.toISOString(),
              end: slotEnd.toISOString(),
              score,
            });
          }

          // Move to next potential slot
          currentTime = new Date(currentTime.getTime() + (bufferMinutes * 60000));
        }
      }

      // Sort by score (higher is better)
      slots.sort((a, b) => b.score - a.score);

      return {
        success: true,
        slots: slots.slice(0, 5), // Return top 5 slots
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate slot quality score (0-100)
   */
  _calculateSlotScore(slotTime, preferredRange) {
    let score = 50; // Base score

    const hour = slotTime.getHours();
    const [prefStartHour] = preferredRange.start.split(':').map(Number);

    // Prefer slots earlier in preferred range
    if (hour === prefStartHour) score += 30;
    else if (hour === prefStartHour + 1) score += 20;
    else score += 10;

    // Prefer morning over afternoon
    if (hour >= 9 && hour < 12) score += 20;

    return Math.min(100, score);
  }

  /**
   * Get event by ID
   */
  async getEvent(eventId) {
    try {
      const response = await this.calendar.events.get({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      return {
        success: true,
        event: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
