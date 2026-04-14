import { redirect } from "next/navigation";
import { getSafeInternalPath } from "@/lib/navigation";

type AuthPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath = getSafeInternalPath(params.next);
  redirect(`/?auth=1&next=${encodeURIComponent(nextPath)}`);
}
