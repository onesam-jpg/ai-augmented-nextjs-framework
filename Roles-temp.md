Role and System Definition: "You are an Expert AI-Augmented Development Architect specializing in VS Code environments, Model Context Protocol (MCP) servers, and generative AI workflow optimization. Your expertise prioritizes performance, maintainability, and security. You are designing a foundational VS Code setup using the AI Toolkit for Visual Studio Code, GitHub Copilot, and best practices for agentic workflows."
Context and Goal: "My primary goal is to establish a modular, high-productivity framework in VS Code focused on autonomous development tasks, model evaluation, and integrating custom tools. The framework must utilize both cloud-based and local Large Language Models (LLMs) for cost control and privacy."
Constraints and Standards (System Prompts): "Adhere strictly to modern prompt engineering best practices:
1. Prioritize Modular Design: Use Dev Containers to ensure environment consistency and isolate dependencies.
2. Error Handling and Best Practices: Implement configurations that follow established performance tips (e.g., disabling automatic file restore, optimizing debugging, or disabling CodeLens if performance issues arise).
3. Agent Governance: Define specific project rules in a claude.md or copilot_instructions.md file to set guardrails for all code generation.
4. Tool Integration (MCP): The core agent functionality must leverage the Model Context Protocol (MCP) for secure interaction with external resources, referencing both the built-in AI Toolkit integration and optional external servers (like File System access or Git tools)."
Task Decomposition (Chain of Thought/CAD): "I require a comprehensive, prioritized plan segmented into four checkpoints. For each checkpoint, define the necessary configuration files and user actions:
Checkpoint 1: Core Tool Installation & Initialization
1. Identify the essential VS Code extensions needed (AI Toolkit, Copilot, Dev Containers, Local LLM options).
2. Detail the initial setup steps for installing the AI Toolkit and setting up a basic chat interaction.
Checkpoint 2: Environment Standardization & Performance
1. Generate the structure for a .devcontainer.json file to ensure a reproducible development environment, including necessary tools or runtime prerequisites (e.g., Python packages for tracing).
2. Outline critical VS Code performance settings to optimize memory usage, especially when working with large workloads or debugging (e.g., disabling CodeLens, optimizing symbol loading).
Checkpoint 3: Agentic Workflow & Governance Setup
1. Provide the exact content for a foundational governance file (claude.md or copilot_instructions.md) containing best practice rules for code generation, task decomposition, and tracking progress.
2. Provide the structure for a project_plan.md (or todo.md) file where the agent can store its detailed task execution breakdown, ensuring transparency.
Checkpoint 4: Advanced Agent Configuration (MCP/Background)
1. Detail the process and necessary file structures for configuring the environment setup steps for a background coding agent (e.g., copilot_setup_steps.yaml).
2. Specify how to integrate an exemplary MCP Server (e.g., a File System server) using a JSON configuration or programmatically, noting the security warning inherent in running MCP servers."

--------------------------------------------------------------------------------
2. VS Code Framework Components and File Contents
Based on the prompt and source research, the framework relies on several extensions and configuration files:
A. Essential VS Code Extensions (Checkpoint 1)
1. AI Toolkit for Visual Studio Code: A comprehensive extension for building, testing, and deploying intelligent applications using generative AI models. It provides an integrated development environment for the complete AI application lifecycle, including a Model Catalog (for models from OpenAI, Anthropic, Ollama, etc.), Playground, and Agent Builder.
    ◦ Installation: Install via the Visual Studio Marketplace or by searching for AI Toolkit for Visual Studio Code in the Extensions icon in the Activity Bar.
2. GitHub Copilot Extension: Provides AI pair programming capabilities, including inline code suggestions, chat, and access to the Coding Agent for asynchronous work.
    ◦ Agent Mode: Essential for autonomously planning and executing development tasks with specialized tools.
3. Dev Containers Extension: Allows you to use a Docker container as a full-featured development environment, ensuring all dependencies (SDKs, runtimes, tools) are consistent and isolated.
4. Local LLM Integration (Recommended Options):
    ◦ llama.vscode: Supports local LLM-assisted text completion, chat, and agentic coding, integrating with llama.cpp for efficient inference.
    ◦ llama-swap: A transparent proxy server for automatic model swapping between multiple LLMs used for coding assistance tasks.
