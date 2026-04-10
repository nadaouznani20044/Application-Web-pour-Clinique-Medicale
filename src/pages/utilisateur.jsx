import React, { useMemo, useState } from 'react';
import { Edit2, Eye, History, KeyRound, Lock, Plus, ShieldCheck, Trash2, Unlock } from 'lucide-react';
import { PERMISSIONS_BY_ROLE, ROLE_LABELS } from '../auth/permissions';
import '../styles/Users.css';
import AddUserForm from '../components/AddUserForm';
import Toast from '../components/Toast';

const PAGE_LABELS = {
  dashboard: 'Tableau de bord',
  users: 'Utilisateurs',
  services: 'Services',
  patients: 'Patients',
  calendar: 'Calendrier',
  planning: 'Planning',
  hospitalization: 'Hospitalisations',
  settings: 'Parametres',
  analytics: 'Analytics',
  chirurgie: 'Chirurgie',
  gynecologie: 'Gynecologie',
  laboratoire: 'Laboratoire',
  medecineinterne: 'Medecine interne',
  ophtalmologie: 'Ophtalmologie',
  pediatrie: 'Pediatrie',
  radiologie: 'Radiologie',
  urgence: 'Urgence',
};

const getRoleClassName = (role) =>
  (role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

const getPermissionLabels = (role) =>
  (PERMISSIONS_BY_ROLE[role] || []).map((permission) => PAGE_LABELS[permission] || permission);

const formatDateTime = (value) => {
  if (!value) return 'Aucune connexion';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const buildTemporaryPassword = (userId) =>
  `Temp-${String(userId).padStart(2, '0')}-${Math.random().toString(36).slice(-6)}`;

const createLoginEntry = (label, meta, occurredAt = new Date().toISOString()) => ({
  label,
  meta,
  occurredAt,
});

const createEmailEntry = (label, meta, occurredAt = new Date().toISOString()) => ({
  label,
  meta,
  occurredAt,
});

const STATUS_OPTIONS = ['Tous', 'Actifs', 'Inactifs'];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterRole, setFilterRole] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [historyUser, setHistoryUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const roles = ['Tous', ...ROLE_LABELS];

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;
  const staffUsers = users.filter((user) => ['Médecin', 'Médecin Chef', 'Infirmier'].includes(user.role)).length;
  const receptionUsers = users.filter((user) => user.role === 'Réceptionniste').length;

  const handleAddUser = (formData) => {
    const nextId = Math.max(...users.map((user) => user.id), 0) + 1;
    const createdAt = new Date().toISOString();
    const permissions = PERMISSIONS_BY_ROLE[formData.role] || [];

    const user = {
      id: nextId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      department: formData.department,
      permissions,
      isActive: true,
      mustResetPassword: false,
      lastLogin: null,
      loginHistory: [
        createLoginEntry('Creation du compte', 'Compte cree par l administrateur', createdAt),
      ],
      emailHistory: [
        createEmailEntry('Email de bienvenue', 'Email de bienvenue envoye', createdAt),
      ],
    };

    setUsers((current) => [...current, user]);
    setShowAddUser(false);
    setEditingUser(null);
    setToast({
      message: 'Utilisateur cree avec succes. Email de bienvenue envoye.',
      type: 'success',
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUser(true);
  };

  const handleUpdateUser = (formData) => {
    if (!editingUser) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              firstName: formData.firstName.trim(),
              lastName: formData.lastName.trim(),
              email: formData.email.trim(),
              password: formData.password,
              role: formData.role,
              department: formData.department,
              permissions: PERMISSIONS_BY_ROLE[formData.role] || [],
            }
          : user
      )
    );

    setShowAddUser(false);
    setEditingUser(null);
    setToast({
      message: 'Utilisateur modifie avec succes',
      type: 'success',
    });
  };

  const handleRequestDelete = (user) => {
    setResetTarget(null);
    setResetSuccess(null);
    setDeleteTarget(user);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    setUsers((current) => current.filter((user) => user.id !== deleteTarget.id));
    setDeleteTarget(null);
    setToast({
      message: 'Utilisateur supprime avec succes',
      type: 'warning',
    });
  };

  const handleToggleStatus = (user) => {
    const nextStatus = !user.isActive;
    const historyEntry = createLoginEntry(
      nextStatus ? 'Compte active' : 'Compte desactive',
      nextStatus ? 'Acces restaure' : 'Acces suspendu'
    );

    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              isActive: nextStatus,
              loginHistory: [historyEntry, ...item.loginHistory],
            }
          : item
      )
    );

    setToast({
      message: nextStatus ? 'Compte active avec succes' : 'Compte desactive avec succes',
      type: nextStatus ? 'success' : 'warning',
    });
  };

  const handleRequestReset = (user) => {
    setDeleteTarget(null);
    setResetSuccess(null);
    setResetTarget(user);
  };

  const handleConfirmReset = () => {
    if (!resetTarget) return;

    const temporaryPassword = buildTemporaryPassword(resetTarget.id);
    const now = new Date().toISOString();
    const loginHistoryEntry = createLoginEntry(
      'Mot de passe reinitialise',
      'Un mot de passe temporaire a ete genere',
      now
    );
    const emailHistoryEntry = createEmailEntry(
      'Mot de passe temporaire envoye',
      `Envoye a ${resetTarget.email}`,
      now
    );

    setUsers((current) =>
      current.map((item) =>
        item.id === resetTarget.id
          ? {
              ...item,
              password: temporaryPassword,
              mustResetPassword: true,
              loginHistory: [loginHistoryEntry, ...item.loginHistory],
              emailHistory: [emailHistoryEntry, ...(item.emailHistory || [])],
            }
          : item
      )
    );

    setResetTarget(null);
    setResetSuccess({
      user: resetTarget,
      temporaryPassword,
      email: resetTarget.email,
    });
    setToast({
      message: 'Mot de passe temporaire genere et envoye par email',
      type: 'success',
    });
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

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesRole = filterRole === 'Tous' || user.role === filterRole;
        const matchesStatus =
          filterStatus === 'Tous' ||
          (filterStatus === 'Actifs' && user.isActive) ||
          (filterStatus === 'Inactifs' && !user.isActive);
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query);
        return matchesRole && matchesStatus && matchesSearch;
      }),
    [filterRole, filterStatus, searchTerm, users]
  );

  const emptyTitle =
    users.length === 0
      ? 'Aucun utilisateur pour le moment'
      : 'Aucun utilisateur ne correspond aux filtres';
  const emptyHint =
    users.length === 0
      ? 'Cliquez sur "Ajouter un utilisateur" pour commencer'
      : 'Modifiez la recherche ou les filtres de role et de statut.';

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h2 className="users-title">Gestion des utilisateurs</h2>
          <p className="users-subtitle">
            Administration des comptes, des permissions et du suivi des connexions.
          </p>
        </div>
        <button
          className="btn-add-user"
          onClick={() => {
            setEditingUser(null);
            setShowAddUser(true);
          }}
        >
          <Plus size={18} />
          Ajouter Utilisateur
        </button>
      </div>

      <div className="admin-kpis">
        <KpiCard title="Comptes actifs" value={activeUsers} hint={`${totalUsers} comptes au total`} />
        <KpiCard title="Comptes inactifs" value={inactiveUsers} hint="Utilisateurs desactives" />
        <KpiCard title="Personnel soignant" value={staffUsers} hint="Medecins et infirmiers" />
        <KpiCard title="Reception" value={receptionUsers} hint="Receptionnistes actifs ou inactifs" />
        <KpiCard
          title="Gestion admin"
          value={users.filter((user) => user.mustResetPassword).length}
          hint="Mots de passe temporaires en attente"
        />
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
          <label>Filtrer par role</label>
          <select
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
            className="filter-select"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filtrer par statut</label>
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="filter-select"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <label>Recherche</label>
          <input
            type="text"
            placeholder="Nom, email ou departement"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
                <th>Nom</th>
                <th>Email</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Statut</th>
                <th>Derniere connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const permissionLabels = getPermissionLabels(user.role);
                return (
                  <tr key={user.id}>
                    <td className="user-id">{user.id}</td>
                    <td className="user-name">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-role">
                      <span className={`role-badge role-${getRoleClassName(user.role)}`}>{user.role}</span>
                    </td>
                    <td>
                      <div className="permission-summary">
                        <ShieldCheck size={15} />
                        <span>{permissionLabels.length} acces</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-stack">
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        {user.mustResetPassword && (
                          <span className="status-badge reset">Reset requis</span>
                        )}
                      </div>
                    </td>
                    <td className="user-last-login">{formatDateTime(user.lastLogin)}</td>
                    <td>
                      <div className="user-actions">
                        <button
                          className="btn-icon btn-edit"
                          title="Modifier"
                          aria-label="Modifier"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 size={18} strokeWidth={2.5} color="#0f766e" />
                        </button>
                        <button
                          className={`btn-icon ${user.isActive ? 'btn-toggle-off' : 'btn-toggle-on'}`}
                          title={user.isActive ? 'Desactiver le compte' : 'Activer le compte'}
                          aria-label={user.isActive ? 'Desactiver le compte' : 'Activer le compte'}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.isActive ? (
                            <Unlock size={18} strokeWidth={2.5} color="#15803d" />
                          ) : (
                            <Lock size={18} strokeWidth={2.5} color="#b91c1c" />
                          )}
                        </button>
                        <button
                          className="btn-icon btn-reset"
                          title="Reinitialiser le mot de passe"
                          aria-label="Reinitialiser le mot de passe"
                          onClick={() => handleRequestReset(user)}
                        >
                          <KeyRound size={18} strokeWidth={2.5} color="#92400e" />
                        </button>
                        <button
                          className="btn-icon btn-history"
                          title="Historique des connexions"
                          aria-label="Historique des connexions"
                          onClick={() => setHistoryUser(user)}
                        >
                          <History size={18} strokeWidth={2.5} color="#6d28d9" />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(user)}
                          className="btn-icon btn-delete"
                          title="Supprimer"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={18} strokeWidth={2.5} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div className="dialog-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="dialog-modal dialog-danger" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h3 className="dialog-title">Supprimer l'utilisateur</h3>
                <p className="dialog-subtitle">
                  {deleteTarget.firstName} {deleteTarget.lastName} ({deleteTarget.email})
                </p>
              </div>
              <button type="button" className="dialog-close" onClick={() => setDeleteTarget(null)}>
                Fermer
              </button>
            </div>
            <div className="dialog-body">
              Cette action est definitive. L'utilisateur sera retire de la liste et ne pourra plus
              se connecter.
            </div>
            <div className="dialog-actions">
              <button type="button" className="dialog-btn secondary" onClick={() => setDeleteTarget(null)}>
                Annuler
              </button>
              <button type="button" className="dialog-btn danger" onClick={handleConfirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="dialog-overlay" onClick={() => setResetTarget(null)}>
          <div className="dialog-modal" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h3 className="dialog-title">Reinitialiser le mot de passe</h3>
                <p className="dialog-subtitle">
                  Un nouveau mot de passe temporaire sera genere et envoye a {resetTarget.email}.
                </p>
              </div>
              <button type="button" className="dialog-close" onClick={() => setResetTarget(null)}>
                Fermer
              </button>
            </div>
            <div className="dialog-body">
              <div className="dialog-note">
                Confirmez pour generer un mot de passe temporaire et notifier l'utilisateur par
                email.
              </div>
            </div>
            <div className="dialog-actions">
              <button type="button" className="dialog-btn secondary" onClick={() => setResetTarget(null)}>
                Annuler
              </button>
              <button type="button" className="dialog-btn primary" onClick={handleConfirmReset}>
                Envoyer Nouveau Mot de Passe
              </button>
            </div>
          </div>
        </div>
      )}

      {resetSuccess && (
        <div className="dialog-overlay" onClick={() => setResetSuccess(null)}>
          <div className="dialog-modal dialog-success" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <div>
                <h3 className="dialog-title">Reinitialisation reussie</h3>
                <p className="dialog-subtitle">
                  Le mot de passe temporaire a ete genere et envoye a {resetSuccess.email}.
                </p>
              </div>
              <button type="button" className="dialog-close" onClick={() => setResetSuccess(null)}>
                Fermer
              </button>
            </div>
            <div className="dialog-body">
              <div className="dialog-success-row">
                <ShieldCheck size={18} />
                <span>Succes</span>
              </div>
              <div className="dialog-note">Mot de passe temporaire :</div>
              <div className="dialog-password">{resetSuccess.temporaryPassword}</div>
            </div>
            <div className="dialog-actions">
              <button type="button" className="dialog-btn primary" onClick={() => setResetSuccess(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {historyUser && (
        <div className="history-overlay" onClick={() => setHistoryUser(null)}>
          <div className="history-modal" onClick={(event) => event.stopPropagation()}>
            <div className="history-header">
              <div>
                <h3>Historique du compte</h3>
                <p>
                  {historyUser.firstName} {historyUser.lastName}
                </p>
              </div>
              <button className="history-close" onClick={() => setHistoryUser(null)}>
                Fermer
              </button>
            </div>
            <div className="history-body">
              <div className="history-section">
                <div className="history-section-title">Connexions</div>
                {historyUser.loginHistory.length === 0 ? (
                  <div className="history-empty">Aucune connexion enregistree pour ce compte.</div>
                ) : (
                  historyUser.loginHistory.map((entry, index) => (
                    <div key={`${entry.occurredAt}-${index}`} className="history-item">
                      <div className="history-item-title">{entry.label}</div>
                      <div className="history-item-meta">{entry.meta}</div>
                      <div className="history-item-time">{formatDateTime(entry.occurredAt)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="history-section">
                <div className="history-section-title">Emails envoyes</div>
                {(historyUser.emailHistory || []).length === 0 ? (
                  <div className="history-empty">Aucun email enregistre pour ce compte.</div>
                ) : (
                  (historyUser.emailHistory || []).map((entry, index) => (
                    <div key={`${entry.occurredAt}-email-${index}`} className="history-item">
                      <div className="history-item-title">{entry.label}</div>
                      <div className="history-item-meta">{entry.meta}</div>
                      <div className="history-item-time">{formatDateTime(entry.occurredAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KpiCard = ({ title, value, hint }) => (
  <div className="kpi-card">
    <div className="kpi-title">{title}</div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-hint">{hint}</div>
  </div>
);

export default Users;
