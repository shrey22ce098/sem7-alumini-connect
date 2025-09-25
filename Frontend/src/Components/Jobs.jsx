// import React, { useEffect, useState } from "react";
// import { getLoggedIn, getUserData } from "../services/authService";
// import NotLoggedIn from "./helper/NotLoggedIn";
// import { fetchJobs, createJob, applyJob, updateJob, deleteJob } from "../services/jobService";
//   const [editId, setEditId] = useState(null);
//   const [editForm, setEditForm] = useState({ title: '', description: '', vacancy: 1, link: '' });
//   const [showEditModal, setShowEditModal] = useState(false);
//   const canEditOrDelete = (job) => {
//     if (!user) return false;
//     return user.role === 'admin' || (job.createdBy && (job.createdBy._id === user._id || job.createdBy === user._id));
//   };

//   const handleEditClick = (job) => {
//     setEditId(job._id);
//     setEditForm({
//       title: job.title,
//       description: job.description,
//       vacancy: job.vacancy,
//       link: job.link || ''
//     });
//     setShowEditModal(true);
//   };

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await updateJob(editId, editForm);
//       setShowEditModal(false);
//       setEditId(null);
//       const res = await fetchJobs();
//       setJobs(res.data.data.jobs);
//     } catch (err) {
//       setError('Failed to update job');
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this job?')) return;
//     setLoading(true);
//     try {
//       await deleteJob(id);
//       const res = await fetchJobs();
//       setJobs(res.data.data.jobs);
//     } catch (err) {
//       setError('Failed to delete job');
//     }
//     setLoading(false);
//   };

// function Jobs() {
//   const loggedIn = getLoggedIn();
//   const user = getUserData();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [form, setForm] = useState({ title: '', description: '', vacancy: 1, link: '' });
//   const [applyMsg, setApplyMsg] = useState('');

//   useEffect(() => {
//     if (loggedIn) {
//       fetchJobs()
//         .then(res => setJobs(res.data.data.jobs))
//         .catch(() => setError('Failed to fetch jobs'));
//     }
//   }, [loggedIn]);

//   const canPost = user && ["collegeadmin", "professor", "alumni"].includes(user.role);
//   const canApply = user && user.role === "student";

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       await createJob(form);
//       setForm({ title: '', description: '', vacancy: 1, link: '' });
//       const res = await fetchJobs();
//       setJobs(res.data.data.jobs);
//     } catch (err) {
//       setError('Failed to post job');
//     }
//     setLoading(false);
//   };

//   const handleApply = async (jobId) => {
//     setLoading(true);
//     setApplyMsg('');
//     try {
//       await applyJob(jobId, {});
//       setApplyMsg('Application submitted!');
//     } catch (err) {
//       setApplyMsg('Failed to apply');
//     }
//     setLoading(false);
//   };

//   if (!loggedIn) return <NotLoggedIn text="Jobs" />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
//       <h1 className="text-4xl font-bold mb-6">Jobs</h1>
//       {canPost && (
//         <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
//           <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
//           <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded" required />
//           <input name="vacancy" value={form.vacancy} onChange={handleChange} type="number" min="1" className="block w-full mb-3 p-2 border rounded" required placeholder="No. of Vacancies" />
//           <input name="link" value={form.link} onChange={handleChange} placeholder="External Job Link (LinkedIn, Naukri, etc.)" className="block w-full mb-3 p-2 border rounded" />
//           <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded" required />
//           <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200 w-full" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
//         </form>
//       )}
//       {error && <div className="text-red-600 mb-2">{error}</div>}
//       <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
//         {jobs.length === 0 ? (
//           <div className="col-span-2 text-center text-gray-500">No jobs found.</div>
//         ) : (
//           jobs.map(job => (
//             <div key={job._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col">
//               <div className="font-bold text-lg text-indigo-700 mb-1">{job.title}</div>
//               <div className="text-gray-600 mb-1">Vacancy: {job.vacancy}</div>
//               {job.link && (
//                 <div className="mb-1">
//                   <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Job Post</a>
//                 </div>
//               )}
//               <div className="text-gray-700 mb-2">{job.description}</div>
//               <div className="text-gray-500 text-xs mb-1">Posted by: {job.createdBy?.email} ({job.createdBy?.role})</div>
//               <div className="flex gap-2 mt-2">
//                 {canApply && (
//                   <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleApply(job._id)} disabled={loading}>Apply</button>
//                 )}
//                 {canEditOrDelete(job) && (
//                   <>
//                     <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => handleEditClick(job)} disabled={loading}>Edit</button>
//                     <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(job._id)} disabled={loading}>Delete</button>
//                   </>
//                 )}
//               </div>
//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
//             <h2 className="text-xl font-semibold mb-4">Edit Job</h2>
//             <form onSubmit={handleEditSubmit}>
//               <input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded" required />
//               <input name="vacancy" value={editForm.vacancy} onChange={handleEditChange} type="number" min="1" className="block w-full mb-3 p-2 border rounded" required placeholder="No. of Vacancies" />
//               <input name="link" value={editForm.link} onChange={handleEditChange} placeholder="External Job Link (LinkedIn, Naukri, etc.)" className="block w-full mb-3 p-2 border rounded" />
//               <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded" required />
//               <div className="flex gap-2">
//                 <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
//                 <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition-colors duration-200" onClick={() => setShowEditModal(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//             </div>
//           ))
//         )}
//       </div>
//       {applyMsg && <div className="text-green-600 mt-4">{applyMsg}</div>}
//     </div>
//   );
// }

