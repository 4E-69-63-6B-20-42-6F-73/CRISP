import papa from "papaparse"
import * as XLSX from "xlsx";

export default async function ExtractContent(file: File): Promise<JSON> {

    switch (file.type) {
        case 'text/csv':
        case 'application/vnd.ms-excel':  // Common MIME type for CSVs
            return ExtractCSV(file);

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':  // XLSX MIME type
        case 'application/vnd.ms-excel.sheet.macroEnabled.12':
            return ExtractXLSX(file);
       
        default:
            throw new Error(`Unsupported file type: ${file.type}` )
    }
}

async function ExtractCSV(file: File): Promise<JSON> {
    return new Promise((resolve, reject) => {
        papa.parse<JSON>(file, {
          header: true,
          complete: function(results) {
            resolve(JSON.parse(JSON.stringify(results
                .data
            ))); 
          },
          error: function(error) {
            reject(error);
          }
        });
      });
}

async function ExtractXLSX(file: File): Promise<JSON> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // When the file is read, we will use xlsx to parse the data
        reader.onload = (event) => {
            const data = event.target?.result;

            try {
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];  // Get the first worksheet name
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);  // Convert worksheet to JSON
                resolve(json as unknown as JSON);
            } catch (error) {
                reject(error);
            }
        };

        // Read the file as binary string
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
}