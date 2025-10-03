import { FaqContent } from "./faq-content";
import { FaqHero } from "./faq-hero";

export function Faq() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <FaqHero />
        <FaqContent className="mt-4" />
      </div>
    </div>
  );
}
