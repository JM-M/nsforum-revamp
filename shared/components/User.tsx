import useProfile from "@/shared/hooks/useProfile";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import useUser from "../hooks/useUser";
import { cn } from "../lib/utils";

type Props = { did: string; className?: string };
const User = ({ did, className = "" }: Props) => {
  const { profile } = useProfile();
  const { user, query } = useUser({ did });
  if (query.isLoading) return "Loading...";

  const { username = "", verified = false } = user || {};

  const href = did === profile?.controller ? "/profile" : `/users/${did}`;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 leading-none text-muted-foreground",
        className,
      )}
    >
      {username}
      {verified && (
        <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
      )}
    </Link>
  );
};
export default User;
