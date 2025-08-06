import api from "./api";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface TagPayload {
  name: string;
  color: string;
}

export async function getTags(): Promise<Tag[]> {
  const result = await api.get<Tag[]>("/api/tags");
  return result.data;
}
export async function addTag(payload: TagPayload): Promise<Tag> {
  const result = await api.post<Tag>("/api/tags", payload);
  return result.data;
}
export async function updateTag(id: number, payload: TagPayload): Promise<Tag> {
  const result = await api.put<Tag>(`/api/tags/${id}`, payload);
  return result.data;
}
export async function deleteTag(id: number): Promise<void> {
  const result = await api.delete(`/api/tags/${id}`);
  return result.data;
}
