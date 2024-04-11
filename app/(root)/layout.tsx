import Image from "next/image";
import Link from "next/link";
import { Footer } from "~/app/footer";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { getCurrentUser } from "~/lib/get-user";

export default async function AppLayout({
  children,
  post_form
}: Readonly<{
  children: React.ReactNode;
  post_form: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-lvh max-h-lvh bg-muted-100">
      <header className="fixed left-4.5 top-4.5">
        <Link href="/">
          <Image
            src="/mc-app-icon.png"
            width={32}
            height={32}
            alt="Modular Cloud Logo"
          />
        </Link>
      </header>
      <main className="flex-grow overflow-y-auto">{children}</main>

      {process.env.NODE_ENV !== "production" && <TailwindIndicator />}
      <Footer user={user} form={post_form} />
    </div>
  );
}
