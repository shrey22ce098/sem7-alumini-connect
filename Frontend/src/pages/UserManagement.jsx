// Helper functions for role-based action visibility
// Place these outside the component to avoid parser errors
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';


// export default function UserManagement() {
//   const loggedIn = useSelector((state) => state.loggedIn);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editUser, setEditUser] = useState(null); // user being edited
//   const [showModal, setShowModal] = useState(false);

//   const fetchUsers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get('http://localhost:5000/users/all', { withCredentials: true });
//       setUsers(res.data.data.users);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => { fetchUsers(); }, []);


//   const handleApprove = async (userId) => {
//     setLoading(true);
//     try {
//       await axios.post('http://localhost:5000/users/approve', { userId }, { withCredentials: true });
//       fetchUsers();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     setLoading(true);
//     try {
//       await axios.delete('http://localhost:5000/users/delete', { data: { userId }, withCredentials: true });
//       fetchUsers();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//     setLoading(false);
//   };

//   const openEditModal = (user) => {
//     setEditUser({ ...user });
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditUser(null);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     try {
//       await axios.put('http://localhost:5000/users/update', { userId: editUser._id, email: editUser.email, role: editUser.role }, { withCredentials: true });
//       fetchUsers();
//       closeModal();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//     setLoading(false);
//   };

//   if (!loggedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="max-w-5xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold mb-4">User Management Dashboard</h2>
//       {loading && <div>Loading...</div>}
//       {error && <div className="text-red-600 mb-2">{error}</div>}
//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border">Email</th>
//             <th className="py-2 px-4 border">Role</th>
//             <th className="py-2 px-4 border">Approved</th>
//             <th className="py-2 px-4 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user._id}>
//               <td className="py-2 px-4 border">{user.email}</td>
//               <td className="py-2 px-4 border">{user.role === 'collegeadmin' ? 'College Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
//               <td className="py-2 px-4 border">{user.isApproved ? 'Yes' : 'No'}</td>
//               <td className="py-2 px-4 border flex flex-col gap-2 md:flex-row md:gap-2">
//                 {!user.isApproved && (
//                   <button onClick={() => handleApprove(user._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
//                 )}
//                 <button onClick={() => openEditModal(user)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Edit</button>
//                 <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Edit Modal */}
//       {showModal && editUser && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-80">
//             <h3 className="text-lg font-bold mb-4">Edit User</h3>
//             <label className="block mb-2">Email
//               <input type="email" name="email" value={editUser.email} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
//             </label>
//             <label className="block mb-2">Role
//               <select name="role" value={editUser.role} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
//                 <option value="admin">Admin</option>
//                 <option value="collegeadmin">College Admin</option>
//                 <option value="professor">Professor</option>
//                 <option value="alumni">Alumni</option>
//                 <option value="student">Student</option>
//               </select>
//             </label>
//             <div className="flex justify-end gap-2 mt-4">
//               <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
//               <button onClick={handleUpdate} className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';


// Helper functions for role-based action visibility
function canEditOrDelete(currentUser, user) {
  if (!currentUser || !user) return false;
  if (currentUser._id === user._id) return false; // Prevent self-edit/delete
  if (currentUser.role === 'admin') {
    // Admin can edit/delete all collegeadmins, professors, alumni
    return ['collegeadmin', 'professor', 'alumni'].includes(user.role);
  }
  if (currentUser.role === 'collegeadmin') {
    // College admin can edit/delete professors and alumni of same department
    return (
      ['professor', 'alumni'].includes(user.role) &&
      user.department &&
      user.department === currentUser.department
    );
  }
  if (currentUser.role === 'professor') {
    // Professor can edit/delete alumni of same department and branch
    return (
      user.role === 'alumni' &&
      user.department &&
      user.branch &&
      user.department === currentUser.department &&
      user.branch === currentUser.branch
    );
  }
  return false;
}

function canApprove(currentUser, user) {
  // Approval follows same rules as edit/delete
  return canEditOrDelete(currentUser, user);
}

export default function UserManagement() {
  const loggedIn = useSelector((state) => state.loggedIn);
  const currentUser = useSelector((state) => state.currentUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null); // user being edited
  const [showModal, setShowModal] = useState(false);
  // College admin registration form state
  const [collegeAdminForm, setCollegeAdminForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    collegeName: '',
    department: ''
  });
  // Handle college admin form input
  const handleCollegeAdminInput = (e) => {
    const { name, value } = e.target;
    setCollegeAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit college admin registration
  const handleCollegeAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/auth/register', {
        ...collegeAdminForm,
        role: 'collegeadmin',
      }, { withCredentials: true });
      setCollegeAdminForm({ email: '', password: '', firstName: '', lastName: '', collegeName: '', department: '' });
      fetchUsers();
      alert('College Admin registered successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/users/all', { withCredentials: true });
      console.log('Fetched users for table:', res.data.data.users);
      setUsers(res.data.data.users);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);


  const handleApprove = async (userId) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/users/approve', { userId }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      await axios.delete('http://localhost:5000/users/delete', { data: { userId }, withCredentials: true });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const openEditModal = (user) => {
    setEditUser({
      ...user,
      department: user.department || '',
      branch: user.branch || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/users/update', {
        userId: editUser._id,
        email: editUser.email,
        role: editUser.role,
        department: editUser.department,
        branch: editUser.branch
      }, { withCredentials: true });
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management Dashboard</h2>
      {/* College Admin Registration Form (admin only) */}
      {currentUser?.role === 'admin' && (
        <form onSubmit={handleCollegeAdminRegister} className="mb-8 bg-white p-6 rounded shadow max-w-xl">
          <h3 className="text-lg font-bold mb-4">Register College Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="firstName" value={collegeAdminForm.firstName} onChange={handleCollegeAdminInput} placeholder="First Name" className="border px-2 py-1 rounded" required />
            <input name="lastName" value={collegeAdminForm.lastName} onChange={handleCollegeAdminInput} placeholder="Last Name" className="border px-2 py-1 rounded" />
            <input name="collegeName" value={collegeAdminForm.collegeName} onChange={handleCollegeAdminInput} placeholder="College Name" className="border px-2 py-1 rounded" required />
            <input name="department" value={collegeAdminForm.department} onChange={handleCollegeAdminInput} placeholder="Department" className="border px-2 py-1 rounded" required />
            <input name="email" value={collegeAdminForm.email} onChange={handleCollegeAdminInput} placeholder="Email" type="email" className="border px-2 py-1 rounded" required />
            <input name="password" value={collegeAdminForm.password} onChange={handleCollegeAdminInput} placeholder="Password" type="password" className="border px-2 py-1 rounded" required />
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Register College Admin</button>
        </form>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Branch</th>
            <th className="py-2 px-4 border">Approved</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role === 'collegeadmin' ? 'College Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
              <td className="py-2 px-4 border">{user.department || '-'}</td>
              <td className="py-2 px-4 border">{user.branch || '-'}</td>
              <td className="py-2 px-4 border">{user.isApproved ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border flex flex-col gap-2 md:flex-row md:gap-2">
                {canApprove(currentUser, user) && !user.isApproved && (
                  <button onClick={() => handleApprove(user._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
                )}
                {canEditOrDelete(currentUser, user) && (
                  <>
                    <button onClick={() => openEditModal(user)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                  </>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <label className="block mb-2">Email
              <input type="email" name="email" value={editUser.email} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <label className="block mb-2">Role
              <select name="role" value={editUser.role} onChange={handleEditChange} className="w-full border px-2 py-1 rounded">
                <option value="admin">Admin</option>
                <option value="collegeadmin">College Admin</option>
                <option value="professor">Professor</option>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
              </select>
            </label>
            {/* Department/Branch fields for relevant roles */}
            {(editUser.role === 'student' || editUser.role === 'alumni' || editUser.role === 'collegeadmin' || editUser.role === 'professor') && (
              <label className="block mb-2">Department
                <input type="text" name="department" value={editUser.department || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
              </label>
            )}
            {(editUser.role === 'student' || editUser.role === 'alumni') && (
              <label className="block mb-2">Branch
                <input type="text" name="branch" value={editUser.branch || ''} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
              </label>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-3 py-1 bg-blue-600 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
