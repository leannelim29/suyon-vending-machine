import { items } from "@/items";

export async function GET() {
  return Response.json(items);
}
