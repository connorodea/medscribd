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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Camera, Mail, Building2, CreditCard, Award, Save } from "lucide-react"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const [profile, setProfile] = useState({
    firstName: "Demo",
    lastName: "Doctor",
    email: "demo@medscribd.com",
    phone: "(555) 123-4567",
    specialty: "Internal Medicine",
    clinicName: "Demo Medical Center",
    npiNumber: "1234567890",
    licenseNumber: "MD-12345",
    licenseState: "CA",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-lg">Profile</SheetTitle>
          <SheetDescription className="text-sm">
            Manage your personal and practice information
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 pb-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Click to upload photo</p>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Practice Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Practice Information
            </h3>
            <div className="space-y-1.5">
              <Label htmlFor="specialty" className="text-xs">Specialty</Label>
              <Input
                id="specialty"
                value={profile.specialty}
                onChange={(e) => handleChange("specialty", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinicName" className="text-xs">Clinic / Practice Name</Label>
              <Input
                id="clinicName"
                value={profile.clinicName}
                onChange={(e) => handleChange("clinicName", e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Credentials */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              Credentials
            </h3>
            <div className="space-y-1.5">
              <Label htmlFor="npiNumber" className="text-xs">NPI Number</Label>
              <Input
                id="npiNumber"
                value={profile.npiNumber}
                onChange={(e) => handleChange("npiNumber", e.target.value)}
                className="h-9 text-sm font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="licenseNumber" className="text-xs">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  className="h-9 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="licenseState" className="text-xs">License State</Label>
                <Input
                  id="licenseState"
                  value={profile.licenseState}
                  onChange={(e) => handleChange("licenseState", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Billing
            </h3>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Pro Plan</p>
                  <p className="text-xs text-muted-foreground">$99/month - Renews Feb 15, 2026</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6 pt-4">
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
