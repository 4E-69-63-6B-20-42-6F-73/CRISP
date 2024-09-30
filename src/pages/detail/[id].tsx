import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from "@fluentui/react-components";
import { useNavigate, useParams } from "../../router";
import { useGetAnalysesById } from "../../stores/ApplicationStore";

export default function Details() {
  const params = useParams("/detail/:id");
  const id = Number(params.id);

  const navigate = useNavigate();

  const analyse = useGetAnalysesById(id);

  const details = analyse.prediction?.map( x =>  <p> { x.patientId } { x.prediction } </p>)
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => navigate("/")}>
            My analyses
          </BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current> {analyse.name} </BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>

      {details}
    </>
  );
}
