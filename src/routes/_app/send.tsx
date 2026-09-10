import { createFileRoute } from "@tanstack/react-router";
import { SendView } from "@/components/send-view";

export const Route = createFileRoute("/_app/send")({
  component: SendView,
});
