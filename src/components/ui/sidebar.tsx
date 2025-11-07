import * as React from "react";
import { cn } from "../../lib/utils";

// Simple Sidebar context to support collapse/expand
type SidebarContextValue = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const toggle = React.useCallback(() => setCollapsed((c) => !c), []);
  const value = React.useMemo(() => ({ collapsed, toggle }), [collapsed, toggle]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const SidebarTrigger = ({ className }: { className?: string }) => {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) return null;
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      aria-pressed={ctx.collapsed}
      onClick={ctx.toggle}
      className={cn(
        "inline-flex h-8 items-center rounded-md border border-border px-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        className,
      )}
    >
      ☰
    </button>
  );
};

export const Sidebar = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const ctx = React.useContext(SidebarContext);
  const collapsed = ctx?.collapsed ?? false;
  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 border-r border-border bg-sidebar text-sidebar-foreground",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {children}
    </aside>
  );
};

export const SidebarContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("h-full overflow-y-auto p-3", className)}>{children}</div>
);

export const SidebarGroup = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <section className={cn("mb-4", className)}>{children}</section>
);

export const SidebarGroupLabel = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}>
    {children}
  </div>
);

export const SidebarGroupContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn(className)}>{children}</div>
);

export const SidebarMenu = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <ul className={cn("flex flex-col gap-1", className)}>{children}</ul>
);

export const SidebarMenuItem = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <li className={cn(className)}>{children}</li>
);

type SidebarMenuButtonProps = {
  asChild?: boolean;
  isActive?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SidebarMenuButton = ({ asChild, isActive, className, children, ...props }: SidebarMenuButtonProps) => {
  const base = cn(
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(base, (children as any).props?.className),
    });
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
};

