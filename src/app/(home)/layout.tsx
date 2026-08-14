import { headers } from "next/headers";
import HomeShell from "@/components/HomeShell";

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
        <HomeShell>{children}</HomeShell>
        <script defer src="/_vercel/insights/script.js" nonce={nonce} />
    </>
  );
}
