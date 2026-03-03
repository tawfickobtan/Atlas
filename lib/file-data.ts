export type FileType = "folder" | "document" | "image" | "video" | "audio" | "code" | "archive" | "spreadsheet" | "presentation" | "pdf" | "unknown"

export interface FileItem {
  id: string
  name: string
  type: FileType
  size?: number
  modified: string
  path: string
  children?: FileItem[]
  extension?: string
  starred?: boolean
}

export interface BreadcrumbItem {
  name: string
  path: string
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function getFileType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase()
  if (!ext) return "folder"
  const typeMap: Record<string, FileType> = {
    // Documents
    doc: "document", docx: "document", txt: "document", rtf: "document", md: "document",
    // Images
    png: "image", jpg: "image", jpeg: "image", gif: "image", svg: "image", webp: "image", bmp: "image",
    // Videos
    mp4: "video", mov: "video", avi: "video", mkv: "video", webm: "video",
    // Audio
    mp3: "audio", wav: "audio", flac: "audio", aac: "audio", ogg: "audio",
    // Code
    js: "code", ts: "code", tsx: "code", jsx: "code", py: "code", rb: "code", go: "code",
    rs: "code", html: "code", css: "code", json: "code", yaml: "code", yml: "code",
    sh: "code", sql: "code", xml: "code",
    // Archives
    zip: "archive", rar: "archive", tar: "archive", gz: "archive", "7z": "archive",
    // Spreadsheets
    xls: "spreadsheet", xlsx: "spreadsheet", csv: "spreadsheet",
    // Presentations
    ppt: "presentation", pptx: "presentation",
    // PDF
    pdf: "pdf",
  }
  return typeMap[ext] || "unknown"
}

