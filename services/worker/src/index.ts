import dotenv from "dotenv";

dotenv.config();

console.log("☣️  Worker service started");

process.on("SIGINT", async () => {
    console.log("Worker shutting down on SIGINT . . .");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Worker shutting down on SIGTERM . . .");
    process.exit(0);
});
