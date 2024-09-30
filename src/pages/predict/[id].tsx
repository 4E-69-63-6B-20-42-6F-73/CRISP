import { useEffect } from "react";
import { ProgressBar } from "@fluentui/react-components";

// import {
//   useGetAnalysesById,
//   useAddPrediction,
// } from "../../stores/ApplicationStore";
// import { useNavigate, useParams } from "../../router";
import { usePredict } from "../../model/usePredict";

export default function Predict() {
  // const params = useParams("/predict/:id");
  // const id = Number(params.id);

  // const navigate = useNavigate();

  // const addPrediction = useAddPrediction();
  const [loading, predict] = usePredict()


  // const [state, setState] = useState<State>("extracting");
  // const [predicted] = useState(0);
  // const text = getText(state, predicted, 200);

  const data = "01001|0.3126284518385913|1.4956309894562494|0.33411334769482753|-0.2849260529871922|0.08027216901345147|-0.03340348055189329|1.0|1.0|0.0|1|0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|1.0|0.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0|1.0|1.0|0.0|1.0|0.0|1.0|0.0|1.0|0.0|0.0".split("|")
  useEffect(() => {
    // const simulatePrediction = async () => {
    //   for await (const newState of predictor()) {
    //     setState(newState);
    //   }
    // };
    if (!loading){
    // simulatePrediction();
      const prediction = predict(data)

      console.log(prediction.toString())
  }
  }, [loading]);

  // const analyse = useGetAnalysesById(id);

  // addPrediction(analyse.id, [{ patientId: "123", prediction: 1 }]);

  // navigate("/detail/:id", { params: { id: id.toString() } });


  if (loading) 
    {
      return <h1>Loading....</h1>
    }

  else {
    return <>Done!</>
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
