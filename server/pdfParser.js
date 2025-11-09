import pdfParse from "pdf-parse";

export async function parsePdf(base64) {
  const buffer = Buffer.from(base64, "base64");
  const data = await pdfParse(buffer);
  return data.text; // PDFの全文テキストを返す
}
