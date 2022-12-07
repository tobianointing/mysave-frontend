import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core"
import { NotificationsProvider, showNotification } from "@mantine/notifications"
import { theme } from "./theme"
import AuthLayout from "./layouts/AuthLayout/AuthLayout"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import HomeLayout from "./layouts/HomeLayout/HomeLayout"
import History from "./pages/History"
import jwt_decode from "jwt-decode"
import { useAuth } from "./store"
import React, { useState } from "react"

export default function App() {
  const [setToken] = useAuth((state: any) => [state.setToken])

  const token = localStorage.getItem("token")

  React.useEffect(() => {
    setToken(token)
  }, [setToken, token])

  const ProtectedRoute = ({ token, children }: { token: string | null; children: JSX.Element }) => {
    if (token) {
      try {
        let decodedToken: any = jwt_decode(token)
        let currentDate = new Date()

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          return <Navigate to="/auth/login" replace />
        } else {
          return children
        }
      } catch (error) {
        console.log("Error define by me:" + error)
        return <Navigate to="/auth/login" replace />
      }
    } else {
      return <Navigate to="/auth/login" replace />
    }
  }

  const [colorScheme, setColorScheme] = useState<ColorScheme>("light")
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider position="top-right">
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            <Route
              path="/"
              element={
                <ProtectedRoute token={token}>
                  <HomeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
