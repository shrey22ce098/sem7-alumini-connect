

import React, { useState, useEffect } from 'react';
import { getLoggedIn, getUserData } from "../services/authService";
import { fetchMeetings, fetchAlumniList, createMeetingRequest, approveMeeting, rejectMeeting } from '../services/api';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import NotLoggedIn from './helper/NotLoggedIn';
import { VideoCameraIcon, CalendarDaysIcon, LinkIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const Meeting = () => {
  const loggedIn = getLoggedIn();
  const user = getUserData();
  const [meetings, setMeetings] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, meeting: null });
  const [editForm, setEditForm] = useState({ title: '', description: '', meetingLink: '', date: '' });
  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Open edit modal and populate form
  const openEditModal = (meeting) => {
    setEditForm({
      title: meeting.title || '',
      description: meeting.description || '',
      meetingLink: meeting.meetingLink || '',
      date: meeting.date ? meeting.date.slice(0, 16) : '',
    });
    setEditModal({ open: true, meeting });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModal({ open: false, meeting: null });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/meeting/${editModal.meeting._id}`, editForm, { withCredentials: true });
      toast.success('Meeting updated!');
      const res = await fetchMeetings();
      setMeetings(res.data.meetings || res.data.data?.meetings || []);
      closeEditModal();
    } catch {
      toast.error('Failed to update meeting');
    }
    setLoading(false);
  };
  const [form, setForm] = useState({ title: '', description: '', meetingLink: '', date: '', alumni: '' });
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      fetchMeetings()
        .then(res => setMeetings(res.data.meetings || res.data.data?.meetings || []))
        .catch(() => toast.error('Failed to fetch meetings'));
      if (user && (user.role === 'professor' || user.role === 'collegeadmin')) {
        fetchAlumniList()
          .then(res => setAlumniList(res.data.data.alumni || []))
          .catch(() => toast.error('Failed to fetch alumni list'));
      }
    }
  }, [loggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMeetingRequest(form);
      toast.success('Meeting request sent!');
      setForm({ title: '', description: '', meetingLink: '', date: '', alumni: '' });
      // Refresh meetings
      const res = await fetchMeetings();
      setMeetings(res.data.meetings || res.data.data?.meetings || []);
    } catch (err) {
      toast.error('Failed to create meeting');
    }
    setLoading(false);
  };

  const canCreate = user && (user.role === 'professor' || user.role === 'collegeadmin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
      <ToastContainer />
      {loggedIn ? (
        <>
          <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">Meetings</h2>
          {canCreate && (
            <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><PencilSquareIcon className="h-6 w-6 text-indigo-400 mr-2" />Create Meeting Request</h3>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="date" value={form.date} onChange={handleChange} type="datetime-local" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="meetingLink" value={form.meetingLink} onChange={handleChange} placeholder="Meeting Link (e.g. Zoom/Meet)" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" />
              <select name="alumni" value={form.alumni} onChange={handleChange} className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required>
                <option value="">Select Alumni</option>
                {alumniList.map(a => (
                  <option key={a._id} value={a._id}>{a.fullName} ({a.email})</option>
                ))}
              </select>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200 w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Request'}</button>
            </form>
          )}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">No meetings found.</div>
            ) : (
              meetings.map(m => (
                <div key={m._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col animate-fade-in">
                  <div className="flex items-center mb-2">
                    <VideoCameraIcon className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="font-bold text-lg text-indigo-700">{m.title}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <CalendarDaysIcon className="h-4 w-4 text-indigo-300 mr-1" />
                    <span className="text-gray-600">{m.date}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <LinkIcon className="h-4 w-4 text-indigo-300 mr-1" />
                    <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline break-all">{m.meetingLink}</a>
                  </div>
                  <div className="text-gray-700 mb-2">{m.description}</div>
                  <div className="text-gray-500 text-xs mb-1">Status: <span className={m.status === 'approved' ? 'text-green-600' : m.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}>{m.status}</span></div>
                  {/* Alumni can approve/reject their own meeting requests */}
                  {user && user.role === 'alumni' && m.alumni && (m.alumni._id === user._id || m.alumni === user._id) && m.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={async () => {
                        setLoading(true);
                        try {
                          await approveMeeting(m._id);
                          toast.success('Meeting approved!');
                          const res = await fetchMeetings();
                          setMeetings(res.data.meetings || res.data.data?.meetings || []);
                        } catch {
                          toast.error('Failed to approve meeting');
                        }
                        setLoading(false);
                      }}>Approve</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={async () => {
                        setLoading(true);
                        try {
                          await rejectMeeting(m._id);
                          toast.success('Meeting rejected!');
                          const res = await fetchMeetings();
                          setMeetings(res.data.meetings || res.data.data?.meetings || []);
                        } catch {
                          toast.error('Failed to reject meeting');
                        }
                        setLoading(false);
                      }}>Reject</button>
                    </div>
                  )}
                  {/* Creator can edit/delete their own meeting */}
                  {user && m.createdBy && (m.createdBy._id === user._id || m.createdBy === user._id) && (
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={() => openEditModal(m)}>
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this meeting?')) return;
                        setLoading(true);
                        try {
                          await axios.delete(`http://localhost:5000/meeting/${m._id}`, { withCredentials: true });
                          toast.success('Meeting deleted!');
                          const res = await fetchMeetings();
                          setMeetings(res.data.meetings || res.data.data?.meetings || []);
                        } catch {
                          toast.error('Failed to delete meeting');
                        }
                        setLoading(false);
                      }}>Delete</button>
                    </div>
                  )}
      {/* Edit Meeting Modal */}
      {editModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Meeting</h3>
            <label className="block mb-2">Title
              <input type="text" name="title" value={editForm.title} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" required />
            </label>
            <label className="block mb-2">Date
              <input type="datetime-local" name="date" value={editForm.date} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" required />
            </label>
            <label className="block mb-2">Meeting Link
              <input type="text" name="meetingLink" value={editForm.meetingLink} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" required />
            </label>
            <label className="block mb-2">Description
              <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full border px-2 py-1 rounded" />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeEditModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <NotLoggedIn text="Meeting" />
      )}
    </div>
  );
};

export default Meeting;
