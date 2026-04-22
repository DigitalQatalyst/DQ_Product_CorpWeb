type GoogleTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function base64UrlEncode(buf: Buffer | string) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return b
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function signJwtRs256(payload: object, privateKeyPem: string) {
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const input = `${encodedHeader}.${encodedPayload}`;

  const { createSign } = require("node:crypto") as typeof import("node:crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(input);
  signer.end();
  const signature = signer.sign(privateKeyPem);
  const encodedSig = base64UrlEncode(signature);
  return `${input}.${encodedSig}`;
}

function requiredEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`${name} is required for Google Calendar integration.`);
  return v;
}

function getPrivateKeyPem() {
  // Supabase/Next env typically stores with literal \n.
  return requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replaceAll("\\n", "\n");
}

export function hasGoogleCalendarConfig() {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim() &&
      process.env.GOOGLE_CALENDAR_ID?.trim(),
  );
}

async function getAccessToken() {
  const iss = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const aud = "https://oauth2.googleapis.com/token";
  const scope = "https://www.googleapis.com/auth/calendar";
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60;
  const sub = process.env.GOOGLE_IMPERSONATE_USER?.trim();

  const payload: Record<string, unknown> = {
    iss,
    scope,
    aud,
    iat: now,
    exp,
  };
  if (sub) payload.sub = sub;

  const assertion = signJwtRs256(payload, getPrivateKeyPem());

  const form = new URLSearchParams();
  form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  form.set("assertion", assertion);

  const res = await fetch(aud, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to fetch Google access token.");
  }

  return (await res.json()) as GoogleTokenResponse;
}

export async function createCalendarEventWithMeet(input: {
  calendarId?: string;
  summary: string;
  description?: string;
  startIso: string;
  endIso: string;
  attendeeEmail: string;
}) {
  const calendarId = (input.calendarId ?? process.env.GOOGLE_CALENDAR_ID)?.trim();
  if (!calendarId) throw new Error("GOOGLE_CALENDAR_ID is required.");

  const token = await getAccessToken();
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const body = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.startIso },
    end: { dateTime: input.endIso },
    attendees: [{ email: input.attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId,
  )}/events?conferenceDataVersion=1&sendUpdates=all`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(text || "Failed to create Google Calendar event.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = JSON.parse(text) as any;

  const meetLink: string | null =
    event?.hangoutLink ??
    event?.conferenceData?.entryPoints?.find((e: any) => e?.entryPointType === "video")
      ?.uri ??
    null;

  return {
    eventId: (event?.id as string | undefined) ?? null,
    meetLink,
    htmlLink: (event?.htmlLink as string | undefined) ?? null,
  };
}

