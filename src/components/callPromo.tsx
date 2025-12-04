import { useEffect, useRef } from "react"
import { CartItem, createCartStore } from "@faststore/sdk"

const cartStore = createCartStore({ id: "", items: [] }, undefined, "fs::cart")

export function callPromo() {
  const last = useRef("")

  useEffect(() => {
    const send = async (payload: any) => {
      try {
        await fetch("/_v/promotions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        })
      } catch (e) {
        console.log("PROMO CALL FAILED ❌", e)
      }
    }

    const handle = (cart: any) => {
      const sig = `${cart.id}::${cart.items
        .map((i: CartItem) => `${i.id}:${i.quantity}`)
        .join("|")}`
      if (sig === last.current) return
      last.current = sig

      const payload = {
        orderformId: cart?.id,
        value: 0,
        items: cart.items.map((item: any) => ({
          skuId: item.itemOffered?.sku,
          productId: item.itemOffered?.isVariantOf?.productGroupID,
          refId: null,
          ean: null,
          quantity: item.quantity,
          listPrice: item.listPrice,
          sellingPrice: item.price ?? item.listPrice ?? 0,
          categoryIds: null,
          brandId: null,
          seller: item.seller?.identifier ?? "1",
        })),
      }

      console.log("CART CHANGED ✅")
      console.log(payload)

      send(payload) // <-- call your endpoint
    }

    const unsub = cartStore.subscribe(handle)

    // first load trigger
    handle(cartStore.read())

    return () => unsub()
  }, [])

  return null
}

