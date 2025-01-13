package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/api/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Server is running!",
		})
	})

	r.GET("/api/test_slow", func(c *gin.Context) {
		// Simulate a slow response
		time.Sleep(2 * time.Second)
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "This was a slow response",
		})
	})

	// Run the server
	r.Run(":8080")
}
