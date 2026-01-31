
import React, { useState, useRef } from 'react';
import { BristolType, PoopRecord } from '../types';
import { BRISTOL_SCALE } from '../constants';
import { Camera, X, Save, ArrowLeft, Check } from 'lucide-react';

interface PoopFormProps {
  onSave: (record: Omit<PoopRecord, 'id' | 'timestamp'>) => void;
  onClose: () => void;
  t: any;
}

const PoopForm: React.FC<PoopFormProps> = ({ onSave, onClose, t }) => {
  const [bristolType, setBristolType] = useState<BristolType>(4);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-vintage-paper/90 dark:bg-[#1a1915]/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-md w-full polaroid-frame !p-8 !pb-12 space-y-10 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-center">
           <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><ArrowLeft size={20}/></button>
           <h2 className="text-xl font-black tracking-tighter lowercase">{t.capture}.</h2>
           <div className="w-10"></div>
        </div>

        <div className="space-y-8">
          {/* Photo Slot */}
          <div className="flex justify-center">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             {photo ? (
               <div className="relative w-48 h-48 border-4 border-white shadow-lg rotate-1 group">
                 <img src={photo} className="w-full h-full object-cover" alt="Captured Poop" />
                 <button onClick={() => setPhoto(undefined)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
               </div>
             ) : (
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 border-2 border-dashed border-vintage-border flex flex-col items-center justify-center text-gray-300 hover:text-vintage-ink hover:border-vintage-ink transition-all group"
               >
                 <Camera size={40} className="group-hover:scale-110 transition-transform duration-300" />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em] mt-4">{t.loadFilm}</span>
               </button>
             )}
          </div>

          {/* Type Picker */}
          <div className="space-y-4">
             <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t.consistency}</span>
                <span className="typewriter text-[10px] font-bold text-vintage-ink dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">0{bristolType}</span>
             </div>
             <div className="flex justify-between gap-1 overflow-x-auto pb-2 hide-scrollbar">
                {(Object.keys(BRISTOL_SCALE) as unknown as BristolType[]).map((type) => (
                   <button
                    key={type}
                    onClick={() => setBristolType(type)}
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-sm text-sm font-black transition-all ${
                      bristolType === type 
                        ? 'bg-vintage-ink text-white dark:bg-gray-100 dark:text-black scale-110 shadow-md' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-300'
                    }`}
                   >
                     {type}
                   </button>
                ))}
             </div>
          </div>

          {/* Journal Note */}
          <div className="space-y-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">{t.fieldObservation}</span>
             <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.language === 'zh' ? "在此记录您的观察结果..." : "Transcribe your observations here..."}
                className="w-full typewriter text-sm bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-sm border-vintage-border border outline-none focus:border-vintage-ink dark:focus:border-gray-100 transition-all resize-none"
                rows={3}
             />
          </div>

          <button 
            onClick={() => onSave({ bristolType, note, photo })}
            className="w-full py-4 bg-vintage-ink dark:bg-gray-100 text-white dark:text-black font-black text-xs uppercase tracking-[0.4em] rounded-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Check size={16} strokeWidth={3} />
            {t.develop}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoopForm;
