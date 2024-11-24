import * as yup from "yup"
import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"

export const subAccountValidation = () =>
  yup
    .string()
    .test("subaccount", "should be array of 32 8bit unsigned integers ([1,0,255...])", (value) => {
      if (!value) return true
      try {
        if (
          !/^\[(?:([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5]),\s*){31}([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])\]$/.test(
            value
          )
        )
          return false

        const subAccountOrError = SubAccount.fromBytes(new Uint8Array(JSON.parse(value)))

        if (typeof subAccountOrError === typeof Error) {
          throw subAccountOrError
        }

        return true
      } catch (e) {
        return false
      }
    })

export const principalValidation = () =>
  yup.string().test("principal", "not a valid principal", (value) => {
    if (!value) return true
    try {
      return !!Principal.fromText(value)
    } catch (e) {
      return false
    }
  })

export const numberValidation = () =>
  yup.string().test("principal", "should be positive number", (value) => {
    if (!value) return true
    return /^(0|[1-9]\d*)(e[+-]?\d+)?$/.test(value)
  })
