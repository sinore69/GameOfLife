"use client";
import { useEffect, useState } from "react";
export default function Home() {
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

  const connection=new WebSocket("ws://127.0.0.1:5000/echo")
  connection.onopen = (event) => {
    console.log("connection open")
  };  
  const senddata=()=>{
    connection.send(JSON.stringify(data));
  }

  useEffect(()=>{
    connection.onmessage = (event) => {
      try {
        const res=JSON.parse(event.data) as number[][]
        setdata([...res])
      } catch (error) {
        console.log(error)
      }
    };
  },[data])
  
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
                className={`flex flex-col h-6 w-6 border ${(item===0)?"border-black":"border-white"} ${
                  (item === 0) ? "bg-white" : "bg-black"
                }`}
                onClick={() => changeValue(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={senddata}>click</button>
    </div>
  );

}
