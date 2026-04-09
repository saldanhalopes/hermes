/**
 * ReportService handles data export for Hermes Control.
 * It uses native browser capabilities for CSV generation and 
 * Print-to-PDF workflows.
 */

export const ReportService = {
  /**
   * Generates and downloads a CSV file from an array of objects.
   */
  exportToCSV: (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] ?? '';
          const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          // Escape quotes and wrap in quotes
          return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Opens a print-optimized view of the page.
   * This is a "Premium" approach that leverages browser PDF engines.
   */
  printReport: () => {
    window.print();
  }
};
