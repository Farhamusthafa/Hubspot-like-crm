import { BaseRepository } from "../repositories/base.repository";
import { Note } from "../models/note.model";

export class NoteService {
  private repo = new BaseRepository<Note>(Note);

  createNote(entityType: string, entityId: number, content: string) {
    return this.repo.create({ entityType, entityId, content });
  }

  getNotes(entityType: string, entityId: number) {
    return this.repo.findByEntity(entityType, entityId);
  }

  getNoteById(entityType: string, entityId: number, noteId: number) {
    return this.repo.findById(entityType, entityId, noteId);
  }

  updateNote(entityType: string, entityId: number, noteId: number, content: string) {
    return this.repo.update(entityType, entityId, noteId, { content });
  }

  deleteNote(entityType: string, entityId: number, noteId: number) {
    return this.repo.delete(entityType, entityId, noteId);
  }
}