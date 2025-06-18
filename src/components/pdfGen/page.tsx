'use client';

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

type PDFProps = {
  orderId: string;
  userDetails: {
    name: string;
    number: number;
    alternateNumber: number;
    address: string;
    email: string;
  };
  total: number;
  productDetails: { name: string; quantity: number; price: number }[];
};

export default function PDFGeneratorWithForms({
  orderId,
  userDetails,
  total,
  productDetails,
}: PDFProps) {
  const generatePDF = async () => {
    const existingPdfBytes = await fetch(
      'https://res.cloudinary.com/dn3jc0m8s/image/upload/v1750241145/invoice_template_f5yex1.pdf'
    ).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const date = new Date();
    form.getTextField('orderNumber').setText(orderId);
    form.getTextField('name').setText(userDetails.name);
    form.getTextField('number').setText(userDetails.number.toString());
    form
      .getTextField('alternate_number')
      .setText(userDetails.alternateNumber.toString());
    form.getTextField('amount').setText(total.toString());
    form.getTextField('address').setText(userDetails.address);
    form.getTextField('email').setText(userDetails.email);
    form
      .getTextField('date')
      .setText(`${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`);

    const pages = pdfDoc.getPages();
    if (pages.length < 2) {
      console.error('PDF does not have a second page for the product table.');
      return;
    }

    const page = pages[1];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let startY = 520;

    productDetails.forEach((item, index) => {
      const y = startY - index * 20;
      page.drawText(item.name, { x: 50, y, size: 12, font });
      page.drawText(String(item.quantity), { x: 250, y, size: 12, font });
      page.drawText(`${item.price * item.quantity}`, {
        x: 400,
        y,
        size: 12,
        font,
      });
    });
    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'invoice.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="mb-4 bg-green-600 text-white px-3 py-1 rounded"
    >
      Generate Invoice
    </button>
  );
}
