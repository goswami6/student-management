import * as XLSX from 'xlsx'

export function downloadExcel(students) {
  const data = students.map((s, i) => ({
    '#': i + 1,
    Name: s.name,
    Email: s.email,
    Age: s.age,
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')

  // Auto column widths
  ws['!cols'] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 30 },
    { wch: 8 },
  ]

  XLSX.writeFile(wb, 'students.xlsx')
}
