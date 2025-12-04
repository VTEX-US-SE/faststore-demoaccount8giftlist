import { NavbarButtons } from "@faststore/ui"
import { callPromo } from "./callPromo"

export function CustomNavbarButtons(props: any) {
  return (
    <NavbarButtons {...props}>
      {callPromo()}
      {props.children}
    </NavbarButtons>
  )
}
