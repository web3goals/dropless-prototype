import { Avatar, AvatarFallback } from "../ui/avatar";

export function FaqHero() {
  return (
    <div className="w-full flex flex-row gap-3 bg-secondary border rounded-lg px-3 py-4">
      <Avatar className="size-12">
        <AvatarFallback className="text-xl bg-primary">❓</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance text-secondary-foreground">
          FAQ
        </h1>
        <p className="text-secondary-foreground mt-2">
          Here are answers to some common questions
        </p>
      </div>
    </div>
  );
}
