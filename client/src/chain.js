import { defineChain } from 'viem'

export const cardona = defineChain({
  id: 2442,
  name: 'Cardona',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.cardona.zkevm-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'Polygonscan', url: 'https://cardona-zkevm.polygonscan.com/' },
  },
})