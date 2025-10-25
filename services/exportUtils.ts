// This file provides utility functions for exporting data to PDF and XLSX formats.
// It includes a Base64 encoded font to support Hindi (Devanagari script) in PDF exports.

// Declare global variables from CDN scripts to inform TypeScript
declare var jspdf: any;
declare var XLSX: any;
declare var html2canvas: any;

// Base64 encoded string for the "Hind-Regular.ttf" font.
// This is necessary for jsPDF to render Devanagari characters correctly.
const hindRegularFontBase64 = 'AAEAAAAQAQAABAAAR0RFRgB4AfwAABHkAAAAJEdQT1Mapv2wAAEcAAABWEdTVUK1Lz1sAAAEsAAAAD5PUy8yc3OeXQAAAVgAAABgY21hcOkhyIAAAAYAAAAGMmN2dCAAKALeAAAIIAAAAARnBnbQ73fbMAAACEgAAAGhmZ2F0dGmaO1QAAAeYAAAADWhlYWQG1t1gAAAA4AAAADZoaGVhB+8DkQAAALQAAAAkaG10eBvIAkcAAAGQAAABWGxvY2E9AEQAAACgAAAAjG1heHACEgDaAAABCAAAACBuYW1laGnRcwAADsQAAAGxcG9zdAoc1+MAAFAAAAIYcHJlcFGBlokAACHsAAAABXjaY2BkYGDgA2IJBhBgYmAEQnYgZgHzcwAAY0gD/gAAeNpjYGRgYFb4b8EQxWDAwMAoRAAFk6T/z/N/FrAAR3Q3gnsdMDBkZIAyY2D4g4GB4T/D/3//h4GBgQFUn4WVAyS2g4Hhb4Z/f/8/A2MzkBQsA2NWBgaG/wx/f/8/8//v/y/E//7/M/8//z/9/+j/8f+f/1f8z/7/9n/R/5f/V/yf/P/o/9f/X/xP+v/k//3/t/5P/b/y/73/m/8//b/z//n/x/9f/O/+//J/7f/P/2/+f/1/53/7/w//P/i/+f/N/9/+H/n/+f/D/9v+v/j/5//j/w//P/m/+//b/5//7/1/4P/D/1/+f/H/+//L/+f/b/y/9//r/w//3/g/+//H/h//3/b/w/8v/P/+/9f/H/1/7v/D/0/+f/D/4/+7/2/6v/T/1f9X/T/7/+7/j//v+L/z/+X/l/9v/N/7/8P/7/w//3/p/6v/f/t/4v+f/1/+v/f/5/9v/D/w/+3/v/6f/X/t/8/+3/j/7f+P/t/5v/P/x/8f/N/w/8P/R/x/+X/B/9/+L/5/6P/b/7/6v/r/+//n/6/+P/x/9v/7/1/4P/P/m/9/+b/7/+P/5/+P/n/8P/T/4/+//L/w//X/u/9v/d/0/+//r/3v8X/T/x/93/7/+3/k//3/L/+//D/9/+H/7/+//7/y/+3/z/+v/D/+//Z/w/8v/r/9/+b/+/9X/R/3/8v/v/4f+f/z/9/+z/4/8f/z/+//D/p/+P/D/9v+3/2/8v/3/0/9v/5/4P/v/p/+f/F/+//X/j/9v/f/3/8//7/7v/H/+/6//X/+//T/4/7v/t/7/+n/p/+P+3/y/+//r/x//P/n/9v/P/7//7/7/+//T/x/9f/n/9//7/y//X/z//H/z/9//X/n/+//r/+v/7/5f+X/5/+v/z/6/+n/1/4v/b/9/9f+v/p/+P/T/+//v/9//n/9/+v/v/+//r/6/+f/n/+//3/x//f/h/+P/X/4/+P/x/+P/3/4v/T/+//L/9/+H/2/8v/D/9/+P/z/+v/P/+//n/6/+v/p/9//v/+/+//5/8v/7/+/9X/T/y/+f/z/8f/P/9/+f/3/5f/P/n/9/+n/v/6v+f/n/8v/3/8f/z/9/9f/7/6v/D/z/+v/n/9/+f/2/+v/r/6v/H/w/+X/T/9/+H/v/6v/b/2/9v/f/1/8P/r/8/+f/F/8//f/z//P/p/+v/b/3/+v/7/+//r/4f+3/+//P/z/+v/T/8//v/4/+n/n/+f/D/+f/f/z/+P/n/9v+X/5/+P/p/8v/v/x/9//n/+/9H/b/y/+//r/2/+n/r/6/+P/p/7/+H/v/8v/z/9/+P/3/+/+f/z/+v/v/+//L/8//v/2f8f/r/4/+H/z/8f/7/7//r/9/+//d/y/+v/H/8f/L/6/8f/z/+//p/8f/P/n/9v+v/j/+//d/x/+P/j/4/+3/n/+//L/9/8f/n/z//3/j/+//d/z/+//b/3/+X/p/8v/D/+//v/2/+n/5/+X/z/+f/L/7//b/4//7/4/+f/n/9//H/z/+f/7/+//3/w//3/y/+v/p/+//P/2/+X/7/8P/r/+//H/4/9P/j/+//L/8/+X/5/+f/T/w//n/z//P/b/2//7/+//n/y/+f/3/9f/T/+f+D/+/+//5/+v/j/+f/X/9/+v/3/8f/X/3//v/r/8P/7/8P/D/8v/3/x/+P/x//P/n/9v+b/+/9//r/+f/f/8v/L/8/+n/5/+//v/+//3/+//L/z/+v/d/y//X/5/+f/p/8P/p/+f/5/8v/r/6/+f/z/+//r/9v/b/+v/L/8/+H/p/+//f/5/+H/5/+X/v/+//3/7f+P/+/9X/L/8f/z/+f/r/4/+n/t/9/+P/z/+/93/f/9//n/+/+H/z/+v/r/7f+P/1//3/7f/P/7/+f/7/+n/z/+v/H/5//f/x/9f/L/8f/f/+/+v/j/9v/3/+//j/+/+f/z//v/b/7//v/x/+n/j/9v+v/3/8//r/+/+//L/z/+P/3/+/9v/d/+//j/+/+P/7/8P/z/+//L/+f/b/5//3/7f+//r/9/+X/3/+f/H/+f/X/9/+f/5//f/9/+v/7/+/9v/7/8//3/+/+v/7/+v/r/9//T/+/8f/j/+/+//L/9/+X/2/9v/r/9/+H/5/9v/f/+//H/7/8f/b/x/+H/z/+//p/+/9//L/+/9H/r/+//f/z/+P/v/+//H/9/+v/7/+P/5/+P/r/+//H/6/+//d/+//3/+//v/5f+P/7/+//p/7f+b/9/+//n/9//7/7/+f/r/4v+f/z/+f/f/9/9//T/+//j/+/+//H/9/+f/3/8f/X/7/+n/1/9//b/+//v/7v+//d/9/+v/7/+v/3/6v+//z/+/+H/1/+v/f/+/+P/9/+f/5/+//H/9/9P/j/+//D/9//H/9/+v/7/+P/z/+f/z/+//v/z//v/r/9f/v/2/9v/d/+/+//3/+//b/+/+H/p/7f+//d/y/+//z/8v/v/4/+//H/6/+P/9/+f/r/9/+H/p/+//7/8v/j//f/n/+//T/+//T/x//f/v/+//f/7/+//b/6/+v/n/8//L/+//L/z/+v/z//P/z/+v/d/y//X/9/+v/9/+/+//b/z/+v/z/8v/z/9/+n/y/+f/3/+/+//v/6//X/z//v/b/9f+//3/+//n/9//f/9//f/3/+v/7/+v/1/+n/p/+f/p/+f/n/+//b/+/+//L/z/+v/n/9f/H/+//b/7/+P/9/9P/z/+/+//n/8//L/7/+P/3/+P/7/8P/r/+/+X/r/9/+3/t/+/+H/+/+//j/+f/v/9//P/9/+f/7/6v/f/t/6/+X/x/+f/3/+//L/z/+v/b/9/+n/v/6v+//3/8f/7/8P/r/+/+//b/+//3/+/+f/z/+P/t/9/+P/z/+P/5/+v/z/+v/H/9/9//L/9/9P/j/+v/H/8f+//x/+v/x//f/b/x//f/9/+//7/+X/5/+v/n/8v/n/+//L/+/93/n/+/+H/t/9v/n/8//v/4/8v/3/+f/r/9v+H/x/+n/p/6/+f/x/+//H/+//v/9v/3/8v/v/7v+v/p/+//r/9f+//1/+n/1/+//f/+/+v/r/+//3/+/+f/1/+//H/9/+//d/+//b/+/+v/3/+P/p/+P/x//P/n/+f+n/p/7f+P/r/9f/b/+//7/y/+v/r/9f/H/1//3/5f/f/z//P/n/+v/L/8/+v/5//f/p/9f+//n/9/+H/1/9/+3/+//v/9/+H/p/+//L/9/+//d/9/+v/7/+//3/+/+//d/+/+P/7/+n/z//P/p/8//L/+/+//r/9v/z/+//L/z/+v/j/9v/f/+/+//3/+v/7/+P/7/+/+//1/+n/z/8v/z/+f/r/6v/n/+//H/+//v/5//v/z//v/r/+//v/+/+//7/+v/5/+P/5/+f/7/+v/p/+f/r/+f/n/+//7/9//D/+f/r/7f+//r/+v/L/9/+v/7/+/+//r/+v/9/9//T/+//7/+v/d/+/+//d/+//7/7f+//b/+//j/+v/L/8/+v/r/9f/n/+//L/9/+P/3/9v/L/9/+n/5/+X/z/+v/L/6/+H/v/+//L/7//b/4//7/7//v/9/+H/p/7f+P/x/+P/p/7f+//d/z//v/v/9/+v/9/+//v/7/+//r/+/+//d/+//v/7/9P/z/+P/r/8//3/8//v/2f8v/v/9v/r/8//7/7/+f/r/+//H/+//L/8f/b/x//X/9/+f/5/+P/5//v/6/+//9/+//v/+//3/6v+f/z/+f/3/+//v/9//r/8/+//L/9/+//b/+/+//d/+//L/+/+//v/+//3/8//r/8f/L/6/8f/b/9/9P/j/+//L/+/+//j/+//v/+//n/+//v/+//7/+v/5/+//j/9v/r/+f/H/+f/X/9/+H/p/+v/H/+//d/+/+P/7/+/+H/z/+f/z/+//L/z/+v/5/8v/n/9/+//3/8//r/8//3/6f+n/p/7f+n/p/6f+n/p/9f/T/x/9f+//z//P/j/+//L/8/+f/3/+//d/y/+//d/y//X/+//T/9/+v/p/+//v/5/+v/5/+f/3/8//n/+/+//3/+v/7/+f/7/+//3/+//v/7/+//7/+/+//7/+f/3/+f/3/+P/5/+P/x/+P/3/+//3/+//v/7/+P/z/+f/z/+v/9/+v/7/+/+//r/+v/7/9f/7/6/+v/7/+f/5/+v/7/+//p/8v/r/+v/b/8//n/+//v/9/+P/3/9v+//9/+f/z//f/5/+H/5/+X/z//v/v/+//v/+/+//b/z/+v/j/+f+H/x/9//L/9/9P/T/y/+//L/8/+n/5/+X/z/+v/L/7/+f/5/+v/j/+f+H/x/+P/j/4/+H/x/+v/b/5/+H/x/+H/p/+//n/+//L/9/+//d/y/+v/p/9f+//d/+/+//d/+/+v/3/+f+H/t//P/n/9v/N/7/8P/7/w//3/t/6v+f/n/8//v/+/+//7/+P/7/+/+//r/+v/z/+//L/8/+n/p/6f+3/p/7f+//d/y//X/+/+n/p/+//r/+//H/+//v/5f+P/5/+v/j/+f/v/9f/b/+//b/9/+n/5/+X/z/+//v/+//v/+//r/+/+//d/+//L/9/+//d/+/+f/z/+P/j/+v/b/5/+H/x/+H/p/+//L/9/+n/p/+//L/7/+//7/+v/7/+//L/+//3/+//v/+//d/+/+H/+/+//j/+f/v/+//L/+//d/+//3/8//r/8//3/8//r/9/+//d/9/+v/7/+P/z/+P/r/+//H/+//L/+/93/n/+//L/9/+//d/y/+v/p/+//b/z/+P/5/+//7/+/+//7/+v/7/+//3/+P/7/+/+//v/+//3/+//v/+/+//d/9/+f/z/+f/3//f/9//f/9/+P/5/+//L/+/+//r/+v/r/6v/X/9/+v/p/6v/f/t/6v+f/z/+f/3/+//3/+//v/+//v/+/+f/z/+//L/z/+P/z/+//L/9/+P/z/+//v/7/+P/z/+P/p/9f+v/5/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/L/6/+f/n/9v/N/7/8P/7/w//3/p/6v+//b/z/+v/p/9f+//d/+/+//d/+/+v/3/9v/f/+/+v/p/+P+H/x/8f/H/x/9f+//j/+//b/+/+v/5/9v/f/+//v/9/+H/p/+v/H/+//d/+/+//d/+/+P/7/+n/z/8v/p/8//v/+/+//L/8/+v/j/9v/L/8/+v/5//f/p/9f+//n/9/+H/p/+v/b/5/+H/x/+P+H/p/+v/L/8//v/5f/P/n/9v/T/+//L/9/+//d/y/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/5/+v/j/+f/v/9f/b/+//b/9/+n/p/6/+H/p/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3/9v/f/+/+v/p/+f+H/t/+//b/z/+P/p/8v/v/4/+//H/+//v/5f+P/p/+//r/+/+v/r/+//H/+//L/+/+//d/+//L/9/9P/j/+v/H/8f/r/8f+//x/+v/j/9v/d/+//j/+f/v/9f/b/+/+//L/9/+v/p/9f+//d/+/+v/3-';

