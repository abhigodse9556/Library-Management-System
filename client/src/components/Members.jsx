import { useState, useEffect } from "react";
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/api";
import "./Members.css";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    outstanding_debt: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMembers();
      setMembers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        outstanding_debt: member.outstanding_debt || 0,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        outstanding_debt: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const memberData = {
        ...formData,
        outstanding_debt: parseFloat(formData.outstanding_debt) || 0,
      };

      if (editingMember) {
        await updateMember(editingMember.id, memberData);
      } else {
        await createMember(memberData);
      }
      handleCloseModal();
      fetchMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }
    try {
      await deleteMember(id);
      fetchMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="members-container">
      <div className="page-header">
        <h1>Members Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Add New Member
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading members...</div>
      ) : (
        <div className="members-table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Outstanding Debt (Rs.)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className={
                      parseFloat(member.outstanding_debt) >= 500
                        ? "debt-limit-exceeded"
                        : ""
                    }
                  >
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || "-"}</td>
                    <td
                      className={
                        parseFloat(member.outstanding_debt) >= 500
                          ? "debt-warning"
                          : ""
                      }
                    >
                      ₹{parseFloat(member.outstanding_debt).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => handleOpenModal(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDelete(member.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!!editingMember}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Outstanding Debt (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.outstanding_debt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      outstanding_debt: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingMember ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
