import { useEffect, useState } from "react";
import StackNavigator from "./src/StackNavigator";
import { initDB } from "./src/database/db";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB();
    setLoading(false);
  }, [])

  if (loading){
    return <></>;
  }

  return (
    <StackNavigator/>
  );
}