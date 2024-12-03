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
                const sheetnames = workbook.SheetNames.filter(
                    (x) => x !== "Legend",
                );

                const json = sheetnames.flatMap((x) =>
                    removeHeaderAndRenameKeys(
                        XLSX.utils.sheet_to_json(workbook.Sheets[x], {
                            header: 1,
                        }),
                    ),
                );
                resolve(json as any[]);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
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

// Using headers 1 on XLXS results in the first record te be the columnnames
function removeHeaderAndRenameKeys(data: unknown[][]): any[] {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid data: Must be a non-empty 2D array.");
    }

    // Extract and remove the header row
    const columnMapping = data.shift() as string[];

    if (!Array.isArray(columnMapping) || columnMapping.length === 0) {
        throw new Error(
            "Invalid header: The first row must contain column names.",
        );
    }

    // Map data rows to objects based on the column mapping
    return data.map((row) => {
        return columnMapping.reduce(
            (acc, colName, index) => {
                acc[colName] = row[index] || null; // Default to null for missing values
                return acc;
            },
            {} as Record<string, any>,
        );
    });
}
