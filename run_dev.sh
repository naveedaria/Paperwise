# Function to stop background processes on script exit
cleanup() {
  echo "Stopping servers..."
  kill $(jobs -p) 2>/dev/null
  exit
}

# Set up cleanup on script exit
trap cleanup EXIT

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  # Windows commands
  start /B cmd /c "cd backend && go run ."
  start /B cmd /c "cd ui && npm run dev"
else
  # Unix-based commands
  cd backend && go run . &
  cd ui && npm run dev &
fi

# Keep script running
wait
