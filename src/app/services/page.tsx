import { Separator } from "@/components/ui/separator"

const services = [
    {
        emoji: "🖥️",
        title: "Administration Système & Réseaux",
        description: "Conception, déploiement et maintenance d'infrastructures robustes.",
        items: [
            "Configuration serveurs Linux (Debian, Ubuntu, CentOS) et Windows Server",
            "Virtualisation Proxmox VE, VMware ESXi – clustering et haute disponibilité",
            "Gestion VLAN, routage, VPN (WireGuard, OpenVPN)",
            "Supervision et monitoring (Grafana, Prometheus, Zabbix)",
        ],
    },
    {
        emoji: "📦",
        title: "Intégration & Déploiement",
        description: "Modernisation des processus de livraison et d'exploitation.",
        items: [
            "Conteneurisation Docker, orchestration Compose et Swarm",
            "Pipelines CI/CD (GitHub Actions, GitLab CI, Jenkins)",
            "Infrastructure as Code – Ansible, scripts d'automatisation",
            "Déploiement et configuration d'applications métier",
        ],
    },
    {
        emoji: "📞",
        title: "Solutions de Téléphonie & Collaboration",
        description: "Intégration de systèmes de communication unifiée en entreprise.",
        items: [
            "IPBX XiVO / Wazo – déploiement, migration, maintenance",
            "Configuration SIP trunking et interconnexion opérateurs",
            "Migration depuis systèmes legacy (DECT, analogique)",
            "Formation et support utilisateurs",
        ],
    },
    {
        emoji: "🔒",
        title: "Cybersécurité & Conformité",
        description: "Renforcement de la posture de sécurité des systèmes.",
        items: [
            "Audit de sécurité des infrastructures (réseau, serveurs, applicatif)",
            "Hardening systèmes – politiques de durcissement",
            "Gestion des accès, MFA, PKI interne",
            "Sensibilisation et formation des équipes",
        ],
    },
    {
        emoji: "☁️",
        title: "Cloud & Architecture Hybride",
        description: "Transition vers le cloud et architectures résilientes.",
        items: [
            "Migration cloud (AWS, OVHcloud, Scaleway)",
            "Architecture hybride on-premise / cloud",
            "Plan de continuité d'activité (PCA) et reprise après sinistre",
            "Gestion sauvegardes et réplication (Proxmox Backup Server, rsync)",
        ],
    },
]

export default function ServicesPage() {
    return (
        <div className="space-y-5 max-w-3xl text-base leading-relaxed text-foreground">
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Services Professionnels</h1>
                <p className="text-muted-foreground">
                    Fort d'une expérience en ingénierie système, réseaux et intégration, j'accompagne
                    les entreprises dans la conception et l'exploitation de leurs infrastructures IT
                </p>
            </div>

            <Separator />

            <div className="space-y-5">
                {services.map((service) => (
                    <div key={service.title} className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">{service.emoji}</span>
                            <div>
                                <h2 className="font-semibold">{service.title}</h2>
                                <p className="text-muted-foreground text-sm">{service.description}</p>
                            </div>
                        </div>
                        <ul className="ml-8 space-y-1">
                            {service.items.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="p-5 rounded-xl border bg-muted/30 space-y-2">
                <p className="font-semibold">Une mission ? Un audit ? Une intégration ?</p>
                <p className="text-muted-foreground">
                    Je suis disponible pour des missions de conseil, d'intégration ou de support technique,
                    aussi bien à La Réunion qu'à distance
                </p>
                <a
                    href="mailto:bhugeloo.idriss@gmail.com"
                    className="inline-block mt-1 font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                    bhugeloo.idriss@gmail.com →
                </a>
            </div>
        </div>
    )
}
