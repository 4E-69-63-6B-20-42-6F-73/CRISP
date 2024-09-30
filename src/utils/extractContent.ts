import papa from "papaparse"

export default async function ExtractContent(file: File): Promise<JSON> {

    switch (file.type) {
        case 'text/csv':
        case 'application/vnd.ms-excel':  // Common MIME type for CSVs
            return ExtractCSV(file);

        default:
            return new Promise(() => JSON.parse("{}"))
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
// async function ExtractXLSX(file:File): JSON[] {
//     return await csv().fromFile(file.webkitRelativePath)
// }