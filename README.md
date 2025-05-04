# LLM Agent Workflow Generator

A minimal Next.js-based web app for visually building and editing AI agent workflows. Features a chat interface and a node-based workflow editor.

## Features
- Chat with an AI agent
- Visual workflow builder (drag/drop, edit nodes/edges)
- Edit tool parameters in nodes
- Popup modal for workflow editing

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
llm-agent/
├── app/
│   └── page.tsx           # Main chat interface
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── ToolNode.tsx       # Custom node for React Flow
│   ├── WorkflowEditor.tsx # React Flow canvas
│   └── WorkflowPopup.tsx  # Modal dialog with editor
├── types/
│   └── index.ts           # TypeScript types
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

## Notes
- This project is frontend-only. Connect your own backend/LLM as needed.
- UI primitives use shadcn/ui. If needed, add more with:
  ```bash
  npx shadcn-ui@latest add button input dialog scroll-area label card separator
  ```

---
Cleaned and simplified. For advanced features or integration, extend as needed.