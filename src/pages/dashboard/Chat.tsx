import { useEffect, useState, useRef } from "react";
import {
  createChatGroup,
  sendSimpleChat,
  getChatGroupHistory,
  getLastChatGroupId,
  getChatGroups,
} from "@/utils/chat";

const PAGE_SIZE = 20;
const LAST_CHAT_GROUP_KEY = "lastChatGroupId";

type ChatMessage = {
  content: string;
  role: "user" | "assistant";
  streaming?: boolean;
};

type ChatGroup = {
  id: string;
  name: string;
  createdAt: string;
  ChatHistory: ChatMessage[];
};

const getDirection = (text: string) => {
  // check if text has more than 50% of rtl characters
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const rtlCount = (text.match(rtlChars) || []).length;
  const ltrCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
  return rtlCount > ltrCount ? "rtl" : "ltr";
};

const Chat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [userInput, setUserInput] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedChatGroupId, setSelectedChatGroupId] = useState<string | null>(
    null
  );

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
      setSelectedChatGroupId(id);
    });
  }, []);

  useEffect(() => {
    if (!selectedChatGroupId) return;
    setHistoryLoading(true);
    getChatGroupHistory({
      chatGroupId: selectedChatGroupId,
      page: 1,
      limit: PAGE_SIZE,
    })
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
    getChatGroups({ userId: "1" }).then((groups: ChatGroup[]) => {
      setChatGroups(groups?.filter((group) => group.ChatHistory.length > 0));
    });
  }, [selectedChatGroupId]);

  const doSend = async () => {
    if (!userInput.trim() || !selectedChatGroupId || loading) return;
    setError("");
    setLoading(true);
    let responseHtml = "";
    setChatHistory((prev) => [
      ...prev,
      { content: userInput, role: "user" },
      { content: "", role: "assistant", streaming: true },
    ]);
    try {
      const stream = await sendSimpleChat({
        userInput,
        context,
        selectedChatGroupId,
      });
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
      setSelectedChatGroupId(newId);
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
    if (selectedChatGroupId) {
      localStorage.setItem(LAST_CHAT_GROUP_KEY, selectedChatGroupId);
    }
  }, [selectedChatGroupId]);

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
      if (
        !loading &&
        !historyLoading &&
        selectedChatGroupId &&
        userInput.trim()
      ) {
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
            className="ml-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 transition-all duration-300 ease-in-out transform hover:scale-[1.05] active:scale-[0.98]"
            type="button"
            disabled={historyLoading || loading}
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 md:pl-6 md:pr-6 md:pb-4 space-y-4 min-h-0">
          {historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-[var(--commandly-primary)]/20 border-t-[var(--commandly-primary)] rounded-full animate-spin"></div>
                <p className="text-white/60 animate-pulse">Loading chat history...</p>
              </div>
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[70%] rounded-xl p-6 mb-2 shadow-md prose prose-invert break-words font-medium text-base single-message transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
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
            disabled={!selectedChatGroupId || loading || historyLoading}
            autoFocus
            onKeyDown={handleTextareaKeyDown}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-[1.05] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={!selectedChatGroupId || loading || historyLoading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              "Send"
            )}
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
            {chatGroups.length === 0 && !historyLoading && (
              <div className="flex flex-col items-center justify-center text-white/50 text-center mt-8 gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p>No chat history</p>
                <p className="text-sm text-white/40">Start a new conversation</p>
              </div>
            )}
            {chatGroups.map((group, idx) => (
              <div
                onClick={() => setSelectedChatGroupId(group.id)}
                key={idx}
                className={`rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                  idx === chatGroups.length - 1
                    ? "bg-[var(--commandly-primary)]/20 border border-[var(--commandly-primary)]/40"
                    : "hover:bg-white/10 border border-transparent"
                }
                ${
                  selectedChatGroupId === group.id
                    ? "bg-[var(--commandly-primary)]/20 border border-[var(--commandly-primary)]/40 scale-[1.02]"
                    : ""
                }`}
              >
                <div className="text-xs text-white/60 mb-1">
                  {group["ChatHistory"].length > 0
                    ? group["ChatHistory"][0].content
                        .slice(0, 100)
                        .replace(/```html|```/g, "")
                        .replace(/<[^>]*>?/g, "")
                    : "No messages"}
                </div>
                <div
                  className="truncate text-white/90 text-sm"
                  title={group.name}
                >
                  {group.name}
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
