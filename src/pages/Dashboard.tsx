import { useOutletContext } from "react-router-dom";
import { User } from "../types/user";

export default function Dashboard() {
  const { data } = useOutletContext() as User;

  return (
    <>
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
