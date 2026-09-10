import { createFileRoute } from "@tanstack/react-router";
import { ActivityView } from "@/components/activity-view";

export const Route = createFileRoute("/_app/activity")({
  component: ActivityView,
});
