import { getAuthToken } from "./auth";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const API_BASE_URL = "http://localhost:7070";

export async function createChatGroup() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/chat/create-chat-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "Failed to create chat group");
  return data.chatGroupId;
}

export async function sendSimpleChat({
  userInput,
  context,
  selectedChatGroupId,
}: {
  userInput: string;
  context: string;
  selectedChatGroupId: string;
}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/ai/simple-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userInput,
      context,
      chatGroupId: selectedChatGroupId,
    }),
  });
  if (res.headers.get("content-type")?.includes("text/event-stream")) {
    return res.body;
  }
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to send chat");
  return data.text;
}

export async function getChatGroups({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  const token = getAuthToken();
  const res = await fetch(
    `${API_BASE_URL}/chat/chat-groups?userId=${userId}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "Failed to fetch chat groups");
  return data.chatGroups;
}

export async function getChatGroupHistory({
  chatGroupId,
  page = 1,
  limit = 10,
}: {
  chatGroupId: string;
  page?: number;
  limit?: number;
}) {
  const token = getAuthToken();
  const res = await fetch(
    `${API_BASE_URL}/chat/chat-group/${chatGroupId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "Failed to fetch chat history");
  return data.chatHistory;
}

export async function getLastChatGroupId() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/chat/chat-groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error || "Failed to fetch chat groups");
  return data.chatGroups[0].id;
}
