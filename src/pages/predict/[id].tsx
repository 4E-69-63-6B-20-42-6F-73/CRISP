import { useEffect, useState } from "react";
import { ProgressBar } from "@fluentui/react-components";

import {
  useGetAnalysesById,
  useAddPrediction,
} from "@/stores/ApplicationStore";

import { useNavigate, useParams } from "@/router";
import { usePredict } from "@/model/usePredict";

export default function Predict() {
  const params = useParams("/predict/:id");
  const id = Number(params.id);

  const navigate = useNavigate();

  const addPrediction = useAddPrediction();
  const [loading, predict] = usePredict()
  const [isPredicting, setIsPredicting] = useState(false)

  const analyse = useGetAnalysesById(id);

  if (analyse.prediction !== undefined){
    navigate("/detail/:id", { params: { id: id.toString() } });
  }

  useEffect(() => {
    if (!loading) {
      setIsPredicting(true)

      const predictions = analyse.files
      .flatMap(x => x.content as any[])
      .map(x => Object.values(x) as any[])
      .map((data) => {
          const patientId = data[0];
          try {
              const prediction = predict(data);
              return { patientId, prediction };
          } catch (error) {
              console.error(`Error predicting for patient ${patientId}:`, error);
              return { patientId, prediction: -1 };
          }
      });
  
      
        addPrediction(id, predictions)
        setIsPredicting(false)
    }
  }, [loading])


  if (loading) {
    return <h1>Loading....</h1>
  }
  else if (isPredicting) 
    {
      return <h1>Predicting....</h1>
    }
  else {
    return navigate("/detail/:id", { params: { id: id.toString() } }); // TODO Change...
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          minHeight: "200px",
          textAlign: "center",
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "column",
        }}
      >
        {/* <h3>{text.line3}</h3>
        <h2>{text.line2}</h2>
        <h1>{text.line1}</h1> */}
      </div>

      <ProgressBar style={{ width: "50%" }} />
      <p>Please do not close this window</p>
    </div>
  );
}

// type State = "extracting" | "loading" | "predicting";

// const getText = (state: State, predicted: number, total: number) => {
//   switch (state) {
//     case "extracting":
//       return { line1: "Extracting data", line2: "", line3: "" };
//     case "loading":
//       return { line1: "Loading model", line2: "Extracting data", line3: "" };
//     case "predicting":
//       return {
//         line1: `Predicting ${predicted + 1} / ${total}`,
//         line2: "Loading model",
//         line3: "Extracting data",
//       };
//     default:
//       return { line1: "", line2: "", line3: "" };
//   }
// };

// async function* predictor() {
//   yield new Promise<State>((resolve) =>
//     setTimeout(() => resolve("extracting"), 500)
//   );

//   yield new Promise<State>((resolve) =>
//     setTimeout(() => resolve("loading"), 1000)
//   );
//   yield new Promise<State>((resolve) =>
//     setTimeout(() => resolve("predicting"), 2000)
//   );
// }
