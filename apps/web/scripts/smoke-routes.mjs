import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const appDir = join(process.cwd(), "src", "app");
const requiredRoutes = [
  ["Landing page", "page.tsx"],
  ["Start page", "start/page.tsx"],
  ["Guide index", "guides/page.tsx"],
  ["Explorer page", "explore/page.tsx"],
  ["Privacy page", "privacy/page.tsx"],
  ["Terms page", "terms/page.tsx"],
  ["About page", "about/page.tsx"],
  ["Example page", "example/page.tsx"],
  ["Result page", "result/[planId]/page.tsx"],
];
const requiredGuideSlugs = [
  "cleaning",
  "x-rays",
  "filling",
  "local-anesthesia",
  "extraction-consult",
  "emergency-visit",
];

const missingRoutes = requiredRoutes.filter(([, routePath]) => {
  return !existsSync(join(appDir, routePath));
});

if (missingRoutes.length > 0) {
  console.error("Missing frontend routes:");
  for (const [label, routePath] of missingRoutes) {
    console.error(`- ${label}: ${routePath}`);
  }
  process.exit(1);
}

const guidesSource = readFileSync(
  join(process.cwd(), "src", "lib", "guides.ts"),
  "utf8",
);
const missingGuideSlugs = requiredGuideSlugs.filter((slug) => {
  return !guidesSource.includes(`slug: "${slug}"`);
});

if (missingGuideSlugs.length > 0) {
  console.error("Missing guide slugs:");
  for (const slug of missingGuideSlugs) {
    console.error(`- ${slug}`);
  }
  process.exit(1);
}

console.log("Frontend smoke route check passed.");