// export default Jobs;



import React, { useEffect, useState } from "react";
import { getLoggedIn, getUserData } from "../services/authService";
import NotLoggedIn from "./helper/NotLoggedIn";
import { fetchJobs, createJob, applyJob, updateJob, deleteJob } from "../services/jobService";


function Jobs() {
  const loggedIn = getLoggedIn();
  const user = getUserData();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', vacancy: 1, link: '' });
  const [applyMsg, setApplyMsg] = useState('');

  // Modal and edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', vacancy: 1, link: '' });

  // Get token from user (if available)
  const token = user && user.token ? user.token : undefined;

  // Edit/Delete logic
  const handleEditClick = (job) => {
    setEditId(job._id);
    setEditForm({
      title: job.title,
      description: job.description,
      vacancy: job.vacancy,
      link: job.link || ''
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateJob(editId, editForm, token);
      setShowEditModal(false);
      setEditId(null);
      const res = await fetchJobs(token);
      setJobs(res.data.data.jobs);
    } catch (err) {
      setError('Failed to update job');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    try {
      await deleteJob(id, token);
      const res = await fetchJobs(token);
      setJobs(res.data.data.jobs);
    } catch (err) {
      setError('Failed to delete job');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loggedIn) {
      fetchJobs(token)
        .then(res => setJobs(res.data.data.jobs))
        .catch(() => setError('Failed to fetch jobs'));
    }
  }, [loggedIn]);

  const canPost = user && ["collegeadmin", "professor", "alumni"].includes(user.role);
  const canApply = user && user.role === "student";

  // Allow admin/collegeadmin to edit/delete any job, professor/alumni only their own
  const canEditOrDelete = (job) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'collegeadmin') return true;
    if ((user.role === 'professor' || user.role === 'alumni') && job.createdBy && (job.createdBy._id === user._id || job.createdBy === user._id)) return true;
    return false;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createJob(form, token);
      setForm({ title: '', description: '', vacancy: 1, link: '' });
      const res = await fetchJobs(token);
      setJobs(res.data.data.jobs);
    } catch (err) {
      setError('Failed to post job');
    }
    setLoading(false);
  };

  const handleApply = async (jobId) => {
    setLoading(true);
    setApplyMsg('');
    try {
      await applyJob(jobId, {}, token);
      setApplyMsg('Application submitted!');
    } catch (err) {
      setApplyMsg('Failed to apply');
    }
    setLoading(false);
  };

  if (!loggedIn) return <NotLoggedIn text="Jobs" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6">Jobs</h1>
      {canPost && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded" required />
          <input name="vacancy" value={form.vacancy} onChange={handleChange} type="number" min="1" className="block w-full mb-3 p-2 border rounded" required placeholder="No. of Vacancies" />
          <input name="link" value={form.link} onChange={handleChange} placeholder="External Job Link (LinkedIn, Naukri, etc.)" className="block w-full mb-3 p-2 border rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded" required />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200 w-full" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
        </form>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500">No jobs found.</div>
        ) : (
          jobs.map(job => (
            <div key={job._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col">
              <div className="font-bold text-lg text-indigo-700 mb-1">{job.title}</div>
              <div className="text-gray-600 mb-1">Vacancy: {job.vacancy}</div>
              {job.link && (
                <div className="mb-1">
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Job Post</a>
                </div>
              )}
              <div className="text-gray-700 mb-2">{job.description}</div>
              <div className="text-gray-500 text-xs mb-1">Posted by: {job.createdBy?.email} ({job.createdBy?.role})</div>
              <div className="flex gap-2 mt-2">
                {canApply && (
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleApply(job._id)} disabled={loading}>Apply</button>
                )}
                {canEditOrDelete(job) && (
                  <>
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => handleEditClick(job)} disabled={loading}>Edit</button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(job._id)} disabled={loading}>Delete</button>
                  </>
                )}
              </div>
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Job</h2>
            <form onSubmit={handleEditSubmit}>
              <input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded" required />
              <input name="vacancy" value={editForm.vacancy} onChange={handleEditChange} type="number" min="1" className="block w-full mb-3 p-2 border rounded" required placeholder="No. of Vacancies" />
              <input name="link" value={editForm.link} onChange={handleEditChange} placeholder="External Job Link (LinkedIn, Naukri, etc.)" className="block w-full mb-3 p-2 border rounded" />
              <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded" required />
              <div className="flex gap-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition-colors duration-200" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
            </div>
          ))
        )}
      </div>
      {applyMsg && <div className="text-green-600 mt-4">{applyMsg}</div>}
    </div>
  );
}

export default Jobs;
