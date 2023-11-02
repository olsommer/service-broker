import Stripe from "stripe";
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

export async function reportUsage(
  subscriptionItemID: string,
  quantity: number,
) {
  const idempotencyKey = crypto.randomUUID();
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemID,
      {
        quantity,
        timestamp: timestamp,
        action: "set",
      },
      {
        idempotencyKey,
      },
    );
    return { error: null, idempotencyKey };
  } catch (error) {
    console.error(
      `Usage report failed for item ID ${subscriptionItemID} with idempotency key ${idempotencyKey}: ${
        (error as Error).toString()
      }`,
    );
    return { error: error as Error, idempotencyKey };
  }
}
