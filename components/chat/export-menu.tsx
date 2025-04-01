"use client"

import type React from "react"

import { useState } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import DownloadIcon from "@mui/icons-material/Download"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import TextSnippetIcon from "@mui/icons-material/TextSnippet"
import CodeIcon from "@mui/icons-material/Code"
import { exportChatAsPDF, exportChatAsText, exportChatAsJSON } from "@/utils/export-chat"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ExportMenuProps {
  messages: Message[]
}

export default function ExportMenu({ messages }: ExportMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleExport = (format: "pdf" | "text" | "json") => {
    handleClose()

    if (messages.length === 0) return

    switch (format) {
      case "pdf":
        exportChatAsPDF(messages)
        break
      case "text":
        exportChatAsText(messages)
        break
      case "json":
        exportChatAsJSON(messages)
        break
    }

    // Log analytics
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "chat_export",
        data: { format, messageCount: messages.length },
      }),
    }).catch((err) => console.error("Failed to log analytics:", err))
  }

  return (
    <>
      <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleClick} disabled={messages.length === 0}>
        Export
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleExport("pdf")}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleExport("text")}>
          <ListItemIcon>
            <TextSnippetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Text</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleExport("json")}>
          <ListItemIcon>
            <CodeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as JSON</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

