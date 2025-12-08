import { NavbarButtons } from "@faststore/ui"
import { CallPromo } from "./callPromo"

export function CustomNavbarButtons(props: any) {
  return (
      <NavbarButtons {...props}>
        <CallPromo />
        {props.children}
      </NavbarButtons>
  )
}
