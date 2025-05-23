import { useEffect, useState, useRef } from "react";
import {
  createChatGroup,
  sendSimpleChat,
  getChatGroupHistory,
  getLastChatGroupId,
  getChatGroups,
} from "@/utils/chat";
import Tooltip from "@/components-dashboard/Tooltip/Tooltip";
import { useConfig } from "@/contexts/ConfigContext";
import languages from "@/configs/languages";
import { getPlans, Plan } from "@/utils/fetchPlanes";
import { handleCheckout } from "@/utils/handleCheckout";

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
  const newText = text.replace(/```html|```/g, "").replace(/<[^>]*>?/g, "");
  const ltrCount = (newText.match(/[a-zA-Z0-9]/g) || []).length;
  const rtlCount = newText.length - ltrCount;
  const isRTL = rtlCount > ltrCount;
  return isRTL ? "rtl" : "ltr";
};

const Chat = () => {
  const { chat, setChat, settings } = useConfig();
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<
    number | null
  >(null);
  const [defaultTranslateLanguage, setDefaultTranslateLanguage] = useState(
    settings?.defaultTranslationLanguage || "en"
  );
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [quotedMessageId, setQuotedMessageId] = useState<number | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const newChatRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [chatLimitError, setChatLimitError] = useState<string | null>(null);

  useEffect(() => {
    const handleChatUpdate = async () => {
      if (chat) {
        const newChatId = await handleNewChat();
        if (!newChatId) return;

        setUserInput(chat);
        setChat("");
        setTimeout(async () => {
          if (formRef.current) {
            formRef.current.dispatchEvent(
              new Event("submit", { bubbles: true })
            );
          }
        }, 1000);
      }
    };

    handleChatUpdate();
  }, [chat]);

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

  useEffect(() => {
    if (!chatGroupId) return;
    setHistoryLoading(true);
    getChatGroupHistory({
      chatGroupId: chatGroupId,
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
  }, [chatGroupId]);

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
    setTimeout(() => {
      if (responseRef.current) {
        responseRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setUserInput("");
    try {
      const stream = await sendSimpleChat({
        userInput,
        context: selectedQuote || "",
        selectedChatGroupId: chatGroupId,
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
            setTimeout(() => {
              if (responseRef.current) {
                responseRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 0);
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
      if (err instanceof Error && err.message.includes("429")) {
        setChatLimitError("limit");
      } else {
        setError(err instanceof Error ? err.message : "Failed to send chat");
      }
      setChatHistory((prev) => prev.slice(0, -1));
    } finally {
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: "smooth" });
          setSelectedQuote(
            responseHtml?.replace(/```html|```/g, "").replace(/<[^>]*>?/g, "")
          );
        }
      }, 100);
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
    try {
      const newId = await createChatGroup();
      setChatGroupId(newId);
      localStorage.setItem(LAST_CHAT_GROUP_KEY, newId);
      return newId;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create chat group"
      );
      return null;
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
      setUserInput(userInput + "\n");
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      if (!loading && !historyLoading && chatGroupId && userInput.trim()) {
        doSend();
      }
    }
  };

  const handleTranslate = async (text: string) => {
    setUserInput(`Translate to ${defaultTranslateLanguage}`);
    setSelectedQuote(text);
    setTimeout(() => {
      doSend();
    }, 100);
  };

  // Close language dropdown on outside click
  useEffect(() => {
    if (showLanguageDropdown === null) return;
    function handleClickOutside(event: MouseEvent) {
      const dropdown = dropdownRef.current;
      const chevron = chevronRef.current;
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        chevron &&
        !chevron.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const handleUpgrade = async () => {
    const { plans } = await getPlans();
    const paidPlan = plans.find((p: Plan) => p.price > 0);
    if (paidPlan) {
      await handleCheckout(paidPlan.id);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full min-h-0">
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
            ref={newChatRef}
            onClick={handleNewChat}
            className="ml-auto px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 transition-all duration-300 ease-in-out transform"
            type="button"
            disabled={historyLoading || loading}
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 md:pl-6 md:pr-6 md:pb-4 space-y-4 min-h-0 mb-2 border-b border-white/10">
          {historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-[var(--commandly-primary)]/20 border-t-[var(--commandly-primary)] rounded-full animate-spin"></div>
                <p className="text-white/60 animate-pulse">
                  Loading chat history...
                </p>
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
                <div className="flex flex-col">
                  <div
                    className={`rounded-xl mb-2 prose prose-invert font-medium text-base single-message transition-all duration-300 ease-in-out transform text-white p-4 ${
                      msg.role === "user"
                        ? "bg-[var(--commandly-primary)]/80 ml-10"
                        : "mr-10"
                    } ${msg.streaming ? "opacity-70" : ""}`}
                    dir={getDirection(msg.content || "")}
                    style={{}}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        ? msg.content.replace(/```html|```/g, "")
                        : "",
                    }}
                  />
                  {/* Style for .single-message and its children */}
                  <style>{`
                    .single-message {
                      font-size: 1.08rem;
                      line-height: 1.7;
                      padding: 1.1rem 1.5rem;
                      border-radius: 1.1rem;
                    }
                    .single-message h3 {
                      font-size: 1.5rem;
                      font-weight: 800;
                      margin-bottom: 0.6rem;
                      margin-top: 1.1rem;
                      color: white;
                      letter-spacing: -0.01em;
                    }
                    .single-message p {
                      font-size: 1.08rem;
                      margin-bottom: 0.7rem;
                      line-height: 1.7;
                      color: #fff;
                    }
                    .single-message ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                      margin-bottom: 0.8rem;
                    }
                    .single-message li {
                      font-size: 1.08rem;
                      margin-bottom: 0.4rem;
                      line-height: 1.6;
                      color: #fff;
                      display: block;
                      align-items: flex-start;
                      gap: 0.5em;
                    }
                    .single-message a {
                      color: white;
                      font-weight: 600;
                      border-bottom: 2px solid rgba(255,255,255,0.5);
                      transition: color 0.18s;
                      word-break: break-all;
                    }
                    .single-message a:hover {
                      color: white;
                      border-bottom: 2px solid rgba(255,255,255,1);
                    }
                    .single-message span.emoji {
                      display: inline-block;
                      vertical-align: middle;
                      font-size: 1.2em;
                      margin-right: 0.1em;
                    }
                    .single-message pre {
                      margin: 0.5rem 0;
                      background: rgba(255,255,255,0.08);
                      color: #ffe;
                      border-radius: 0.4em;
                      padding: 0.15em 0.4em;
                      font-size: 0.98em;
                      font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
                    }
                  `}</style>
                  {msg.streaming && loading && (
                    <div className="flex items-start gap-2 w-full chat-message-animate mb-2">
                      <div className="relative max-w-[70%] px-3 py-1.5 rounded-full bg-[var(--commandly-primary)]/80 shadow-lg flex items-center gap-2 animate-pulse-subtle">
                        <span className="text-white font-medium text-sm mr-1 tracking-normal">
                          Thinking…
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="loading-dot-bounce" />
                          <span
                            className="loading-dot-bounce"
                            style={{ animationDelay: "0.15s" }}
                          />
                          <span
                            className="loading-dot-bounce"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>
                        <style>{`
                        .loading-dot-bounce {
                          display: inline-block;
                          width: 0.38em;
                          height: 0.38em;
                          background: white;
                          border-radius: 50%;
                          margin: 0 0.08em;
                          opacity: 0.85;
                          animation: loadingBounce 1.1s infinite cubic-bezier(0.4,0,0.2,1);
                        }
                        @keyframes loadingBounce {
                          0%, 80%, 100% {
                            transform: translateY(0) scale(0.85);
                            opacity: 0.5;
                          }
                          40% {
                            transform: translateY(-0.25em) scale(1.05);
                            opacity: 1;
                          }
                        }
                        .animate-pulse-subtle {
                          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        @keyframes pulse-subtle {
                          0%, 100% {
                            opacity: 1;
                          }
                          50% {
                            opacity: 0.92;
                          }
                        }
                      `}</style>
                      </div>
                    </div>
                  )}
                  {msg.role === "assistant" && !msg.streaming && (
                    <div className="flex items-center gap-2">
                      <Tooltip
                        text={copiedMessageId === idx ? "Copied!" : "Copy"}
                      >
                        <button
                          className={`cursor-pointer p-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center shadow-sm border border-transparent ${
                            copiedMessageId === idx
                              ? "bg-green-500/20 text-green-400 scale-110"
                              : "hover:bg-white/10 text-white/80 hover:text-white"
                          }`}
                          onClick={() => {
                            const newText = msg.content
                              .replace(/```html|```/g, "")
                              .replace(/<[^>]*>?/g, "");
                            navigator.clipboard.writeText(newText);
                            setCopiedMessageId(idx);
                            setTimeout(() => setCopiedMessageId(null), 2000);
                          }}
                          style={{ minWidth: 32, minHeight: 32 }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${
                              copiedMessageId === idx
                                ? "scale-110 text-green-400"
                                : ""
                            }`}
                          >
                            {copiedMessageId === idx ? (
                              <path d="M20 6L9 17l-5-5" />
                            ) : (
                              <>
                                <rect
                                  width="14"
                                  height="14"
                                  x="8"
                                  y="8"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </>
                            )}
                          </svg>
                        </button>
                      </Tooltip>
                      <Tooltip
                        text={quotedMessageId === idx ? "Quoted!" : "Quote"}
                      >
                        <button
                          className={`cursor-pointer p-1 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center shadow-sm border border-transparent ${
                            quotedMessageId === idx
                              ? "bg-blue-500/20 text-blue-400 scale-110"
                              : "hover:bg-white/10 text-white/80 hover:text-white"
                          }`}
                          style={{ minWidth: 32, minHeight: 32 }}
                          onClick={() => {
                            setSelectedQuote(msg.content);
                            setQuotedMessageId(idx);
                            setTimeout(() => setQuotedMessageId(null), 2000);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${
                              quotedMessageId === idx
                                ? "scale-110 text-blue-400"
                                : ""
                            }`}
                          >
                            {quotedMessageId === idx ? (
                              <path d="M20 6L9 17l-5-5" />
                            ) : (
                              <>
                                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                              </>
                            )}
                          </svg>
                        </button>
                      </Tooltip>
                      <div className="relative">
                        <div className="flex items-center gap-0.5">
                          <div className="relative">
                            <Tooltip text="Translate">
                              <button
                                className="cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center text-white/80 hover:text-white shadow-sm border border-transparent"
                                style={{ minWidth: 32, minHeight: 32 }}
                                onClick={() => {
                                  handleTranslate(msg.content);
                                }}
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 8l6 6" />
                                  <path d="m4 14 6-6 2-3" />
                                  <path d="M2 5h12" />
                                  <path d="M7 2h1" />
                                  <path d="m22 22-5-10-5 10" />
                                  <path d="M14 18h6" />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                          <div className="relative">
                            <Tooltip text="Language options">
                              <button
                                ref={chevronRef}
                                className="cursor-pointer p-1 -ml-1 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center text-white/80 hover:text-white shadow-sm border border-transparent"
                                style={{ minWidth: 32, minHeight: 32 }}
                                onClick={() =>
                                  setShowLanguageDropdown(
                                    showLanguageDropdown === idx ? null : idx
                                  )
                                }
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className={`transition-transform duration-200 ${
                                    showLanguageDropdown === idx
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                        {showLanguageDropdown === idx && (
                          <div
                            ref={dropdownRef}
                            className="absolute left-0 bottom-full w-56 bg-black/50 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 py-2 z-50 overflow-hidden mb-2 animate-fade-in"
                            style={{ minWidth: 200 }}
                          >
                            <div className="max-h-[320px] overflow-y-auto">
                              {languages
                                .sort((a) =>
                                  a.code === defaultTranslateLanguage ? -1 : 1
                                )
                                .map((lang) => (
                                  <button
                                    key={lang.code}
                                    className={`cursor-pointer w-full text-left px-5 py-3 text-base flex items-center gap-3 transition-colors duration-150 font-medium rounded-lg mb-1 last:mb-0 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/30 focus:bg-[var(--commandly-primary)]/10 ${
                                      defaultTranslateLanguage === lang.code
                                        ? "bg-[var(--commandly-primary)]/80 text-white shadow-inner"
                                        : "hover:bg-white/20 text-white/90 hover:text-white"
                                    }`}
                                    onClick={() => {
                                      setDefaultTranslateLanguage(lang.code);
                                      setShowLanguageDropdown(null);
                                    }}
                                    style={{ minHeight: 44 }}
                                  >
                                    {defaultTranslateLanguage === lang.code && (
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-white"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                    <span>{lang.name}</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={responseRef} className="h-10 mt-10" />
        </div>
        {/* Chat Input */}
        <form
          ref={formRef}
          onSubmit={handleSend}
          className="p-0 pt-0 md:pl-6 md:pr-6 flex flex-col gap-2 sticky bottom-0"
        >
          <div className="flex gap-2">
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
              type="button"
              ref={submitRef}
              onClick={handleSend}
              className="px-6 py-2 rounded-lg bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary)]/90 text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-[1.05] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={!chatGroupId || loading || historyLoading}
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
          </div>
          {selectedQuote && (
            <div className="relative bg-white/5 rounded-lg border border-white/10 p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="text-sm text-white/70 line-clamp-2">
                  {selectedQuote
                    ?.replace(/```html|```/g, "")
                    ?.replace(/<[^>]*>?/g, "")}
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </form>
        {error && <div className="text-red-400 mt-2 px-4">{error}</div>}
        {chatLimitError === "limit" && (
          <div className="flex flex-col items-center text-center gap-3 animate-fade-in mt-8 mb-8 px-6 py-8 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-indigo-800/50 to-black/60 border border-indigo-500/30 shadow-2xl backdrop-blur-xl">
            <span className="text-5xl mb-2 animate-bounce">🚫</span>
            <h3 className="text-white font-bold text-xl mb-1">
              You've reached your daily chat limit
            </h3>
            <p className="text-white/70 text-base mb-2">
              Upgrade your plan to unlock more daily chats and insights.
            </p>
            {/* If you have usage info, show it here */}
            {/* <p className="text-white/40 text-sm mb-2">Used 10 of 10 chats today</p> */}
            <button
              onClick={handleUpgrade}
              className="cursor-pointer mt-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold text-base shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
      {/* Sidebar as a floating box */}
      <div className="w-full lg:w-80 flex-shrink-0 md:mt-6 md:mr-6 md:mb-6 md:ml-0 mt-8 md:relative min-h-0">
        <div className="bg-white/5 rounded-xl shadow-lg border border-white/10 h-full flex flex-col md:sticky md:top-6 min-h-0">
          <div className="p-4 border-b border-white/10 text-lg font-semibold text-white/80">
            Chat History
          </div>
          <div className="flex-1 overflow-y-p-4 auto p-4 space-y-2 min-h-0">
            {chatGroups.length === 0 && !historyLoading && (
              <div className="flex flex-col items-center justify-center text-white/50 text-center mt-8 gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p>No chat history</p>
                <p className="text-sm text-white/40">
                  Start a new conversation
                </p>
              </div>
            )}
            {chatGroups.map((group, idx) => (
              <div
                onClick={() => setChatGroupId(group.id)}
                key={idx}
                className={`rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] 
                ${
                  chatGroupId === group.id
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
