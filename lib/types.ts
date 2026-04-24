export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type ChatRequestBody = {
  messages: Array<{ role: Role; content: string }>;
};
