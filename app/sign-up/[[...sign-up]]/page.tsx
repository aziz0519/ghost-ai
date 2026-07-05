import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getSignInUrl } from "@/lib/auth-routes";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/editor");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-4 py-16 text-foreground">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-surface shadow-2xl shadow-black/20 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-center border-b border-border/70 bg-base/80 p-8 lg:border-b-0 lg:border-r">
          <div className="space-y-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-surface text-lg font-semibold text-foreground">
              G
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-foreground">Create your Ghost AI account</h1>
              <p className="max-w-md text-sm leading-6 text-secondary">
                Start your workspace, save your projects, and collaborate from a secure, polished editor experience.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-secondary">
              <li>• Sign in quickly and keep your projects connected</li>
              <li>• Use Clerk-managed security without extra setup</li>
              <li>• Keep the experience minimal and focused on your work</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <SignUp forceRedirectUrl="/editor" signInUrl={getSignInUrl("/sign-in")} />
          </div>
        </section>
      </div>
    </main>
  );
}
