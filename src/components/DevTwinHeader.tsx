import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon } from "lucide-react";

interface DevTwinHeaderProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export function DevTwinHeader({ onToggleTheme, isDark }: DevTwinHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-3">
      <div className="flex items-center justify-end gap-4">
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
        
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            DV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}