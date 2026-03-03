"use client"

import { useState } from "react"
import { ChevronRight, Star } from "lucide-react"
import type { FileItem } from "@/lib/file-data"
import { FileIcon } from "@/components/file-icon"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileTreeProps {
  files: FileItem[]
  currentPath: string
  onNavigate: (path: string, item: FileItem) => void
  onSelect: (item: FileItem) => void
  selectedId?: string
}

export function FileTree({ files, currentPath, onNavigate, onSelect, selectedId }: FileTreeProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {files.map((file) => (
          <FileTreeNode
            key={file.id}
            item={file}
            depth={0}
            currentPath={currentPath}
            onNavigate={onNavigate}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

interface FileTreeNodeProps {
  item: FileItem
  depth: number
  currentPath: string
  onNavigate: (path: string, item: FileItem) => void
  onSelect: (item: FileItem) => void
  selectedId?: string
}

function FileTreeNode({ item, depth, currentPath, onNavigate, onSelect, selectedId }: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(
    currentPath.startsWith(item.path)
  )
  const isFolder = item.type === "folder"
  const isActive = currentPath === item.path
  const isSelected = selectedId === item.id

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded)
      onNavigate(item.path, item)
    } else {
      onSelect(item)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent",
          isActive && "bg-accent text-accent-foreground",
          isSelected && !isActive && "bg-accent/50",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder && (
          <ChevronRight
            size={14}
            className={cn(
              "shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-90"
            )}
          />
        )}
        {!isFolder && <span className="w-3.5" />}
        <FileIcon type={item.type} size={16} />
        <span className="truncate text-left flex-1">{item.name}</span>
        {item.starred && (
          <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
        )}
      </button>
      {isFolder && expanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
              onNavigate={onNavigate}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
