"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-border/20 flex items-center justify-center mx-auto mb-4">
          <XIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground mb-6">
          You don't have access to this project or it may have been deleted.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = "/editor"}
          className="mt-4"
        >
          Go to Projects
        </Button>
      </div>
    </div>
  );
}