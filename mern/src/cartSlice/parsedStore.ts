// store/parsedStore.ts
import { create } from 'zustand'

type ParsedStore = {
  parsedData: any[]
  setParsedData: (data: any[]) => void
}

export const useParsedStore = create<ParsedStore>((set) => ({
  parsedData: [],
  setParsedData: (data) => set({ parsedData: data }),
}))