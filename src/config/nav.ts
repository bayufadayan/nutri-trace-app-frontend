export type Role = "SUPERADMIN" | "PRODUCER" | "DISTRIBUTOR" | "NUTRITIONIST";

export type IconName =
    | "layout-dashboard"
    | "users"
    | "boxes"
    | "truck"
    | "utensils"
    | "settings";

export type NavItem = {
    title: string;
    href: string;
    icon: IconName;
    roles: Role[];
    exact?: boolean;
};
export const NAV_ITEMS: NavItem[] = [
    {
        title: "Overview",
        href: "/admin",
        icon: "layout-dashboard",
        roles: ["SUPERADMIN"],
        exact: true,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: "users",
        roles: ["SUPERADMIN"],
    },

    {
        title: "Batches",
        href: "/admin/batches",
        icon: "boxes",
        roles: ["SUPERADMIN"],
    },
    {
        title: "Batches",
        href: "/producer/batches",
        icon: "boxes",
        roles: ["PRODUCER"],
    },

    {
        title: "Distributions",
        href: "/admin/shipments",
        icon: "truck",
        roles: ["SUPERADMIN"],
    },
    {
        title: "Distributions",
        href: "/distributor/shipments",
        icon: "truck",
        roles: ["DISTRIBUTOR"],
    },
    {
        title: "Nutrition",
        href: "/nutritionist/analysis",
        icon: "utensils",
        roles: ["NUTRITIONIST", "SUPERADMIN"],
    },

    {
        title: "Settings",
        href: "/settings",
        icon: "settings",
        roles: ["SUPERADMIN", "PRODUCER", "DISTRIBUTOR", "NUTRITIONIST"],
    },
];

export function menuForRole(role?: Role | null) {
    if (!role) return [] as NavItem[]
    const items = NAV_ITEMS.filter((i) => i.roles.includes(role))
    const seen = new Set<string>()
    return items.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)))
}


export const HOME_BY_ROLE: Record<Role, string> = {
    SUPERADMIN: "/admin",
    PRODUCER: "/producer",
    DISTRIBUTOR: "/distributor",
    NUTRITIONIST: "/nutritionist",
};
