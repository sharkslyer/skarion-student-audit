import React, { useState } from 'react';
import { RATING_CONFIG } from '../data/initialData';
import { 
  User, 
  Calendar, 
  Plus, 
  Minus, 
  Trash2, 
  Eye, 
  MessageSquarePlus, 
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentTable({ 
  students, 
  onUpdateStudent, 
  onDeleteStudent, 
  onSelectStudent, 
  onAddNoteForStudent 
}) {
  const [sortField, setSortField] = useState('joiningDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleMockChange = (e, student, delta) => {
    e.stopPropagation();
    const newCount = Math.max(0, (student.mockInterviews || 0) + delta);
    onUpdateStudent({ ...student, mockInterviews: newCount });
  };

  const handleRatingChange = (e, student, newRating) => {
    e.stopPropagation();
    onUpdateStudent({ ...student, rating: newRating });
  };

  const handleProgressSlider = (e, student, newProgress) => {
    e.stopPropagation();
    onUpdateStudent({ ...student, progress: Number(newProgress) });
  };

  return (
    <div className="card-panel" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-subtle)' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--skarion-navy)' }}>Candidate Audit Roster</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Input-friendly dashboard to update mock interviews, course completion %, and evaluation marks.
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', background: 'var(--bg-surface)', padding: '0.3rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {sortedStudents.length} candidates enrolled
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Candidate Name <ArrowUpDown size={13} />
                </div>
              </th>
              <th onClick={() => handleSort('joiningDate')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Joining Date <ArrowUpDown size={13} />
                </div>
              </th>
              <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Audit Mark / Status <ArrowUpDown size={13} />
                </div>
              </th>
              <th onClick={() => handleSort('progress')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Course Progress <ArrowUpDown size={13} />
                </div>
              </th>
              <th onClick={() => handleSort('mockInterviews')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Mock Interviews <ArrowUpDown size={13} />
                </div>
              </th>
              <th>Audit Log Count</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No candidate audit records found matching your filters.
                </td>
              </tr>
            ) : (
              sortedStudents.map((student) => {
                const ratingObj = RATING_CONFIG[student.rating] || RATING_CONFIG.good;
                const stickyCount = student.stickyNotes?.length || 0;

                return (
                  <tr key={student.id} style={{ cursor: 'pointer' }} onClick={() => onSelectStudent(student)}>
                    {/* Candidate Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'var(--skarion-navy)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '0.95rem'
                        }}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--skarion-navy)' }}>{student.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Joining Date */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Calendar size={14} color="var(--skarion-navy)" />
                        {new Date(student.joiningDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Audit Mark Selector */}
                    <td>
                      <select 
                        value={student.rating}
                        onChange={(e) => handleRatingChange(e, student, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`status-badge ${ratingObj.badgeClass}`}
                        style={{
                          outline: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        {Object.entries(RATING_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key} style={{ background: 'var(--bg-surface)', color: cfg.color, fontWeight: 'bold' }}>
                            {cfg.icon} {cfg.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Course Progress Slider */}
                    <td style={{ width: '220px' }}>
                      <div onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '800', color: 'var(--skarion-navy)' }}>{student.progress}%</span>
                          <span style={{ color: 'var(--text-muted)' }}>Stage {Math.ceil((student.progress || 1) / 25)}/4</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={student.progress || 0}
                          onChange={(e) => handleProgressSlider(e, student, e.target.value)}
                          style={{
                            width: '100%',
                            accentColor: 'var(--skarion-orange)',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </td>

                    {/* Mock Interviews Stepper */}
                    <td>
                      <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-surface-subtle)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <button className="btn-icon" style={{ width: '24px', height: '24px', padding: '0' }} onClick={(e) => handleMockChange(e, student, -1)}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: '800', fontSize: '0.95rem', minWidth: '24px', textAlign: 'center', color: 'var(--skarion-navy)' }}>
                          {student.mockInterviews || 0}
                        </span>
                        <button className="btn-icon" style={{ width: '24px', height: '24px', padding: '0' }} onClick={(e) => handleMockChange(e, student, 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>

                    {/* Audit Logs Count */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        <span style={{
                          background: stickyCount > 0 ? 'rgba(255, 82, 82, 0.1)' : 'var(--bg-surface-subtle)',
                          color: stickyCount > 0 ? 'var(--skarion-orange)' : 'var(--text-muted)',
                          padding: '0.15rem 0.55rem',
                          borderRadius: '6px',
                          fontWeight: '800',
                          border: '1px solid var(--border-color)'
                        }}>
                          📝 {stickyCount} log{stickyCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="btn-icon" 
                          title="Log Audit Comment"
                          onClick={() => onAddNoteForStudent(student)}
                          style={{ color: 'var(--skarion-orange)' }}
                        >
                          <MessageSquarePlus size={15} />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="View Full Profile Audit Trail"
                          onClick={() => onSelectStudent(student)}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Delete Candidate Record"
                          onClick={() => {
                            if (window.confirm(`Delete audit log for ${student.name}?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          style={{ color: '#dc2626' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
