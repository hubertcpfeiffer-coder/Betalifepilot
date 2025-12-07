import React, { useState } from 'react';
import { Heart, Music, Film, BookOpen, Dumbbell, Plus, X } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const TagInput: React.FC<{ tags: string[]; onChange: (tags: string[]) => void; placeholder: string; color: string }> = 
  ({ tags, onChange, placeholder, color }) => {
  const [input, setInput] = useState('');
  
  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      onChange([...tags, input.trim()]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className={`px-3 py-1 ${color} rounded-full text-sm flex items-center gap-1`}>
            {tag}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500"
          placeholder={placeholder} />
        <button onClick={addTag} className="px-3 py-2 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const KnowledgeBoxInterests: React.FC<Props> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Interessen & Hobbys</h3>
          <p className="text-sm text-gray-500">Was dich begeistert</p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Heart className="w-4 h-4 text-pink-500" /> Hobbys
        </label>
        <TagInput tags={profile.hobbies || []} onChange={(hobbies) => onChange({ hobbies })}
          placeholder="z.B. Fotografieren, Kochen..." color="bg-pink-100 text-pink-700" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Music className="w-4 h-4 text-purple-500" /> Lieblingsmusik
        </label>
        <TagInput tags={profile.favorite_music || []} onChange={(favorite_music) => onChange({ favorite_music })}
          placeholder="z.B. Rock, Jazz, Pop..." color="bg-purple-100 text-purple-700" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Film className="w-4 h-4 text-blue-500" /> Lieblingsfilme/-Serien
        </label>
        <TagInput tags={profile.favorite_movies || []} onChange={(favorite_movies) => onChange({ favorite_movies })}
          placeholder="z.B. Sci-Fi, Dokumentationen..." color="bg-blue-100 text-blue-700" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <BookOpen className="w-4 h-4 text-amber-500" /> Lieblingsbücher/-Genres
        </label>
        <TagInput tags={profile.favorite_books || []} onChange={(favorite_books) => onChange({ favorite_books })}
          placeholder="z.B. Thriller, Sachbücher..." color="bg-amber-100 text-amber-700" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Dumbbell className="w-4 h-4 text-green-500" /> Sport
        </label>
        <TagInput tags={profile.sports || []} onChange={(sports) => onChange({ sports })}
          placeholder="z.B. Joggen, Yoga, Fußball..." color="bg-green-100 text-green-700" />
      </div>
    </div>
  );
};

export default KnowledgeBoxInterests;
