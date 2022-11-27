import create from "zustand"

export const useStore = create((set) => ({
  section: "",
  setSection: (section: string) => set(() => ({ section })),
  opened: false,
  setOpened: () => set((state: { opened: any }) => ({ opened: !state.opened })),
}))

export const useAuth = create((set) => ({
  is_authenticated: false,
  setIsAuthenticated: (is_authenticated: boolean) =>
    set((state: any) => ({ ...state, is_authenticated })),
  userData: {},
  setUserData: (userData: any) => set((state: any) => ({ ...state, userData: { ...state.userData, ...userData } })),
  token: "",
  setToken: (token: string) => set((state: any) => ({ ...state, token })),
  setBalance: (balance: string) =>
    set((state: any) => ({
      ...state,
      userData: {
        ...state.userData,
        balance: balance,
      },
    })),
}))
