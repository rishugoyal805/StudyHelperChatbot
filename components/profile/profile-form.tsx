"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import { updateProfile } from "@/app/actions/profile"

interface User {
  id: string
  name: string
  email: string
}

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validate passwords match if changing password
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      const result = await updateProfile({
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || undefined,
      })

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully" })
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile" })
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: "primary.main", fontSize: "2rem" }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Change Password (optional)
        </Typography>

        <TextField
          margin="normal"
          fullWidth
          name="currentPassword"
          label="Current Password"
          type="password"
          id="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="newPassword"
          label="New Password"
          type="password"
          id="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
          {isLoading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </Box>
    </Paper>
  )
}

