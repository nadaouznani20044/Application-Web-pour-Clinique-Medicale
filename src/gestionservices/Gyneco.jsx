import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import EditServiceModal from '../components/EditServiceModal';
import AddPersonnelModal from '../components/AddPersonnelModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ChangeChiefModal from '../components/ChangeChiefModal';
import '../styles/Gyneco.css';
import '../styles/EditServiceModal.css';
import '../styles/AddPersonnelModal.css';
import '../styles/DeleteConfirmModal.css';
import '../styles/ChangeChiefModal.css';

const ServiceDetail = ({ service, onBack }) => {
  const [activeTab, setActiveTab] = useState('informations');
  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. ' + service.chef, role: 'Chef de Service', department: 'Médecin' },
  ]);
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', floor: '1', capacity: 2, occupied: 1, Statut: 'Occupée' },
    { id: 2, number: '102', floor: '1', capacity: 2, occupied: 0, Statut: 'Disponible' },
    { id: 3, number: '201', floor: '2', capacity: 1, occupied: 1, Statut: 'Occupée' },
  ]);

  const [showEditService, setShowEditService] = useState(false);
  const [showAddPersonnel, setShowAddPersonnel] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangeChief, setShowChangeChief] = useState(false);

  const handleEditService = (data) => {
    console.log('Service mis a jour:', data);
    setShowEditService(false);
  };

  const handleAddPersonnel = (data) => {
    console.log('Personnel ajoute:', data);
    setStaff([...staff, { id: staff.length + 1, ...data }]);
    setShowAddPersonnel(false);
  };

  const handleDeleteService = () => {
    console.log('Service supprime');
    onBack();
  };

  const handleChangeChief = (data) => {
    console.log('Chef change:', data);
    setShowChangeChief(false);
  };

  const handleDeletePersonnel = (personId) => {
    setStaff(staff.filter(p => p.id !== personId));
  };

  if (!service) {
    return (
      <div className="gyneco-detail">
        <p>Service non trouvé</p>
      </div>
    );
  }

  const totalOccupancy = rooms.reduce((sum, room) => sum + room.occupied, 0);
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  return (
    <div className="gyneco-detail">
      
      <div className="gyneco-header">
        <button onClick={onBack} className="btn-back">
          <ArrowLeft size={20} />
          Retour
        </button>
        <h1 className="gyneco-title">{service.name}</h1>
        <div className="gyneco-actions">
          <button 
            onClick={() => setShowEditService(true)}
            className="btn-action btn-edit" 
            title="Modifier"
          >
            <Edit2 size={18} />
            Modifier le Service
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-action btn-delete" 
            title="Supprimer"
          >
            <Trash2 size={18} />
            Supprimer le Service
          </button>
        </div>
      </div>

      
      <div className="service-kpis">
        <div className="kpi-item">
          <span className="kpi-label">Personnel</span>
          <span className="kpi-value">{staff.length}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Chambres</span>
          <span className="kpi-value">{rooms.length}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Taux d'occupation</span>
          <span className="kpi-value">{occupancyRate}%</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Localisation</span>
          <span className="kpi-value">{service.location}</span>
        </div>
      </div>

      
      <div className="service-tabs">
        <button 
          className={`tab-button ${activeTab === 'informations' ? 'active' : ''}`}
          onClick={() => setActiveTab('informations')}
        >
          Informations
        </button>
        <button 
          className={`tab-button ${activeTab === 'personnel' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnel')}
        >
          Personnel Rattache
        </button>
        <button 
          className={`tab-button ${activeTab === 'chambres' ? 'active' : ''}`}
          onClick={() => setActiveTab('chambres')}
        >
          Chambres
        </button>
      </div>

      
      <div className="service-tabs-content">
        
        
        {activeTab === 'informations' && (
          <div className="tab-pane active">
            <div className="info-section">
              <h2>Informations Generales</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nom du Service</span>
                  <span className="info-value">{service.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Description</span>
                  <span className="info-value">{service.description}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Localisation</span>
                  <span className="info-value">{service.location}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Telephone</span>
                  <span className="info-value">{service.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Statut</span>
                  <span className="info-value Statut-badge">{service.Statut}</span>
                </div>
              </div>
            </div>

            
            <div className="chief-section">
              <h2>Medecin Chef</h2>
              <div className="chief-card">
                <div className="chief-avatar">
                  {service.chef.charAt(0)}
                </div>
                <div className="chief-info">
                  <h3>{service.chef}</h3>
                  <p>Chef de Service</p>
                </div>
                <button 
                  onClick={() => setShowChangeChief(true)}
                  className="btn-edit-chief"
                >
                  <Edit2 size={16} />
                  Modifier le Chef
                </button>
              </div>
            </div>

            
            <div className="schedule-section">
              <h2>Horaires d'Ouverture</h2>
              <div className="schedule-grid">
                <div className="schedule-item">
                  <span className="day">Lundi - Vendredi</span>
                  <span className="time">8h - 18h</span>
                </div>
                <div className="schedule-item">
                  <span className="day">Samedi</span>
                  <span className="time">9h - 13h</span>
                </div>
                <div className="schedule-item">
                  <span className="day">Dimanche</span>
                  <span className="time">Ferme</span>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'personnel' && (
          <div className="tab-pane active">
            <div className="personnel-header">
              <h2>Personnel Rattaché</h2>
              <button 
                onClick={() => setShowAddPersonnel(true)}
                className="btn-add-staff"
              >
                + Ajouter du Personnel
              </button>
            </div>

            <div className="personnel-table-wrapper">
              {staff.length === 0 ? (
                <div className="empty-state">
                  <p>Aucun personnel pour le moment</p>
                </div>
              ) : (
                <table className="personnel-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Role</th>
                      <th>Departement</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((person) => (
                      <tr key={person.id}>
                        <td className="personnel-name">{person.name}</td>
                        <td className="personnel-role">{person.role}</td>
                        <td className="personnel-dept">{person.department}</td>
                        <td className="personnel-actions">
                          <button className="btn-icon btn-edit" title="Modifier">
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeletePersonnel(person.id)}
                            className="btn-icon btn-delete" 
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        
        {activeTab === 'chambres' && (
          <div className="tab-pane active">
            <div className="rooms-header">
              <h2>Gestion des Chambres</h2>
              <div className="rooms-stats">
                <div className="stat">
                  <span className="label">Total</span>
                  <span className="value">{totalCapacity}</span>
                </div>
                <div className="stat">
                  <span className="label">Occupees</span>
                  <span className="value">{totalOccupancy}</span>
                </div>
                <div className="stat">
                  <span className="label">Disponibles</span>
                  <span className="value">{totalCapacity - totalOccupancy}</span>
                </div>
              </div>
            </div>

            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className={`room-card Statut-${room.Statut.toLowerCase()}`}>
                  <div className="room-number">{room.number}</div>
                  <div className="room-floor">Etage {room.floor}</div>
                  <div className="room-capacity">
                    <span>{room.occupied}</span> / {room.capacity}
                  </div>
                  <div className={`room-Statut Statut-${room.Statut.toLowerCase()}`}>
                    {room.Statut}
                  </div>
                  <button className="btn-manage-room">
                    <Edit2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      
      <EditServiceModal
        isOpen={showEditService}
        service={service}
        onClose={() => setShowEditService(false)}
        onSubmit={handleEditService}
      />

      <AddPersonnelModal
        isOpen={showAddPersonnel}
        onClose={() => setShowAddPersonnel(false)}
        onSubmit={handleAddPersonnel}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        itemName={service?.name}
        itemType="Service"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteService}
      />

      <ChangeChiefModal
        isOpen={showChangeChief}
        currentChief={service?.chef}
        onClose={() => setShowChangeChief(false)}
        onSubmit={handleChangeChief}
      />
    </div>
  );
};

export default ServiceDetail;


