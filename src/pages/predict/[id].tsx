import { useParams, useNavigate } from "../../router";
import {
  useAddPrediction,
  useGetAnalysesById,
} from "../../stores/ApplicationStore";

export default function Details() {
  const params = useParams("/predict/:id");
  const id = Number(params.id);

  const navigate = useNavigate();

  const analyse = useGetAnalysesById(id);
  const addPrediction = useAddPrediction();

  addPrediction(id, [{ patientId: "123", prediction: 1 }]);

  navigate("/detail/:id", { params: { id: id.toString() } });

  return <h1>Predicting... {analyse.id}</h1>;
}
