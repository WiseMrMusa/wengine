import type { Webhooks } from "@prisma/client"
import assert from 'node:assert'
import crypto, { randomUUID } from 'node:crypto'
import { Agent, fetch } from "undici"