Below is the updated README file with the new configuration instructions:

---

# MCP Crypto Ticker Tool

## Overview

**MCP (Model Context Protocol)** is a framework that allows you to integrate custom tools into AI-assisted development environments—such as Cursor AI. MCP servers expose functionality (like data retrieval or code analysis) so that an LLM-based IDE can call these tools on demand. Learn more about MCP in the [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction).

This project demonstrates an MCP server that provides a crypto ticker tool. It uses the [Coinpaprika API Node.js client](https://github.com/coinpaprika-api-nodejs-client) to fetch real-time cryptocurrency data from [Coinpaprika API](https://api.coinpaprika.com/). Users pass the full coin name (e.g., "bitcoin") and the tool returns its current price in USD along with the 24-hour percentage change.

## Requirements

- **Node.js:** Version 20 or higher is required.

## Features

- **MCP Integration:** Exposes tool functionality to LLM-based IDEs.
- **Crypto Ticker Data:** Retrieves current ticker information for a given coin.
- **Input Validation:** Uses [Zod](https://github.com/colinhacks/zod) for schema validation.
- **Standard I/O Transport:** Connects via `StdioServerTransport` for integration with development environments.

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install Dependencies**

   You can install the project dependencies in one of two ways:

   **Option 1: Install using the existing `package.json`**

   Simply run:

   ```bash
   npm install
   ```

   **Option 2: Install dependencies manually**

   If you prefer, delete the existing `package.json` and install the required packages manually:

   ```bash
   npm install @modelcontextprotocol/sdk @coinpaprika/api-nodejs-client zod
   ```

   Then, update the newly generated `package.json` file to include the following line, which enables ES Modules:

   ```json
   "type": "module"
   ```

3. **Ensure Node.js Version 20+**

   Confirm your Node.js version by running:

   ```bash
   node -v
   ```

   Update Node.js if necessary.

## Integrating with Cursor AI

This project now includes a `.cursor` subdirectory that contains an `mcp.json` file for configuring the MCP server. Open the file and update the following fields:

- **command:** Replace this field with the absolute path to your Node.js executable. For example:

  ```
  /home/john/.nvm/versions/node/v20.13.1/bin/node
  ```

- **argument:** Replace this field with the absolute path to your MCP server JavaScript file. For example:

  ```
  /home/john/mcp-crypto-ticker/mcp-crypto-ticker.js
  ```

You can verify the absolute path to your Node.js executable by running `which node` in your terminal.

### Optional: Global Configuration

If you prefer, you can move the `mcp.json` file from the `.cursor` subdirectory to your global Cursor AI configuration directory located at `~/.cursor`. This allows Cursor AI to recognize your MCP server configuration globally.

## Using the MCP Tool in Cursor Composer (Agent Mode)

With the MCP server integrated into Cursor AI and with Agent mode enabled in Cursor Composer, simply use a natural language prompt like:

```
get the bitcoin price
```

The AI agent will infer the available `getTicker` tool from your MCP server and execute it to retrieve the current ticker data for Bitcoin.

## Code Overview

The project comprises the following key parts:

- **MCP Server Initialization:**  
  The MCP server is instantiated using `McpServer` from the MCP SDK and connected via `StdioServerTransport`.

- **Tool Definition:**  
  The `getTicker` tool is defined with a Zod schema that accepts a coin’s full name (defaulting to "bitcoin"). The tool fetches the list of coins from the Coinpaprika API to map the friendly coin name to the corresponding coin ID. It then calls `getAllTickers` with `quotes: ['USD']` to retrieve ticker data in USD, extracts the price and 24-hour change, and returns the information.

## What is MCP?

**Model Context Protocol (MCP)** provides a standardized approach to integrate custom tools into AI-assisted development environments. With MCP, you can define tools that perform specific tasks—such as retrieving external data, validating code, or enforcing coding standards—and the AI assistant in your IDE can call these tools automatically based on context. This helps improve developer productivity, ensures consistent quality, and streamlines workflows.

## Reference

[Use Your Own MCP on Cursor in 5 Minutes](https://dev.to/andyrewlee/use-your-own-mcp-on-cursor-in-5-minutes-1ag4)

## License

This project is licensed under the [MIT License](LICENSE).
