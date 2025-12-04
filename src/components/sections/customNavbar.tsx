import { getOverriddenSection, NavbarSection } from "@faststore/core"
import { CustomNavbarButtons } from "../customNavbarButtons"

export default getOverriddenSection({
  Section: NavbarSection,
  components: {
    NavbarButtons: { Component: CustomNavbarButtons },
  },
})
