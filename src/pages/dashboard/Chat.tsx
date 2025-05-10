import { useEffect, useState, useRef } from "react";
import {
  createChatGroup,
  sendSimpleChat,
  getChatGroupHistory,
  getLastChatGroupId,
} from "@/utils/chat";

const PAGE_SIZE = 20;
const LAST_CHAT_GROUP_KEY = "lastChatGroupId";

type ChatMessage = {
  content: string;
  role: "user" | "assistant";
  streaming?: boolean;
};

const getDirection = (text: string) => {
  // check if text has more than 50% of rtl characters
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const rtlCount = (text.match(rtlChars) || []).length;
  const ltrCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
  return rtlCount > ltrCount ? "rtl" : "ltr";
};

const Chat = () => {
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load last used chat group or create a new one
  useEffect(() => {
    const loadLastChatGroupId = async () => {
      const lastId = localStorage.getItem(LAST_CHAT_GROUP_KEY);
      if (!lastId) {
        const newId = await getLastChatGroupId();
        localStorage.setItem(LAST_CHAT_GROUP_KEY, newId);
        return newId;
      }
      return lastId;
    };
    loadLastChatGroupId().then((id) => {
      setChatGroupId(id);
    });
  }, []);

  // Fetch chat history when chatGroupId changes
  useEffect(() => {
    if (!chatGroupId) return;
    setHistoryLoading(true);
    getChatGroupHistory({ chatGroupId, page: 1, limit: PAGE_SIZE })
      .then((history) => setChatHistory(history.reverse()))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to fetch chat history"
        )
      )
      .finally(() => {
        setHistoryLoading(false);
        setTimeout(() => {
          if (responseRef.current) {
            responseRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
  }, [chatGroupId]);

  // Extract send logic so it can be called from both handleSend and Shift+Enter
  const doSend = async () => {
    if (!userInput.trim() || !chatGroupId || loading) return;
    setError("");
    setLoading(true);
    let responseHtml = "";
    setChatHistory((prev) => [
      ...prev,
      { content: userInput, role: "user" },
      { content: "", role: "assistant", streaming: true },
    ]);
    try {
      const stream = await sendSimpleChat({ userInput, context, chatGroupId });
      if (stream && typeof stream.getReader === "function") {
        const reader = stream.getReader();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = new TextDecoder().decode(value);
            responseHtml += chunk;
            setChatHistory((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: responseHtml,
                role: "assistant",
                streaming: true,
              };
              return updated;
            });
          }
        }
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            streaming: false,
          };
          return updated;
        });
      } else if (typeof stream === "string") {
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: stream,
            role: "assistant",
            streaming: false,
          };
          return updated;
        });
      }
      setUserInput("");
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send chat");
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSend();
  };

  // Create a new chat group and clear history
  const handleNewChat = async () => {
    setError("");
    setHistoryLoading(true);
    setChatHistory([]);
    setUserInput("");
    setContext("");
    try {
      const newId = await createChatGroup();
      setChatGroupId(newId);
      localStorage.setItem(LAST_CHAT_GROUP_KEY, newId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create chat group"
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // Save chatGroupId to localStorage when it changes
  useEffect(() => {
    if (chatGroupId) {
      localStorage.setItem(LAST_CHAT_GROUP_KEY, chatGroupId);
    }
  }, [chatGroupId]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  // Handle Shift+Enter to submit
  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!loading && !historyLoading && chatGroupId && userInput.trim()) {
        doSend();
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full min-h-0">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-h-0 pr-0 md:pr-8">
        <div className="flex items-center gap-4 mb-6 pt-6 pl-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-[var(--commandly-primary)]">
              💬
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white/90">Chat</h2>
            <p className="text-sm text-white/60 mt-1">
              Chat with your AI assistant
            </p>
          </div>
          <button
            onClick={handleNewChat}
            className="ml-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 transition-all duration-200"
            type="button"
            disabled={historyLoading || loading}
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 md:pl-6 md:pr-6 md:pb-4 space-y-4 min-h-0">
          {historyLoading ? (
            <div className="text-white/60 p-6">Loading chat history...</div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-6 mb-2 shadow-md prose prose-invert break-words font-medium text-base single-message ${
                    msg.role === "user"
                      ? "bg-[var(--commandly-primary)]/80 text-white self-end"
                      : "bg-white/10 text-white self-start"
                  } ${msg.streaming ? "opacity-70" : ""}`}
                  dir={getDirection(msg.content || "")}
                  style={{
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      ? msg.content
                          .replace(/```html|```/g, "")
                          .replace(
                            /<h3>/g,
                            '<h3 class="text-xl font-bold mb-2 mt-4">'
                          )
                          .replace(/<p>/g, '<p class="mb-3">')
                          .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-3">')
                          .replace(/<li>/g, '<li class="mb-1">')
                          .replace(
                            /<a href="([^"]+)"/g,
                            '<a target="_blank" href="$1" class="text-[var(--commandly-primary)] hover:underline"'
                          )
                          .replace(
                            /([\u{1F300}-\u{1F9FF}])/gu,
                            '<span class="inline-block align-middle">$1</span>'
                          )
                      : "",
                  }}
                />
              </div>
            ))
          )}
          <div ref={responseRef} />
        </div>
        {/* Chat Input */}
        <form
          onSubmit={handleSend}
          className="p-4 pt-0 md:pl-6 md:pr-6 flex gap-2 sticky bottom-0"
        >
          <textarea
            value={userInput}
            onChange={handleInputChange}
            ref={textareaRef}
            rows={1}
            style={{ resize: "none", overflow: "hidden" }}
            className="flex-1 px-4 py-3 rounded-lg bg-black/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20 focus:bg-black/30 transition-all duration-200 min-h-[44px] max-h-40"
            placeholder="Type your message..."
            required
            disabled={!chatGroupId || loading || historyLoading}
            autoFocus
            onKeyDown={handleTextareaKeyDown}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white font-semibold transition-all duration-200"
            disabled={!chatGroupId || loading || historyLoading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
        {error && <div className="text-red-400 mt-2 px-4">{error}</div>}
      </div>
      {/* Sidebar as a floating box */}
      <div className="w-full md:w-80 flex-shrink-0 md:mt-6 md:mr-6 md:mb-6 md:ml-0 mt-8 md:relative min-h-0">
        <div className="bg-white/5 rounded-xl shadow-lg border border-white/10 h-full flex flex-col md:sticky md:top-6 min-h-0">
          <div className="p-4 border-b border-white/10 text-lg font-semibold text-white/80">
            Chat History
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
            {chatHistory.length === 0 && !historyLoading && (
              <div className="text-white/50 text-center mt-8">
                No messages yet.
              </div>
            )}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-lg px-3 py-2 cursor-pointer transition-all duration-150 ${
                  idx === chatHistory.length - 1
                    ? "bg-[var(--commandly-primary)]/20 border border-[var(--commandly-primary)]/40"
                    : "hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="text-xs text-white/60 mb-1">
                  {msg.role === "user" ? "You" : "AI"}
                </div>
                <div
                  className="truncate text-white/90 text-sm"
                  title={msg.content
                    ?.replace(/<[^>]+>/g, "")
                    .replace(/```html|```/g, "")
                    .slice(0, 100)}
                >
                  {msg.content
                    ?.replace(/<[^>]+>/g, "")
                    .replace(/```html|```/g, "")
                    .slice(0, 60)}
                  {msg.content?.replace(/<[^>]+>/g, "").length > 60
                    ? "..."
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
