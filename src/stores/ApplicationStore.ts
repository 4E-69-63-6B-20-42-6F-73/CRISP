import { create } from 'zustand'

import { Analyse } from '../types';

interface ApplicationState {
    analyses: Analyse[]
    addAnalyse: (analyse: Analyse) => void
}

const useApplicationStore = create<ApplicationState>()((set) => ({
    analyses: [
        {
            name: "Test",
            description: "",
            created: new Date(2021, 4, 27),
            files:[]
        },
        {
            name: "Test2",
            description: "",
            created: new Date(2023, 5, 13),
            files:[]
        },
        {
            name: "Test3",
            description: "gfdgsdfg",
            created: new Date(2023, 4, 5),
            files:[]
        },
    ],
    addAnalyse: (analyse: Analyse) =>  set((state) => ({ analyses: [...state.analyses, analyse] })),
}))


const useAnalyses = () => useApplicationStore(s => s.analyses)
const useAddAnalyse = () => useApplicationStore(s => s.addAnalyse)

export { useAnalyses, useAddAnalyse }