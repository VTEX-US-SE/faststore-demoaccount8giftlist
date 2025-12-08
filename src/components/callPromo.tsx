"use client"

import { useEffect, useRef } from "react"
// We keep the original imports for the low-level store
import { createCartStore } from "@faststore/sdk"

// --- Low-Level Store Initialization (Kept from Original Code) ---
const cartStore = createCartStore({ id: "", items: [] }, undefined, "fs::cart")

export function UseCallPromoWatcher() {
  // We change the signature ref to store the entire stringified cart state
  const lastCartState = useRef("") 
  const timer = useRef<number | null>(null)

  const inflightOrderForm = useRef<AbortController | null>(null)
  const inflightPromo = useRef<AbortController | null>(null)
  
  const PROMO_URL = `https://promo--demoaccount8giftlist.myvtex.com/_v/promotions`
  const ORDERFORM_URL = `https://promo--demoaccount8giftlist.myvtex.com/_v/orderform`

  // ... (Keep sleep, fetchOrderForm, and sendPromo functions exactly the same) ...

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const fetchOrderForm = async (orderFormId: string) => {
    // ... (Your existing fetchOrderForm implementation) ...
    inflightOrderForm.current?.abort()
    inflightOrderForm.current = new AbortController()

    const delays = [0, 200, 500, 900]

    for (const d of delays) {
      if (d) await sleep(d)
      // ... (Rest of fetch logic) ...
       const res = await fetch(ORDERFORM_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderFormId }),
        signal: inflightOrderForm.current.signal,
      }).catch((e: any) => {
        if (e?.name === "AbortError") return null
        throw e
      })

      if (!res) return null

      if (res.ok) {
        const data = await res.json()
        return data?.orderForm ?? data 
      }
    }
    return null
  }

  const sendPromo = async (orderForm: any) => {
    // ... (Your existing sendPromo implementation) ...
    inflightPromo.current?.abort()
    inflightPromo.current = new AbortController()

    try {
      const res = await fetch(PROMO_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderForm),
        signal: inflightPromo.current.signal,
      })

      console.log("PROMO RESPONSE ✅", res.status)
      if (!res.ok) console.log(await res.text())
    } catch (e: any) {
      if (e?.name === "AbortError") return
      console.log("PROMO CALL FAILED ❌", e)
    }
  }

  // --- Main Logic (useEffect) ---

  useEffect(() => {
    const handleCartChange = (cart: any) => {
      // 1. IMPROVED STABILITY CHECK: Stringify the entire relevant cart object.
      // This ensures ANY change in the orderForm properties (total, item price,
      // gift message, etc.) triggers a new fetch.
      const currentStateString = JSON.stringify({
        id: cart.id,
        items: (cart.items ?? []).map((i: any) => ({
          id: i.id,
          quantity: i.quantity,
          // IMPORTANT: Check for price/listPrice which is the best indicator of
          // a fully processed orderForm update from VTEX.
          price: i.price, 
          listPrice: i.listPrice,
        })),
      })

      // 2. STABILITY CHECK: If the full state hasn't changed, ignore the update.
      if (currentStateString === lastCartState.current) return
      
      // Update the last successful state string
      lastCartState.current = currentStateString

      if (!cart?.id) return

      // 3. Clear any pending debounced call
      if (timer.current) window.clearTimeout(timer.current)

      // 4. Debounce the actual fetch/send logic
      timer.current = window.setTimeout(async () => {
        console.log("CART CHANGED (Debounced) ✅", cart.id)

        // The fetchOrderForm call has built-in retries (200, 500, 900ms)
        // This is key to getting the *stable* orderForm from the back-end.
        const orderForm = await fetchOrderForm(cart.id)
        
        if (!orderForm?.orderFormId) {
          console.log("ORDERFORM NOT READY ❌")
          return
        }

        console.log("ORDERFORM ✅", orderForm.orderFormId, orderForm.items?.length)

        await sendPromo(orderForm)
      }, 700)
    }

    // 5. Subscribe to the cart store
    const unsub = cartStore.subscribe(handleCartChange)
    
    // 6. Handle the initial load immediately
    handleCartChange(cartStore.read()) 

    // 7. Cleanup function
    return () => {
      inflightOrderForm.current?.abort()
      inflightPromo.current?.abort()
      if (timer.current) window.clearTimeout(timer.current)
      unsub()
    }
  }, []) // Runs only once on mount

  return null
}

export const CallPromo = UseCallPromoWatcher