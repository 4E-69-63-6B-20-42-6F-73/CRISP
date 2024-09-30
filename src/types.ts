type Analyse = {
  id: number;
  name: string;
  description: string;
  created: Date;
  files: FileWithContent[];
  prediction?: Prediction[];
};

// Since we are working with CSV or XLSX we can have diffrent columns.
type FileWithContent = {
  file: File;
  content: JSON;
}

type Prediction = {
  patientId: string;
  prediction: number;
};
export type { Analyse, Prediction };
