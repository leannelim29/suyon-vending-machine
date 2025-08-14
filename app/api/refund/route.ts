export async function POST() {
  return new Response(JSON.stringify({ status: "refunded" }), {
    status: 200,
  });
}
