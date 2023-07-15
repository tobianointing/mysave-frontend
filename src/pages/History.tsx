import { Group, Stack, Text, Box } from "@mantine/core";
import { IconBell } from "@tabler/icons";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Header from "../sections/Header";

export default function History() {
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    const res = await fetch(
      "https://mysave-backend.000webhostapp.com/mysave/backend/users/history",
      {
        headers: {
          Authorization: token ?? "",
        },
      }
    );

    const json = await res.json();

    return json;
  };

  const { data } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    select: (data) =>
      data.results
        .sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        .reverse(),
  });

  let tableData;

  if (data) {
    tableData = data;
  } else {
    tableData = [];
  }

  return (
    <>
      <Header title="History" />

      <Box mt={48}>
        <HistoryTable data={tableData} />
      </Box>
    </>
  );
}

interface HistoryTableProps {
  data: any[];
}

function HistoryTable(props: HistoryTableProps) {
  const ths = (
    <tr>
      <th>Amount(₦)</th>
      <th>Type</th>
      <th>Status</th>
      <th> Date</th>
    </tr>
  );

  const rows = props.data.map((element) => {
    const date = dayjs(element.date).format("ddd, DD MMM YYYY hh:mm:ss");
    return (
      <tr key={element.id}>
        <td>{element.amount}</td>
        <td>{element.transaction_type}</td>
        <td>{element.status}</td>
        <td>{date}</td>
      </tr>
    );
  });

  return (
    <Table>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
