"use client";
import { useEffect, useState, useRef } from "react";
export default function Home() {
  const socketref = useRef<WebSocket | null>(null);
  const [reconnect,setreconnect]=useState(1);
  const [data, setdata] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  useEffect(() => {
    socketref.current = new WebSocket("ws://localhost:5000/echo");
    socketref.current.onopen = () => {
      console.log("WebSocket is connected");
    };
    socketref.current.onmessage = (event) => {
      try {
        const res = JSON.parse(event.data) as number[][];
        setdata([...res]);
      } catch (error) {
        console.log(error);
      }
    };
    socketref.current.onclose = () => {
      console.log("connection closed");
    };
  }, [reconnect]);
  const sendMessage = () => {
    if (socketref.current && socketref.current.readyState === WebSocket.OPEN) {
      socketref.current.send(JSON.stringify(data));
    } else {
      setreconnect(reconnect+1)
      console.log("WebSocket connection is not open");
    }
  };
  const changeValue = (rowIndex: number, colIndex: number) => {
    if (data[rowIndex][colIndex] === 1) {
      data[rowIndex][colIndex] = 0;
    } else {
      data[rowIndex][colIndex] = 1;
    }
    setdata([...data]);
  };

  return (
    <div className="h-screen w-screen flex justify-center pt-36">
      <div className="h-96 w-96">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {row.map((item, colIndex) => (
              <div
                key={colIndex}
                className={`flex flex-col h-6 w-6 border ${
                  item === 0 ? "border-black" : "border-white"
                } ${item === 0 ? "bg-white" : "bg-black"}`}
                onClick={() => changeValue(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={sendMessage}>click</button>
    </div>
  );
}
