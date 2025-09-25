import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state) => state.currentUser);
  const openEditModal = (student) => {
    setEditStudent({ ...student });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditStudent(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/users/students/update', {
        studentId: editStudent._id,
        enrollmentNumber: editStudent.enrollmentNumber,
        department: editStudent.department,
        branch: editStudent.branch,
        year: editStudent.year,
        email: editStudent.user?.email,
        firstName: editStudent.user?.firstName,
        lastName: editStudent.user?.lastName,
      }, { withCredentials: true });
      fetchStudents();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/users/students/all', { withCredentials: true });
      setStudents(res.data.data.students);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleApprove = async (studentId) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/users/students/approve', { studentId }, { withCredentials: true });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setLoading(true);
    try {
      await axios.delete('http://localhost:5000/users/students/delete', { data: { studentId }, withCredentials: true });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-2">
      <h2 className="text-2xl font-bold mb-4">Student Management</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Enrollment No.</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Branch</th>
              <th className="py-2 px-4 border">Year</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Approved</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{student.user?.firstName} {student.user?.lastName}</td>
                <td className="py-2 px-4 border">{student.enrollmentNumber}</td>
                <td className="py-2 px-4 border">{student.department || '-'}</td>
                <td className="py-2 px-4 border">{student.branch}</td>
                <td className="py-2 px-4 border">{student.year}</td>
                <td className="py-2 px-4 border">{student.user?.email}</td>
                <td className="py-2 px-4 border">{student.isApproved ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border flex flex-col gap-2 md:flex-row md:gap-2">
                  {canApproveStudent(currentUser, student) && !student.isApproved && (
                    <button onClick={() => handleApprove(student._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                  )}
                  {canApproveStudent(currentUser, student) && (
                    <>
                      <button onClick={() => openEditModal(student)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                      <button onClick={() => handleDelete(student._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                    </>
                  )}
                </td>
      {/* Edit Modal */}
      {showModal && editStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Edit Student</h3>
            <label className="block mb-2">First Name
              <input type="text" name="firstName" value={editStudent.user?.firstName || ''} onChange={e => setEditStudent(prev => ({ ...prev, user: { ...prev.user, firstName: e.target.value } }))} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Last Name
              <input type="text" name="lastName" value={editStudent.user?.lastName || ''} onChange={e => setEditStudent(prev => ({ ...prev, user: { ...prev.user, lastName: e.target.value } }))} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Email
              <input type="email" name="email" value={editStudent.user?.email || ''} onChange={e => setEditStudent(prev => ({ ...prev, user: { ...prev.user, email: e.target.value } }))} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Enrollment Number
              <input type="text" name="enrollmentNumber" value={editStudent.enrollmentNumber || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Department
              <input type="text" name="department" value={editStudent.department || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Branch
              <input type="text" name="branch" value={editStudent.branch || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Year
              <input type="text" name="year" value={editStudent.year || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
// Role-based access for student management
function canApproveStudent(currentUser, student) {
  if (!currentUser || !student) return false;
  if (currentUser.role === 'admin') return true;
  if (currentUser.role === 'collegeadmin') {
    return student.department && student.department === currentUser.department;
  }
  if (currentUser.role === 'professor') {
    return (
      student.department &&
      student.branch &&
      student.department === currentUser.department &&
      student.branch === currentUser.branch
    );
  }
  return false;
}

function canDeleteStudent(currentUser, student) {
  // Same logic as approve
  return canApproveStudent(currentUser, student);
}
}
