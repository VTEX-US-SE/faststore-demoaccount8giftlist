"use client"

import { useEffect, useRef } from "react"
import { useCart_unstable as useCart } from "@faststore/core/experimental"

export function callPromo() {
  const { id, items } = useCart() as any
  const last = useRef("")

  useEffect(() => {
    if (!id) return

    // ✅ "get the updates": run whenever cart changes
    const sig = `${id}::${(items ?? [])
      .map((i: any) => `${i.itemOffered?.sku ?? i.id}:${i.quantity}`)
      .sort()
      .join("|")}`

    if (sig === last.current) return
    last.current = sig

    const ORDERFORM_URL = "https://promo--demoaccount8giftlist.myvtex.com/_v/orderform"
    const PROMO_URL = "https://promo--demoaccount8giftlist.myvtex.com/_v/promotions"

    const run = async () => {
      console.log("CART UPDATE ✅", { id, items })

      // 1) get orderForm
      const ofRes = await fetch(ORDERFORM_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderFormId: id }),
      })

      if (!ofRes.ok) {
        console.log("ORDERFORM FAILED ❌", ofRes.status, await ofRes.text())
        return
      }

      const data = await ofRes.json()
      const orderForm = data?.orderForm ?? data
      console.log(orderForm)

      // 2) call promo with orderForm
      const promoRes = await fetch(PROMO_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderForm),
      })

      console.log("PROMO STATUS ✅", promoRes.status)
      if (!promoRes.ok) console.log(await promoRes.text())
    }

    run().catch((e) => console.log("FAILED ❌", e))
  }, [id, items])

  return null
}

export const CallPromo = callPromo

