import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, Eye, Filter, Lock, Plus, Search, Trash2, Unlock } from 'lucide-react';
import AddServiceForm from '../components/AddServiceForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EditServiceForm from '../components/EditServiceForm';
import '../styles/Services.css';

const STORAGE_KEY = 'medical-app-services';

const DEFAULT_SERVICES = [
  { serviceName: 'Pediatrie' },
  { serviceName: 'Gynecologie' },
  { serviceName: 'Ophtalmologie' },
  { serviceName: 'Radiologie' },
  { serviceName: 'Laboratoire / Analyses' },
  { serviceName: 'Chirurgie' },
  { serviceName: 'Urgence' },
  { serviceName: 'Medecine interne' },
];

const createId = (prefix = 'service') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createDefaultServices = () =>
  DEFAULT_SERVICES.map((service, index) => ({
    id: `${service.serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    serviceName: service.serviceName,
    description: '',
    location: '',
    phone: '',
    status: 'Active',
  }));

const loadInitialServices = () => {
  if (typeof window === 'undefined') {
    return createDefaultServices();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultServices();
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return createDefaultServices();
    }

    return parsed.map((service, index) => ({
      id:
        service.id ||
        `${String(service.serviceName || 'service')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}-${index}`,
      serviceName: service.serviceName || `Service ${index + 1}`,
      description: service.description || '',
      location: service.location || '',
      phone: service.phone || '',
      status: service.status === 'Inactive' ? 'Inactive' : 'Active',
    }));
  } catch (error) {
    return createDefaultServices();
  }
};

const Services = ({ onViewService }) => {
  const [services, setServices] = useState(loadInitialServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    const container = document.querySelector('.content-area');
    if (container) {
      container.scrollTop = 0;
      container.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    }
  }, [services]);

  const filteredServices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !search ||
        service.serviceName.toLowerCase().includes(search) ||
        (service.location || '').toLowerCase().includes(search);
      const matchesStatus =
        filterStatus === 'all' || service.status.toLowerCase() === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, filterStatus]);

  const totalCount = services.length;
  const activeCount = services.filter((service) => service.status === 'Active').length;
  const inactiveCount = services.length - activeCount;

  const handleAddService = (formData) => {
    const newService = {
      id: createId(),
      serviceName: formData.serviceName.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      phone: formData.phone.trim(),
      status: 'Active',
    };

    setServices((current) => [newService, ...current]);
    setShowAddForm(false);
  };

  const handleUpdateService = (formData) => {
    if (!editingService) {
      return;
    }

    setServices((current) =>
      current.map((service) =>
        service.id === editingService.id
          ? {
              ...service,
              serviceName: formData.serviceName.trim(),
              description: formData.description.trim(),
              location: formData.location.trim(),
              phone: formData.phone.trim(),
            }
          : service
      )
    );
    setEditingService(null);
  };

  const handleToggleStatus = (serviceId) => {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: service.status === 'Active' ? 'Inactive' : 'Active',
            }
          : service
      )
    );
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) {
      return;
    }

    setServices((current) => current.filter((service) => service.id !== serviceToDelete.id));
    setServiceToDelete(null);
  };

  const handleView = (service) => {
    if (typeof onViewService === 'function') {
      onViewService(service.serviceName);
    }
  };

  const renderField = (value) => value || '-';

  return (
    <div className="services-page--simple">
      <section className="services-header-panel">
        <div>
          <span className="services-kicker">Services</span>
          <h1 className="services-title">Gestion des services</h1>
          <p className="services-subtitle">
            La liste des services est affichee ici. Tu peux ajouter, modifier, activer ou
            supprimer chaque service depuis cette page.
          </p>
        </div>

        <button type="button" className="services-add-button" onClick={() => setShowAddForm(true)}>
          <Plus size={18} />
          Ajouter Service
        </button>
      </section>

      <section className="services-mini-stats">
        <article className="services-mini-stat">
          <span>Total Services</span>
          <strong>{totalCount}</strong>
        </article>
        <article className="services-mini-stat">
          <span>Actifs</span>
          <strong>{activeCount}</strong>
        </article>
        <article className="services-mini-stat">
          <span>Inactifs</span>
          <strong>{inactiveCount}</strong>
        </article>
      </section>

      <section className="services-toolbar">
        <label className="services-filter">
          <span>
            <Search size={14} />
            Recherche
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nom du service ou localisation"
          />
        </label>

        <label className="services-filter">
          <span>
            <Filter size={14} />
            Statut
          </span>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </label>
      </section>

      <section className="services-table-shell">
        {filteredServices.length === 0 ? (
          <div className="services-empty">
            <div className="services-empty-icon">
              <Search size={20} />
            </div>
            <h3>Aucun service trouve</h3>
            <p>Essaie un autre mot-cle ou retire le filtre actif pour afficher les services.</p>
          </div>
        ) : (
          <div className="services-table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Description</th>
                  <th>Localisation</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name">{service.serviceName}</div>
                    </td>
                    <td>
                      <div className="service-description">{renderField(service.description)}</div>
                    </td>
                    <td>
                      <div className="service-location">{renderField(service.location)}</div>
                    </td>
                    <td>
                      <span
                        className={`service-status ${
                          service.status === 'Active' ? 'active' : 'inactive'
                        }`}
                      >
                        {service.status === 'Active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="service-actions">
                        <button
                          type="button"
                          className="btn-icon btn-view"
                          onClick={() => handleView(service)}
                          title="Voir"
                          aria-label="Voir"
                        >
                          <Eye size={18} strokeWidth={2.5} color="#0f766e" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-edit"
                          onClick={() => setEditingService(service)}
                          title="Modifier"
                          aria-label="Modifier"
                        >
                          <Edit2 size={18} strokeWidth={2.5} color="#0f766e" />
                        </button>
                        <button
                          type="button"
                          className={`btn-icon ${
                            service.status === 'Active' ? 'btn-toggle-on' : 'btn-toggle-off'
                          }`}
                          onClick={() => handleToggleStatus(service.id)}
                          title={service.status === 'Active' ? 'Desactiver' : 'Activer'}
                          aria-label={service.status === 'Active' ? 'Desactiver' : 'Activer'}
                        >
                          {service.status === 'Active' ? (
                            <Unlock size={18} strokeWidth={2.5} color="#15803d" />
                          ) : (
                            <Lock size={18} strokeWidth={2.5} color="#b91c1c" />
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-delete"
                          onClick={() => setServiceToDelete(service)}
                          title="Supprimer"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={18} strokeWidth={2.5} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showAddForm && (
        <AddServiceForm onSubmit={handleAddService} onClose={() => setShowAddForm(false)} />
      )}

      {editingService && (
        <EditServiceForm
          service={editingService}
          onSubmit={handleUpdateService}
          onClose={() => setEditingService(null)}
        />
      )}

      <DeleteConfirmModal
        isOpen={Boolean(serviceToDelete)}
        itemName={serviceToDelete?.serviceName || ''}
        itemType="Service"
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
      />
    </div>
  );
};

export default Services;
