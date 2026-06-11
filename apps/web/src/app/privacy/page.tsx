import { DisclaimerBox } from "@/components/layout/DisclaimerBox";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const privacySections = [
  {
    title: "What SmileAtEase is",
    body:
      "SmileAtEase is an educational preparation tool for people who feel nervous about dental visits. It helps organize visit preferences into a preparation plan and comfort card.",
  },
  {
    title: "What information is collected",
    body:
      "The intake asks structured questions about visit timing, visit type, worries, communication preferences, coping preferences, safety screening answers, and optional context. The app also stores the generated plan so it can be viewed and printed.",
  },
  {
    title: "What information is not required",
    body:
      "SmileAtEase does not require your name, phone number, address, account, or email to create a plan in this MVP.",
  },
  {
    title: "How intake answers are used",
    body:
      "Your structured answers are used to create a rule-based visit preparation plan, show safety reminders when needed, and create a comfort card. Intake answers are not used to diagnose or decide care.",
  },
  {
    title: "Temporary plan storage",
    body:
      "Generated plans may be stored temporarily so you can open, copy, or print them from a result link. Plans and related intake records expire according to PLAN_RETENTION_DAYS.",
  },
  {
    title: "Optional context",
    body:
      "Optional free-text context is used only for safety evaluation and plan personalization. You should not include sensitive medical details, account numbers, insurance information, or anything you do not want processed by this MVP.",
  },
  {
    title: "AI and analytics",
    body:
      "AI is not currently used for plan generation. Analytics are not currently used. If either changes in a later version, this page should be updated before launch.",
  },
  {
    title: "No sale of data",
    body:
      "SmileAtEase does not sell personal data in this MVP.",
  },
  {
    title: "Deletion",
    body:
      "Plans can be deleted from the app when a delete action is available for a saved result. Expired plans may no longer be available from their result link.",
  },
  {
    title: "Security limitations",
    body:
      "No web app can promise perfect security. Avoid entering highly sensitive information. Do not use SmileAtEase for emergencies or immediate safety concerns.",
  },
  {
    title: "Contact",
    body:
      "Contact placeholder: support@example.com.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="py-12 md:py-16">
        <div className="grid gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Privacy
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
              Privacy policy
            </h1>
            <p className="text-base leading-8 text-muted-foreground">
              This MVP is designed to collect only the information needed to
              create a practical visit preparation plan and comfort card.
            </p>
          </div>

          <DisclaimerBox />

          <div className="grid gap-4 md:grid-cols-2">
            {privacySections.map((section) => (
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
