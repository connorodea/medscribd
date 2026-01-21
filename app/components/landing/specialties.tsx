import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Eye, 
  Stethoscope,
  Activity,
  Pill
} from "lucide-react"

const specialties = [
  { icon: Stethoscope, name: "Primary Care" },
  { icon: Heart, name: "Cardiology" },
  { icon: Brain, name: "Neurology" },
  { icon: Bone, name: "Orthopedics" },
  { icon: Baby, name: "Pediatrics" },
  { icon: Eye, name: "Ophthalmology" },
  { icon: Activity, name: "Emergency Medicine" },
  { icon: Pill, name: "Psychiatry" },
]

export function Specialties() {
  return (
    <section id="specialties" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for every specialty
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Specialty-specific templates and terminology ensure accurate documentation across all fields of medicine
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {specialties.map((specialty) => (
            <div
              key={specialty.name}
              className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <specialty.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {specialty.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          And 40+ more specialties supported
        </p>
      </div>
    </section>
  )
}
