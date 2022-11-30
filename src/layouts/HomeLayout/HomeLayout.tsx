import {
  AppShell,
  Burger,
  Group,
  Navbar,
  Stack,
  Text,
  Box,
  createStyles,
  Container,
  UnstyledButton,
  MediaQuery,
  Transition,
} from "@mantine/core"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import {
  IconAddressBook,
  IconBrandFlightradar24,
  IconUser,
  IconLayoutDashboard,
  IconLogout,
  TablerIcon,
} from "@tabler/icons"
import { useAuth, useStore } from "../../store"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

type Props = {}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon")

  return {
    link: {
      ...theme.fn.focusStyles(),
      textDecoration: "none",
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : "white",
      fontWeight: 500,
      fontSize: "1rem",
    },

    mobileLink: {
      ...theme.fn.focusStyles(),
      color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.dark[1],
      fontWeight: 500,
      fontSize: "1rem",
    },

    mobileIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
    },

    mobileIconActive: {
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.blue[7],
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      backgroundColor: "white",
      borderRadius: theme.radius.md,
      borderEndStartRadius: "0",
      padding: "0.25rem 2.5rem 0.25rem 1.5rem",
      fontWeight: 500,
      color: theme.colorScheme === "dark" ? "white" : theme.colors.dark[9],
    },

    mobileLinkActive: {
      color: theme.colorScheme === "dark" ? "white" : theme.colors.dark[9],
    },
  }
})

const mockdata = [
  { icon: IconLayoutDashboard, label: "Home", link: "" },
  { icon: IconBrandFlightradar24, label: "Save", link: "" },
  { icon: IconAddressBook, label: "History", link: "" },
  { icon: IconUser, label: "Account", link: "" },
]

export default function HomeLayout(props: Props) {
  const navigate = useNavigate()
  const [mopened, msetOpened] = useState(false)
  const [active, setActive] = useState("Home")

  const { setSection, setOpened } = useStore((state: any) => ({
    section: state.section,
    setSection: state.setSection,
    opened: state.opened,
    setOpened: state.setOpened,
  }))

  const [setUserData, setToken] = useAuth((state: any) => [state.setUserData, state.setToken])

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  const token = localStorage.getItem("token")

  const getUserData = async () => {
    const res = await fetch("https://eviafrica.com/mysave/users", {
      headers: {
        Authorization: token ?? "",
      },
    })

    const json = await res.json()

    return json
  }

  const { data, isFetchedAfterMount } = useQuery({
    queryKey: ["userdata"],
    queryFn: getUserData,
  })

  if (isFetchedAfterMount) {
    setUserData(data)
  }

  const handleDrawerSwitch = (section: string): void => {
    if (section === "Home") {
      setActive(section)
      navigate("/")
    } else if (section === "History") {
      setActive(section)
      navigate("/history")
    } else {
      navigate("/")
      setActive(section)
      setOpened(true)
      setSection(section)
    }
  }

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!mopened}
          width={{ base: mopened ? 70 : 250 }}
          sx={(theme) => ({
            backgroundColor: theme.colors.blue[7],
            padding: "3rem 1.5rem 1rem",
            transition: "width .3s ease",
          })}
        >
          <Navbar.Section>
            <Group>
              <Burger
                opened={mopened}
                onClick={() => msetOpened((o) => !o)}
                size="sm"
                color={"white"}
                mr="xl"
              />
              <Text color={"white"} size="xl" hidden={mopened}>
                MySave
              </Text>
            </Group>
          </Navbar.Section>
          <Navbar.Section grow mt={48}>
            <Stack spacing={40}>
              {mockdata.map((elem) => (
                <NavLink
                  icon={elem.icon}
                  label={elem.label}
                  link={elem.link}
                  active={active}
                  onClick={() => handleDrawerSwitch(elem.label)}
                  mopened={mopened}
                />
              ))}
            </Stack>
          </Navbar.Section>
          <Navbar.Section>
            <NavLink
              icon={IconLogout}
              label={"Logout"}
              link={""}
              active={active}
              onClick={logout}
              mopened={mopened}
            />
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Container
        sx={(theme) => ({
          maxWidth: "100%",
          padding: "2rem 0 0",

          [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
            padding: "2.5rem 3rem",
          },
        })}
      >
        <Outlet />
      </Container>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Box
          sx={(theme) => ({
            height: "70px",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.gray[2],
          })}
          py="md"
          px={"lg"}
        >
          <Group position="apart">
            {mockdata.map((elem) => (
              <MobileLink
                icon={elem.icon}
                label={elem.label}
                link={elem.link}
                active={active}
                onClick={() => handleDrawerSwitch(elem.label)}
              />
            ))}
          </Group>
        </Box>
      </MediaQuery>
    </AppShell>
  )
}

interface NavLinkProps {
  icon: TablerIcon
  label: string
  link: string
  active: string
  onClick: () => void
  mopened?: boolean
}

function NavLink(props: NavLinkProps) {
  const { classes } = useStyles()

  return (
    <UnstyledButton className={classes.link} onClick={props.onClick}>
      <Group spacing={32}>
        <Box>
          <props.icon />
        </Box>
        <Transition mounted={!props.mopened ?? false} transition="fade" duration={200} timingFunction="ease">
          {(styles) => (
            <Box
              // hidden={props.mopened}
              className={props.label === props.active && !props.mopened ? classes.linkActive : ""}
            >
              <Text>{props.label}</Text>
            </Box>
          )}
        </Transition>
      </Group>
    </UnstyledButton>
  )
}

function MobileLink(props: NavLinkProps) {
  const { classes, cx } = useStyles()
  return (
    <UnstyledButton className={classes.mobileLink} onClick={props.onClick}>
      <Stack spacing={0} align="center">
        <props.icon
          className={cx(classes.mobileIcon, {
            [classes.mobileIconActive]: props.active === props.label,
          })}
        />
        <Text className={props.label === props.active ? classes.mobileLinkActive : ""}>
          {props.label}
        </Text>
      </Stack>
    </UnstyledButton>
  )
}
