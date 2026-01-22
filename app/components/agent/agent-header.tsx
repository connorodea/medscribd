"use client"

import { MedScribdLogo } from "@/components/shared/medscribd-logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, ChevronDown, User, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { ProfileSheet } from "./profile-sheet"
import { SettingsSheet } from "./settings-sheet"

export function AgentHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="transition-opacity hover:opacity-70">
          <MedScribdLogo size="sm" />
        </Link>
        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          HIPAA
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme}
          className="h-8 w-8 p-0"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary">DR</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Dr. Demo</p>
              <p className="text-[11px] text-muted-foreground">Internal Medicine</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="gap-2 text-sm cursor-pointer"
              onSelect={() => setProfileOpen(true)}
            >
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="gap-2 text-sm cursor-pointer"
              onSelect={() => setSettingsOpen(true)}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="gap-2 text-sm text-destructive">
              <Link href="/">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Sheet */}
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
      
      {/* Settings Sheet */}
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  )
}
