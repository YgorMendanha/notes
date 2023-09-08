import { Response } from "@/types/response";
import { featchApi } from "../api";

export class User {
  static async Create(payload: { user: string }) {
    const reponse: Response = await featchApi("/api/user", {
      method: "POST",
      body: JSON.stringify(payload),
      next: { revalidate: 3600 },
    });
    return reponse;
  }
}
