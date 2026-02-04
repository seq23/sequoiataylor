export async function onRequest(context) {
  const { request, env } = context;

  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Honeypot (spam trap). If filled, pretend success.
  if (body && typeof body.company === "string" && body.company.trim().length > 0) {
    return json({ ok: true }, 200);
  }

  const name = (body?.name || "").toString().trim();
  const email = (body?.email || "").toString().trim();
  const message = (body?.message || "").toString().trim();

  // Basic validation
  if (name.length < 2) return json({ error: "Please enter your name." }, 400);
  if (!isValidEmail(email)) return json({ error: "Please enter a valid email." }, 400);
  if (message.length < 10) return json({ error: "Please enter a longer message." }, 400);

  const to = env.CONTACT_TO || "sequoia@westpeek.ventures";
  const from = env.CONTACT_FROM || "no-reply@sequoiataylor.com";

  const subject = `New message from ${name} (sequoiataylor.com)`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;line-height:1.5">
      <h2 style="margin:0 0 12px">New message from sequoiataylor.com</h2>
      <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <pre style="white-space:pre-wrap;background:#f6f7f9;padding:12px;border-radius:10px;border:1px solid #e5e7eb">${escapeHtml(message)}</pre>
    </div>
  `;

  // MailChannels send API (works in Cloudflare Workers/Pages Functions)
  // https://github.com/mailchannels/mailchannels-worker
  const mcRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "SequoiaTaylor.com" },
      reply_to: { email, name },
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
    }),
  });

  if (!mcRes.ok) {
    const errText = await mcRes.text().catch(() => "");
    return json(
      { error: "Email service rejected the request.", detail: errText.slice(0, 400) },
      502
    );
  }

  return json({ ok: true }, 200);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function isValidEmail(v) {
  // Simple, pragmatic email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
