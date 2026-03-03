"use client"

import {
  Folder,
  FileText,
  Image,
  Video,
  Music,
  FileCode,
  Archive,
  Sheet,
  Presentation,
  FileType2,
  File,
} from "lucide-react"
import type { FileType } from "@/lib/file-data"
import { cn } from "@/lib/utils"

const iconMap: Record<FileType, { icon: React.ElementType; className: string }> = {
  folder: { icon: Folder, className: "text-primary" },
  document: { icon: FileText, className: "text-blue-400" },
  image: { icon: Image, className: "text-emerald-400" },
  video: { icon: Video, className: "text-rose-400" },
  audio: { icon: Music, className: "text-amber-400" },
  code: { icon: FileCode, className: "text-cyan-400" },
  archive: { icon: Archive, className: "text-orange-400" },
  spreadsheet: { icon: Sheet, className: "text-green-400" },
  presentation: { icon: Presentation, className: "text-rose-300" },
  pdf: { icon: FileType2, className: "text-red-400" },
  unknown: { icon: File, className: "text-muted-foreground" },
}

interface FileIconProps {
  type: FileType
  className?: string
  size?: number
}

export function FileIcon({ type, className, size = 18 }: FileIconProps) {
  const { icon: Icon, className: colorClass } = iconMap[type] || iconMap.unknown
  return <Icon size={size} className={cn(colorClass, className)} />
}
