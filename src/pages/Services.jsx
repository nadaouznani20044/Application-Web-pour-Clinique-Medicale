import React, { useState } from 'react';
import { Plus, Eye, Trash2 } from 'lucide-react';
import '../styles/services.css';

const Services = ({ onViewService }) => {
  const [services, setServices] = useState([
    { id: 1, name: 'Pédiatrie', chef: '', status: 'Actif', description: 'Suivi de croissance, vaccinations.' },
    { id: 2, name: 'Gynécologie', chef: '', status: 'Actif', description: 'Suivi gynécologique.' },
    { id: 3, name: 'Ophtalmologie', chef: '', status: 'Actif', description: 'Bilan et suivi ophtalmologique.' },
    { id: 4, name: 'Radiologie', chef: '', status: 'Actif', description: 'Imagerie médicale et diagnostics.' },
    { id: 5, name: 'Laboratoire / Analyses', chef: '', status: 'Actif', description: 'Analyses biologiques.' },
    { id: 6, name: 'Chirurgie', chef: '', status: 'Actif', description: 'Chirurgie générale et spécialisée.' },
    { id: 7, name: 'Urgence', chef: '', status: 'Actif', description: 'Urgences et traumatologie.' },
    { id: 8, name: 'Médecine interne', chef: '', status: 'Actif', description: 'Prise en charge globale.' },
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
        <h2 className="services-title">Gérer les services</h2>
       
      </div>

      <div className="services-table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Description</th>
              <th>Chef de service</th>
              <th>Statut</th>
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
                      className="btn-icon btn-view" 
                      title="Voir le service"
                      onClick={() => handleViewService(service.name)}
                    >
                      <Eye size={16} />
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
