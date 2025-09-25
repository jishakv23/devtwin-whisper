import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface DevTwinHeaderProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export function DevTwinHeader({ onToggleTheme, isDark }: DevTwinHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-3">
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="w-9 h-9 p-0"
        >
          {isDark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}