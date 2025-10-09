/**
 * Notion API Client
 * Simple wrapper for LifeOS database operations
 */

import { Client } from '@notionhq/client';

export class NotionClient {
  constructor({ auth, databases }) {
    this.notion = new Client({ auth });
    this.databases = databases;
  }

  /**
   * Query tasks with filters
   */
  async queryTasks({ filters = {}, sorts = [], limit = 100 }) {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.tasks,
        filter: filters,
        sorts: sorts,
        page_size: limit,
      });

      return {
        success: true,
        tasks: response.results.map(this._formatTask),
        hasMore: response.has_more,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a new task
   */
  async createTask(properties) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databases.tasks },
        properties: this._formatTaskProperties(properties),
      });

      return {
        success: true,
        task: this._formatTask(response),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(pageId, properties) {
    try {
      const response = await this.notion.pages.update({
        page_id: pageId,
        properties: this._formatTaskProperties(properties),
      });

      return {
        success: true,
        task: this._formatTask(response),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get daily log entry
   */
  async getDailyLog(date) {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.dailyLog,
        filter: {
          property: 'Date',
          date: {
            equals: date,
          },
        },
        page_size: 1,
      });

      if (response.results.length === 0) {
        return {
          success: true,
          log: null,
        };
      }

      return {
        success: true,
        log: this._formatDailyLog(response.results[0]),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create daily log entry
   */
  async createDailyLog(properties) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databases.dailyLog },
        properties: this._formatDailyLogProperties(properties),
      });

      return {
        success: true,
        log: this._formatDailyLog(response),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Add an idea
   */
  async addIdea(properties) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databases.ideas },
        properties: this._formatIdeaProperties(properties),
      });

      return {
        success: true,
        idea: this._formatIdea(response),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * List active projects
   */
  async listProjects(status = 'Active') {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.projects,
        filter: {
          property: 'Status',
          select: {
            equals: status,
          },
        },
      });

      return {
        success: true,
        projects: response.results.map(this._formatProject),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // --- Formatters ---

  _formatTask(page) {
    const props = page.properties;
    return {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text || '',
      status: props.Status?.select?.name || '',
      priority: props.Priority?.select?.name || '',
      category: props.Category?.select?.name || '',
      due: props.Due?.date?.start || null,
      impactScore: props.ImpactScore?.number || 0,
      effort: props.Effort?.select?.name || '',
      nonDeferrable: props.NonDeferrable?.checkbox || false,
      whyItMatters: props.WhyItMatters?.rich_text?.[0]?.plain_text || '',
      nextBite: props.NextBite?.rich_text?.[0]?.plain_text || '',
      calendarEventId: props.calendar_event_id?.rich_text?.[0]?.plain_text || null,
    };
  }

  _formatTaskProperties(props) {
    const formatted = {};

    if (props.name) {
      formatted.Name = {
        title: [{ text: { content: props.name } }],
      };
    }

    if (props.status) {
      formatted.Status = {
        select: { name: props.status },
      };
    }

    if (props.priority) {
      formatted.Priority = {
        select: { name: props.priority },
      };
    }

    if (props.category) {
      formatted.Category = {
        select: { name: props.category },
      };
    }

    if (props.due) {
      formatted.Due = {
        date: { start: props.due },
      };
    }

    if (props.impactScore !== undefined) {
      formatted.ImpactScore = {
        number: props.impactScore,
      };
    }

    if (props.effort) {
      formatted.Effort = {
        select: { name: props.effort },
      };
    }

    if (props.nonDeferrable !== undefined) {
      formatted.NonDeferrable = {
        checkbox: props.nonDeferrable,
      };
    }

    if (props.whyItMatters) {
      formatted.WhyItMatters = {
        rich_text: [{ text: { content: props.whyItMatters } }],
      };
    }

    if (props.nextBite) {
      formatted.NextBite = {
        rich_text: [{ text: { content: props.nextBite } }],
      };
    }

    if (props.calendarEventId) {
      formatted.calendar_event_id = {
        rich_text: [{ text: { content: props.calendarEventId } }],
      };
    }

    return formatted;
  }

  _formatDailyLog(page) {
    const props = page.properties;
    return {
      id: page.id,
      date: props.Date?.date?.start || '',
      win1: props.Win_1?.rich_text?.[0]?.plain_text || '',
      win2: props.Win_2?.rich_text?.[0]?.plain_text || '',
      win3: props.Win_3?.rich_text?.[0]?.plain_text || '',
      minutesFocused: props.MinutesFocused?.number || 0,
      mood: props.Mood?.select?.name || '',
    };
  }

  _formatDailyLogProperties(props) {
    const formatted = {};

    if (props.date) {
      formatted.Date = {
        date: { start: props.date },
      };
    }

    if (props.win1) {
      formatted.Win_1 = {
        rich_text: [{ text: { content: props.win1 } }],
      };
    }

    if (props.minutesFocused !== undefined) {
      formatted.MinutesFocused = {
        number: props.minutesFocused,
      };
    }

    return formatted;
  }

  _formatIdea(page) {
    const props = page.properties;
    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || '',
      status: props.Status?.select?.name || '',
      priority: props.Priority?.select?.name || '',
    };
  }

  _formatIdeaProperties(props) {
    const formatted = {};

    if (props.title) {
      formatted.Title = {
        title: [{ text: { content: props.title } }],
      };
    }

    if (props.status) {
      formatted.Status = {
        select: { name: props.status },
      };
    }

    if (props.priority) {
      formatted.Priority = {
        select: { name: props.priority },
      };
    }

    return formatted;
  }

  _formatProject(page) {
    const props = page.properties;
    return {
      id: page.id,
      name: props.Name?.title?.[0]?.plain_text || '',
      status: props.Status?.select?.name || '',
      goal: props.Goal?.rich_text?.[0]?.plain_text || '',
    };
  }
}