B. Configuration File Contents (Checkpoint 2 & 3)
The following files are crucial for defining your environment, governance, and workflow tracking.
1. Governance and Instruction File ( or )
This file sets the System Prompt and Role-Based Prompting guardrails for your AI agents, ensuring they follow your preferred development style and practices.
Purpose
Recommended Content Structure (Synthesized from sources)
Citation
Preamble/Role
# System Instructions: Expert Software Developer<br>You are a Senior Architect specializing in [Specific Language/Framework, e.g., Next.js and TypeScript]. You prioritize readability, maintainability, and security.
Execution Rules
1. Think First (CoT): Before generating code, analyze requirements thoroughly, consider trade-offs, and break down the implementation into logical steps.<br>2. Plan Mode: First write a detailed plan of your actions to project_plan.md (or todo.md) and wait for verification before beginning work.<br>3. Simplicity: Make every task and code change as simple as possible, avoiding massive or complex changes.<br>4. Documentation: Include comprehensive comments explaining complex logic or non-obvious design decisions.
Output Standards
5. Security: Consider security implications of all code you generate.<br>6. Dependencies: Define specific dependencies and versions only within the Dev Container configuration (e.g., .devcontainer.json) or setup steps (copilot_setup_steps.yaml).
2. Project Plan / To-Do Tracking ( or )
This file facilitates Context-Aware Decomposition (CAD) and workflow management. It serves as a transparent log for the agent's work, similar to how the Claude Code agent breaks down complex tasks into a to-do list.
Structure
Description
Citation
High-Level Checkpoints
Major steps for the project (e.g., Checkpoint 1: Core Setup; Checkpoint 2: Authentication System).
Tasks List
A broken-down list of small tasks required to complete each checkpoint, which the AI checks off as it proceeds.
Review Section
A summary of changes made and any relevant information after each checkpoint completion.
3. Background Agent Setup ()
This YAML file is used to provide custom steps for setting up the environment specifically for the GitHub Copilot coding agent. This ensures consistency between your local machine environment and the agent’s asynchronous workspace.
| YAML Structure | Example Content (Based on source descriptions) | Purpose | Citation | | :--- | :--- | :--- | | name: | Copilot Setup Workflow | Naming the workflow. | | | on: [workflow_dispatch] | workflow_dispatch: | Triggers the workflow. | | | jobs: setup_environment: | runs-on: ubuntu-latest | Defines the operating environment (e.g., Linux/Windows/Mac). | | | steps: | - name: Checkout code <br> - uses: actions/checkout@v4 | Checks out the code repository. | | | | - name: Install .NET 9 SDK <br> ... (steps to install) | Installs necessary runtimes (e.g., .NET, specific Maui workload, or Python packages). | | | | - name: Install dependencies <br> ... (commands like npm install or bundle install) | Ensures all project dependencies are available for the agent. | |
4. Dev Container Configuration ()
This file defines the isolated development environment that encapsulates the OS, tools, and dependencies.
JSON Structure
Description
Citation
image
Specifies the base container image (e.g., a specific Linux/Docker image).
features
Defines additional tool installations (e.g., Post-Create Commands, or SDKs).
extensions
Lists VS Code extensions to install automatically inside the container (e.g., AI Toolkit, Copilot).
postCreateCommand
Commands run after the container is created (e.g., installing Ruby Gems for a Jekyll project, or Python environment setup for tracing).
C. MCP Tool Integration (Checkpoint 4)
The Model Context Protocol (MCP) is key for agent autonomy, allowing AI models to securely interact with local and remote resources like databases, file systems, and APIs.
You can integrate an MCP tool via a JSON configuration file. Although the sources do not provide a literal JSON configuration file content, they describe the purpose and configuration method.
Steps for MCP Integration:
1. Select a Server: Choose a production-ready or experimental MCP server relevant to your workflow, such as a File System server (for file access) or a GitHub server (for repository management).
2. Configuration Method: MCP tools are added through JSON configuration or programmatically via a VS Code extension.
3. Security Warning: Be aware that running MCP servers without proper sandboxing creates significant security risks, including full system access, arbitrary code execution, and data exposure. It is highly recommended to run servers in isolated environments (like Dev Containers/VMs) and limit permissions to the minimum required.
4. Integration: The AI Toolkit and other extensions like Continue and llama.vscode support MCP tools, enabling agents to leverage these external services.
3. Action Plan: Local Folder Creation
Since I cannot directly interact with your local file system, you must perform the action of creating the designated folder and populating it with the generated files.
Action Required by You:
1. Create the Folder: Inside your computer's Documents folder, manually create a new directory (e.g., Documents/VSCode_AI_Framework_Setup).
2. Populate the Folder: Within this new folder, create the configuration files detailed above, using the provided structures as a guide, and customizing the content for your specific programming language and project needs:
    ◦ copilot_instructions.md (or claude.md)
    ◦ project_plan.md (or todo.md)
    ◦ .devcontainer.json (inside a sub-folder named .devcontainer)
    ◦ copilot_setup_steps.yaml