import { create } from "zustand";

import { Analyse, Prediction } from "../types";

interface ApplicationState {
  analyses: Analyse[];
  addAnalyse: (analyse: Omit<Analyse, "id">) => number;
  addPrediction: (id: number, predictions: Prediction[]) => void;
}

const useApplicationStore = create<ApplicationState>()((set) => ({
  analyses: [
    {
      id: 1,
      name: "Test",
      description: "",
      created: new Date(2021, 4, 27),
      files: [],
      prediction: [
        { patientId: "1", prediction: 1 },
        { patientId: "2", prediction: 2 },
        { patientId: "3", prediction: 3 },
        { patientId: "4", prediction: 4 },
      ],
    },
    {
      id: 2,
      name: "Test2",
      description: "",
      created: new Date(2023, 5, 13),
      files: [],
    },
    {
      id: 3,
      name: "Test3",
      description: "gfdgsdfg",
      created: new Date(2023, 4, 5),
      files: [],
    },
  ],

  addAnalyse: (analyse: Omit<Analyse, "id">) => {
    let newId: number = 0; // Hacky. Find a better way to return the id.
    set((state) => {
      const maxId =
        state.analyses.length > 0
          ? Math.max(...state.analyses.map((a) => a.id))
          : 0;

      newId = maxId + 1;

      return {
        analyses: [...state.analyses, { id: newId, ...analyse }],
      };
    });
    return newId;
  },

  addPrediction: (id: number, predictions: Prediction[]) =>
    set((state) => ({
      analyses: state.analyses.map((analyse) =>
        analyse.id === id
          ? {
              ...analyse,
              prediction: [...(analyse.prediction || []), ...predictions],
            }
          : analyse
      ),
    })),
}));

const useAnalyses = () => useApplicationStore((s) => s.analyses);
const useGetAnalysesById = (id: number) => {
  const analyse = useApplicationStore((s) =>
    s.analyses.find((x) => x.id === id)
  );

  if (!analyse) {
    throw new Error("No analyse with the specified id");
  }

  return analyse;
};

const useAddAnalyse = () => useApplicationStore((s) => s.addAnalyse);
const useAddPrediction = () => useApplicationStore((s) => s.addPrediction);

export { useAnalyses, useAddAnalyse, useGetAnalysesById, useAddPrediction };