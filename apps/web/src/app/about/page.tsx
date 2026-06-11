import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const aboutCards = [
  {
    title: "Built around preparation",
    body:
      "SmileAtEase turns structured answers into a visit preparation plan that is easier to read before an appointment.",
  },
  {
    title: "Focused on communication",
    body:
      "The intake asks about worries, communication style, and comfort preferences so the plan can organize what you may want to share.",
  },
  {
    title: "Includes a comfort card",
    body:
      "The comfort card is a short summary you can bring, print, or copy when you want help explaining what supports clear communication.",
  },
  {
    title: "Independent MVP",
    body:
      "SmileAtEase is an independent educational healthtech MVP. It is not a dental clinic and does not replace professional care.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="py-12 md:py-16">
        <div className="grid gap-10">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              About
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              SmileAtEase helps nervous dental patients prepare for visits.
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              SmileAtEase creates a visit preparation plan and comfort card
              based on communication needs, comfort preferences, and practical
              questions to bring to a dental team.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/start">Create your visit plan</Button>
              <Button href="/guides" variant="secondary">
                Browse guides
              </Button>
            </div>
          </div>

          <DisclaimerBox />

          <div className="grid gap-4 md:grid-cols-2">
            {aboutCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {card.body}
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
