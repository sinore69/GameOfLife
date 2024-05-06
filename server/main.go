package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections by default
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func echoHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection to WebSocket:", err)
		return
	}
	defer conn.Close()
	// Continuously read messages from the client and echo them back
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}
		var array [16][16]int
		err = json.Unmarshal(p, &array)
		if err != nil {
			log.Println("decoding error")
			break
		}
		comwaysgame(conn, array)
	}
}

func comwaysgame(conn *websocket.Conn, array [16][16]int) {
	defer conn.Close()
	row := len(array)
	col := len(array[0])
	newArray:=[16][16]int{}
	// newArray := make([][]int, row)
	// for i := range newArray {
	// 	newArray[i] = make([]int, col)
	// }
	for {
		for i := 0; i < row; i++ {
			for j := 0; j < col; j++ {
				newArray[i][j] = calc(array, i, j)
			}
		}
		array = newArray
		if err := conn.WriteJSON(newArray); err != nil {
			log.Println(err)
			return
		}
		time.Sleep((time.Millisecond * 1000))
	}
}

func calc(arr [16][16]int, i int, j int) int {
	//1 alive 0 dead
	row := []int{-1, -1, -1, 0, 1, 1, 1, 0}
	col := []int{-1, 0, 1, 1, 1, 0, -1, -1}
	count := 0
	for k := 0; k < 8; k++ {
		r := i + row[k]
		c := j + col[k]
		if r < 0 || r >= len(arr) || c < 0 || c >= len(arr[0]) {
			continue
		}

		if arr[r][c] == 1 {
			count++

		}
	}
	if arr[i][j] == 1 {
		if count >= 4 {
			return 0
		} else if count == 2 || count == 3 {
			return 1
		} else {
			return 0
		}
	} else {
		if count == 3 {
			return 1
		} else {
			return 0
		}
	}
}

func main() {
	http.HandleFunc("/echo", echoHandler)
	log.Println("Server started at :5000")
	err := http.ListenAndServe(":5000", nil)
	if err != nil {
		log.Fatal("Error starting server:", err)
	}
}
