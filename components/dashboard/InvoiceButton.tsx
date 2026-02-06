"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface InvoiceButtonProps {
    order: any;
    className?: string;
}

export function InvoiceButton({ order, className }: InvoiceButtonProps) {
    const [generating, setGenerating] = useState(false);

    const generatePDF = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF();

            // Brand Header
            doc.setFontSize(22);
            doc.text("AYUNIV", 20, 20);
            doc.setFontSize(10);
            doc.text("The Ayurvedic Sanctuary", 20, 26);

            // Company Info (Right Aligned)
            const pageWidth = doc.internal.pageSize.width;
            doc.setFontSize(8);
            doc.text("SlightJoy Healthcare", pageWidth - 20, 20, { align: "right" });
            doc.text("GSTIN: 29AAAAA0000A1Z5", pageWidth - 20, 25, { align: "right" }); // Example GST
            doc.text("info@ayuniv.com", pageWidth - 20, 30, { align: "right" });

            // Line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 35, pageWidth - 20, 35);

            // Invoice Title
            doc.setFontSize(16);
            doc.text("TAX INVOICE", 20, 50);

            // Order & Customer Info
            doc.setFontSize(10);
            const startY = 60;

            // Left Column
            doc.text(`Invoice No: INV-${order.id.slice(0, 8).toUpperCase()}`, 20, startY);
            doc.text(`Date: ${new Date(order.created_at || new Date()).toLocaleDateString()}`, 20, startY + 6);
            doc.text(`Status: ${order.status.toUpperCase()}`, 20, startY + 12);

            // Right Column
            doc.text("Bill To:", 120, startY);
            doc.text(order.address?.name || "Valued Customer", 120, startY + 6);
            const addressLines = doc.splitTextToSize(`${order.address?.line}, ${order.address?.city}`, 70);
            doc.text(addressLines, 120, startY + 12);

            // Table
            const tableBody = order.items.map((item: any) => [
                item.name,
                item.qty,
                `Rs. ${item.price.toLocaleString()}`,
                `Rs. ${(item.price * item.qty).toLocaleString()}`
            ]);

            autoTable(doc, {
                startY: startY + 30,
                head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [90, 122, 106], textColor: 255 }, // #5A7A6A
                styles: { fontSize: 9, cellPadding: 3 },
            });

            // Totals
            const lastTable = (doc as any).lastAutoTable;
            let finalY = lastTable && lastTable.finalY ? lastTable.finalY + 10 : startY + 50;
            const subtotal = order.payment.subtotal;
            // Assuming tax is included in price for now, can separate if needed based on input
            const tax = order.payment.tax || (subtotal * 0.18); // Example calculation if not present, but using stored valid tax
            const total = order.payment.total;

            doc.text(`Subtotal:`, 140, finalY);
            doc.text(`Rs. ${subtotal.toLocaleString()}`, 190, finalY, { align: "right" });

            if (order.payment.discount > 0) {
                doc.setTextColor(220, 38, 38); // Red color for discount
                doc.text(`Discount:`, 140, finalY + 6);
                doc.text(`- Rs. ${order.payment.discount.toLocaleString()}`, 190, finalY + 6, { align: "right" });
                doc.setTextColor(0, 0, 0); // Reset
                finalY += 6; // Adjust spacing
            }

            // Adjust subsequent Y positions
            doc.text(`GST (Included):`, 140, finalY + 6);
            doc.text(`Rs. ${tax.toLocaleString()}`, 190, finalY + 6, { align: "right" });

            doc.text(`Shipping:`, 140, finalY + 12);
            doc.text(`Rs. ${(order.payment.shipping || 0).toLocaleString()}`, 190, finalY + 12, { align: "right" });

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Total Amount:`, 140, finalY + 22);
            doc.text(`Rs. ${total.toLocaleString()}`, 190, finalY + 22, { align: "right" });

            // Footer
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text("Thank you for choosing Ayuniv.", 105, 270, { align: "center" });
            doc.text("This is a computer generated invoice.", 105, 275, { align: "center" });

            doc.save(`Ayuniv-Invoice-${order.id.slice(0, 8)}.pdf`);
        } catch (err) {
            console.error("PDF Fail", err);
            alert("Failed to generate PDF");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={generating}
            className={cn(
                "group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#7A8A8A] hover:text-[#5A7A6A] transition-colors disabled:opacity-50",
                className
            )}
        >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />}
            {generating ? "Generating..." : "Download Receipt"}
        </button>
    );
}
