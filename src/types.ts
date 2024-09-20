type Analyse = {
    id: number
    name: string;
    description: string;
    created: Date
    files: File[];
    prediction?: Prediction[]
};

type Prediction = {
    patientId: string
    prediction: number
}
export type { Analyse, Prediction };
