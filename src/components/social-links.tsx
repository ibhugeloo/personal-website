import Link from "next/link"

const socialLinks = [
    { name: "Email", href: "mailto:bhugeloo.idriss@gmail.com" },
    { name: "GitHub", href: "https://github.com/ibhugeloo" },
    { name: "Instagram", href: "https://www.instagram.com/idriss-bhugeloo/" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/idriss-bhugeloo/" },
]

export function SocialLinks() {
    return (
        <div className="flex flex-wrap gap-4 text-sm">
            {socialLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                    target={link.name !== "Email" ? "_blank" : undefined}
                    rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                >
                    {link.name}
                </Link>
            ))}
        </div>
    )
}
