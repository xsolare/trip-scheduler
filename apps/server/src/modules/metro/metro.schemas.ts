import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { metroLines, metroStations, metroSystems } from '~/../db/schema'

// --- Output Schemas ---

export const MetroSystemSchema = createSelectSchema(metroSystems)

export const MetroStationSchema = createSelectSchema(metroStations)

export const MetroLineSchema = createSelectSchema(metroLines)

export const MetroSystemDetailsSchema = z.object({
  id: z.string().uuid(),
  city: z.string(),
  lines: z.array(MetroLineSchema.extend({
    stations: z.array(MetroStationSchema),
  })),
})

// --- Input Schemas ---

export const GetMetroSystemDetailsInputSchema = z.object({
  systemId: z.string().uuid(),
})
