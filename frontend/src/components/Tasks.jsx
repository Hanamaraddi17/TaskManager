import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const priorityColors = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sorted, setSorted] = useState(false);
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: '/tasks',
      method: 'get',
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) =>
      setTasks(data.tasks)
    );
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: 'delete',
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const handleSort = () => {
    setSorted(!sorted);
  };

  const calculateDaysLeft = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    const timeDiff = dueDateObj - currentDate;
    const daysLeft = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysLeft;
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const displayedTasks = sorted
    ? [...filteredTasks].sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
    : filteredTasks;

  return (
    <div className="my-4 mx-auto max-w-3xl p-4">
      {tasks.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-3">Your Tasks ({tasks.length})</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              onClick={handleSort}
            >
              {sorted ? 'Reset Order' : 'Sort by Priority'}
            </button>
          </div>
        </>
      )}

      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <span className="text-lg text-gray-500">No tasks found</span>
          <Link
            to="/tasks/add"
            className="mt-3 bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-5 py-2"
          >
            + Add new task
          </Link>
        </div>
      ) : (
        displayedTasks.map((task, index) => (
          <div
            key={task._id}
            className="bg-white my-4 p-5 text-gray-700 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Task #{index + 1}</span>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-white text-xs font-semibold rounded-md ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
                <Tooltip text="Edit this task" position="top">
                  <Link
                    to={`/tasks/${task._id}`}
                    className="ml-4 text-green-600 hover:text-green-700 transition"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                </Tooltip>
                <Tooltip text="Delete this task" position="top">
                  <span
                    className="ml-4 text-red-500 hover:text-red-700 cursor-pointer transition"
                    onClick={() => handleDelete(task._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </Tooltip>
              </div>
            </div>

            <div className="mt-2 text-xl font-bold text-gray-800">{task.title}</div>
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>

            <div className="mt-3">
              <p className="text-sm">
                <span className="font-medium">Due Date:</span>{' '}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {task.status}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tags:</span>{' '}
                {task.tags.length > 0 ? task.tags.join(', ') : 'None'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Days Left:</span> {calculateDaysLeft(task.dueDate)} days
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
