"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  display?: string;
};

export default function AboutChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好，我是文思月。你想先了解哪一部分？",
      display: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const autoScrollRef = useRef(true);

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const renderMarkdown = (text: string) => {
    const safe = escapeHtml(text);
    const bolded = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const italic = bolded.replace(/\*(.+?)\*/g, "<em>$1</em>");
    return italic.replace(/\n/g, "<br />");
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoScrollRef.current) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const onScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    autoScrollRef.current = distance < 120;
  };

  useEffect(() => {
    if (typingTimerRef.current != null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const target = [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "assistant" &&
          (message.display ?? "") !== message.content,
      );

    if (!target) return;

    const step = () => {
      setMessages((prev) =>
        prev.map((message) => {
          if (message.id !== target.id) return message;
          const nextLength = Math.min(
            message.content.length,
            (message.display?.length ?? 0) + 1,
          );
          return {
            ...message,
            display: message.content.slice(0, nextLength),
          };
        }),
      );

      const updated = messages.find((message) => message.id === target.id);
      const done =
        updated && (updated.display?.length ?? 0) >= updated.content.length;
      if (!done) {
        typingTimerRef.current = window.setTimeout(step, 18);
      }
    };

    typingTimerRef.current = window.setTimeout(step, 18);
    return () => {
      if (typingTimerRef.current != null) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, [messages]);

  const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: createId(), role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-12),
        }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      const data = (await response.json()) as { reply?: string };
      const reply = data.reply ?? "我这部分还不太确定，能再具体一点吗？";
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: reply, display: "" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: "网络有点问题，稍后再试一次。",
          display: "",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className="about-chat">
      <div className="about-chat-header">
        <div className="about-chat-title">AI 对话</div>
        <div className="about-chat-subtitle">
          基于我的项目与作业笔记，回答你的问题
        </div>
      </div>

      <div className="about-chat-messages" ref={containerRef} onScroll={onScroll}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`about-chat-message ${message.role}`}
          >
            <div
              className="about-chat-bubble"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(message.display ?? message.content),
              }}
            />
          </div>
        ))}
        {isSending ? (
          <div className="about-chat-message assistant">
            <div className="about-chat-bubble">正在思考...</div>
          </div>
        ) : null}
      </div>

      <div className="about-chat-input">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="输入你的问题，回车发送，Shift+Enter 换行"
          rows={3}
        />
        <button type="button" onClick={() => void sendMessage()}>
          发送
        </button>
      </div>
    </section>
  );
}