// Mock file system data
export const mockFileSystem: FileItem[] = [
  {
    id: "1",
    name: "Projects",
    type: "folder",
    modified: "2026-02-20",
    path: "/Projects",
    children: [
      {
        id: "1-1",
        name: "web-app",
        type: "folder",
        modified: "2026-02-20",
        path: "/Projects/web-app",
        children: [
          { id: "1-1-1", name: "package.json", type: "code", size: 1240, modified: "2026-02-19", path: "/Projects/web-app/package.json", extension: "json" },
          { id: "1-1-2", name: "tsconfig.json", type: "code", size: 520, modified: "2026-02-18", path: "/Projects/web-app/tsconfig.json", extension: "json" },
          { id: "1-1-3", name: "index.tsx", type: "code", size: 3400, modified: "2026-02-20", path: "/Projects/web-app/index.tsx", extension: "tsx" },
          { id: "1-1-4", name: "styles.css", type: "code", size: 8900, modified: "2026-02-17", path: "/Projects/web-app/styles.css", extension: "css" },
          { id: "1-1-5", name: "README.md", type: "document", size: 2300, modified: "2026-02-15", path: "/Projects/web-app/README.md", extension: "md", starred: true },
        ],
      },
      {
        id: "1-2",
        name: "ml-pipeline",
        type: "folder",
        modified: "2026-02-18",
        path: "/Projects/ml-pipeline",
        children: [
          { id: "1-2-1", name: "train.py", type: "code", size: 12400, modified: "2026-02-18", path: "/Projects/ml-pipeline/train.py", extension: "py" },
          { id: "1-2-2", name: "model.py", type: "code", size: 8700, modified: "2026-02-17", path: "/Projects/ml-pipeline/model.py", extension: "py" },
          { id: "1-2-3", name: "requirements.txt", type: "document", size: 340, modified: "2026-02-10", path: "/Projects/ml-pipeline/requirements.txt", extension: "txt" },
          { id: "1-2-4", name: "data.csv", type: "spreadsheet", size: 2450000, modified: "2026-02-16", path: "/Projects/ml-pipeline/data.csv", extension: "csv" },
        ],
      },
      {
        id: "1-3",
        name: "mobile-app",
        type: "folder",
        modified: "2026-02-14",
        path: "/Projects/mobile-app",
        children: [
          { id: "1-3-1", name: "App.tsx", type: "code", size: 5600, modified: "2026-02-14", path: "/Projects/mobile-app/App.tsx", extension: "tsx" },
          { id: "1-3-2", name: "app.json", type: "code", size: 890, modified: "2026-02-12", path: "/Projects/mobile-app/app.json", extension: "json" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Documents",
    type: "folder",
    modified: "2026-02-19",
    path: "/Documents",
    children: [
      { id: "2-1", name: "Annual Report 2025.pdf", type: "pdf", size: 4500000, modified: "2026-01-15", path: "/Documents/Annual Report 2025.pdf", extension: "pdf", starred: true },
      { id: "2-2", name: "Meeting Notes.md", type: "document", size: 12000, modified: "2026-02-19", path: "/Documents/Meeting Notes.md", extension: "md" },
      { id: "2-3", name: "Budget.xlsx", type: "spreadsheet", size: 89000, modified: "2026-02-10", path: "/Documents/Budget.xlsx", extension: "xlsx" },
      { id: "2-4", name: "Presentation.pptx", type: "presentation", size: 3200000, modified: "2026-02-08", path: "/Documents/Presentation.pptx", extension: "pptx" },
      { id: "2-5", name: "Contract Draft.docx", type: "document", size: 45000, modified: "2026-02-05", path: "/Documents/Contract Draft.docx", extension: "docx" },
    ],
  },
  {
    id: "3",
    name: "Media",
    type: "folder",
    modified: "2026-02-17",
    path: "/Media",
    children: [
      {
        id: "3-1",
        name: "Photos",
        type: "folder",
        modified: "2026-02-17",
        path: "/Media/Photos",
        children: [
          { id: "3-1-1", name: "vacation-01.jpg", type: "image", size: 3200000, modified: "2026-02-17", path: "/Media/Photos/vacation-01.jpg", extension: "jpg" },
          { id: "3-1-2", name: "vacation-02.jpg", type: "image", size: 2800000, modified: "2026-02-17", path: "/Media/Photos/vacation-02.jpg", extension: "jpg" },
          { id: "3-1-3", name: "profile.png", type: "image", size: 540000, modified: "2026-01-20", path: "/Media/Photos/profile.png", extension: "png" },
          { id: "3-1-4", name: "screenshot.webp", type: "image", size: 180000, modified: "2026-02-15", path: "/Media/Photos/screenshot.webp", extension: "webp" },
        ],
      },
      {
        id: "3-2",
        name: "Videos",
        type: "folder",
        modified: "2026-02-12",
        path: "/Media/Videos",
        children: [
          { id: "3-2-1", name: "recording-01.mp4", type: "video", size: 125000000, modified: "2026-02-12", path: "/Media/Videos/recording-01.mp4", extension: "mp4" },
          { id: "3-2-2", name: "demo.webm", type: "video", size: 45000000, modified: "2026-02-08", path: "/Media/Videos/demo.webm", extension: "webm" },
        ],
      },
      {
        id: "3-3",
        name: "Music",
        type: "folder",
        modified: "2026-01-30",
        path: "/Media/Music",
        children: [
          { id: "3-3-1", name: "track-01.mp3", type: "audio", size: 5400000, modified: "2026-01-30", path: "/Media/Music/track-01.mp3", extension: "mp3" },
          { id: "3-3-2", name: "podcast.mp3", type: "audio", size: 34000000, modified: "2026-01-28", path: "/Media/Music/podcast.mp3", extension: "mp3" },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Downloads",
    type: "folder",
    modified: "2026-02-21",
    path: "/Downloads",
    children: [
      { id: "4-1", name: "installer.dmg", type: "archive", size: 230000000, modified: "2026-02-21", path: "/Downloads/installer.dmg", extension: "dmg" },
      { id: "4-2", name: "source-code.zip", type: "archive", size: 12000000, modified: "2026-02-20", path: "/Downloads/source-code.zip", extension: "zip" },
      { id: "4-3", name: "dataset.tar.gz", type: "archive", size: 890000000, modified: "2026-02-18", path: "/Downloads/dataset.tar.gz", extension: "gz" },
      { id: "4-4", name: "resume-template.pdf", type: "pdf", size: 240000, modified: "2026-02-15", path: "/Downloads/resume-template.pdf", extension: "pdf" },
    ],
  },
  {
    id: "5",
    name: "notes.md",
    type: "document",
    size: 4500,
    modified: "2026-02-21",
    path: "/notes.md",
    extension: "md",
    starred: true,
  },
  {
    id: "6",
    name: "todo.txt",
    type: "document",
    size: 1200,
    modified: "2026-02-20",
    path: "/todo.txt",
    extension: "txt",
  },
]
