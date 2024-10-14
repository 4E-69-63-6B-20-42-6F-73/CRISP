import * as XLSX from "xlsx";

export function exportJsonToExcel(
    json: any[],
    sheetName = "Sheet1",
    fileName = "data.xlsx",
) {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, fileName);
}
