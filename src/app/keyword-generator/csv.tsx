"use client";

import * as XLSX from "xlsx";

export function exportToCSV(data: any[], filename = "keywords.csv") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Keywords");
  XLSX.writeFile(workbook, filename);
}
