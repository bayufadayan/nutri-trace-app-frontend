export const ROLES = ["SUPERADMIN","PRODUCER","DISTRIBUTOR","NUTRITIONIST"] as const
export type Role = typeof ROLES[number]