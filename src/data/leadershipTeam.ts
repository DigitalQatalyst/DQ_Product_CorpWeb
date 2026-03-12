export interface LeadershipMember {
  name: string;
  role: string;
  image?: string;
  initials?: string;
  bio: string;
}

export const leadershipTeam: LeadershipMember[] = [
  {
    name: "Dr. Stephane Niango",
    role: "CEO | Research Office",
    image: "/images/SN.svg",
    bio: "Sets the strategic research agenda and steers DigitalQatalyst toward bold, measurable transformation."
  },
  {
    name: "Mark Kerry",
    role: "EVP | Accounts Office",
    image: "/images/MK.svg",
    bio: "Partners with enterprise leaders to align growth programs with accountable delivery."
  },
  {
    name: "Bilal Waqar",
    role: "DBP Designs Office",
    image: "/images/BW.svg",
    bio: "Architects next-gen Digital Business Platforms with human-centered design excellence."
  },
  {
    name: "Sharavi Ravi",
    role: "DBP Deploys Office",
    image: "/images/SR.svg",
    bio: "Leads complex platform deployments, ensuring speed, quality, and adoption."
  },
  {
    name: "Pelagie Njiki",
    role: "DCO Excellence Office",
    image: "/images/PN.svg",
    bio: "Builds cognitive operating models that keep clients adaptive and resilient."
  },
  {
    name: "Lorenza Oduor",
    role: "DCO Excellence Office",
    image: "/images/Lorenza-Avatar.png",
    bio: "Drives capability uplift programs that codify best practices across Digital Cognitive Organizations."
  },
  {
    name: "Kaylynn Oceanne",
    role: "Research Advisory",
    image: "/images/Kaylynn_Avatar.png",
    bio: "Translates behavioral research into insight-led blueprints and playbooks."
  },
  {
    name: "Jean Francois",
    role: "Technology Advisory",
    image: "/images/Jean-Avatar.png",
    bio: "Advises on architecture decisions, ensuring platforms scale securely across ecosystems."
  },
  {
    name: "Prisca Tiphaine",
    role: "Executive Advisory",
    image: "/images/PT.svg",
    bio: "Guides C-suite teams through transformation governance and value tracking."
  },
  {
    name: "Stephen Muema",
    role: "Executive Advisory",
    image: "/images/Stephen-Avatar.png",
    bio: "Helps executives operationalize change agendas with pragmatic leadership coaching."
  },
  {
    name: "Irene Musyoki",
    role: "DCO Operations",
    image: "/images/Irene-Avatar.png",
    bio: "Optimizes day-to-day operations so transformation programs deliver sustained impact."
  }
];
