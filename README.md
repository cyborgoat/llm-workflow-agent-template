# LLM Agent Workflow Generator

A minimal agentic LLM web app built with Next.js 15 (App Router), featuring a chat interface and a visual workflow
editor for AI agent flows.

## Features

- Chat with an AI agent (mocked, easily extendable)
- Visual workflow builder (drag/drop, edit nodes/edges)
- Edit tool parameters in nodes
- Popup modal for workflow editing
- Theme/model switching and status indicators
- Mock data organized in `/mock/mockData.ts`
- Customizable favicon (now using `globe.svg`)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- @xyflow/react (React Flow)
- shadcn/ui (Radix UI components)
- Framer Motion (animation)
- Lucide React (icons)

## Project Structure

```
llm-workflow-agent-template/
├── app/
│   ├── layout.tsx         # Root layout with metadata and favicon
│   └── page.tsx           # Main chat/workflow interface
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── sidebar/           # Sidebar and settings components
│   ├── header/            # Header and status indicators
│   ├── chat/              # ChatArea, InputArea, etc.
│   └── ...                # Other UI components
├── mock/
│   └── mockData.ts        # Centralized mock data for chat/settings/topics
├── types.ts               # Shared TypeScript types
├── public/
│   ├── globe.svg          # Favicon (customizable)
│   └── ...                # Other static assets
```

## Getting Started

1. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2. **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customizing the Favicon

To change the favicon:

1. Replace `public/globe.svg` with your own SVG/PNG/ICO file, or add a new file (e.g., `favicon.ico`).
2. Update the `<link rel="icon" ... />` in `app/layout.tsx` to reference your desired icon.

## Notes

- This project is frontend-only. Connect your own backend/LLM as needed.
- UI primitives use shadcn/ui. To add more components:
  ```bash
  npx shadcn-ui@latest add button input dialog scroll-area label card separator
  ```
- Mock data is centralized in `/mock/mockData.ts` for easy development and testing.
- The project uses the Next.js App Router (app directory structure).

---
For advanced features or integration, extend as needed.