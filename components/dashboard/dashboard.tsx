"use client"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { useTheme } from "@/context/theme-context"

interface User {
  id: string
  name: string
  email: string
}

interface DashboardProps {
  user: User
}

interface Stats {
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
  recentConversations: Array<{
    id: string
    title: string
    date: string
    messageCount: number
  }>
}

export default function Dashboard({ user }: DashboardProps) {
  const { theme } = useTheme()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: theme === "dark" ? "grey.900" : "grey.50",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Conversations" />
            <CardContent>
              <Typography variant="h3" align="center">
                {stats?.totalConversations || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Total conversations
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Messages" />
            <CardContent>
              <Typography variant="h3" align="center">
                {stats?.totalMessages || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Total messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Average" />
            <CardContent>
              <Typography variant="h3" align="center">
                {stats?.averageMessagesPerConversation.toFixed(1) || "0.0"}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Messages per conversation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Conversations
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {stats?.recentConversations && stats.recentConversations.length > 0 ? (
              <List>
                {stats.recentConversations.map((conversation) => (
                  <ListItem key={conversation.id} divider>
                    <ListItemText
                      primary={conversation.title}
                      secondary={`${conversation.date} • ${conversation.messageCount} messages`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No recent conversations
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

