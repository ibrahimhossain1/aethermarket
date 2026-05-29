import { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      stripeAccountId?: string | null
      stripeCustomerId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role?: UserRole
    stripeAccountId?: string | null
    stripeCustomerId?: string | null
  }
}
