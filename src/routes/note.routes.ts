import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { NoteController } from "../controllers/note.controller";

export const createEntityNotesRouter = () => {
  const router = Router({ mergeParams: true });
  const controller = new NoteController();

  router.use(verifyToken);

  router.post("/", controller.createNote);
  router.get("/", controller.getNotes);
  router.get("/:noteId", controller.getNoteById);
  router.patch("/:noteId", controller.updateNote);
  router.delete("/:noteId", controller.deleteNote);

  return router;

};