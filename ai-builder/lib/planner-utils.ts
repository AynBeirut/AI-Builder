// Utility functions for planner-agent orchestration
export interface TodoItem {
  id: number
  task: string
  status: 'pending' | 'in-progress' | 'done'
  prompt: string
  result?: string
}

export interface ProjectBrief {
  projectId: string
  projectName: string
  initialPrompt: string
  questions: Array<{ question: string; answer: string }>
  summary: string
  createdAt: string
}

export function generateMarkdownBrief(brief: ProjectBrief): string {
  return `# Project Brief: ${brief.projectName}

**Project ID:** ${brief.projectId}
**Created:** ${brief.createdAt}

## Initial Requirements
${brief.initialPrompt}

## Discovery Q&A

${brief.questions.map((q, i) => `### Question ${i + 1}
**Q:** ${q.question}
**A:** ${q.answer}
`).join('\n')}

## Summary
${brief.summary}
`
}

export function generateTodoList(projectName: string, brief: string): TodoItem[] {
  // Extract key requirements and create todo items with SHORT prompts
  const briefContext = brief.substring(0, 400) // Max 400 chars of context
  
  const todos: TodoItem[] = [
    {
      id: 1,
      task: 'Create HTML structure',
      status: 'pending',
      prompt: `Create complete HTML5 structure for "${projectName}". Context: ${briefContext}. Output ONLY complete HTML with embedded CSS wrapped in \`\`\`html tags.`
    },
    {
      id: 2,
      task: 'Add content sections',
      status: 'pending',
      prompt: `Add all content sections (hero, features, about, contact) based on requirements. Update previous HTML. Output complete HTML in \`\`\`html tags.`
    },
    {
      id: 3,
      task: 'Polish and finalize',
      status: 'pending',
      prompt: `Add final polish: animations, smooth scrolling, mobile responsiveness, professional styling. Output final complete HTML in \`\`\`html tags.`
    }
  ]
  
  return todos
}

export function generateTodoMarkdown(todos: TodoItem[]): string {
  return `# Build Todo List

${todos.map(todo => `## ${todo.status === 'done' ? '✅' : todo.status === 'in-progress' ? '🔄' : '⏳'} Task ${todo.id}: ${todo.task}

**Status:** ${todo.status}
${todo.result ? `**Result:** ${todo.result}\n` : ''}
`).join('\n')}

---
**Progress:** ${todos.filter(t => t.status === 'done').length}/${todos.length} completed
`
}
