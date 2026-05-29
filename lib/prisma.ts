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

/**
 * Checks if the database is currently pausing or offline.
 * Skips Prisma connection attempts to avoid blocking server-rendering for 5 seconds.
 */
export function isDatabaseOffline(): boolean {
  const dbUrl = process.env.DATABASE_URL || ""
  
  // 1. Instantly skip if placeholders are present
  if (dbUrl.includes("[YOUR_PROJECT_ID]") || dbUrl.includes("[YOUR_PASSWORD]") || !dbUrl) {
    return true
  }

  // 2. Skip if previously flagged as offline (cache for 1 minute before retrying)
  if (globalThis.isDbOffline) {
    const timeSinceLastCheck = Date.now() - (globalThis.lastDbCheck || 0)
    if (timeSinceLastCheck > 60000) { // 60 seconds connection cache
      // Update check time to avoid spawning duplicate background checks
      globalThis.lastDbCheck = Date.now()
      
      // Run background connection check asynchronously without blocking
      console.log("🔄 Background check: Attempting to see if database has come online...")
      basePrisma.$queryRaw`SELECT 1`
        .then(() => {
          console.log("✅ Database is BACK ONLINE! Disabling offline sandbox mode.")
          globalThis.isDbOffline = false
        })
        .catch(() => {
          console.log("❌ Database is still offline. Continuing in sandbox mode.")
          globalThis.isDbOffline = true
          globalThis.lastDbCheck = Date.now()
        })
    }
    return true
  }

  return false
}

/**
 * Flags the database as currently offline when a connection timeout or query exception occurs.
 */
export function flagDatabaseOffline() {
  globalThis.isDbOffline = true
  globalThis.lastDbCheck = Date.now()
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

