import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import '../styles/services.css';

const Services = ({ onViewService }) => {
  const [services, setServices] = useState([
    { id: 1, name: 'Pédiatrie', chef: '', status: 'Active', description: 'Suivi croissance, vaccins...' },
    { id: 2, name: 'Gynécologie', chef: '', status: 'Active', description: 'Suivi gynécologie' },
    { id: 3, name: 'Ophtalmologie', chef: '', status: 'Active', description: 'Ophtalmologie +ronsultat...' },
    { id: 4, name: 'Radiologie', chef: '', status: 'Active', description: 'Suivi croissance, vaccin...' },
    { id: 5, name: 'Laboratoire / Analyses', chef: '', status: 'Active', description: 'Laboratoire - rabolatoire...' },
    { id: 6, name: 'Chirurgie', chef: '', status: 'Active', description: 'Chirurgie -mbohara...' },
    { id: 7, name: 'Urgence', chef: '', status: 'Active', description: 'Dabussements, realiité en Chirurgie' },
    { id: 8, name: 'Médecine Interne', chef: '', status: 'Active', description: 'Suivi croissance, vaccins...' },
  ]);

  const handleDelete = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleViewService = (serviceName) => {
    if (onViewService) {
      onViewService(serviceName);
    }
  };

  return (
    <div className="services-container">
      <div className="services-header">
        <h2 className="services-title">Gérer les Services</h2>
        <button className="btn-add-service">
          <Plus size={18} />
          Ajouter un Service
        </button>
      </div>

      <div className="services-table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Service Icon</th>
              <th>Description</th>
              <th>Chef de Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td className="service-name">{service.name}</td>
                <td className="service-description">{service.description}</td>
                <td className="service-chef">{service.chef}</td>
                <td>
                  <span className="status-badge">{service.status}</span>
                </td>
                <td>
                  <div className="service-actions">
                    <button 
                      className="btn-icon btn-edit" 
                      title="Edit"
                      onClick={() => handleViewService(service.name)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="btn-icon btn-delete"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;