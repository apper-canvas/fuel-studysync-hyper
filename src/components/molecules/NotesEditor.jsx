import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const NotesEditor = ({ content = '', onChange, placeholder = 'Start writing your notes...' }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList')
    });
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    updateActiveFormats();
    handleInput();
  };

  const handleKeyDown = (e) => {
    // Handle common keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
      }
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex items-center space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => executeCommand('bold')}
          className={cn(
            "px-2 py-1 h-8",
            activeFormats.bold && "bg-primary text-white hover:bg-primary/90"
          )}
          title="Bold (Ctrl+B)"
        >
          <ApperIcon name="Bold" className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => executeCommand('italic')}
          className={cn(
            "px-2 py-1 h-8",
            activeFormats.italic && "bg-primary text-white hover:bg-primary/90"
          )}
          title="Italic (Ctrl+I)"
        >
          <ApperIcon name="Italic" className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => executeCommand('insertUnorderedList')}
          className={cn(
            "px-2 py-1 h-8",
            activeFormats.insertUnorderedList && "bg-primary text-white hover:bg-primary/90"
          )}
          title="Bullet List"
        >
          <ApperIcon name="List" className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => executeCommand('insertOrderedList')}
          className={cn(
            "px-2 py-1 h-8",
            activeFormats.insertOrderedList && "bg-primary text-white hover:bg-primary/90"
          )}
          title="Numbered List"
        >
          <ApperIcon name="ListOrdered" className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={updateActiveFormats}
        onSelectionChange={updateActiveFormats}
        className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none text-gray-900 leading-relaxed"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default NotesEditor;