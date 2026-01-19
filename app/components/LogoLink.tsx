import type { FC } from "react";
import Image from "next/image";

interface Props {
  href: string;
}

const LogoLink: FC<Props> = ({ href }) => (
  <a className="flex items-center" href={href}>
    <Image
      src="/medscribd-logo.png"
      alt="medscribd logo"
      width={160}
      height={40}
      className="h-8 w-auto"
      priority
    />
  </a>
);

export default LogoLink;
