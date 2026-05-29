import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
  var isDbOffline: boolean | undefined
  var lastDbCheck: number | undefined
}

const basePrisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export function isDatabaseOffline(): boolean {
  const dbUrl = process.env.DATABASE_URL || ""
  
  // 1. Instantly skip if placeholders are present or empty
  if (dbUrl.includes("[YOUR_PROJECT_ID]") || dbUrl.includes("[YOUR_PASSWORD]") || !dbUrl) {
    return true
  }

  return false
}

/**
 * Flags the database as currently offline when a connection timeout or query exception occurs.
 */
export function flagDatabaseOffline() {
  // No-op in production to prevent locked offline sandbox states on serverless cold starts.
}

// Wrap basePrisma in a Proxy to intercept and instantly fail all database operations if offline,
// completely eliminating Prisma's 3-5 seconds connection attempts and timeouts.
const prismaProxy = new Proxy(basePrisma, {
  get(target: any, prop: string | symbol, receiver: any) {
    if (isDatabaseOffline()) {
      // 1. Intercept standard model accesses (e.g., prisma.user, prisma.product)
      if (typeof prop === "string" && !prop.startsWith("$")) {
        return new Proxy(target[prop] || {}, {
          get(subTarget, subProp) {
            return () => {
              throw new Error("Database is offline (Sandbox Mode)")
            }
          }
        })
      }

      // 2. Intercept query/transaction methods (e.g., prisma.$transaction, prisma.$queryRaw)
      const queryMethods = ["$transaction", "$queryRaw", "$executeRaw", "$queryRawUnsafe", "$executeRawUnsafe"]
      if (typeof prop === "string" && queryMethods.includes(prop)) {
        return () => {
          throw new Error("Database is offline (Sandbox Mode)")
        }
      }
    }

    return Reflect.get(target, prop, receiver)
  }
})

const prisma = prismaProxy as PrismaClient
export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = basePrisma

