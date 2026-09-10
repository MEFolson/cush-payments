import { createFileRoute } from "@tanstack/react-router";
import { YouView } from "@/components/you-view";

export const Route = createFileRoute("/_app/you")({
  component: YouView,
});
