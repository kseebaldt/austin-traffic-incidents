import { useEffect, useState } from "react";
import Map from "../components/map";

export default function Index() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  };

  useEffect(() => load(), []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Map Data Demo</h1>
      {data ? <Map data={data} /> : null}
    </div>
  );
}
