'use client';

import { useState } from 'react';
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
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

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
        .setText(
          `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        );

      const pages = pdfDoc.getPages();
      if (pages.length < 2) {
        throw new Error('PDF does not have a second page');
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
      const blob = new Blob([pdfBytes as BlobPart], {
        type: 'application/pdf',
      });
      saveAs(blob, 'invoice.pdf');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`mb-4 px-3 py-1 rounded text-white
        ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-800'
        }
      `}
    >
      {isGenerating ? 'Generating...' : 'Generate Invoice'}
    </button>
  );
}
