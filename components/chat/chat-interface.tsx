"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/theme-context"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { logout } from "@/app/actions/auth"

// Icons
import SendIcon from "@mui/icons-material/Send"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import EmailIcon from "@mui/icons-material/Email"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import DeleteIcon from "@mui/icons-material/Delete"
import PersonIcon from "@mui/icons-material/Person"

interface User {
  id: string
  name: string
  email: string
}

interface ChatInterfaceProps {
  user: User
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-expand textarea as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [input])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    router.push("/")
    router.refresh()
  }

  const handleClearChat = () => {
    setClearDialogOpen(false)
    setMessages([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const shareViaGmail = (text: string) => {
    const subject = encodeURIComponent("Chat with AI")
    const body = encodeURIComponent(text)
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank")
  }

  const shareViaWhatsApp = (text: string) => {
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/?text=${encodedText}`, "_blank")
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: theme === "dark" ? "grey.900" : "grey.50",
      }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Chatbot
          </Typography>

          <IconButton color="inherit" onClick={toggleTheme}>
            {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={() => setClearDialogOpen(true)}>
            <DeleteIcon />
          </IconButton>

          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Typography variant="body2">{user.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((message) => (
          <Card
            key={message.id}
            sx={{
              maxWidth: "75%",
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              bgcolor:
                message.role === "user"
                  ? theme === "dark"
                    ? "primary.dark"
                    : "primary.light"
                  : theme === "dark"
                    ? "grey.800"
                    : "grey.100",
              color:
                message.role === "user"
                  ? theme === "dark"
                    ? "primary.contrastText"
                    : "primary.contrastText"
                  : theme === "dark"
                    ? "white"
                    : "text.primary",
              borderRadius: message.role === "user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
              animation: "fadeIn 0.3s ease-in-out",
              "@keyframes fadeIn": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(10px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <CardContent>
              <Typography variant="body1" component="div" sx={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </Typography>

              {message.role === "assistant" && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}>
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={() => copyToClipboard(message.content)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share via Gmail">
                    <IconButton size="small" onClick={() => shareViaGmail(message.content)}>
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Share via WhatsApp">
                    <IconButton size="small" onClick={() => shareViaWhatsApp(message.content)}>
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Paper
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: theme === "dark" ? "grey.800" : "background.paper",
        }}
        elevation={3}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (input.trim()) {
                handleSubmit(e as any)
              }
            }
          }}
          inputRef={inputRef}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !input.trim()}
          endIcon={<SendIcon />}
          sx={{ borderRadius: 4, px: 3 }}
        >
          Send
        </Button>
      </Paper>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Chat History</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all chat messages? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearChat} color="error" autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}