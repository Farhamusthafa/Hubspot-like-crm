'use client';

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ChevronDown, Bold, Italic, Underline, List, ListOrdered, Image as ImageIcon, Link2, Smile, Paperclip, X, Check } from 'lucide-react';

export interface RichTextEditorRef {
  execCommand: (command: string, val?: string) => void;
  focus: () => void;
  insertImage: () => void;
  insertFile: () => void;
  insertLink: () => void;
  toggleEmoji: () => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  toolbarPosition?: 'top' | 'bottom';
  hideToolbar?: boolean;
  className?: string;
}

const COMMON_EMOJIS = ['😊', '👍', '😂', '🔥', '🚀', '🙌', '💡', '✅', '❌', '👀', '✨', '🎉', '👋', '❤️', '🤔', '😢'];

const RichTextEditorComponent: React.ForwardRefRenderFunction<RichTextEditorRef, RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter text...",
  required = false,
  error,
  toolbarPosition = 'top',
  hideToolbar = false,
  className = ""
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const execCommand = (command: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
        editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLinkApply = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    execCommand('insertHTML', emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        execCommand('insertImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const linkHtml = `<a href="#" class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-[#5948DB] font-medium no-underline hover:bg-gray-200 transition-colors" contenteditable="false" onclick="event.preventDefault()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        ${file.name}
      </a>&nbsp;`;
      execCommand('insertHTML', linkHtml);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useImperativeHandle(ref, () => ({
    execCommand,
    focus: () => editorRef.current?.focus(),
    insertImage: () => imageInputRef.current?.click(),
    insertFile: () => fileInputRef.current?.click(),
    insertLink: () => setShowLinkInput(true),
    toggleEmoji: () => setShowEmojiPicker(prev => !prev),
  }));

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!value) {
        editorRef.current.innerHTML = '';
      } else if (editorRef.current.innerHTML === '') {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col w-full ${label ? 'gap-1.5' : ''} ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`relative transition-all bg-white flex flex-col ${label ? 'border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#5948DB] focus-within:ring-2 focus-within:ring-indigo-100' : 'border-0'}`}>
        {!hideToolbar && toolbarPosition === 'top' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-b border-gray-100 select-none overflow-x-auto no-scrollbar">
            <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Bold size={16} /></button>
            <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Italic size={16} /></button>
            <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Underline size={16} /></button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1 flex-shrink-0" />
            <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><List size={16} /></button>
            <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><ListOrdered size={16} /></button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1 flex-shrink-0" />
            <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${showLinkInput ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-900'}`}><Link2 size={16} /></button>
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${showEmojiPicker ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-gray-900'}`}><Smile size={16} /></button>
            <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"><ImageIcon size={16} /></button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"><Paperclip size={16} /></button>
          </div>
        )}
        
        <div className="relative flex-1">
          <div 
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="w-full p-4 text-[14px] outline-none text-gray-700 leading-relaxed min-h-[120px] editor-content"
            style={{ whiteSpace: 'pre-wrap' }}
          />
          {(!value || value === '' || value === '<br>') && (
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-[14px]">
              {placeholder}
            </div>
          )}

          {showLinkInput && (
            <div className="absolute top-2 left-4 p-2 bg-white border border-gray-200 shadow-xl rounded-xl flex items-center gap-2 z-[110] animate-in slide-in-from-top-2 duration-200 border-t-4 border-t-indigo-500">
              <Link2 size={14} className="text-indigo-500 ml-1" />
              <input 
                type="text" 
                placeholder="Paste or type a link..." 
                className="px-2 py-1 text-[13px] border border-gray-100 rounded-lg outline-none focus:border-indigo-300 w-56"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkApply()}
                autoFocus
              />
              <button type="button" onClick={handleLinkApply} className="p-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"><Check size={14} /></button>
              <button type="button" onClick={() => setShowLinkInput(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={14} /></button>
            </div>
          )}

          {showEmojiPicker && (
            <div className="absolute bottom-2 left-4 p-2 bg-white border border-gray-200 shadow-xl rounded-2xl grid grid-cols-8 gap-1 z-[110] animate-in slide-in-from-bottom-2 duration-200 border-b-4 border-b-amber-400">
              {COMMON_EMOJIS.map(emoji => (
                <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-lg transition-colors">{emoji}</button>
              ))}
            </div>
          )}
        </div>

        {!hideToolbar && toolbarPosition === 'bottom' && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-t border-gray-100 select-none overflow-x-auto no-scrollbar">
            <button type="button" onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Bold size={16} /></button>
            <button type="button" onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Italic size={16} /></button>
            <button type="button" onClick={() => execCommand('underline')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><Underline size={16} /></button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1 flex-shrink-0" />
            <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><List size={16} /></button>
            <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"><ListOrdered size={16} /></button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1 flex-shrink-0" />
            <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${showLinkInput ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-900'}`}><Link2 size={16} /></button>
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${showEmojiPicker ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-gray-900'}`}><Smile size={16} /></button>
            <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-emerald-600 transition-colors"><ImageIcon size={16} /></button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"><Paperclip size={16} /></button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      <style jsx global>{`
        .editor-content a { color: #5948DB; text-decoration: underline; }
        .editor-content img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
        .editor-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .editor-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        .editor-content li { margin-bottom: 0.25rem; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export const RichTextEditor = forwardRef(RichTextEditorComponent);
RichTextEditor.displayName = 'RichTextEditor';
