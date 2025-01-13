// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/pinecone-io/go-pinecone/pinecone"
	"github.com/sashabaranov/go-openai"
)

type Config struct {
	PineconeAPIKey string
	PineconeEnv    string
	OpenAIKey      string
	Port           string
}

type Server struct {
	config   Config
	openAI   *openai.Client
	pinecone pinecone.Client
	router   *gin.Engine
}

func NewServer(config Config) (*Server, error) {
	openAIClient := openai.NewClient(config.OpenAIKey)

	pineconeClient, err := pinecone.Init(pinecone.Config{
		APIKey:      config.PineconeAPIKey,
		Environment: config.PineconeEnv,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to initialize pinecone: %v", err)
	}

	router := gin.Default()

	return &Server{
		config:   config,
		openAI:   openAIClient,
		pinecone: pineconeClient,
		router:   router,
	}, nil
}

func (s *Server) setupRoutes() {
	s.router.POST("/api/upload", s.handlePDFUpload)
	s.router.POST("/api/query", s.handleQuery)
}

func (s *Server) handlePDFUpload(c *gin.Context) {
	// Handle file upload
	file, err := c.FormFile("pdf")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Process PDF and create embeddings
	// Store in Pinecone
	// Return success response
}

func (s *Server) handleQuery(c *gin.Context) {
	var query struct {
		Question string `json:"question"`
		Context  string `json:"context"`
	}

	if err := c.BindJSON(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Query Pinecone for relevant context
	// Use OpenAI to generate answer
	// Return response
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	config := Config{
		PineconeAPIKey: os.Getenv("PINECONE_API_KEY"),
		PineconeEnv:    os.Getenv("PINECONE_ENV"),
		OpenAIKey:      os.Getenv("OPENAI_API_KEY"),
		Port:           os.Getenv("PORT"),
	}

	server, err := NewServer(config)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	server.setupRoutes()
	server.router.Run(":" + config.Port)
}
