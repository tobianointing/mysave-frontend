import { Group, Stack, Text, Box, createStyles, Drawer, useMantineColorScheme } from "@mantine/core"
// @ts-ignore
import { Carousel } from "@mantine/carousel"
import {
  TablerIcon,
  IconPlus,
  IconStrikethrough,
  IconTrendingUp,
  IconShield,
  IconSunHigh,
  IconMoonStars,
} from "@tabler/icons"
import QuickSave from "../sections/QuickSave"
import Withdraw from "../sections/Withdraw"
import Account from "../sections/Account"
import { useAuth, useStore } from "../../src/store"
import { useMediaQuery } from "@mantine/hooks"

type Props = {}

export default function Dashboard(props: Props) {
  const [section, setSection, opened, setOpened] = useStore((state: any) => [
    state.section,
    state.setSection,
    state.opened,
    state.setOpened,
  ])

  const [userData] = useAuth((state: any) => [state.userData])

  const handleDrawerSwitch = (section: string): void => {
    setOpened(true)
    setSection(section)
  }

  const largeScreen = useMediaQuery("(min-width: 900px)")

  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === "dark"

  return (
    <>
      <Group position="apart">
        <Stack spacing={0}>
          <Text
            sx={(theme) => ({
              fontSize: "1.5rem",
              fontWeight: 700,

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: "1.875rem",
              },
            })}
          >
            {userData.first_name ?? ""}
          </Text>
          <Text
            sx={(theme) => ({
              fontSize: "0.875rem",

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: "1rem",
              },
            })}
          >
            Good afternoon, wash your hands 🌞
          </Text>
        </Stack>

        <Box
          sx={(theme) => ({
            borderRadius: "50%",
            padding: ".4rem",
            backgroundColor: theme.colors.blue[7],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              padding: theme.spacing.sm,
            },
          })}
          onClick={() => toggleColorScheme()}
        >
          {dark ? (
            <IconMoonStars color={"#C1C2C5"} size={24} />
          ) : (
            <IconSunHigh color={"white"} size={24} />
          )}
        </Box>
      </Group>

      <Box mt={48}>
        <Carousel slideSize="10%" slideGap="sm" align="start" withControls={false}>
          <Carousel.Slide>
            <BalanceCard
              icon={IconShield}
              amount={userData.balance}
              label={"Total Savings"}
              bgColor={"blue"}
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <BalanceCard
              icon={IconTrendingUp}
              amount={0.0}
              label={"Total Loans"}
              bgColor={"dark"}
            />
          </Carousel.Slide>
        </Carousel>
      </Box>

      <Group mt={50} px={largeScreen ? 0 : "sm"}>
        <ButtonCard
          title={"Quick save"}
          icon={IconPlus}
          onClick={handleDrawerSwitch}
          label={"Save"}
        />
        <ButtonCard
          title={"Withdraw"}
          icon={IconStrikethrough}
          onClick={handleDrawerSwitch}
          label={"Withdraw"}
        />
      </Group>

      <Drawer
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        size={450}
        padding={"xl"}
        styles={{ drawer: { overflow: "scroll" } }}
        transition="slide-left"
        transitionDuration={600}
        transitionTimingFunction="ease"
      >
        {section === "Save" && <QuickSave />}
        {section === "Account" && <Account />}
        {section === "Withdraw" && <Withdraw />}
      </Drawer>
    </>
  )
}

interface BalanceCardProps {
  icon: TablerIcon
  amount: number
  label: string
  bgColor: string
}

function BalanceCard(props: BalanceCardProps) {
  const { classes } = useStyles()

  return (
    <Box
      className={classes.card}
      sx={(theme) => ({
        backgroundColor: theme.colors[props.bgColor][7],
      })}
    >
      <Group>
        <props.icon className={classes.cardIcon} />
        <Stack spacing={0}>
          <Text className={classes.title}>{props.label}</Text>
          <Text className={classes.amount}>₦{props.amount}</Text>
        </Stack>
      </Group>
    </Box>
  )
}

interface ButtonCardProps {
  title: string
  label: string
  icon: TablerIcon
  onClick: (section: string) => void
}

function ButtonCard(props: ButtonCardProps) {
  const { classes } = useStyles()

  return (
    <Box className={classes.btnCard} onClick={() => props.onClick(props.label)}>
      <Group>
        <props.icon className={classes.btnCardIcon} />
        <Text>{props.title}</Text>
      </Group>
    </Box>
  )
}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon")

  return {
    btnCard: {
      width: "100%",
      display: "flex",
      borderRadius: theme.radius.md,
      borderEndStartRadius: "0",
      padding: "1rem 2rem",
      border:
        theme.colorScheme === "dark" ? theme.colors.dark[2] : `1px solid ${theme.colors.blue[7]}`,
      color: theme.colorScheme === "dark" ? theme.colors.dark[2] : theme.colors.dark[9],
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : "",
      cursor: "pointer",
      textTransform: "uppercase",
      fontSize: "1rem",
      fontWeight: 600,

      [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
        width: "300px",
        fontSize: "1.2rem",
        padding: "2rem 3rem",
      },
    },

    card: {
      width: "266px",
      height: "130x",
      display: "flex",
      // backgroundColor: theme.colors.grape[7],
      borderRadius: theme.radius.md,
      borderEndStartRadius: "0",
      padding: "2rem 3rem 2rem 1rem",
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : "white",

      [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
        width: "250px",
        height: "138px",
      },
    },

    btnCardIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? "white" : theme.colors.dark[9],
      marginRight: theme.spacing.sm,
    },

    cardIcon: {
      ref: icon,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : "white",
      marginRight: theme.spacing.sm,
      width: "32px",
      height: "32px",
    },

    title: {
      fontSize: ".875rem",
      fontWeight: 700,
    },

    amount: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
  }
})
