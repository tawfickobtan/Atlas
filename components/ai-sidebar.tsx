"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Sparkles,
  FolderPlus,
  Trash2,
  FilePlus,
  Search,
  FileUp,
  ArrowDown,
  Bot,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  { icon: FolderPlus, label: "New folder", prompt: "Create a new folder called " },
  { icon: FilePlus, label: "New file", prompt: "Create a new file called " },
  { icon: Search, label: "Find files", prompt: "Find all files that " },
  { icon: FileUp, label: "Move files", prompt: "Move all files from " },
  { icon: Trash2, label: "Clean up", prompt: "Find and remove duplicate files in " },
]

const suggestedPrompts = [
  "Organize my Downloads folder by file type",
  "Find all files larger than 100MB",
  "Rename all photos to include their date",
  "Find duplicate files across all folders",
]

export function AiSidebar() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsThinking(true)

    // Simulated response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getSimulatedResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsThinking(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Sparkles size={14} className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-sidebar-foreground">AI Agent</h2>
          <p className="text-xs text-muted-foreground">File operations assistant</p>
        </div>
      </div>

      {/* Messages / Empty state */}
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 px-4 py-6">
            <div className="mb-6">
              <h3 className="mb-1 text-sm font-medium text-sidebar-foreground">
                What can I help with?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I can create, move, rename, delete, and organize your files using natural language.
              </p>
            </div>

            {/* Quick actions */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center gap-1.5 rounded-md border border-sidebar-border bg-sidebar-accent/50 px-2.5 py-1.5 text-xs text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                  >
                    <action.icon size={13} className="text-primary" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested prompts */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Try asking
              </p>
              <div className="flex flex-col gap-1.5">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="rounded-md border border-sidebar-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div ref={scrollRef} className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2.5",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    message.role === "user"
                      ? "bg-secondary"
                      : "bg-primary"
                  )}
                >
                  {message.role === "user" ? (
                    <User size={13} className="text-secondary-foreground" />
                  ) : (
                    <Bot size={13} className="text-primary-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary">
                  <Bot size={13} className="text-primary-foreground" />
                </div>
                <div className="rounded-lg bg-sidebar-accent px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* Input area */}
      <div className="border-t border-sidebar-border p-3">
        {messages.length > 3 && (
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
              }
            }}
            className="mb-2 flex w-full items-center justify-center gap-1 rounded-md py-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <ArrowDown size={12} />
            Scroll to bottom
          </button>
        )}
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI to manage your files..."
              rows={1}
              className="w-full resize-none rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2.5 text-xs text-sidebar-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ minHeight: "38px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = Math.min(target.scrollHeight, 120) + "px"
              }}
            />
          </div>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="h-[38px] w-[38px] shrink-0 p-0"
          >
            <Send size={14} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          AI agent can make mistakes. Review file operations before confirming.
        </p>
      </div>
    </div>
  )
}

function getSimulatedResponse(userInput: string): string {
  const lower = userInput.toLowerCase()
  if (lower.includes("organize")) {
    return "I can help organize those files. I would sort them into folders by type: Documents, Images, Videos, Archives, and Code. Shall I proceed with this organization?"
  }
  if (lower.includes("find") || lower.includes("search")) {
    return "I found 3 matching files:\n\n1. dataset.tar.gz (849 MB) in /Downloads\n2. recording-01.mp4 (119 MB) in /Media/Videos\n3. demo.webm (42.9 MB) in /Media/Videos\n\nWould you like me to do anything with these files?"
  }
  if (lower.includes("rename")) {
    return "I can rename those files. I'll add the modification date as a prefix in YYYY-MM-DD format. This will affect 4 files in /Media/Photos. Should I go ahead?"
  }
  if (lower.includes("duplicate")) {
    return "Scanning for duplicates... I didn't find any exact duplicates, but I found 2 files with very similar names that might be related:\n\n- vacation-01.jpg and vacation-02.jpg\n\nWould you like me to compare them?"
  }
  if (lower.includes("create") || lower.includes("new")) {
    return "I'll create that for you. Where would you like me to place it? You can specify a path or I'll create it in the current directory."
  }
  if (lower.includes("delete") || lower.includes("remove")) {
    return "I found the files you want to remove. Before I delete anything, let me confirm: this action cannot be undone. Are you sure you want to proceed?"
  }
  if (lower.includes("move")) {
    return "I can move those files for you. Please confirm the destination folder, and I'll take care of it. Would you also like me to create the destination folder if it doesn't exist?"
  }
  return "I understand you want to work with your files. Could you give me more details about what operation you'd like to perform? I can create, move, rename, delete, search, and organize files."
}
