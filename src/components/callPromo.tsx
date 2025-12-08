"use client"

import { useEffect, useRef } from "react"
import { useCart_unstable as useCart } from "@faststore/core/experimental"
import { cartStore_unstable as cartStore } from "@faststore/core/experimental"

export function callPromo() {
  const { id, items, isValidating } = useCart() as any
  const last = useRef("")

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const cartSig = (orderFormId: string, cartItems: any[]) =>
    `${orderFormId}::${(cartItems ?? [])
      .map((i: any) => `${i.itemOffered?.sku ?? i.id}:${i.quantity}`)
      .sort()
      .join("|")}`

  const orderFormSig = (of: any) =>
    `${of?.orderFormId ?? ""}::${(of?.items ?? [])
      .map((i: any) => `${i.id}:${i.quantity}`)
      .sort()
      .join("|")}`

  useEffect(() => {
    if (!id) return
    if (isValidating) return // ✅ wait for it to flip to false

    const desiredSig = cartSig(id, items ?? [])
    if (desiredSig === last.current) return
    last.current = desiredSig

    const ORDERFORM_URL = "https://demoaccount8.myvtex.com/_v/orderform"
    const PROMO_URL = "https://demoaccount8.myvtex.com/_v/promotions"

    const run = async () => {
      // ✅ fetch OF and retry until it reflects cart
      const delays = [0, 200, 500, 900]
      let orderForm: any = null

      for (const d of delays) {
        if (d) await sleep(d)

        const ofRes = await fetch(ORDERFORM_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderFormId: id }),
        })

        if (!ofRes.ok) {
          console.log("ORDERFORM FAILED ❌", ofRes.status, await ofRes.text())
          continue
        }

        const data = await ofRes.json()
        orderForm = data?.orderForm ?? data

        console.log(orderForm)
        console.log(desiredSig)

        if (orderFormSig(orderForm) === desiredSig) break
      }

      if (!orderForm?.orderFormId) return

      const promoRes = await fetch(PROMO_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderForm),
      })

      console.log("PROMO STATUS ✅", promoRes.status)
      const updatedCart = cartStore.read()
      cartStore.set(updatedCart)
      if (!promoRes.ok) console.log(await promoRes.text())
    }

    run().catch((e) => console.log("FAILED ❌", e))
  }, [id, items, isValidating])

  return null
}

export const CallPromo = callPromo

