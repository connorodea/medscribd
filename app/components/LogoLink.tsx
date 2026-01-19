import type { FC } from "react";

interface Props {
  href: string;
}

const LogoLink: FC<Props> = ({ href }) => (
  <a className="flex items-center" href={href}>
    <span className="text-lg font-semibold tracking-wide text-brand-cloud font-sora">
      medscribd
    </span>
  </a>
);

export default LogoLink;
