import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Analyse, Prediction } from "../types";
import { getItem, removeItem, setItem } from "./indexdb";

const idbStorage = {
    getItem: async (key: string) => {
        const value = await getItem(key);
        return value ? JSON.stringify(value) : null;
    },
    setItem: async (key: string, value: string) => {
        console.log(value);
        const parsedValue = JSON.parse(value);
        await setItem(key, parsedValue);
    },
    removeItem: removeItem,
};

interface ApplicationState {
    analyses: Analyse[];
    addAnalyse: (analyse: Omit<Analyse, "id">) => number;
    updateAnalyse: (analyse: Analyse) => void;
    addPrediction: (id: number, predictions: Prediction[]) => void;

    hasLoaded: boolean; //Check to see if the data has been loaded
    setHasLoaded: (state: boolean) => void;
}

const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            hasLoaded: false,
            setHasLoaded: (state: boolean) => {
                set({
                    hasLoaded: state,
                });
            },
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
                        analyses: [
                            ...state.analyses,
                            { id: newId, ...analyse },
                        ],
                    };
                });
                return newId;
            },
            updateAnalyse: (updatedAnalyse: Analyse) =>
                set((state) => ({
                    analyses: state.analyses.map((analyse) =>
                        analyse.id === updatedAnalyse.id
                            ? { ...analyse, ...updatedAnalyse }
                            : analyse,
                    ),
                })),
            addPrediction: (id: number, predictions: Prediction[]) =>
                set((state) => ({
                    analyses: state.analyses.map((analyse) =>
                        analyse.id === id
                            ? {
                                  ...analyse,
                                  prediction: [
                                      ...(analyse.prediction || []),
                                      ...predictions,
                                  ],
                              }
                            : analyse,
                    ),
                })),
        }),
        {
            name: "application-store",
            storage: createJSONStorage(() => idbStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasLoaded(true);
                if (state) {
                    state.analyses = state.analyses.map((analyse) => ({
                        ...analyse,
                        // For some reason analyse.created is sometimes still a string...
                        created: new Date(analyse.created),
                        files: analyse.files.map((file) => ({
                            ...file,
                            content: file.content,
                        })),
                    }));
                }
            },
        },
    ),
);

const useAnalyses = () => useApplicationStore((s) => s.analyses);
const useGetAnalysesById = (id: number) => {
    const analyse = useApplicationStore((s) =>
        s.analyses.find((x) => x.id === id),
    );

    if (!analyse) {
        throw new Error("No analyse with the specified id");
    }

    return analyse;
};

const useAddAnalyse = () => useApplicationStore((s) => s.addAnalyse);
const useUpdateAnalyse = () => useApplicationStore((s) => s.updateAnalyse);

const useAddPrediction = () => useApplicationStore((s) => s.addPrediction);

const useHasLoaded = () => useApplicationStore((s) => s.hasLoaded);
export {
    useHasLoaded,
    useAnalyses,
    useAddAnalyse,
    useUpdateAnalyse,
    useGetAnalysesById,
    useAddPrediction,
};
