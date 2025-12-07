import React, { useState } from 'react';
import { Users, Heart, PawPrint, Plus, X, User } from 'lucide-react';
import { UserKnowledgeProfile, FamilyMember, Pet } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const KnowledgeBoxPeople: React.FC<Props> = ({ profile, onChange }) => {
  const [newFamily, setNewFamily] = useState<FamilyMember>({ name: '', relationship: '' });
  const [newFriend, setNewFriend] = useState<FamilyMember>({ name: '', relationship: '' });
  const [newPet, setNewPet] = useState<Pet>({ name: '', type: '' });

  const relationships = ['Partner/in', 'Ehepartner/in', 'Kind', 'Elternteil', 'Geschwister', 'Großeltern', 'Enkel', 'Onkel/Tante', 'Cousin/e'];
  const petTypes = ['Hund', 'Katze', 'Vogel', 'Fisch', 'Hamster', 'Kaninchen', 'Meerschweinchen', 'Reptil', 'Sonstiges'];

  const addFamily = () => {
    if (newFamily.name && newFamily.relationship) {
      onChange({ family_members: [...(profile.family_members || []), newFamily] });
      setNewFamily({ name: '', relationship: '' });
    }
  };

  const addFriend = () => {
    if (newFriend.name) {
      onChange({ close_friends: [...(profile.close_friends || []), newFriend] });
      setNewFriend({ name: '', relationship: '' });
    }
  };

  const addPet = () => {
    if (newPet.name && newPet.type) {
      onChange({ pets: [...(profile.pets || []), newPet] });
      setNewPet({ name: '', type: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Wichtige Menschen & Haustiere</h3>
          <p className="text-sm text-gray-500">Mio merkt sich wichtige Geburtstage</p>
        </div>
      </div>

      {/* Familie */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Heart className="w-4 h-4 text-rose-500" /> Familie
        </label>
        <div className="space-y-2 mb-3">
          {(profile.family_members || []).map((m, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
              <User className="w-5 h-5 text-rose-500" />
              <div className="flex-1"><span className="font-medium">{m.name}</span><span className="text-gray-500 text-sm ml-2">({m.relationship})</span></div>
              {m.birthday && <span className="text-xs text-gray-500">{m.birthday}</span>}
              <button onClick={() => onChange({ family_members: (profile.family_members || []).filter((_, idx) => idx !== i) })}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input type="text" value={newFamily.name} onChange={(e) => setNewFamily({ ...newFamily, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Name" />
          <select value={newFamily.relationship} onChange={(e) => setNewFamily({ ...newFamily, relationship: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm">
            <option value="">Beziehung</option>
            {relationships.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={addFamily} className="px-3 py-2 bg-rose-500 text-white rounded-xl text-sm hover:bg-rose-600 flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Freunde */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Users className="w-4 h-4 text-blue-500" /> Enge Freunde
        </label>
        <div className="space-y-2 mb-3">
          {(profile.close_friends || []).map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <User className="w-5 h-5 text-blue-500" />
              <span className="flex-1 font-medium">{f.name}</span>
              <button onClick={() => onChange({ close_friends: (profile.close_friends || []).filter((_, idx) => idx !== i) })}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newFriend.name} onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Name des Freundes" />
          <button onClick={addFriend} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600"><Plus className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Haustiere */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <PawPrint className="w-4 h-4 text-amber-500" /> Haustiere
        </label>
        <div className="space-y-2 mb-3">
          {(profile.pets || []).map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
              <PawPrint className="w-5 h-5 text-amber-500" />
              <div className="flex-1"><span className="font-medium">{p.name}</span><span className="text-gray-500 text-sm ml-2">({p.type})</span></div>
              <button onClick={() => onChange({ pets: (profile.pets || []).filter((_, idx) => idx !== i) })}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input type="text" value={newPet.name} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm" placeholder="Name" />
          <select value={newPet.type} onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm">
            <option value="">Tierart</option>
            {petTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={addPet} className="px-3 py-2 bg-amber-500 text-white rounded-xl text-sm hover:bg-amber-600"><Plus className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBoxPeople;
