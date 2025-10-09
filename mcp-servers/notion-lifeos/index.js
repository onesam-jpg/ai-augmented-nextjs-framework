#!/usr/bin/env node

/**
 * Notion LifeOS MCP Server
 * Provides Notion database access tools for AI agents
 */

import dotenv from 'dotenv';
import { NotionClient } from './lib/notion-client.js';

dotenv.config({ path: '../../.env' });

// Initialize Notion client
const client = new NotionClient({
  auth: process.env.NOTION_API_KEY,
  databases: {
    tasks: process.env.NOTION_DATABASE_TASKS,
    projects: process.env.NOTION_DATABASE_PROJECTS,
    ideas: process.env.NOTION_DATABASE_IDEAS,
    dailyLog: process.env.NOTION_DATABASE_DAILY_LOG,
    content: process.env.NOTION_DATABASE_CONTENT,
    finance: process.env.NOTION_DATABASE_FINANCE,
    crm: process.env.NOTION_DATABASE_CRM,
    habits: process.env.NOTION_DATABASE_HABITS,
  },
});

console.error('Notion LifeOS MCP Server started');

// MCP Protocol: Read JSON-RPC requests from stdin
process.stdin.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  // Process complete JSON messages
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep incomplete line in buffer

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      console.log(JSON.stringify(response));
    } catch (error) {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error: ' + error.message,
        },
        id: null,
      }));
    }
  }
});

async function handleRequest(request) {
  const { jsonrpc, method, params, id } = request;

  try {
    let result;

    switch (method) {
      case 'tools/list':
        result = {
          tools: [
            {
              name: 'query_tasks',
              description: 'Query tasks from Notion with filters and sorting',
              inputSchema: {
                type: 'object',
                properties: {
                  filters: { type: 'object', description: 'Notion filter object' },
                  sorts: { type: 'array', description: 'Sort criteria' },
                  limit: { type: 'integer', default: 100 },
                },
              },
            },
            {
              name: 'create_task',
              description: 'Create a new task in Notion',
              inputSchema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Task name' },
                  status: { type: 'string', description: 'Task status' },
                  priority: { type: 'string', description: 'Priority level' },
                  category: { type: 'string', description: 'Task category' },
                  due: { type: 'string', description: 'Due date (ISO 8601)' },
                  impactScore: { type: 'integer', description: 'Impact score (0-10)' },
                  effort: { type: 'string', description: 'Effort estimate' },
                  nonDeferrable: { type: 'boolean', description: 'Is non-deferrable?' },
                  whyItMatters: { type: 'string', description: 'Motivation' },
                  nextBite: { type: 'string', description: 'First action' },
                },
                required: ['name'],
              },
            },
            {
              name: 'update_task',
              description: 'Update an existing task',
              inputSchema: {
                type: 'object',
                properties: {
                  pageId: { type: 'string', description: 'Notion page ID' },
                  properties: { type: 'object', description: 'Properties to update' },
                },
                required: ['pageId', 'properties'],
              },
            },
            {
              name: 'get_daily_log',
              description: 'Get daily log entry for a specific date',
              inputSchema: {
                type: 'object',
                properties: {
                  date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
                },
                required: ['date'],
              },
            },
            {
              name: 'create_daily_log',
              description: 'Create a daily log entry',
              inputSchema: {
                type: 'object',
                properties: {
                  date: { type: 'string', description: 'Date (YYYY-MM-DD)' },
                  win1: { type: 'string', description: 'First win' },
                  win2: { type: 'string', description: 'Second win' },
                  win3: { type: 'string', description: 'Third win' },
                  minutesFocused: { type: 'integer', description: 'Focus time in minutes' },
                },
                required: ['date'],
              },
            },
            {
              name: 'add_idea',
              description: 'Add a new idea to Ideas database',
              inputSchema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Idea title' },
                  status: { type: 'string', description: 'Idea status' },
                  priority: { type: 'string', description: 'Priority level' },
                },
                required: ['title'],
              },
            },
            {
              name: 'list_projects',
              description: 'List projects by status',
              inputSchema: {
                type: 'object',
                properties: {
                  status: { type: 'string', default: 'Active', description: 'Project status' },
                },
              },
            },
          ],
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;

        switch (name) {
          case 'query_tasks':
            result = await client.queryTasks(args);
            break;
          case 'create_task':
            result = await client.createTask(args);
            break;
          case 'update_task':
            result = await client.updateTask(args.pageId, args.properties);
            break;
          case 'get_daily_log':
            result = await client.getDailyLog(args.date);
            break;
          case 'create_daily_log':
            result = await client.createDailyLog(args);
            break;
          case 'add_idea':
            result = await client.addIdea(args);
            break;
          case 'list_projects':
            result = await client.listProjects(args.status);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        if (!result.success) {
          throw new Error(result.error);
        }
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return {
      jsonrpc,
      result,
      id,
    };
  } catch (error) {
    return {
      jsonrpc,
      error: {
        code: -32603,
        message: error.message,
      },
      id,
    };
  }
}
