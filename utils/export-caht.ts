import { jsPDF } from "jspdf"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function exportChatAsPDF(messages: Message[], title = "Chat Export") {
  // Create a new PDF document
  const doc = new jsPDF()

  // Set title
  doc.setFontSize(20)
  doc.text(title, 20, 20)
  doc.setFontSize(12)

  // Add date
  const date = new Date().toLocaleString()
  doc.text(`Generated: ${date}`, 20, 30)

  // Add messages
  let y = 40
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  const lineHeight = 7

  messages.forEach((message, index) => {
    // Add role header
    const roleText = message.role === "user" ? "You:" : "AI:"
    doc.setFont(undefined, "bold")

    // Check if we need a new page
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    doc.text(roleText, margin, y)
    y += lineHeight
    doc.setFont(undefined, "normal")

    // Split message content into lines to fit page width
    const contentLines = doc.splitTextToSize(message.content, doc.internal.pageSize.width - 2 * margin)

    // Check if we need a new page for the content
    if (y + contentLines.length * lineHeight > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    // Add content
    doc.text(contentLines, margin, y)
    y += contentLines.length * lineHeight + 5

    // Add separator between messages
    if (index < messages.length - 1) {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.setDrawColor(200)
      doc.line(margin, y - 2, doc.internal.pageSize.width - margin, y - 2)
      y += 5
    }
  })

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`)
}

export function exportChatAsText(messages: Message[]) {
  const text = messages.map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`).join("\n\n")

  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()

  URL.revokeObjectURL(url)
}

export function exportChatAsJSON(messages: Message[]) {
  const data = {
    exportDate: new Date().toISOString(),
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()

  URL.revokeObjectURL(url)
}

