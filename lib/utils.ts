import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// utils/export-chat.ts
export function exportChatAsPDF(messages) {
  // Implementation using a PDF library like jsPDF
}

export function exportChatAsText(messages) {
  const text = messages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n\n');
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
}