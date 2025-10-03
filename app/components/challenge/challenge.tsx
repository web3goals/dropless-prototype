import { ChallengeContent } from "./challenge-content";
import { ChallengeHero } from "./challenge-hero";

export function Challenge() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <ChallengeHero />
        <ChallengeContent className="mt-4" />
      </div>
    </div>
  );
}
