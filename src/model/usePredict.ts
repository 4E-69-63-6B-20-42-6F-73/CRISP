import { useEffect, useState } from "react";
import * as tf from '@tensorflow/tfjs';

/*
This hook contains the key logic that makes everything work.
The original model was created using Python, leveraging various packages, including TensorFlow. 
While we can use Pyodide to execute most Python code in the browser, TensorFlow is an exception.
To work around this, we use TensorFlow.js (tfjs) to run the autoencoder in the browser, while executing the remaining Python code with Pyodide.

The tfs model should be in web_model/replication_mmae
the python code should be in web_model/python.zip
*/

declare function loadPyodide(options: { packages: string[] }): Promise<any>;

export function usePredict() {
    const [loading, setLoading] = useState(true);
    const [pyodide, setPyodide] = useState<any>(null);
    const [model, setModel] = useState<any>(null);

    // // Load TensorFlow.js model
    useEffect(() => {
        const loadModel = async () => {
            const model = await tf.loadGraphModel('/CRISP/web_model/replication_mmae/model.json');
            setModel(model);
            console.log("Loaded tf model");
        };

        loadModel();
    }, []);

    // Load Pyodide and Python packages
    useEffect(() => {
        const loadPyodideAndPackages = async () => {
            console.log("Loading Pyodide and packages");
            const pyodideInstance = await loadPyodide({ packages: ["xgboost", "scikit-learn", "pandas"] });
            console.log("Loaded Pyodide and packages");

            setPyodide(pyodideInstance);

            console.log("Downloading Python code");
            const response = await fetch('/CRISP/web_model/python.zip');
            const buffer = await response.arrayBuffer();

            await pyodideInstance.unpackArchive(buffer, "zip");
            console.log("Unpacking Python code");   

            pyodideInstance.runPython(`exec(open('simple.py').read())`)

        };

        loadPyodideAndPackages();
    }, []);

    useEffect(() => {
        if (model !== null && pyodide !== null )
        setLoading(false)
    },
    [model, pyodide]
)

    const predict = (data: any[]) : number =>  {
        const simple = pyodide.pyimport('simple');

        return simple.predict(model, data) as number
    }

    return [loading, predict];
}
