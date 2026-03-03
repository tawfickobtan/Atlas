"use client"

import {
  Search,
  FolderPlus,
  FilePlus,
  Upload,
  RefreshCw,
  PanelRightClose,
  PanelRight,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TopBarProps {
  showAiSidebar: boolean
  onToggleAiSidebar: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TopBar({ showAiSidebar, onToggleAiSidebar, searchQuery, onSearchChange }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Compass size={14} className="text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-wide text-foreground">Atlas</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex flex-1 items-center justify-center px-8">
        <div
          className={cn(
            "flex w-full max-w-md items-center gap-2 rounded-lg border bg-input px-3 py-1.5 transition-colors",
            searchFocused ? "border-primary" : "border-border"
          )}
        >
          <Search size={14} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search files and folders..."
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
            /
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <FolderPlus size={15} />
          <span className="sr-only">New folder</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <FilePlus size={15} />
          <span className="sr-only">New file</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Upload size={15} />
          <span className="sr-only">Upload</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <RefreshCw size={15} />
          <span className="sr-only">Refresh</span>
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          variant={showAiSidebar ? "default" : "ghost"}
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs"
          onClick={onToggleAiSidebar}
        >
          {showAiSidebar ? <PanelRightClose size={15} /> : <PanelRight size={15} />}
          <span className="hidden sm:inline">AI</span>
        </Button>
      </div>
    </header>
  )
}