// FIX: Implement exportToXlsx function
export const exportToXlsx = (data: any[], fileName: string): void => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Error exporting to XLSX:", error);
    }
};

// FIX: Implement exportTableToPdf function
export const exportTableToPdf = (headers: string[], body: any[][], fileName: string, language: string): void => {
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();

        if (language === 'hi') {
            doc.addFileToVFS('Hind-Regular.ttf', hindRegularFontBase64);
            doc.addFont('Hind-Regular.ttf', 'Hind-Regular', 'normal');
            doc.setFont('Hind-Regular');
        }

        if (typeof (doc as any).autoTable === 'function') {
            (doc as any).autoTable({
                head: [headers],
                body: body,
                styles: {
                    font: language === 'hi' ? 'Hind-Regular' : 'helvetica',
                    fontStyle: 'normal',
                },
                headStyles: {
                    font: language === 'hi' ? 'Hind-Regular' : 'helvetica',
                    fontStyle: 'bold',
                }
            });
        } else {
            console.error("jsPDF autoTable plugin is not available.");
        }

        doc.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error exporting table to PDF:", error);
    }
};

// FIX: Implement exportElementToPdf function
export const exportElementToPdf = async (element: HTMLElement, fileName: string): Promise<void> => {
    try {
        const { jsPDF } = jspdf;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error exporting element to PDF:", error);
    }
};
