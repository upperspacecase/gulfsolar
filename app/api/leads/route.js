export async function POST(request) {
  const body = await request.json();
  if (!body?.email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  // Placeholder for email + CRM integration.
  console.log("Lead captured", {
    email: body.email,
    inputs: body.inputs,
    outputs: body.outputs,
    timestamp: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
