import { useCallback, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { getUsers } from "../../../services/userApi";
import dayjs from "dayjs";
import "./Users.css";
const Users = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    try {
      const fetchedUsers = await getUsers();
      console.log("Fetched users:", fetchedUsers);
      setUsers(fetchedUsers.results || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  }, []);
  const formatDate = (date) => {
    if (!date) return "-";
    return dayjs(date).format("DD/MM/YYYY hh:mm A");
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <Navbar />
      <div className="users-container">
        <div className="page-header">
          <h1>User Management</h1>
          <button className="btn btn-primary" onClick={() => {}}>
            Add New User
          </button>
        </div>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>User Full Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userName}</td>
                    <td>{user.userRole}</td>
                    <td>{user.firstName + " " + user.lastName}</td>
                    <td>{user.emailID}</td>
                    <td>{user.mobileNo}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      <button>Edit</button> <button>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
