import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ROLE_LABELS } from '../auth/permissions';
import '../styles/Users.css';
import AddUserForm from '../components/Adduserform';
import Toast from '../components/Toast';

const getRoleClassName = (role) =>
  (role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterRole, setFilterRole] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const roles = ['Tous', ...ROLE_LABELS];

  const handleAddUser = (formData) => {
    const user = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
    };

    setUsers([...users, user]);
    setShowAddUser(false);
    setEditingUser(null);

    setToast({
      message: '✅ Utilisateur créé avec succès !',
      type: 'success',
    });
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      department: user.department,
    });
    setShowAddUser(true);
  };

  const handleUpdateUser = (formData) => {
    if (!editingUser) return;

    setUsers(
      users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
              role: formData.role,
              department: formData.department,
            }
          : u
      )
    );

    setShowAddUser(false);
    setEditingUser(null);

    setToast({
      message: '✅ Utilisateur modifié avec succès !',
      type: 'success',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter((u) => u.id !== id));
      setToast({
        message: '✅ Utilisateur supprimé avec succès !',
        type: 'warning',
      });
    }
  };

  const handleCloseForm = () => {
    setShowAddUser(false);
    setEditingUser(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingUser) {
      handleUpdateUser(formData);
    } else {
      handleAddUser(formData);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === 'Tous' || user.role === filterRole;
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const emptyTitle =
    users.length === 0
      ? 'Aucun utilisateur pour le moment'
      : 'Aucun utilisateur ne correspond aux filtres';
  const emptyHint =
    users.length === 0
      ? 'Cliquez sur "Ajouter un utilisateur" pour commencer'
      : 'Modifiez la recherche ou le filtre de rôle.';

  return (
    <div className="users-container">
      <div className="users-header">
        <h2 className="users-title">👥 Gérer les utilisateurs</h2>
        <button
          className="btn-add-user"
          onClick={() => {
            setEditingUser(null);
            setShowAddUser(true);
          }}
        >
          <Plus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      {showAddUser && (
        <AddUserForm
          isOpen={showAddUser}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          editingUser={editingUser}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="users-filters">
        <div className="filter-group">
          <label>Filtrer par rôle</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>{emptyTitle}</p>
            <p className="empty-state-hint">{emptyHint}</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOM</th>
                <th>EMAIL</th>
                <th>RÔLE</th>
                <th>DÉPARTEMENT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-id">{user.id}</td>
                  <td className="user-name">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-role">
                    <span className={`role-badge role-${getRoleClassName(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="user-department">{user.department}</td>
                  <td>
                    <div className="user-actions">
                      <button
                        className="btn-icon btn-edit"
                        title="Modifier"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn-icon btn-delete"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
