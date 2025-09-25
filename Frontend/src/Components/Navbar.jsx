

import { Disclosure } from '@headlessui/react';
import { BellIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Use Redux state directly
  const user = useSelector((state) => state.currentUser);
  const loggedIn = useSelector((state) => state.loggedIn);
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    } catch (e) {}
    dispatch(logout());
    window.location.href = '/login';
  };
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    {/* Your company logo */}
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {/* Navigation links by role */}
                      {!loggedIn && (
                        <>
                          <Link to="/" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Home</Link>
                          <Link to="/login" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Login</Link>
                          <Link to="/register" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Sign up</Link>
                          <Link to="/about" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                        </>
                      )}
                      {loggedIn && (
                        <>
                          <Link to="/dashboard" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Dashboard</Link>
                          <Link to="/event" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Events</Link>
                          <Link to="/meeting" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Meetings</Link>
                          {/* Bulk Upload only for collegeadmin and admin */}
                          {(user?.role === 'collegeadmin' || user?.role === 'admin') && (
                            <Link to="/bulkupload" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">Bulk Upload</Link>
                          )}
                          {/* User Approval only for admin */}
                          {user?.role === 'admin' && (
                            <Link to="/user-approval" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">User Approval</Link>
                          )}
                          <Link to="/about" className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                        </>
                      )}
                      {/* User Management link for admin and college admin */}
                      {loggedIn && (user?.role === 'admin' || user?.role === 'collegeadmin') && (
                        <Link
                          to="/user-management"
                          className="text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                        >
                          User Management
                        </Link>
                      )}
                      {/* Student Management link for admin, collegeadmin, professor */}
                      {loggedIn && (user?.role === 'admin' || user?.role === 'collegeadmin' || user?.role === 'professor') && (
                        <Link
                          to="/student-management"
                          className="text-gray-300 hover:bg-green-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
                        >
                          Student Management
                        </Link>
                      )}
                      {/* University Dropdown */}
                      <div className="relative group">
                        <button className="flex items-center text-gray-300 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200">
                          <span role="img" aria-label="university" className="mr-1">🏛️</span> University
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <div className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                          <button onClick={() => navigate('/news-notices')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">News & Notices</button>
                          <button onClick={() => navigate('/feedback')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Feedback</button>
                          <button onClick={() => navigate('/another-option')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Ak Aur Option here</button>
                        </div>
                      </div>
                      {loggedIn && (
                        <>
                          <span className="flex items-center ml-4 text-white">
                            <UserCircleIcon className="h-6 w-6 mr-1 text-indigo-300" />
                            {/* Prefer profile name, fallback to user email */}
                            {(user?.firstName || user?.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : (user?.adminName || user?.email)}
                          </span>
                          <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium ml-2 transition-colors duration-200 hover:bg-red-700">Logout</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Notification button */}
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default Navbar;
