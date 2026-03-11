import { useState, useEffect } from 'react'
import StudentTable from './components/StudentTable'
import StudentForm from './components/StudentForm'
import DeleteDialog from './components/DeleteDialog'
import { downloadExcel } from './utils/excel'

const initialStudents = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@email.com', age: 21 },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@email.com', age: 22 },
  { id: 3, name: 'Rohan Gupta', email: 'rohan.gupta@email.com', age: 20 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@email.com', age: 23 },
  { id: 5, name: 'Karan Mehta', email: 'karan.mehta@email.com', age: 21 },
]

export default function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Simulated loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(initialStudents)
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.age).includes(searchTerm)
  )

  const handleAdd = (student) => {
    setLoading(true)
    setTimeout(() => {
      setStudents((prev) => [
        ...prev,
        { ...student, id: Date.now() },
      ])
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  const handleUpdate = (updated) => {
    setLoading(true)
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      )
      setEditStudent(null)
      setShowForm(false)
      setLoading(false)
    }, 500)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setLoading(true)
    setTimeout(() => {
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
      setLoading(false)
    }, 400)
  }

  const openAdd = () => {
    setEditStudent(null)
    setShowForm(true)
  }

  const openEdit = (student) => {
    setEditStudent(student)
    setShowForm(true)
  }

  const closeForm = () => {
    setEditStudent(null)
    setShowForm(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Students Management</h1>
        <p className="subtitle">Manage student records with ease</p>
      </header>

      <main className="main">
        <div className="toolbar">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or age..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button className="btn btn-outline" onClick={() => downloadExcel(filteredStudents)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Excel
            </button>
            <button className="btn btn-primary" onClick={openAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        <StudentTable
          students={filteredStudents}
          loading={loading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />

        <div className="footer-info">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </main>

      {showForm && (
        <StudentForm
          student={editStudent}
          onSubmit={editStudent ? handleUpdate : handleAdd}
          onClose={closeForm}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          student={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
