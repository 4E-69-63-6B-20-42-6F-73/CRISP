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


// TODO find beter name to make clear this is a class to be used on the edge between Typescript and Python
interface ModelShim extends tf.LayersModel {
    encoder_j: (data: any) => any; 

}


export function usePredict(): [boolean, (data: any[]) => number] {
    const [loading, setLoading] = useState(true);
    const [pyodide, setPyodide] = useState<any>(null);
    const [model, setModel] = useState<any>(null);

    useEffect(() => {
        const loadModel = async () => {
            const model = await tf.loadLayersModel('/CRISP/web_model/encoder_tfjs/model.json') as ModelShim;
            setModel(model);

            console.log(model.inputs)
            console.log(model.outputs)
            // console.log(model.modelSignature)
            
            model.encoder_j = (data:any):any => {
                console.log(data.toString())

                const json = JSON.parse(data.toString())
                
                const prediction = (model.predict([tf.tensor([json["cat"].map((value: string) => parseFloat(value))]), tf.tensor( [json["num"].map((value: string) => parseFloat(value))])]) as tf.Tensor).arraySync()
                return JSON.stringify(prediction)
            }
            console.log("Loaded tf model");
        };

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

        loadPyodideAndPackages().then(() => loadModel().then(() => setLoading(false)))

    }, []);


    const predict = (data: any[]): number => {
        const simple = pyodide.pyimport('simple');
        const prediction = simple.predict(model, data).toJs()[0]

        return prediction + 1; // + 1 since in the python code 0 == cluster.1
    }

    return [loading, predict];
}
