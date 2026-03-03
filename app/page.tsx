"use client"

import { useState, useCallback, useMemo } from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { FileTree } from "@/components/file-tree"
import { FileBrowser } from "@/components/file-browser"
import { AiSidebar } from "@/components/ai-sidebar"
import { TopBar } from "@/components/top-bar"
import { mockFileSystem } from "@/lib/file-data"
import type { FileItem, BreadcrumbItem } from "@/lib/file-data"
import {
  HardDrive,
  Star,
  Clock,
  Trash2,
  Cloud,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: HardDrive, label: "All Files", path: "/" },
  { icon: Star, label: "Starred", path: "/starred" },
  { icon: Clock, label: "Recent", path: "/recent" },
  { icon: Trash2, label: "Trash", path: "/trash" },
  { icon: Cloud, label: "Cloud", path: "/cloud" },
]

function findItemByPath(files: FileItem[], path: string): FileItem | null {
  for (const file of files) {
    if (file.path === path) return file
    if (file.children) {
      const found = findItemByPath(file.children, path)
      if (found) return found
    }
  }
  return null
}

function getFilesAtPath(files: FileItem[], path: string): FileItem[] {
  if (path === "/") return files
  const item = findItemByPath(files, path)
  return item?.children ?? []
}

function getBreadcrumbs(path: string): BreadcrumbItem[] {
  if (path === "/") return [{ name: "Root", path: "/" }]
  const parts = path.split("/").filter(Boolean)
  const crumbs: BreadcrumbItem[] = [{ name: "Root", path: "/" }]
  let currentPath = ""
  for (const part of parts) {
    currentPath += "/" + part
    crumbs.push({ name: part, path: currentPath })
  }
  return crumbs
}

function filterFiles(files: FileItem[], query: string): FileItem[] {
  if (!query) return files
  const lower = query.toLowerCase()
  return files.filter((file) => {
    if (file.name.toLowerCase().includes(lower)) return true
    if (file.children) {
      const filtered = filterFiles(file.children, query)
      return filtered.length > 0
    }
    return false
  })
}

export default function Page() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showAiSidebar, setShowAiSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNav, setActiveNav] = useState("/")

  const currentFiles = useMemo(
    () => getFilesAtPath(mockFileSystem, currentPath),
    [currentPath]
  )

  const filteredFiles = useMemo(
    () => filterFiles(currentFiles, searchQuery),
    [currentFiles, searchQuery]
  )

  const breadcrumbs = useMemo(
    () => getBreadcrumbs(currentPath),
    [currentPath]
  )

  const handleNavigate = useCallback((path: string, _item: FileItem) => {
    setCurrentPath(path)
    setSelectedFile(null)
  }, [])

  const handleSelect = useCallback((item: FileItem) => {
    setSelectedFile(item)
  }, [])

  const handleBreadcrumbClick = useCallback((path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        showAiSidebar={showAiSidebar}
        onToggleAiSidebar={() => setShowAiSidebar(!showAiSidebar)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left sidebar: Navigation + File tree */}
          <ResizablePanel defaultSize={18} minSize={14} maxSize={30}>
            <div className="flex h-full flex-col bg-sidebar">
              {/* Navigation links */}
              <div className="border-b border-sidebar-border p-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      setActiveNav(item.path)
                      if (item.path === "/") setCurrentPath("/")
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors hover:bg-sidebar-accent",
                      activeNav === item.path
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon size={15} className={activeNav === item.path ? "text-primary" : ""} />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* File tree */}
              <div className="flex-1 overflow-hidden">
                <div className="px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Explorer
                  </p>
                </div>
                <FileTree
                  files={mockFileSystem}
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                  onSelect={handleSelect}
                  selectedId={selectedFile?.id}
                />
              </div>

              {/* Storage indicator */}
              <div className="border-t border-sidebar-border p-3">
                <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Storage</span>
                  <span>24.8 GB / 50 GB</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-sidebar-accent">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "49.6%" }}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center: File browser */}
          <ResizablePanel defaultSize={showAiSidebar ? 52 : 82}>
            <FileBrowser
              files={filteredFiles}
              breadcrumbs={breadcrumbs}
              onNavigate={handleNavigate}
              onSelect={handleSelect}
              onBreadcrumbClick={handleBreadcrumbClick}
              selectedId={selectedFile?.id}
            />
          </ResizablePanel>

          {/* AI Sidebar */}
          {showAiSidebar && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={22} maxSize={45}>
                <AiSidebar />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
