import { cn } from "@/lib/utils"

interface MedScribdLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
}

export function MedScribdLogo({ 
  className, 
  size = "md", 
  variant = "full" 
}: MedScribdLogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 40, text: "text-2xl" },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="text-primary-foreground"
          style={{ width: icon * 0.6, height: icon * 0.6 }}
        >
          <path
            d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12h6M12 9v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {variant === "full" && (
        <span className={cn("font-semibold tracking-tight text-foreground", text)}>
          MedScribd
        </span>
      )}
    </div>
  )
}
