import { Request, Response } from "express";
import { NoteService } from "../services/note.service";

export class NoteController {
  private service = new NoteService();

  createNote = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as string;
    const entityId = Number(req.params.entityId as string);
    const { content } = req.body;
    const note = await this.service.createNote(entityType, entityId, content);
    res.status(201).json(note);
  };

  getNotes = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as string;
    const entityId = Number(req.params.entityId as string);
    const notes = await this.service.getNotes(entityType, entityId);
    res.json(notes);
  };

  getNoteById = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const noteId = Number(req.params.noteId);

    const note = await this.service.getNoteById(entityType, entityId, noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  };

  updateNote = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const noteId = Number(req.params.noteId);
    const { content } = req.body;

    const updated = await this.service.updateNote(entityType, entityId, noteId, content);
    if (!updated) return res.status(404).json({ message: "Note not found" });

    res.json(updated);
  };

  deleteNote = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const noteId = Number(req.params.noteId);

    await this.service.deleteNote(entityType, entityId, noteId);
    res.json({ message: "Note deleted successfully" });
  };
}