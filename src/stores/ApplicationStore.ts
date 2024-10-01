import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

import { Analyse, Prediction } from "../types";

interface ApplicationState {
  analyses: Analyse[];
  addAnalyse: (analyse: Omit<Analyse, "id">) => number;
  addPrediction: (id: number, predictions: Prediction[]) => void;
}

const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      analyses: [],
      addAnalyse: (analyse: Omit<Analyse, "id">) => {
        let newId: number = 0;
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
    }),
    {
      name: 'application-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.analyses = state.analyses.map((analyse) => ({
            ...analyse,
            created: new Date(analyse.created),
            files: analyse.files.map((file) => ({
              ...file,
              content: JSON.parse(JSON.stringify(file.content)), 
              // Hmmm... This feels hacky. Find a better solutions that doesn't involve making it json again.
              // But it's kinda the same with Date...
            })),
          }));
        }
      }
    }
  )
);

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
