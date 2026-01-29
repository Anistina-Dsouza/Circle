require("dotenv").config();
const express=require("express")
const app=express()

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for testing
app.get("/", (req, res) => {
    res.json({ 
      message: "Welcome to Circle API",
      version: "1.0.0",
      status: "online",
      timestamp: new Date().toISOString()
    });
  });
  

  app.use((req, res) => {
    res.status(404).json({ 
      error: "Route not found",
      path: req.originalUrl 
    });
  });
  
  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
