import React, { useState } from "react";
import { Brain, ChevronRight, AlertCircle, CheckCircle, XCircle, ExternalLink, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// MS Phenotypes data
const MS_PHENOTYPES = [
  {
    id: "ris",
    name: "RIS",
    fullName: "Radiologically Isolated Syndrome",
    description: "Asymptomatic MRI lesions suggestive of MS without clinical symptoms",
    treatment: "No DMT recommended - monitor with MRI every 3-12 months",
    dmts: [],
    status: "preclinical",
  },
  {
    id: "cis",
    name: "CIS",
    fullName: "Clinically Isolated Syndrome",
    description: "First demyelinating event (optic neuritis, transverse myelitis, brainstem syndrome)",
    treatment: "Early DMT treatment recommended to prevent conversion to MS",
    dmts: [
      { name: "Glatiramer Acetate", dose: "20 mg SC daily", tier: 1 },
      { name: "Interferon Beta-1a", dose: "30 mcg IM weekly or 44 mcg SC 3x/week", tier: 1 },
      { name: "Interferon Beta-1b", dose: "8 million IU SC every other day", tier: 1 },
      { name: "Dimethyl Fumarate", dose: "240 mg PO BID", tier: 2 },
      { name: "Teriflunomide", dose: "14 mg PO daily", tier: 2 },
      { name: "Fingolimod", dose: "0.5 mg PO daily", tier: 2 },
    ],
    status: "early",
  },
  {
    id: "rrms",
    name: "RRMS",
    fullName: "Relapsing-Remitting MS",
    description: "Discrete relapse episodes with partial or complete recovery",
    treatment: "DMT therapy based on disease activity and patient factors",
    dmts: [
      { name: "Ocrelizumab (Ocrevus)", dose: "600 mg IV q6mo", tier: 1, notes: "First-line for active RMS" },
      { name: "Ofatumumab (Kesimpta)", dose: "20 mg SC weekly", tier: 1, notes: "Self-administered, B-cell" },
      { name: "Natalizumab (Tysabri)", dose: "300 mg IV q4wk", tier: 1, notes: "High efficacy, PML risk" },
      { name: "Alemtuzumab (Lemtrada)", dose: "12 mg IV daily × 5 days (Year 1)", tier: 1, notes: "Two-course limit" },
      { name: "Cladribine (Mavenclad)", dose: "0.875 mg/kg × 4-5 days × 2 courses", tier: 1, notes: "Oral, pulsed" },
      { name: "Fingolimod (Gilenya)", dose: "0.5 mg PO daily", tier: 2 },
      { name: "Siponimod (Mayzent)", dose: "2 mg PO daily", tier: 2 },
      { name: "Ozanimod (Zeposia)", dose: "0.92 mg PO daily", tier: 2 },
      { name: "Dimethyl Fumarate (Tecfidera)", dose: "240 mg PO BID", tier: 2 },
      { name: "Teriflunomide (Aubagio)", dose: "14 mg PO daily", tier: 2 },
      { name: "Glatiramer Acetate", dose: "20 mg SC daily or 40 mg TIW", tier: 3 },
      { name: "Interferon Beta-1a", dose: "30 mcg IM weekly", tier: 3 },
      { name: "Ponesimod (Ponvory)", dose: "20 mg PO daily", tier: 3 },
    ],
    status: "active",
  },
];

const PROGRESSIVE_MS_SUBTYPES = [
  {
    id: "ppms",
    name: "PPMS",
    fullName: "Primary Progressive MS",
    description: "Steady neurological decline from disease onset, no distinct relapses",
    age: ">50 years typical",
    dmts: [
      { name: "Ocrelizumab (Ocrevus)", dose: "600 mg IV q6mo", tier: 1, notes: "FDA-approved for PPMS", approved: true },
      { name: "Rituximab (Rituxan)", dose: "500 mg IV q6mo", tier: 2, notes: "Off-label, emerging evidence", approved: false },
      { name: "IVIg (GammaGuard)", dose: "0.4 g/kg × 5 days, then monthly", tier: 3, notes: "Limited evidence", approved: false },
    ],
    active: false,
  },
  {
    id: "spms-active",
    name: "SPMS (Active)",
    fullName: "Secondary Progressive MS - Active",
    description: "Prior RRMS → progressing with ongoing inflammatory activity (relapses/MRI lesions)",
    dmts: [
      { name: "Siponimod (Mayzent)", dose: "2 mg PO daily", tier: 1, notes: "FDA-approved for active SPMS", approved: true },
      { name: "Ocrelizumab (Ocrevus)", dose: "600 mg IV q6mo", tier: 1, notes: "FDA-approved for active SPMS", approved: true },
      { name: "Natalizumab (Tysabri)", dose: "300 mg IV q4wk", tier: 2, notes: "If young and highly active", approved: false },
      { name: "Alemtuzumab (Lemtrada)", dose: "12 mg IV × 5 days", tier: 2, notes: "Consider before progression", approved: false },
    ],
    active: true,
  },
  {
    id: "spms-inactive",
    name: "SPMS (Inactive)",
    fullName: "Secondary Progressive MS - Inactive",
    description: "Progressive disability worsening without ongoing inflammatory activity",
    dmts: [
      { name: "Siponimod (Mayzent)", dose: "2 mg PO daily", tier: 1, notes: "May slow progression", approved: true },
      { name: "No FDA-approved DMTs", dose: "—", tier: 0, notes: "Symptomatic management only", approved: false },
    ],
    active: false,
  },
];

// Tier badges
const TIER_BADGES: Record<number, { label: string; color: string }> = {
  1: { label: "First-Line", color: "bg-green-500" },
  2: { label: "Second-Line", color: "bg-blue-500" },
  3: { label: "Third-Line", color: "bg-gray-500" },
};

function DmtCard({ dmt, expanded }: { dmt: typeof MS_PHENOTYPES[0]["dtms"][0]; expanded?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{dmt.name}</span>
          {dmt.tier === 1 && <Badge className="text-[10px] h-5 bg-green-600">First-Line</Badge>}
          {(dmt.tier === 2 || dmt.tier === 3) && <Badge variant="outline" className="text-[10px] h-5">{dmt.tier === 2 ? "Second-Line" : "Third-Line"}</Badge>}
          {dmt.approved === false && <Badge variant="secondary" className="text-[10px] h-5">Off-label</Badge>}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{dmt.dose}</div>
        {dmt.notes && expanded && <div className="text-xs text-muted-foreground/70 mt-0.5">{dmt.notes}</div>}
      </div>
    </div>
  );
}

function MsPhenotypeDialog({ phenotype, children }: { phenotype: typeof MS_PHENOTYPES[0]; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            {phenotype.name}
          </DialogTitle>
          <DialogDescription>{phenotype.fullName}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground">{phenotype.description}</div>
          </div>
          
          {phenotype.dmts.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Recommended DMTs</span>
              </div>
              <div className="space-y-1">
                {phenotype.dmts.map((dmt, i) => (
                  <DmtCard key={i} dmt={dmt} expanded />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">{phenotype.treatment}</div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Always individualize therapy based on patient comorbidities, preferences, and disease characteristics.
            Consult latest FDA indications and guidelines.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressiveMsDialog({ subtype }: { subtype: typeof PROGRESSIVE_MS_SUBTYPES[0] }) {
  const isActive = subtype.active !== false;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-sm">{subtype.name}</span>
              <div className="text-xs text-muted-foreground">{subtype.fullName}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isActive ? (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            ) : (
              <Info className="h-5 w-5 text-muted-foreground" />
            )}
            {subtype.name}
          </DialogTitle>
          <DialogDescription>{subtype.fullName}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground">{subtype.description}</div>
            {subtype.age && <div className="text-xs text-muted-foreground mt-1">Typical onset: {subtype.age}</div>}
          </div>
          
          {isActive ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Available DMT Options</span>
              </div>
              <div className="space-y-1">
                {subtype.dmts.map((dmt, i) => (
                  <DmtCard key={i} dmt={dmt} expanded />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Limited options:</strong> No DMTs strongly proven for inactive SPMS. 
                Symptomatic management and rehabilitation are mainstays.
              </div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <strong>Note:</strong> Progressive MS treatment is challenging. Consider referral to MS specialist.
            Off-label therapies may be appropriate in select cases.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProgressMSContent() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible defaultValue="rrms">
        <AccordionItem value="rrms">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              ✅ Relapsing-Remitting MS (RRMS)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Most common form (~85% at onset). Characterized by clear relapses with partial or complete recovery.
              </p>
              
              <MsPhenotypeDialog phenotype={MS_PHENOTYPES.find(p => p.id === "rrms")!}>
                <button className="w-full p-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-medium text-primary">View Recommended DMTs</span>
                    <div className="text-xs text-muted-foreground">Click for complete medication options</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </button>
              </MsPhenotypeDialog>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="progressive">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              🔴 Progressive MS
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Steady disability increase without distinct relapses. Includes PPMS and SPMS (active/inactive).
              </p>
              
              <div className="space-y-2">
                {PROGRESSIVE_MS_SUBTYPES.map((subtype) => (
                  <ProgressiveMsDialog key={subtype.id} subtype={subtype} />
                ))}
              </div>
              
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Key distinction:</strong> Active SPMS has ongoing inflammation (relapses enhancing lesions) - may benefit from DMTs.
                  Inactive SPMS has minimal inflammation - DMTs less effective.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="cis">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              ⚡ Clinically Isolated Syndrome (CIS)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                First demyelinating event. High risk of converting to RRMS.
              </p>
              
              <MsPhenotypeDialog phenotype={MS_PHENOTYPES.find(p => p.id === "cis")!}>
                <button className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-medium text-blue-600">View DMT Options</span>
                    <div className="text-xs text-muted-foreground">Early treatment recommended</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </button>
              </MsPhenotypeDialog>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ris">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              🔬 Radiologically Isolated Syndrome (RIS)
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Incidental MRI findings suggestive of MS but no clinical symptoms.
              </p>
              
              <MsPhenotypeDialog phenotype={MS_PHENOTYPES.find(p => p.id === "ris")!}>
                <button className="w-full p-3 rounded-lg bg-muted border border-border hover:bg-muted/80 transition-colors flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-medium">Management Approach</span>
                    <div className="text-xs text-muted-foreground">Monitoring protocol</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </MsPhenotypeDialog>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
        <strong>Biological insight:</strong> MS is progressive from onset even in relapsing forms.
        Early treatment may preserve brain reserve and improve long-term outcomes.
      </div>
    </div>
  );
}

// Export as a page component
export default function MSPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-primary" />
            Multiple Sclerosis
          </CardTitle>
          <CardDescription>MS Phenotypes and Disease-Modifying Therapy Selection</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressMSContent />
        </CardContent>
      </Card>
    </div>
  );
}