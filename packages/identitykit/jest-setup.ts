import "@testing-library/jest-dom"
import "@testing-library/jest-dom/jest-globals"
import { jest } from "@jest/globals"

import { TextEncoder, TextDecoder } from "util"

Object.assign(globalThis, { jest, TextDecoder, TextEncoder })
