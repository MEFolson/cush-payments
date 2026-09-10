import { createFileRoute } from "@tanstack/react-router";
import { PulseView } from "@/components/pulse-view";

export const Route = createFileRoute("/_app/pulse")({
  component: PulseView,
});
