import { signal, effect } from '@preact/signals'
import { MOCK_COINS, type Coin } from '@/types/coin'

export const coins = signal<readonly Coin[]>(MOCK_COINS)
export const searchQuery = signal('')

export const addCoin = (coin: Coin) => {
  coins.value = [coin, ...coins.value]
}

if (typeof window !== 'undefined') {
  effect(() => {
    try { localStorage.setItem('dimes:coins', JSON.stringify(coins.value)) } catch {}
  })

  try {
    const saved = localStorage.getItem('dimes:coins')
    if (saved) coins.value = JSON.parse(saved)
  } catch {}
}
