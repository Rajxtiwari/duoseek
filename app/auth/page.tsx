import { redirect } from "next/navigation";

type AuthPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/";
  redirect(`/?auth=1&next=${encodeURIComponent(nextPath)}`);
}
