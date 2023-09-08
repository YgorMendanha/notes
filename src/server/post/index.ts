import { Response } from "@/types/response";
import { featchApi } from "../api";

export class Post {
  static async Create(payload: {
    title: string;
    content: string;
    authorId: number;
  }) {
    const reponse: Response = await featchApi("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload),
      next: { revalidate: 3600 },
    });
    return reponse;
  }

  static async Get() {
    const reponse: Response = await featchApi("/api/posts", {
      method: "GET",
      next: { tags: ["posts"] },
    });

    return reponse;
  }

  static async Delete(id: number) {
    const reponse: Response = await featchApi(`/api/posts?id=${id}`, {
      method: "DELETE",
    });

    return reponse;
  }
}
