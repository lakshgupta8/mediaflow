# MediaFlow

A fully responsive, highly dynamic, and visually stunning movie web application. This project was built to explore "vibe coding"—leveraging AI agents, modern web frameworks, and advanced tools to rapidly prototype and build a production-ready application.

## 🛠️ Tech Stack & Frameworks

- **[Next.js](https://nextjs.org/) (App Router)**: Core React framework for routing, server-side rendering, and layout persistence.
- **[React](https://react.dev/)**: JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework used for the dark cyberpunk aesthetic, neon accents, and responsive design.
- **[Framer Motion](https://www.framer.com/motion/)**: Animation library used for smooth page transitions, interactive hover states, and dynamic component layouts (e.g., the active route pill in the sidebar).
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language that builds on JavaScript.
- **[Lucide React](https://lucide.dev/)**: Beautiful and consistent iconography.

## 🤖 AI Models & Assistants

- **Antigravity (Gemini)**: The primary agentic AI coding assistant used to architect the application, write code, refactor components, and dynamically update the UI based on user requests.

## 🔌 MCP (Model Context Protocol) Servers

This project heavily utilized Model Context Protocol (MCP) servers to extend the AI's capabilities and pull in external resources:

- **[StitchMCP]**: Sent natural language prompts to generate complete, professional HTML/Tailwind structural designs. Used specifically to generate the initial `Home`, `Settings` (Pro account layout), `Login`, and `Signup` page variations.
- **[Context7]**: Available for querying up-to-date documentation and code examples for specific libraries (e.g., fetching Next.js App Router & Framer Motion implementation patterns).

## 🚀 Getting Started

First, install the dependencies using your preferred package manager (e.g., `npm`, `pnpm`, `yarn`, or `bun`):

```bash
npm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
