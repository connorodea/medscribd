import type { FC, ComponentProps } from "react";
import { NewTabIcon } from "./icons/NewTabIcon";

const Link: FC<ComponentProps<"a">> = ({ children, ...props }) => (
  <a target="_blank" rel="noreferrer" href="https://medscribd.com" {...props}>
    <span>medscribd.com</span>
    {children}
  </a>
);

export const Plaintext: FC = () => (
  <Link className="flex max-w-max gap-2 items-center text-brand-amber font-semibold">
    <NewTabIcon />
  </Link>
);

export const Button: FC = () => (
  <Link className="block px-3 py-2 font-semibold rounded border text-brand-cloud border-brand-cloud/40" />
);
