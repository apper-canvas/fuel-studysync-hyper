import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import NotesEditor from '@/components/molecules/NotesEditor';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { courseService } from '@/services/api/courseService';
import { notesService } from '@/services/api/notesService';
import { toast } from 'react-toastify';

const CourseNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [courseData, notesData] = await Promise.all([
        courseService.getById(id),
        notesService.getByCourseId(parseInt(id))
      ]);
      
      setCourse(courseData);
      setNotes(notesData);
    } catch (err) {
      console.error('Error loading course notes:', err);
      setError('Failed to load course notes');
      toast.error('Failed to load course notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      toast.error('Please enter a note title');
      return;
    }

    try {
      const noteData = {
        ...newNote,
        courseId: parseInt(id)
      };
      
      await notesService.create(noteData);
      await loadData();
      setIsCreating(false);
      setNewNote({ title: '', content: '' });
      toast.success('Note created successfully');
    } catch (err) {
      console.error('Error creating note:', err);
      toast.error('Failed to create note');
    }
  };

  const handleUpdateNote = async (noteId, updatedData) => {
    try {
      await notesService.update(noteId, updatedData);
      await loadData();
      setEditingNote(null);
      toast.success('Note updated successfully');
    } catch (err) {
      console.error('Error updating note:', err);
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesService.delete(noteId);
      await loadData();
      toast.success('Note deleted successfully');
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Failed to delete note');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!course) return <Error message="Course not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/courses')}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Notes</h1>
            <p className="text-gray-600 mt-1">
              {course.name} - {course.instructor}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>New Note</span>
        </Button>
      </div>

      {/* Create Note Form */}
      {isCreating && (
        <Card className="p-6 animate-scale-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create New Note</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreating(false);
                  setNewNote({ title: '', content: '' });
                }}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <Input
              label="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter note title..."
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Note Content
              </label>
              <NotesEditor
                content={newNote.content}
                onChange={(content) => setNewNote(prev => ({ ...prev, content }))}
                placeholder="Start writing your note..."
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={handleCreateNote} className="flex-1">
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Note
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsCreating(false);
                  setNewNote({ title: '', content: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <Card className="p-12 text-center">
            <ApperIcon name="FileText" className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first note to start organizing your course content.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create First Note
            </Button>
          </Card>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.Id}
              note={note}
              isEditing={editingNote === note.Id}
              onEdit={() => setEditingNote(note.Id)}
              onCancelEdit={() => setEditingNote(null)}
              onSave={(updatedData) => handleUpdateNote(note.Id, updatedData)}
              onDelete={() => handleDeleteNote(note.Id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const NoteCard = ({ note, isEditing, onEdit, onCancelEdit, onSave, onDelete }) => {
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        title: note.title,
        content: note.content
      });
    }
  }, [isEditing, note]);

  const handleSave = () => {
    if (!editData.title.trim()) {
      toast.error('Please enter a note title');
      return;
    }
    onSave(editData);
  };

  return (
    <Card className="p-6">
      {isEditing ? (
        <div className="space-y-4">
          <Input
            label="Note Title"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Note Content
            </label>
            <NotesEditor
              content={editData.content}
              onChange={(content) => setEditData(prev => ({ ...prev, content }))}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handleSave} size="sm">
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="secondary" size="sm" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: note.content || '<p><em>No content</em></p>' }}
          />
        </div>
      )}
    </Card>
  );
};

export default CourseNotes;