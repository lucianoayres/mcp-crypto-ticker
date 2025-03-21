// @ts-nocheck
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import CoinpaprikaAPI from "@coinpaprika/api-nodejs-client"

const server = new McpServer({
  name: "MCP Crypto Ticker Tool",
  version: "1.0.0",
})

const client = new CoinpaprikaAPI()

server.tool(
  "getTicker",
  "Get the ticker for a given coin by its full name (e.g. 'bitcoin')",
  {
    // User always passes the full coin name, defaulting to "bitcoin"
    coin: z.string().describe("The full name of the coin").default("bitcoin"),
  },
  async ({ coin }) => {
    try {
      // Step 1: Fetch the list of coins.
      const coins = await client.getCoins()
      const coinLower = coin.toLowerCase()

      // Only check against the full coin name
      const matched = coins.find((c) => c.name.toLowerCase() === coinLower)

      if (!matched) {
        return {
          content: [
            {
              type: "text",
              text: `Coin "${coin}" not found.`,
            },
          ],
        }
      }

      // Step 2: Fetch ticker data using getAllTickers with USD as the quote currency.
      const tickers = await client.getAllTickers({
        coinId: matched.id,
        quotes: ["USD"], // Always use USD
      })

      // Determine if tickers is an array; if so, take the first element.
      const ticker = Array.isArray(tickers) ? tickers[0] : tickers

      if (!ticker || !ticker.quotes?.USD) {
        return {
          content: [
            {
              type: "text",
              text: `No ticker data returned for coin "${coin}" (${matched.id}).`,
            },
          ],
        }
      }

      const price = ticker.quotes.USD.price
      const change = ticker.quotes.USD.percent_change_24h

      const output = `Ticker for ${ticker.name} (${ticker.symbol}):
Price: $${price}
24h Change: ${change}%`

      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching ticker: ${error.message}`,
          },
        ],
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
