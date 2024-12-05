import { expectedColumnInFile } from "./orders";

type Analyse = {
    id: number;
    name: string;
    description: string;
    created: Date;
    files: FileWithContent[];
    prediction?: Prediction[];
};

type FileInput = {
    [K in (typeof expectedColumnInFile)[number]]: any;
};

type FileWithContent = {
    file: File | undefined; // Note this one is undefined after a while.
    fileName: string;
    content: FileInput[];
};

type Prediction = {
    patientId: string;
    prediction: number;
};
export type { Analyse, Prediction, FileInput };
