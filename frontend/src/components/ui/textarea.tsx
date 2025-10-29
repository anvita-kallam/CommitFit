import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-white/30 backdrop-blur-md bg-white/20 px-3 py-2 text-base ring-offset-background placeholder:text-[rgba(100,80,140,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm resize-none",
        className,
      )}
      style={{ color: 'rgba(60, 40, 100, 1)' }}
      {...props}
    />
  );
}

export { Textarea };
