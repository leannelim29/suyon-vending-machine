export async function POST(request: Request) {
  const { amount, method } = await request.json();
  if (method === "card") {
    // Simulate card authorization
  }
  return new Response(JSON.stringify({ status: "received", paid: amount }), {
    status: 501,
  });
}
