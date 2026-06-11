import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const termsSections = [
  {
    title: "Educational preparation only",
    body:
      "SmileAtEase provides educational preparation content, structured questions, a visit preparation plan, and a comfort card. It is meant to support communication before or during a dental visit.",
  },
  {
    title: "Not professional advice",
    body:
      "SmileAtEase does not provide medical, dental, mental health, medication, sedation, diagnosis, treatment, or emergency advice. It is not a substitute for a dentist, physician, therapist, emergency service, or other qualified professional.",
  },
  {
    title: "Your responsibility",
    body:
      "You are responsible for contacting qualified professionals for questions about symptoms, care decisions, costs, safety, or urgent concerns. Do not use SmileAtEase for emergencies.",
  },
  {
    title: "No guarantees",
    body:
      "SmileAtEase does not guarantee a particular appointment experience, result, comfort level, or outcome.",
  },
  {
    title: "AI note",
    body:
      "The current MVP uses rule-based plan generation. It does not currently use AI generation for plans.",
  },
  {
    title: "Acceptable use",
    body:
      "Use SmileAtEase for personal preparation and communication planning. Do not use it to request harmful content, bypass safety boundaries, or generate advice for emergencies.",
  },
  {
    title: "Limitation of liability",
    body:
      "Liability placeholder: SmileAtEase is provided as an MVP educational tool without warranties to the fullest extent allowed by applicable law.",
  },
  {
    title: "Changes to terms",
    body:
      "These terms may change as the MVP develops. Updated terms should be posted on this page.",
  },
  {
    title: "Contact",
    body:
      "Contact placeholder: support@example.com.",
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <section className="py-12 md:py-16">
        <div className="grid gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Terms
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Terms of use
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              These MVP terms explain what SmileAtEase is for and where its
              boundaries are.
            </p>
          </div>

          <DisclaimerBox />

          <div className="grid gap-4 md:grid-cols-2">
            {termsSections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {section.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
