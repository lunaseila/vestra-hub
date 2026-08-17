import { Resend } from "resend";
import {
  type VestraEmailTemplateKey,
  VESTRA_EMAIL_TEMPLATES,
} from "../../frontend/src/lib/vestraEmailTemplates";

const resendApiKey = process.env.VESTRA_EMAIL_API_KEY;
const fromAddress =
  process.env.VESTRA_EMAIL_FROM ?? "Vestra <atelier@vestra.space>";

function getResend() {
  if (!resendApiKey) {
    throw new Error("VESTRA_EMAIL_API_KEY is not configured.");
  }
  return new Resend(resendApiKey);
}

export interface SendTransactionalEmailInput {
  to: string;
  template: VestraEmailTemplateKey;
  variables?: Record<string, string>;
}

function interpolate(template: string, variables?: Record<string, string>) {
  if (!variables) return template;
  return Object.entries(variables).reduce(
    (body, [key, value]) => body.replaceAll(`{{${key}}}`, value),
    template,
  );
}

export async function sendVestraTransactionalEmail(
  input: SendTransactionalEmailInput,
) {
  const template = VESTRA_EMAIL_TEMPLATES[input.template];
  if (!template) {
    throw new Error(`Unknown Vestra email template: ${input.template}`);
  }

  const resend = getResend();
  return resend.emails.send({
    from: fromAddress,
    to: input.to,
    subject: template.subject,
    text: interpolate(template.body, input.variables),
    html: interpolate(template.body, input.variables)
      .split("\n")
      .map((line) => `<p>${line || "&nbsp;"}</p>`)
      .join(""),
    tags: [{ name: "vestra_template", value: input.template }],
  });
}

export async function sendTransactionalEmailRequest(request: Request) {
  try {
    const body = (await request.json()) as SendTransactionalEmailInput;
    const result = await sendVestraTransactionalEmail(body);
    return Response.json({ ok: true, id: result.data?.id });
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Unable to send email.",
      { status: 400 },
    );
  }
}
