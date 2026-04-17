import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import dealRoutes from "./routes/deal.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import notificationRoutes from "./routes/notification.routes";
import searchRoutes from "./routes/search.routes";
import ticketRoutes from "./routes/tickets.routes";
import companyRoutes from "./routes/company.routes";
import attachmentRoutes from "./routes/attachment.routes";
import userRoutes from "./routes/user.routes";
import importRoutes from "./routes/import.routes";
import { createEntityNotesRouter } from "./routes/note.routes";
import { createEntityEmailsRouter } from "./routes/email.routes";
import { createEntityCallsRouter } from "./routes/call.routes";
import { createEntityTasksRouter } from "./routes/task.routes";
import { createEntityMeetingsRouter } from "./routes/meeting.routes";
import { setupAssociations } from "./models/associations";
import activityRoutes from "./routes/activity.routes";  

dotenv.config();
setupAssociations();

const app = express();


app.use(cors({
    origin: [ "http://localhost:3001"], // frontend ports
    credentials: true
}));

// app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/tickets", ticketRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/import", importRoutes);

// app.use("/api/:entityType/:entityId/notes", createEntityNotesRouter());
// app.use("/api/:entityType/:entityId/emails", createEntityEmailsRouter());
// app.use("/api/:entityType/:entityId/calls", createEntityCallsRouter());
// app.use("/api/:entityType/:entityId/tasks", createEntityTasksRouter());
// app.use("/api/:entityType/:entityId/meetings", createEntityMeetingsRouter());
app.use("/api/activities",activityRoutes)

export default app;
