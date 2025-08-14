const changes = [
  { unit: 100, count: 1000 },
  { unit: 500, count: 1000 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const price = Number(searchParams.get("price"));
  const paid = Number(searchParams.get("paid"));

  let changeAmount = paid - price;
  const result: { unit: number; count: number }[] = [];

  for (const coin of changes) {
    if (changeAmount <= 0) break;

    const maxCoins = Math.floor(changeAmount / coin.unit);
    const coinsToGive = Math.min(maxCoins, coin.count);

    if (coinsToGive > 0) {
      result.push({ unit: coin.unit, count: coinsToGive });
      changeAmount -= coinsToGive * coin.unit;
    }
  }

  return Response.json({
    hasChange: changeAmount <= 0,
    change: result,
    remaining: changeAmount, // >0 means not enough change
  });
}
