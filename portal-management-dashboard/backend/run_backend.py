import uvicorn

if __name__ == "__main__":
    print("Starting Portal Management Dashboard Backend on http://localhost:8004")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8004, reload=False)
