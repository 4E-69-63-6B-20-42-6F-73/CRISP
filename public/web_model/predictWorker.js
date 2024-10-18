/*
This serviceworker contains the key logic that makes everything work.
The original model was created using Python, leveraging various packages, including TensorFlow. 
While we can use Pyodide to execute most Python code in the browser, TensorFlow is an exception.
To work around this, we use TensorFlow.js (tfjs) to run the autoencoder in the browser, while executing the remaining Python code with Pyodide.

The tfs model should be in web_model/replication_mmae
the python code should be in web_model/python.zip
*/

importScripts(
    "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js",
);
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let pyodide = null;
let model = null;
let simple = null;

self.onmessage = async function (event) {
    const { data } = event.data;

    if (!pyodide) {
        pyodide = await loadPyodideWithEverything();
    }

    if (!model) {
        model = await loadTFJSModel();
    }

    if (!simple) {
        simple = pyodide.pyimport("simple");
    }

    self.postMessage({ type: "loaded" });

    const predictions = [];
    for (let index = 0; index < data.length; index++) {
        const x = data[index];
        const patientId = x[0];
        try {
            const prediction = simple.predict(model, x).toJs()[0] + 1; // + 1 since in the python code 0 == cluster.1
            predictions.push({ patientId, prediction: prediction });
        } catch (error) {
            console.log(`Error during prediction ${patientId}: ${error}`);
            predictions.push({ patientId, prediction: -1 });
        }

        console.log(`Predicting ${index + 1} / ${data.length}`);

        self.postMessage({
            type: "progress",
            index: index + 1,
            total: data.length,
        });
    }
    self.postMessage({ type: "done", predictions });
};

async function loadPyodideWithEverything() {
    const pyodide = await self.loadPyodide();
    await pyodide.loadPackage("xgboost");
    await pyodide.loadPackage("scikit-learn");
    await pyodide.loadPackage("pandas");
    console.log("Loaded Pyodide and packages");

    const response = await fetch("python.zip");
    const buffer = await response.arrayBuffer();
    await pyodide.unpackArchive(buffer, "zip");
    console.log("Unpacked Python code");

    pyodide.runPython(`exec(open('simple.py').read())`);
    return pyodide;
}

async function loadTFJSModel() {
    const model = await self.tf.loadGraphModel("encoder_tfjs/model.json");

    model.encoder_j = (data) => {
        console.log("Encoding data:", data);

        const json = JSON.parse(data);
        const catTensor = self.tf.tensor([
            json["cat"].map((value) => parseFloat(value)),
        ]);
        const numTensor = self.tf.tensor([
            json["num"].map((value) => parseFloat(value)),
        ]);

        const prediction = model.predict([catTensor, numTensor]).arraySync();
        return JSON.stringify(prediction);
    };

    console.log("TensorFlow.js model loaded");
    return model;
}
