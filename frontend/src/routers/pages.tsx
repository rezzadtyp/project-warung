import { lazy } from "react";
import Loadable from "@/components/utils/Loadable";

export const IndexPage = Loadable(lazy(() => import("@/pages/IndexPage")));
export const IndexLayout = Loadable(lazy(() => import("@/layouts/IndexLayout")));