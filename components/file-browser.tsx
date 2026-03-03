"use client"

import { useState } from "react"
import {
  Grid3X3,
  List,
  Star,
  MoreHorizontal,
  ArrowUpDown,
  Copy,
  Scissors,
  Trash2,
  Pencil,
  Download,
  Info,
} from "lucide-react"
import type { FileItem, BreadcrumbItem } from "@/lib/file-data"
import { formatFileSize } from "@/lib/file-data"
import { FileIcon } from "@/components/file-icon"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ViewMode = "grid" | "list"
type SortKey = "name" | "modified" | "size" | "type"

interface FileBrowserProps {
  files: FileItem[]
  breadcrumbs: BreadcrumbItem[]
  onNavigate: (path: string, item: FileItem) => void
  onSelect: (item: FileItem) => void
  onBreadcrumbClick: (path: string) => void
  selectedId?: string
}

export function FileBrowser({
  files,
  breadcrumbs,
  onNavigate,
  onSelect,
  onBreadcrumbClick,
  selectedId,
}: FileBrowserProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...files].sort((a, b) => {
    // Folders first
    if (a.type === "folder" && b.type !== "folder") return -1
    if (a.type !== "folder" && b.type === "folder") return 1

    let cmp = 0
    switch (sortKey) {
      case "name":
        cmp = a.name.localeCompare(b.name)
        break
      case "modified":
        cmp = a.modified.localeCompare(b.modified)
        break
      case "size":
        cmp = (a.size ?? 0) - (b.size ?? 0)
        break
      case "type":
        cmp = a.type.localeCompare(b.type)
        break
    }
    return sortAsc ? cmp : -cmp
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      onNavigate(item.path, item)
    } else {
      onSelect(item)
    }
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") {
      onNavigate(item.path, item)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-muted-foreground">/</span>
              )}
              <button
                onClick={() => onBreadcrumbClick(crumb.path)}
                className={cn(
                  "rounded px-1.5 py-0.5 transition-colors hover:bg-accent",
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </nav>

        {/* View toggles */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 p-0",
              viewMode === "list" && "bg-accent"
            )}
            onClick={() => setViewMode("list")}
          >
            <List size={15} />
            <span className="sr-only">List view</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 p-0",
              viewMode === "grid" && "bg-accent"
            )}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 size={15} />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
      </div>

      {/* File list */}
      <ScrollArea className="flex-1">
        {viewMode === "list" ? (
          <div className="min-w-0">
            {/* List header */}
            <div className="flex items-center gap-4 border-b border-border px-4 py-2 text-xs text-muted-foreground">
              <button
                onClick={() => handleSort("name")}
                className="flex flex-1 items-center gap-1 hover:text-foreground transition-colors"
              >
                Name
                {sortKey === "name" && <ArrowUpDown size={12} />}
              </button>
              <button
                onClick={() => handleSort("modified")}
                className="flex w-28 items-center gap-1 hover:text-foreground transition-colors"
              >
                Modified
                {sortKey === "modified" && <ArrowUpDown size={12} />}
              </button>
              <button
                onClick={() => handleSort("size")}
                className="flex w-20 items-center justify-end gap-1 hover:text-foreground transition-colors"
              >
                Size
                {sortKey === "size" && <ArrowUpDown size={12} />}
              </button>
              <div className="w-8" />
            </div>

            {/* List items */}
            {sorted.map((file) => (
              <FileListItem
                key={file.id}
                item={file}
                isSelected={selectedId === file.id}
                onClick={() => handleItemClick(file)}
                onDoubleClick={() => handleItemDoubleClick(file)}
              />
            ))}

            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-sm">This folder is empty</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {sorted.map((file) => (
                <FileGridItem
                  key={file.id}
                  item={file}
                  isSelected={selectedId === file.id}
                  onClick={() => handleItemClick(file)}
                  onDoubleClick={() => handleItemDoubleClick(file)}
                />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-sm">This folder is empty</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
        <span>{sorted.length} items</span>
        <span>
          {sorted.filter((f) => f.type !== "folder").reduce((acc, f) => acc + (f.size ?? 0), 0) > 0 &&
            formatFileSize(
              sorted.filter((f) => f.type !== "folder").reduce((acc, f) => acc + (f.size ?? 0), 0)
            )}
        </span>
      </div>
    </div>
  )
}

function FileContextMenuItems() {
  return (
    <>
      <ContextMenuItem>
        <Pencil size={14} className="mr-2" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem>
        <Copy size={14} className="mr-2" />
        Copy
      </ContextMenuItem>
      <ContextMenuItem>
        <Scissors size={14} className="mr-2" />
        Cut
      </ContextMenuItem>
      <ContextMenuItem>
        <Download size={14} className="mr-2" />
        Download
      </ContextMenuItem>
      <ContextMenuItem>
        <Info size={14} className="mr-2" />
        Properties
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive">
        <Trash2 size={14} className="mr-2" />
        Delete
      </ContextMenuItem>
    </>
  )
}

interface FileItemComponentProps {
  item: FileItem
  isSelected: boolean
  onClick: () => void
  onDoubleClick: () => void
}

function FileListItem({ item, isSelected, onClick, onDoubleClick }: FileItemComponentProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={cn(
            "flex w-full items-center gap-4 px-4 py-2 text-sm transition-colors hover:bg-accent/50",
            isSelected && "bg-accent"
          )}
        >
          <div className="flex flex-1 items-center gap-3 min-w-0">
            <FileIcon type={item.type} />
            <span className="truncate">{item.name}</span>
            {item.starred && (
              <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          <span className="w-28 text-left text-xs text-muted-foreground">
            {item.modified}
          </span>
          <span className="w-20 text-right text-xs text-muted-foreground">
            {item.size ? formatFileSize(item.size) : "--"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => { if (e.key === "Enter") e.stopPropagation() }}
                className="flex h-6 w-6 items-center justify-center rounded hover:bg-secondary"
              >
                <MoreHorizontal size={14} className="text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Pencil size={14} className="mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy size={14} className="mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Scissors size={14} className="mr-2" />
                Cut
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download size={14} className="mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <FileContextMenuItems />
      </ContextMenuContent>
    </ContextMenu>
  )
}

function FileGridItem({ item, isSelected, onClick, onDoubleClick }: FileItemComponentProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg p-3 transition-colors hover:bg-accent/50",
            isSelected && "bg-accent"
          )}
        >
          <FileIcon type={item.type} size={32} />
          <span className="w-full truncate text-center text-xs">{item.name}</span>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <FileContextMenuItems />
      </ContextMenuContent>
    </ContextMenu>
  )
}
