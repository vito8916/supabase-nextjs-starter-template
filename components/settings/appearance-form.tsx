"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sun, Moon, Monitor } from "lucide-react";

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast("Theme updated", {
      description: `Your theme has been set to ${newTheme}.`,
    });
  };

  // Don't render anything until component is mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          type="button" 
          variant={theme === "light" ? "default" : "outline"}
          className="flex items-center gap-2 justify-center"
          onClick={() => handleThemeChange("light")}
        >
          <Sun className="h-5 w-5" />
          Light
        </Button>
        
        <Button 
          type="button" 
          variant={theme === "dark" ? "default" : "outline"}
          className="flex items-center gap-2 justify-center"
          onClick={() => handleThemeChange("dark")}
        >
          <Moon className="h-5 w-5" />
          Dark
        </Button>
        
        <Button 
          type="button" 
          variant={theme === "system" ? "default" : "outline"}
          className="flex items-center gap-2 justify-center"
          onClick={() => handleThemeChange("system")}
        >
          <Monitor className="h-5 w-5" />
          System
        </Button>
      </div>
    </div>
  );
} 