"use client"

import type React from "react"

import { useState, useEffect } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import { useTheme } from "@/context/theme-context"

interface Conversation {
  id: string
  title: string
  createdAt: string
  preview: string
}

interface ChatHistoryProps {
  userId: string
  onSelectConversation: (conversationId: string) => void
}

export default function ChatHistory({ userId, onSelectConversation }: ChatHistoryProps) {
  const { theme } = useTheme()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/conversations")
        const data = await response.json()
        setConversations(data.conversations)
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [userId])

  const handleDeleteClick = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedConversation(conversationId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedConversation) return

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setConversations(conversations.filter((conv) => conv.id !== selectedConversation))
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error)
    }

    setDeleteDialogOpen(false)
    setSelectedConversation(null)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (conversations.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">No previous conversations</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme === "dark" ? "grey.800" : "background.paper",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Previous Conversations
      </Typography>
      <Divider />
      <List sx={{ maxHeight: "400px", overflow: "auto" }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            disablePadding
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(conversation.id, e)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => onSelectConversation(conversation.id)}>
              <ListItemText
                primary={conversation.title || "Untitled Conversation"}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">
                      {new Date(conversation.createdAt).toLocaleString()}
                    </Typography>
                    <Typography component="p" variant="body2" color="text.secondary" noWrap>
                      {conversation.preview}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

