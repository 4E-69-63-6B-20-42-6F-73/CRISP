// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
    | `/`
    | `/detail/:id`
    | `/new`
    | `/playground`
    | `/predict/:id`;

export type Params = {
    "/detail/:id": { id: string };
    "/predict/:id": { id: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
    Path,
    Params,
    ModalPath
>();
export const { redirect } = utils<Path, Params>();
