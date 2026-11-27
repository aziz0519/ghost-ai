import { Compass } from "lucide-react";

export function WorkspaceCanvas() {
  return (
    <section className="workspace-canvas flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-border/80 px-6 py-10 text-center">
      <div className="w-full max-w-[560px]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-border/80 bg-elevated/80 shadow-xl shadow-black/20">
          <Compass className="h-8 w-8 text-brand" strokeWidth={2.2} />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-faint">Workspace shell</p>
        <h1 className="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          Canvas and collaboration tooling land here next.
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6 text-muted-foreground sm:text-[15px]">
          This room is ready for the shared architecture canvas, durable AI workflows, and real-time presence. For now,
          the shell is wired with project context and navigation only.
        </p>
      </div>
    </section>
  );
}
