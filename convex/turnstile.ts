export type TurnstileResult = {
  success: boolean;
  errorMessage?: string;
};

export async function verifyTurnstile(token: string): Promise<TurnstileResult> {
  // @ts-ignore
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("CLOUDFLARE_TURNSTILE_SECRET_KEY is not set. Turnstile verification skipped.");
    return { success: true }; 
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    });

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return {
      success: data.success,
      errorMessage: data["error-codes"] ? data["error-codes"].join(", ") : undefined,
    };
  } catch (err: any) {
    console.error("Turnstile verification error:", err);
    return { success: false, errorMessage: err.message || "Network Error" };
  }
}
