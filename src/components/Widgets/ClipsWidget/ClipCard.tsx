import { useState } from "react"
import { Calendar, Clock, ExternalLink, Link2, Copy } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface ClipProps {
  id: string
  sourceUrl: string
  createdAt: string
  text: string
  imageUrl?: string
}

// export default function ClipsCard() {
//   const [copied, setCopied] = useState(false)

//   // Sample clip data
// interface ClipProps {
//     id: string
//     sourceUrl: string
//     createdAt: string
//     text: string
//     imageUrl?: string
// }

export default function ClipsCard({ id, sourceUrl, createdAt, text, imageUrl }: ClipProps) {
    const [copied, setCopied] = useState(false)

    const clip = { id, sourceUrl, createdAt, text, imageUrl }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedDate = format(new Date(clip.createdAt), "MMM d, yyyy")
  const formattedTime = format(new Date(clip.createdAt), "h:mm a")

  return (
      <Card className="w-full overflow-hidden border border-border/40 bg-card shadow-sm transition-all hover:shadow-md">
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-2 font-mono text-xs">
              {clip.id.substring(0, 8)}...
            </Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
              <Clock className="ml-2 h-3 w-3" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-2">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-black">{clip.text}</h3>
            <Tooltip>
              <TooltipTrigger asChild className="text-white">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(clip.text)}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy text</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy text"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Link2 className="h-4 w-4" />
            <a
              href={clip.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-foreground hover:underline"
            >
              {clip.sourceUrl}
            </a>
          </div>

          {clip.imageUrl && (
            <div className="relative mt-3 overflow-hidden rounded-md border border-border/40">
              <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
                <img
                  src={clip.imageUrl || "/placeholder.svg"}
                  alt="Tailwind CSS grid-column documentation"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <Badge className="bg-primary/90 text-xs">Tailwind CSS Documentation</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t p-1">
            <div
                className="h-7 text-xs flex gap-0.5 items-center cursor-pointer px-2 py-1 transition-colors hover:bg-gray-100 rounded-sm"
                onClick={() => window.open(clip.sourceUrl, "_blank")}
            >
                <ExternalLink className="mr-1.5 h-3 w-3" />
                Visit Source
            </div>
        </CardFooter>
      </Card>
  )
}
