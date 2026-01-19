import nunjucks from "nunjucks";

type ParsedContext = {
  patientName?: string;
  dob?: string;
  visitDate?: string;
  visitTime?: string;
  provider?: string;
  roomBed?: string;
  shift?: string;
  allergies?: string;
  medications?: string;
  diagnosis?: string;
  pmh?: string;
  psh?: string;
  code?: string;
  location?: string;
  isolation?: string;
  painLevel?: string;
  vitals?: string;
  nvAccess?: string;
};

const parseContextLine = (line: string) => {
  const [rawKey, ...rest] = line.split(":");
  if (!rawKey || rest.length === 0) return null;
  return { key: rawKey.trim().toLowerCase(), value: rest.join(":").trim() };
};

export const parsePatientContext = (input: string): ParsedContext => {
  const result: ParsedContext = {};
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parsed = parseContextLine(line);
      if (!parsed) return;
      const { key, value } = parsed;
      if (key.includes("patient name")) result.patientName = value;
      else if (key === "dob" || key.includes("date of birth")) result.dob = value;
      else if (key.includes("visit date")) result.visitDate = value;
      else if (key.includes("visit time")) result.visitTime = value;
      else if (key.includes("provider")) result.provider = value;
      else if (key.includes("room") || key.includes("bed")) result.roomBed = value;
      else if (key.includes("shift")) result.shift = value;
      else if (key.includes("allerg")) result.allergies = value;
      else if (key.includes("med")) result.medications = value;
      else if (key.includes("diagnosis")) result.diagnosis = value;
      else if (key === "pmh") result.pmh = value;
      else if (key === "psh") result.psh = value;
      else if (key.includes("code")) result.code = value;
      else if (key.includes("location")) result.location = value;
      else if (key.includes("isolation")) result.isolation = value;
      else if (key.includes("pain")) result.painLevel = value;
      else if (key.includes("vital")) result.vitals = value;
      else if (key.includes("access")) result.nvAccess = value;
    });
  return result;
};

const baseEnv = new nunjucks.Environment(undefined, {
  autoescape: false,
  trimBlocks: true,
  lstripBlocks: true,
});

const clinicalTemplate = `# Patient Report Sheet

**Patient Name:** {{ patient.patientName | default("") }}  
**DOB:** {{ patient.dob | default("") }}  
**Room/Bed:** {{ patient.roomBed | default("") }}  
**Date/Shift:** {{ patient.visitDate | default("") }} {{ patient.shift | default("") }}

**Code:** {{ patient.code | default("") }}  
**Allergies:** {{ patient.allergies | default("") }}  
**Diagnosis:** {{ patient.diagnosis | default("") }}  
**Isolation:** {{ patient.isolation | default("") }}

**PMH:** {{ patient.pmh | default("") }}  
**PSH:** {{ patient.psh | default("") }}  
**Meds:** {{ patient.medications | default("") }}  
**IV Access:** {{ patient.nvAccess | default("") }}

**Last Set of Vitals:** {{ patient.vitals | default("") }}  
**Pain Level / Location:** {{ patient.painLevel | default("") }} {{ patient.location | default("") }}

## Status Checks
- [ ] Neuro: Alert & Oriented x ____
- [ ] Neuro: Confused
- [ ] Neuro: Lethargic
- [ ] Neuro: Unresponsive
- [ ] Cardiac: Regular
- [ ] Cardiac: Irregular
- [ ] Cardiac: Murmur
- [ ] Cardiac: Edema
- [ ] Respiratory: Normal
- [ ] Respiratory: Labored
- [ ] Respiratory: Oxygen
- [ ] Respiratory: Lungs clear
- [ ] GI: Normal
- [ ] GI: NPO
- [ ] GI: NG/OG Tube
- [ ] GI: Bowel sounds ____
- [ ] GU: Voiding
- [ ] GU: Foley
- [ ] GU: Incontinence
- [ ] GU: Dialysis
- [ ] Skin: Intact
- [ ] Skin: Wounds

## Pending Procedures

## Recent Labs / Imaging

## {{ noteType }}
{{ clinicalNote }}

## Verification Needed
{% if verification.length > 0 -%}
{% for item in verification -%}
- [ ] {{ item }}
{% endfor -%}
{% else -%}
- [ ] None
{% endif -%}
`;

const socialWorkTemplate = `# Social Work Progress Note

**Client Name:** {{ patient.patientName | default("") }}  
**DOB:** {{ patient.dob | default("") }}  
**Visit Date:** {{ patient.visitDate | default("") }}  
**Visit Time:** {{ patient.visitTime | default("") }}  
**Emp #:**  
**Mileage:**  

## Reason For Visit and Findings (Check All That Apply)
- [ ] Assess tangible needs
- [ ] Interfering with treatment plan
- [ ] Care taker relief
- [ ] Housing
- [ ] Finances
- [ ] Cleanliness
- [ ] Inadequate services
- [ ] Legal assistance
- [ ] Placement
- [ ] Abuse/Neglect
- [ ] Interpersonal relationships
- [ ] Stressful life

**Comments:**  

## Behavioral / Attitudinal / Mental Status Changes
- [ ] Orientation
- [ ] Anxiety
- [ ] Agitation
- [ ] Depression
- [ ] Passive
- [ ] Cooperative
- [ ] Non-cooperative

## Treatments / Goals Performed This Visit
- [ ] Case coordination with Home Care staff
- [ ] Assisting with financial problems and entitlements
- [ ] Short-term therapy
- [ ] Crisis intervention
- [ ] Counseling for long range plan
- [ ] Community referral & linkages
- [ ] Teaching re: options & access to services

## Communication / Networking
- [ ] Conferenced with CHN
- [ ] Caregiver
- [ ] Other family members
- [ ] Doctor

**Comments / Contacts:**  

## Follow Up Required
{{ clinicalNote }}

## Verification Needed
{% if verification.length > 0 -%}
{% for item in verification -%}
- [ ] {{ item }}
{% endfor -%}
{% else -%}
- [ ] None
{% endif -%}
`;

export const buildMarkdownNote = (options: {
  clinicalNote: string;
  verification?: string[];
  patientContext: ParsedContext;
  noteType: string;
}) => {
  const { clinicalNote, verification = [], patientContext, noteType } = options;
  return baseEnv.renderString(clinicalTemplate, {
    patient: patientContext,
    noteType,
    clinicalNote,
    verification,
  });
};

export const buildSocialWorkMarkdown = (options: {
  patientContext: ParsedContext;
  clinicalNote: string;
  verification?: string[];
}) => {
  const { patientContext, clinicalNote, verification = [] } = options;
  return baseEnv.renderString(socialWorkTemplate, {
    patient: patientContext,
    clinicalNote,
    verification,
  });
};

export const resolveTemplateType = (noteType: string) => {
  const lower = noteType.toLowerCase();
  if (lower.includes("social work") || lower.includes("progress")) {
    return "social_work";
  }
  return "clinical";
};
