import papa from "papaparse";
import * as XLSX from "xlsx";

export default async function ExtractContent(file: File): Promise<any[]> {
    // Sometimes all data is returned as string, while they are numbers. So try to make everything that could be a number a number.
    return (await extractFromFile(file)).map((x) =>
        tryConvertPropertiesToNumber(x),
    );
}

async function extractFromFile(file: File): Promise<any[]> {
    switch (file.type) {
        case "text/csv":
        case "application/vnd.ms-excel": // MIME type for CSVs
            return ExtractCSV(file);

        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": // MIME type for XLSX
        case "application/vnd.ms-excel.sheet.macroEnabled.12":
            return ExtractXLSX(file);

        default:
            throw new Error(`Unsupported file type: ${file.type}`);
    }
}

async function ExtractCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        papa.parse<JSON>(file, {
            header: true,
            complete: function (results) {
                resolve(results.data);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}

async function ExtractXLSX(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target?.result;

            try {
                const workbook = XLSX.read(data, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                resolve(json as any[]);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
}

function tryConvertPropertiesToNumber(obj: any): any {
    const result: any = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            result[key] = isNaN(Number(value)) ? value : Number(value);
        }
    }

    return result;
}
