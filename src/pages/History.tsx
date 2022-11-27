import { Group, Stack, Text, Box } from "@mantine/core"
import { IconBell } from "@tabler/icons"
import { Table } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"

export default function History() {
  const token = localStorage.getItem("token")

  const fetchHistory = async () => {
    const res = await fetch("http://localhost/mysave/backend/users/history", {
      headers: {
        Authorization: token ?? "",
      },
    })

    const json = await res.json()

    return json
  }

  const { data } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    select: (data) =>
      data.results
        .sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        .reverse(),
  })

  let tableData

  if (data) {
    tableData = data
  } else {
    tableData = []
  }

  return (
    <>
      <Group position="apart">
        <Stack spacing={0}>
          <Text
            sx={(theme) => ({
              fontSize: "1.5rem",
              fontWeight: 700,
              color: theme.colors.blue[7],

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: "1.875rem",
              },
            })}
          >
            History
          </Text>
          <Text
            sx={(theme) => ({
              fontSize: "0.875rem",

              [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: "1rem",
              },
            })}
          >
            Good afternoon, wash your hands 🌙
          </Text>
        </Stack>

        <Box
          sx={(theme) => ({
            borderRadius: "50%",
            padding: theme.spacing.xs,
            backgroundColor: theme.colors.blue[7],
            display: "flex",
            alignItems: "center",

            [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
              padding: theme.spacing.sm,
            },
          })}
        >
          <IconBell color={"white"} />
        </Box>
      </Group>

      <Box mt={48}>
        <HistoryTable data={tableData} />
      </Box>
    </>
  )
}

interface HistoryTableProps {
  data: any[]
}

function HistoryTable(props: HistoryTableProps) {
  const ths = (
    <tr>
      <th>Amount(₦)</th>
      <th>Type</th>
      <th>Status</th>
      <th> Date</th>
    </tr>
  )

  const rows = props.data.map((element) => {
    const date = dayjs(element.date).format("ddd, DD MMM YYYY hh:mm:ss")
    return (
      <tr key={element.id}>
        <td>{element.amount}</td>
        <td>{element.transaction_type}</td>
        <td>{element.status}</td>
        <td>{date}</td>
      </tr>
    )
  })

  return (
    <Table>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
