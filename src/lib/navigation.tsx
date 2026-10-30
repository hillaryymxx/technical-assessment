"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { forwardRef, useEffect, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppLinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  to?: string;
  href?: string;
};

export function Link({ to, href, ...props }: AppLinkProps) {
  return <NextLink href={href ?? to ?? "/"} {...props} />;
}

interface NavLinkCompatProps extends Omit<AppLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: ReactNode;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, href, ...props }, ref) => {
    const pathname = usePathname();
    const target = href ?? to ?? "/";
    const isActive = pathname === target || pathname.startsWith(`${target}/`);

    return (
      <NextLink
        ref={ref}
        href={target}
        className={cn(className, isActive && activeClassName, pendingClassName)}
        {...props}
      />
    );
  },
);
NavLink.displayName = "NavLink";

export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname, search: "", hash: "", state: null, key: "default" };
}

export function useParams<T extends Record<string, string | undefined>>() {
  return useNextParams() as T;
}

export function Navigate({ to, replace = true }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router, to, replace]);
  return null;
}
