import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_STUDENTS } from './data/initialData';
import { STORAGE_KEY, saveLocally, loadLocally, pushToCloudDb, fetchFromCloudDb } from './utils/cloudSync';
import Header from './components/Header';
import TickerBar from './components/TickerBar';
import MetricsOverview from './components/MetricsOverview';
import StudentTable from './components/StudentTable';
import StickyNotesBoard from './components/StickyNotesBoard';
import CalendarView from './components/CalendarView';
import PlacedCandidatesView from './components/PlacedCandidatesView';
import MockInterviewView from './components/MockInterviewView';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailModal from './components/StudentDetailModal';

// Defensive sanitizer to ensure no corrupted candidate object can ever crash the React render
function sanitizeStudents(data) {
  if (!Array.isArray(data) || data.length === 0) return INITIAL_STUDENTS;
  const valid = data.filter(s => s && typeof s === 'object' && s.name && typeof s.name === 'string');
  return valid.length > 0 ? valid : INITIAL_STUDENTS;
}

export default function App() {
  const [students, setStudents] = useState(() => {
    const local = loadLocally();
    return sanitizeStudents(local);
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Syncing...');
  const lastEditTimeRef = useRef(Date.now());

  // 1. Initial Cloud Sync on startup
  useEffect(() => {
    async function initCloudSync() {
      setIsCloudSyncing(true);
      try {
        const cloudResult = await fetchFromCloudDb();
        if (cloudResult && Array.isArray(cloudResult.students) && cloudResult.students.length > 0) {
          const sanitized = sanitizeStudents(cloudResult.students);
          setStudents(sanitized);
          saveLocally(sanitized);
        }
      } catch (err) {
        console.warn('Cloud sync error on init:', err);
      }
      setIsCloudSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    initCloudSync();
  }, []);

  // 2. Realtime Background Cloud DB Polling (Polls every 3s to sync edits across devices live)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (Date.now() - lastEditTimeRef.current < 12000) {
        return; // Don't overwrite if user recently performed an edit or pin action
      }
      try {
        const cloudResult = await fetchFromCloudDb();
        if (cloudResult && Array.isArray(cloudResult.students) && cloudResult.students.length > 0) {
          const sanitized = sanitizeStudents(cloudResult.students);
          const currentStr = JSON.stringify(students);
          const cloudStr = JSON.stringify(sanitized);
          if (currentStr !== cloudStr) {
            setStudents(sanitized);
            saveLocally(sanitized);
            setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          }
        }
      } catch (err) {
        console.warn('Cloud polling notice:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [students]);

  // 3. BroadcastChannel listener for instant cross-tab sync
  useEffect(() => {
    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('SKARION_REALTIME_V15_CHANNEL');
      bc.onmessage = (event) => {
        if (event.data?.type === 'STUDENTS_UPDATED' && Array.isArray(event.data.students)) {
          const sanitized = sanitizeStudents(event.data.students);
          setStudents(sanitized);
        }
      };
    }
    return () => {
      if (bc) bc.close();
    };
  }, []);

  // Central State Mutator
  const applyStudentChanges = (newStudentsList, message) => {
    const sanitized = sanitizeStudents(newStudentsList);
    lastEditTimeRef.current = Date.now();
    setStudents(sanitized);
    saveLocally(sanitized);
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    
    if (message) showToast(message);

    setIsCloudSyncing(true);
    pushToCloudDb(sanitized).finally(() => {
      lastEditTimeRef.current = Date.now();
      setIsCloudSyncing(false);
    });
  };

  // Views & Filters
  const [activeView, setActiveView] = useState('table'); // 'table' | 'sticky' | 'calendar' | 'placed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedDetailStudent, setSelectedDetailStudent] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Students List - Defensive filtering against undefined properties
  const safeStudentsList = Array.isArray(students) ? students : INITIAL_STUDENTS;

  const filteredStudents = safeStudentsList.filter(student => {
    if (!student || typeof student !== 'object') return false;
    const studentRating = student.rating || 'good';
    const matchesRating = selectedRatingFilter === 'all' 
      ? true 
      : selectedRatingFilter === 'active' 
        ? studentRating !== 'placed' 
        : studentRating === selectedRatingFilter;
    const q = (searchQuery || '').toLowerCase().trim();
    const nameStr = (student.name || '').toLowerCase();
    const notesStr = student.stickyNotes && Array.isArray(student.stickyNotes) 
      ? student.stickyNotes.map(n => (n?.content || '').toLowerCase()).join(' ')
      : '';
    const matchesSearch = !q || nameStr.includes(q) || notesStr.includes(q);
    return matchesRating && matchesSearch;
  });

  // Actions
  const handleSaveStudent = (studentData) => {
    const exists = students.some(s => s && s.id === studentData.id);
    let updated;
    if (exists) {
      updated = students.map(s => s && s.id === studentData.id ? studentData : s);
      applyStudentChanges(updated, `Saved changes for ${studentData.name}`);
    } else {
      updated = [studentData, ...students];
      applyStudentChanges(updated, `Synced candidate ${studentData.name}`);
    }

    if (selectedDetailStudent && selectedDetailStudent.id === studentData.id) {
      setSelectedDetailStudent(studentData);
    }
  };

  const handleDeleteStudent = (id) => {
    const target = students.find(s => s && s.id === id);
    const updated = students.filter(s => s && s.id !== id);
    applyStudentChanges(updated, `Deleted record for ${target?.name || 'candidate'}`);
    if (selectedDetailStudent?.id === id) setSelectedDetailStudent(null);
  };

  const handleUpdateStudent = (updatedStudent) => {
    const updated = students.map(s => s && s.id === updatedStudent.id ? updatedStudent : s);
    applyStudentChanges(updated, `Updated candidate ${updatedStudent.name}`);
    if (selectedDetailStudent?.id === updatedStudent.id) setSelectedDetailStudent(updatedStudent);
  };

  // Sticky Notes / Audit Log Actions
  const handleAddStickyNote = (studentId, noteObj) => {
    const updated = students.map(s => {
      if (s && s.id === studentId) {
        const notes = s.stickyNotes || [];
        return { ...s, stickyNotes: [noteObj, ...notes] };
      }
      return s;
    });
    const target = students.find(s => s && s.id === studentId);
    applyStudentChanges(updated, `Added note by ${noteObj.author} for ${target?.name || 'candidate'}`);

    if (selectedDetailStudent && selectedDetailStudent.id === studentId) {
      const updatedTarget = updated.find(s => s && s.id === studentId);
      setSelectedDetailStudent(updatedTarget);
    }
  };

  const handleDeleteStickyNote = (studentId, noteId) => {
    const updated = students.map(s => {
      if (s && s.id === studentId) {
        return {
          ...s,
          stickyNotes: (s.stickyNotes || []).filter(n => n && n.id !== noteId)
        };
      }
      return s;
    });
    applyStudentChanges(updated, 'Deleted audit note');

    if (selectedDetailStudent && selectedDetailStudent.id === studentId) {
      const updatedTarget = updated.find(s => s && s.id === studentId);
      setSelectedDetailStudent(updatedTarget);
    }
  };

  const handleTogglePinStickyNote = (studentId, noteId) => {
    const updated = students.map(s => {
      if (s && s.id === studentId) {
        return {
          ...s,
          stickyNotes: (s.stickyNotes || []).map(n => n && n.id === noteId ? { ...n, pinned: !n.pinned } : n)
        };
      }
      return s;
    });
    applyStudentChanges(updated, 'Updated note pin status');

    if (selectedDetailStudent && selectedDetailStudent.id === studentId) {
      const updatedTarget = updated.find(s => s && s.id === studentId);
      setSelectedDetailStudent(updatedTarget);
    }
  };

  // Export / Import Data
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `skarion_student_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported audit dataset to JSON file');
  };

  const handleImportData = (importedStudents) => {
    applyStudentChanges(importedStudents, `Synced ${importedStudents.length} candidate records`);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all student audit logs to default dataset?')) {
      applyStudentChanges(INITIAL_STUDENTS, 'Reset data to default records');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--skarion-navy)',
          color: 'white',
          border: '1px solid var(--skarion-orange)',
          padding: '0.85rem 1.5rem',
          borderRadius: '12px',
          fontWeight: '700',
          fontSize: '0.9rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          ☁️ {toastMessage}
        </div>
      )}

      {/* Main Header Nav */}
      <Header 
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        students={students}
        isCloudSyncing={isCloudSyncing}
        lastSyncTime={lastSyncTime}
        onOpenAddModal={() => { setEditingStudent(null); setIsAddEditModalOpen(true); }}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        showToast={showToast}
      />

      {/* Side-Swiping Live Ticker Headline Bar */}
      <TickerBar 
        students={safeStudentsList}
        onSelectStudent={(student) => setSelectedDetailStudent(student)}
      />

      {/* Metrics Overview Bar */}
      <MetricsOverview 
        students={safeStudentsList}
        selectedRatingFilter={selectedRatingFilter}
        setSelectedRatingFilter={setSelectedRatingFilter}
      />

      {/* Main Content Area based on View Switcher */}
      {activeView === 'table' && (
        <StudentTable 
          students={filteredStudents}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onSelectStudent={(student) => setSelectedDetailStudent(student)}
          onAddNoteForStudent={(student) => setSelectedDetailStudent(student)}
        />
      )}

      {activeView === 'sticky' && (
        <StickyNotesBoard 
          students={safeStudentsList}
          onAddStickyNote={handleAddStickyNote}
          onDeleteStickyNote={handleDeleteStickyNote}
          onTogglePinStickyNote={handleTogglePinStickyNote}
          onSelectStudent={(student) => setSelectedDetailStudent(student)}
        />
      )}

      {activeView === 'calendar' && (
        <CalendarView 
          students={safeStudentsList}
          onSelectStudent={(student) => setSelectedDetailStudent(student)}
        />
      )}

      {activeView === 'mock' && (
        <MockInterviewView 
          students={safeStudentsList}
          onSaveStudent={handleSaveStudent}
          onSelectStudent={(student) => setSelectedDetailStudent(student)}
          showToast={showToast}
        />
      )}

      {activeView === 'placed' && (
        <PlacedCandidatesView 
          students={safeStudentsList}
          onSelectStudent={(student) => setSelectedDetailStudent(student)}
          onOpenAddModal={() => { setEditingStudent(null); setIsAddEditModalOpen(true); }}
        />
      )}

      {/* Add / Edit Student Modal */}
      <StudentFormModal 
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSaveStudent={handleSaveStudent}
        initialData={editingStudent}
      />

      {/* Student Detail Drawer Modal */}
      <StudentDetailModal 
        student={selectedDetailStudent}
        onClose={() => setSelectedDetailStudent(null)}
        onAddStickyNote={handleAddStickyNote}
        onDeleteStickyNote={handleDeleteStickyNote}
        onTogglePinStickyNote={handleTogglePinStickyNote}
        onOpenEditModal={(student) => {
          setEditingStudent(student);
          setIsAddEditModalOpen(true);
        }}
      />
    </div>
  );
}
