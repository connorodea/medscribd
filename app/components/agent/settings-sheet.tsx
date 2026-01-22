"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  Mic, 
  FileText, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Clock,
  Volume2
} from "lucide-react"

interface SettingsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const [settings, setSettings] = useState({
    // Recording
    defaultVoiceMode: "conversation",
    autoStartRecording: false,
    noiseReduction: true,
    audioQuality: "high",
    
    // Notes
    defaultNoteTemplate: "soap",
    autoSaveInterval: "30",
    includeTimestamps: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    
    // Privacy
    dataRetention: "90",
    analyticsEnabled: true,
    
    // Appearance
    theme: "light",
    compactMode: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    onOpenChange(false)
  }

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-lg">Settings</SheetTitle>
          <SheetDescription className="text-sm">
            Customize your MedScribd experience
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="recording" className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 h-10">
            <TabsTrigger value="recording" className="text-xs data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Mic className="h-3.5 w-3.5 mr-1.5" />
              Recording
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Bell className="h-3.5 w-3.5 mr-1.5" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Recording Settings */}
          <TabsContent value="recording" className="p-4 space-y-5 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  Default Voice Mode
                </Label>
                <Select
                  value={settings.defaultVoiceMode}
                  onValueChange={(value) => updateSetting("defaultVoiceMode", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conversation">Conversation Mode</SelectItem>
                    <SelectItem value="dictation">Dictation Mode</SelectItem>
                    <SelectItem value="interview">Interview Mode</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how the AI processes your recordings
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-start Recording</Label>
                    <p className="text-xs text-muted-foreground">
                      Start recording when opening a visit
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoStartRecording}
                    onCheckedChange={(checked) => updateSetting("autoStartRecording", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Noise Reduction</Label>
                    <p className="text-xs text-muted-foreground">
                      Filter background noise from recordings
                    </p>
                  </div>
                  <Switch
                    checked={settings.noiseReduction}
                    onCheckedChange={(checked) => updateSetting("noiseReduction", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Audio Quality</Label>
                <Select
                  value={settings.audioQuality}
                  onValueChange={(value) => updateSetting("audioQuality", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (saves bandwidth)</SelectItem>
                    <SelectItem value="medium">Medium (balanced)</SelectItem>
                    <SelectItem value="high">High (best quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Notes Settings */}
          <TabsContent value="notes" className="p-4 space-y-5 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Default Note Template
                </Label>
                <Select
                  value={settings.defaultNoteTemplate}
                  onValueChange={(value) => updateSetting("defaultNoteTemplate", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soap">SOAP Note</SelectItem>
                    <SelectItem value="hp">H&P (History & Physical)</SelectItem>
                    <SelectItem value="progress">Progress Note</SelectItem>
                    <SelectItem value="procedure">Procedure Note</SelectItem>
                    <SelectItem value="discharge">Discharge Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Auto-save Interval
                </Label>
                <Select
                  value={settings.autoSaveInterval}
                  onValueChange={(value) => updateSetting("autoSaveInterval", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Every 15 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every minute</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Include Timestamps</Label>
                  <p className="text-xs text-muted-foreground">
                    Add timestamps to transcript entries
                  </p>
                </div>
                <Switch
                  checked={settings.includeTimestamps}
                  onCheckedChange={(checked) => updateSetting("includeTimestamps", checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="p-4 space-y-5 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Browser notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Weekly Digest</Label>
                  <p className="text-xs text-muted-foreground">
                    Summary of your weekly activity
                  </p>
                </div>
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="p-4 space-y-5 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Data Retention</Label>
                <Select
                  value={settings.dataRetention}
                  onValueChange={(value) => updateSetting("dataRetention", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Keep forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long to keep recordings and transcripts
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Usage Analytics</Label>
                  <p className="text-xs text-muted-foreground">
                    Help improve MedScribd with anonymous data
                  </p>
                </div>
                <Switch
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) => updateSetting("analyticsEnabled", checked)}
                />
              </div>

              <Separator />

              {/* Appearance */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  Appearance
                </Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Switch to dark theme
                    </p>
                  </div>
                  <Switch
                    checked={settings.theme === "dark"}
                    onCheckedChange={(checked) => {
                      updateSetting("theme", checked ? "dark" : "light")
                      document.documentElement.classList.toggle("dark", checked)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Reduce spacing for more content
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Security */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security
                </Label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm bg-transparent">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start h-9 text-sm text-destructive hover:text-destructive bg-transparent">
                    Download My Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="border-t border-border p-4 mt-auto">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full h-9"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
