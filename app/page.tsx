import { EditorShell } from "@/components/editor/editor-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <EditorShell>
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-base px-6 py-10 text-primary">
        <div className="w-full max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">Ghost AI</p>
              <h1 className="text-3xl font-semibold text-foreground">Editor chrome foundation</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Interface preview</DialogTitle>
                  <DialogDescription>These primitives now use the shared dark theme and shadcn structure.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Workspace controls</CardTitle>
                <CardDescription>Buttons, inputs, dialogs, and tabs all inherit the dark surface styling.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Primary action</Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <Input placeholder="Search workspace" />
                <Textarea placeholder="Describe your next idea" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tabs and content</CardTitle>
                <CardDescription>Nested panels and scrollable surfaces stay aligned with the dark canvas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="rounded-2xl border border-border/80 bg-subtle/50 p-3">
                    <p className="text-sm text-secondary">The UI primitives are ready for shared application screens and panels.</p>
                  </TabsContent>
                  <TabsContent value="notes" className="rounded-2xl border border-border/80 bg-subtle/50 p-3">
                    <ScrollArea className="h-24">
                      <div className="space-y-2 pr-4 text-sm text-secondary">
                        <p>Design tokens are centralized in the global stylesheet.</p>
                        <p>Components use the shared cn helper for utility composition.</p>
                        <p>All surfaces remain dark and consistent by default.</p>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </EditorShell>
  );
}
