export const WHATSAPP_NUMBER = "919363771563";
export const CONTACT_PHONE_DISPLAY = "+91 93637 71563";

export function getContactPhoneHref() {
  return `tel:+${WHATSAPP_NUMBER}`;
}

export function buildContactWhatsAppUrl(message = "Hi Tharun, I'm interested in TRADEX Trading Academy.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildEnrollmentWhatsAppUrl({ name, email, phone, message = "" }) {
  const lines = [
    "New Enrollment - TradeX Trading Course",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
  ];

  if (message.trim()) {
    lines.push(`Message: ${message.trim()}`);
  }

  lines.push("", "Course Price: ₹1999 Only");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}