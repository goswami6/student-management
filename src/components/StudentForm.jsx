import { useState, useEffect } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StudentForm({ student, onSubmit, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', age: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (student) {
      setForm({ name: student.name, email: student.email, age: String(student.age) })
    }
  }, [student])

  const validate = (data) => {
    const errs = {}
    if (!data.name.trim()) errs.name = 'Name is required'
    if (!data.email.trim()) {
      errs.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errs.email = 'Enter a valid email address'
    }
    if (!data.age) {
      errs.age = 'Age is required'
    } else if (isNaN(Number(data.age)) || Number(data.age) < 1 || Number(data.age) > 120) {
      errs.age = 'Enter a valid age (1–120)'
    }
    return errs
  }

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) {
      setErrors(validate(next))
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate(form))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, email: true, age: true })
    if (Object.keys(errs).length > 0) return
    onSubmit({
      ...(student ? { id: student.id } : {}),
      name: form.name.trim(),
      email: form.email.trim(),
      age: Number(form.age),
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="btn-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              autoFocus
            />
            {errors.name && touched.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="e.g. aarav@example.com"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {errors.email && touched.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className={`form-group ${errors.age && touched.age ? 'has-error' : ''}`}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              placeholder="e.g. 21"
              min="1"
              max="120"
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
              onBlur={() => handleBlur('age')}
            />
            {errors.age && touched.age && <span className="error-msg">{errors.age}</span>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {student ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
