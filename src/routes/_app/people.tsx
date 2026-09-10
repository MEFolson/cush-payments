import { createFileRoute } from "@tanstack/react-router";
import { PeopleView } from "@/components/people-view";

export const Route = createFileRoute("/_app/people")({
  component: PeopleView,
});
