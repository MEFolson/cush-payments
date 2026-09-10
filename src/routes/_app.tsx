import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_app")({
  component: Layout,
});

function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
