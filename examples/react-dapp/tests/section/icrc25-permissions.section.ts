import { Page } from "@playwright/test"
import { Section } from "./section.js"

export class Icrc25PermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_permissions")
  }
}
