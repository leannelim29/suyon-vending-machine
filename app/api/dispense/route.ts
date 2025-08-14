export async function POST() {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
  });
}
