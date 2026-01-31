
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PoopRecord, HealthSummary, UserProfile, RankItem, RankPeriod, RankScope, Language, ThemeMode } from './types';
import { BRISTOL_SCALE, DEFAULT_PRIMARY } from './constants';
import { ThemeProvider, useAppTheme } from './components/ThemeContext';
import { locales } from './locales';
import GithubCalendar from './components/GithubCalendar';
import PoopCalendar from './components/PoopCalendar';
import PoopForm from './components/PoopForm';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { 
  Plus, 
  Home, 
  BarChart2, 
  Settings as SettingsIcon, 
  User,
  Camera,
  ChevronRight,
  ArrowLeft,
  X,
  Eye,
  Palette,
  Trophy,
  UserPlus,
  Copy,
  Check,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  Upload,
  UserCircle,
  QrCode,
  History,
  CameraOff,
  UserSearch,
  Activity,
  Languages,
  ExternalLink
} from 'lucide-react';

// --- Sub-components ---

const Tape: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/30 dark:bg-gray-500/10 backdrop-blur-sm border border-white/10 rotate-1 z-20 pointer-events-none shadow-sm ${className}`} />
);

/**
 * QRCodeModal Component
 * Stylized minimal skeuomorphic toilet paper / Polaroid slot hybrid
 * Featuring "Drop from sky" and "Fall to floor" animations
 */
const QRCodeModal: React.FC<{ profile: UserProfile; onClose: () => void; t: any }> = ({ profile, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  const dragY = useMotionValue(0);
  
  // Shorter base height for a more compact, minimalist look
  const baseHeight = 320;
  const paperHeight = useTransform(dragY, [0, 24], [baseHeight, baseHeight + 18]);
  const rollRotate = useTransform(dragY, [0, 24], [0, 10]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.friendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paperColor = "#fafafa";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center pt-24 p-6 bg-vintage-paper/80 dark:bg-[#0c0c0a]/95 backdrop-blur-md"
    >
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Main Container with Drop/Wobble/Fall animations */}
      <motion.div
        initial={{ y: -1000, rotate: -15, scale: 0.85, opacity: 0 }}
        animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
        exit={{ y: 1200, rotate: 10, scale: 0.9, opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 16, 
          stiffness: 80, 
          mass: 1.2,
          opacity: { duration: 0.2 }
        }}
        className="flex flex-col items-center relative z-20"
      >
        {/* Stylized Roller / Polaroid Exit Slot */}
        <div className="relative z-30 w-52 h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-[inset_0_-2px_8px_rgba(0,0,0,0.15),0_10px_20px_-5px_rgba(0,0,0,0.1)] flex items-center justify-center border-b-4 border-gray-300 dark:border-gray-900 pointer-events-none">
           <div className="absolute top-1/2 -translate-y-1/2 w-[92%] h-2 bg-gray-900 dark:bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
           <motion.div style={{ rotateX: rollRotate }} className="relative z-10 w-36 h-8 bg-gray-100 dark:bg-gray-700 rounded-sm shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_11px)]" />
           </motion.div>
        </div>

        {/* The Paper - Unrolls as the holder lands */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 24 }}
          dragElastic={0.05}
          initial={{ y: 10, height: 0, opacity: 0 }}
          animate={{ y: 0, height: baseHeight, opacity: 1 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.8, 
            type: "spring",
            damping: 20,
            stiffness: 100
          }}
          style={{ y: dragY, height: paperHeight, backgroundColor: paperColor }}
          className="relative z-20 w-44 sm:w-48 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] flex flex-col items-center overflow-hidden cursor-grab active:cursor-grabbing border-x border-gray-100/50"
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
          
          {/* Subtle Perforation line */}
          <div className="w-full h-[1px] mt-8 border-t border-dashed border-gray-200/60" />

          <div className="mt-6 flex flex-col items-center gap-5 px-5 w-full">
              {/* QR Code Stylized */}
              <div className="p-3 bg-white dark:bg-white rounded-2xl shadow-inner border border-gray-100/50 flex items-center justify-center overflow-hidden">
                  <QRCodeSVG 
                    value={profile.friendCode} 
                    size={140} 
                    level="M" 
                    includeMargin={false} 
                    fgColor="#2d2a2e" 
                    bgColor="#ffffff"
                    style={{ borderRadius: '12px' }}
                  />
              </div>

              <div className="text-center space-y-3 w-full">
                  <div className="space-y-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">{t.biologicalId}</span>
                      <span className="typewriter text-xl font-black text-gray-800 tracking-[0.3em] pl-1">{profile.friendCode}</span>
                  </div>
                  
                  <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(); }} 
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all border ${copied ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                  >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span className="text-[9px] font-black uppercase tracking-widest">{copied ? t.copied : t.copyCode}</span>
                  </button>
              </div>
              
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter mt-2 leading-relaxed max-w-[130px] text-center opacity-50">
                  {t.scanMe}
              </p>
          </div>

          {/* Irregular Jagged Tear Edge */}
          <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden">
              <svg 
                viewBox="0 0 100 12" 
                className="w-full h-full fill-[#fafafa]" 
                preserveAspectRatio="none"
                style={{ filter: 'drop-shadow(0px -1px 0px rgba(0,0,0,0.02))' }}
              >
                <path d="M0,0 L0,5 L3,10 L7,3 L12,11 L18,5 L25,12 L30,4 L36,11 L43,6 L50,12 L57,4 L64,11 L70,5 L78,12 L85,3 L93,11 L100,5 L100,0 Z" />
              </svg>
          </div>
        </motion.div>

        {/* Decorative Shadow for paper casting onto background */}
        <motion.div 
          style={{ y: dragY, scale: useTransform(dragY, [0, 24], [1, 1.05]) }}
          className="absolute z-10 w-44 sm:w-48 h-32 mt-2 bg-black/5 blur-2xl rounded-full pointer-events-none" 
        />
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ delay: 0.6 }}
        onClick={onClose} 
        className="mt-auto mb-10 p-4 bg-white/10 dark:bg-black/20 hover:bg-white/30 rounded-full transition-all text-gray-400"
      >
        <X size={24} />
      </motion.button>
    </motion.div>
  );
};

const EmptyState: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action?: React.ReactNode;
  onAction?: () => void;
}> = ({ icon, title, description, action, onAction }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-8"
  >
    <div className="relative cursor-pointer group" onClick={onAction}>
      <div className="absolute inset-0 bg-[var(--md-sys-color-primary)] opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity" />
      <motion.div 
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative polaroid-frame !p-4 !pb-12 w-40 h-52 shadow-2xl dark:shadow-none border border-vintage-border dark:border-gray-800"
      >
         <div className="aspect-square w-full bg-gray-50 dark:bg-darkSurface flex items-center justify-center text-gray-200 dark:text-gray-800 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-gray-300 dark:text-gray-700"
            >
              {icon}
            </motion.div>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />
         </div>
         <div className="mt-4 h-1 w-1/2 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full" />
      </motion.div>
    </div>
    <div className="space-y-2 max-w-xs">
      <h3 className="font-black text-xl tracking-tighter lowercase text-vintage-ink dark:text-gray-100">{title}</h3>
      <p className="typewriter text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed px-4">{description}</p>
    </div>
    {action && (
      <div className="pt-2">
        {action}
      </div>
    )}
  </motion.div>
);

const PolaroidRecord: React.FC<{ record: PoopRecord; onClick: () => void; t: any; hidePhoto?: boolean }> = ({ record, onClick, t, hidePhoto = false }) => {
  const date = new Date(record.timestamp);
  
  return (
    <div 
      onClick={onClick}
      className="relative polaroid-frame cursor-pointer hover:rotate-1 hover:scale-[1.02] active:scale-100 transition-all duration-300 group"
    >
      <Tape className="opacity-60 group-hover:opacity-100" />
      <div className="aspect-square w-full bg-gray-50 dark:bg-darkSurface overflow-hidden relative mb-4">
        {(!hidePhoto && record.photo) ? (
          <img src={record.photo} className="w-full h-full object-cover blur-[3px] opacity-70 group-hover:blur-0 group-hover:opacity-100 transition-all duration-700" alt="Poop" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 dark:text-gray-700 bg-gray-100 dark:bg-darkSurface/50">
             <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center mb-2">
                <span className="text-xl font-black">{record.bristolType}</span>
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest">{hidePhoto ? t.snapshotLocked : t.snapshot}</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-vintage-paper dark:bg-darkBg border border-vintage-border dark:border-gray-800 text-[7px] font-black uppercase">
          {t.bristol[record.bristolType]}
        </div>
      </div>
      <div className="space-y-1">
        <p className="typewriter text-[9px] text-gray-400 dark:text-gray-500 font-bold">
          {date.toLocaleDateString(t.language === 'zh' ? 'zh-CN' : 'en-US')} — {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
        </p>
        <p className="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate typewriter">
          {record.note || '...'}
        </p>
      </div>
    </div>
  );
};

const RecordDetail: React.FC<{ record: PoopRecord; onClose: () => void; t: any }> = ({ record, onClose, t }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const date = new Date(record.timestamp);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-vintage-paper/80 dark:bg-[#0c0c0a]/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-md w-full relative polaroid-frame !p-6 !pb-14 space-y-6 animate-in zoom-in-95 duration-300">
        <Tape className="w-24 h-8" />
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">{t.observationLog}</h3>
            <p className="typewriter text-[10px] font-bold text-gray-400">{t.uuid}: {record.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div 
          className="aspect-square w-full bg-gray-100 dark:bg-darkBg overflow-hidden relative border border-gray-100 dark:border-gray-800 cursor-pointer shadow-inner"
          onClick={() => setIsRevealed(!isRevealed)}
        >
          {record.photo ? (
            <>
              <img 
                src={record.photo} 
                className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${isRevealed ? 'blur-0' : 'blur-3xl scale-125'}`} 
                alt="Poop" 
              />
              {!isRevealed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                  <Eye size={28} className="text-white/60" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white mt-4">{t.reveal}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
              <div className="w-24 h-24 rounded-full border-4 border-current flex items-center justify-center mb-4">
                 <span className="text-5xl font-black">{record.bristolType}</span>
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{t.bristol[record.bristolType]}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
           <div className="flex justify-between border-b border-vintage-border dark:border-gray-800 pb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t.timeline}</span>
              <span className="typewriter text-[10px] font-bold">{date.toLocaleString(t.language === 'zh' ? 'zh-CN' : 'en-US')}</span>
           </div>
           
           <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">{t.fieldObservation}</span>
              <p className="typewriter text-xs leading-relaxed text-gray-600 dark:text-gray-400 italic bg-vintage-paper/50 dark:bg-gray-800/20 p-4 rounded border border-vintage-border/50">
                {record.note || '...'}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const AddFriendModal: React.FC<{ onAdd: (code: string) => void; onClose: () => void; t: any }> = ({ onAdd, onClose, t }) => {
  const [code, setCode] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = () => {
    if (code.trim()) {
      onAdd(code.trim().toUpperCase());
      setIsDone(true);
      setTimeout(onClose, 800);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-vintage-paper/80 dark:bg-[#0c0c0a]/95 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-xs w-full relative polaroid-frame !p-8 !pb-12 space-y-8"
      >
        <Tape className="w-20" />
        <div className="flex justify-between items-start">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-300">{t.addFriend}</h3>
           <button onClick={onClose} className="p-2 -mt-2 -mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 block ml-1">{t.biologicalId}</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ABCDEF"
                autoFocus
                maxLength={8}
                className="w-full typewriter text-center text-xl font-black bg-gray-50 dark:bg-gray-800 p-4 border border-vintage-border dark:border-gray-800 outline-none focus:ring-1 ring-[var(--md-sys-color-primary)] transition-all uppercase tracking-[0.5em]"
              />
           </div>

           <button 
            onClick={handleSubmit}
            disabled={!code.trim() || isDone}
            className={`w-full py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-2 ${isDone ? 'bg-green-500 text-white' : 'bg-vintage-ink dark:bg-gray-100 text-white dark:text-black active:scale-95'}`}
           >
              {isDone ? <Check size={16}/> : t.authenticate}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LeaderboardView: React.FC<{ 
  myRecords: PoopRecord[], 
  myProfile: UserProfile, 
  t: any,
  onOpenAddModal: () => void 
}> = ({ myRecords, myProfile, t, onOpenAddModal }) => {
  const [period, setPeriod] = useState<RankPeriod>('week');
  const [scope, setScope] = useState<RankScope>('friends');
  
  const filteredUsers: RankItem[] = useMemo(() => {
    const globalBase = [
      { id: '1', nickname: '肠道超人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', count: 24, friendCode: 'FE3490' },
      { id: '2', nickname: '绝不便秘', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', count: 18, friendCode: 'AN2211' },
      { id: '3', nickname: '华尔街拉王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', count: 15, friendCode: 'JA0091' },
    ];
    const me: RankItem = { id: 'me', nickname: myProfile.nickname || 'Unknown', avatar: myProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${myProfile.nickname || 'me'}`, count: myRecords.length, isMe: true, friendCode: myProfile.friendCode };
    
    let base = scope === 'friends' 
      ? [me, ...globalBase.filter(u => myProfile.friends.includes(u.friendCode || ''))]
      : [...globalBase, me];

    // Explicitly cast count to number for arithmetic sort operation
    return base.sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
  }, [myRecords.length, myProfile, scope]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col items-center gap-6">
         <div className="flex p-1 bg-gray-100 dark:bg-darkSurface rounded-full border border-vintage-border dark:border-gray-800 shadow-inner">
            <button onClick={() => setScope('friends')} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${scope === 'friends' ? 'bg-white dark:bg-gray-700 shadow-sm text-vintage-ink dark:text-white' : 'text-gray-400'}`}>{t.friendsRank}</button>
            <button onClick={() => setScope('global')} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${scope === 'global' ? 'bg-white dark:bg-gray-700 shadow-sm text-vintage-ink dark:text-white' : 'text-gray-400'}`}>{t.globalRank}</button>
         </div>
         <div className="flex gap-6">
            {['week', 'month', 'quarter'].map((p) => (
              <button key={p} onClick={() => setPeriod(p as RankPeriod)} className={`text-[9px] font-black uppercase tracking-[0.3em] pb-1 border-b-2 transition-all ${period === p ? 'border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-primary)]' : 'border-transparent text-gray-300'}`}>{t[p as keyof typeof t] || p}</button>
            ))}
         </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.length > 1 || scope === 'global' ? (
          filteredUsers.map((user, idx) => (
            <div key={user.id} className="relative polaroid-frame !p-4 !pb-4 flex items-center gap-4 group hover:-rotate-1 transition-transform">
              <div className="typewriter text-[9px] font-black text-gray-200 w-6">#{idx + 1}</div>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-vintage-border dark:border-gray-800 p-0.5">
                <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt={user.nickname} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs tracking-tight lowercase">{user.nickname}</p>
                <p className="typewriter text-[8px] text-gray-400 font-bold uppercase tracking-tighter">{t.hitsLabel}: {user.count}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black">{user.count}</div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState 
            icon={<UserSearch size={48} />}
            title={t.noFriendsTitle}
            description={t.noFriendsDesc}
            onAction={onOpenAddModal}
            action={
              <button 
                onClick={onOpenAddModal}
                className="px-6 py-3 bg-[var(--md-sys-color-primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg active:scale-95 transition-all"
              >
                {t.addFriend}
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'home' | 'stats' | 'rank' | 'profile'>('home');
  const [profileSubTab, setProfileSubTab] = useState<'main' | 'appearance' | 'privacy' | 'account'>('main');
  const [records, setRecords] = useState<PoopRecord[]>(() => {
    const saved = localStorage.getItem('laleme-records');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PoopRecord | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('laleme-profile');
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    return saved ? JSON.parse(saved) : { 
      nickname: '肠道旅行者', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Traveler`, 
      birthday: '', 
      friendCode: generateCode(), 
      friends: [],
      language: 'zh'
    };
  });

  const { primaryColor, setPrimaryColor, themeMode, setThemeMode, isGlobalShared, setGlobalShared } = useAppTheme();
  const t = locales[profile.language];

  const builtInAvatars = ['Felix', 'Aneka', 'Jack', 'Mia', 'Toby', 'Lily', 'Max', 'Luna'];
  const themeColors = ['#A67C00', '#D32F2F', '#7B1FA2', '#1976D2', '#388E3C', '#2d2a2e', '#E64A19'];

  useEffect(() => {
    if (activeTab !== 'profile') setProfileSubTab('main');
  }, [activeTab]);

  useEffect(() => { localStorage.setItem('laleme-records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('laleme-profile', JSON.stringify(profile)); }, [profile]);

  const health = useMemo((): HealthSummary => {
    const now = Date.now();
    // Use Number() for arithmetic safety
    const weekRecords = records.filter(r => (Number(now) - Number(r.timestamp)) < (7 * 24 * 3600 * 1000));
    const count = weekRecords.length;
    const lastPoop = records.length > 0 ? records[records.length - 1].timestamp : null;
    
    let status: HealthSummary['status'] = 'poor';
    let message = t.poorDesc;
    
    if (count >= 3 && count <= 14) { 
      status = 'excellent'; 
      message = t.excellentDesc; 
    }
    else if (count > 0) { 
      status = 'good'; 
      message = t.goodDesc; 
    }
    else if (records.length > 0 && count === 0) {
      status = 'fair';
      message = t.fairDesc;
    }
    
    return { status, message, lastPoopTime: lastPoop, countThisWeek: count };
  }, [records, t]);

  const statsSummary = useMemo(() => {
    const total = records.length;
    if (total === 0) return { avg: 0, common: '-', status: '-' };
    
    const types = records.reduce((acc, r) => {
      acc[r.bristolType] = (acc[r.bristolType] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Explicitly cast values to number for subtraction
    const mostCommon = Object.entries(types).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0))[0][0];
    const firstDay = new Date(records[0].timestamp);
    const lastDay = new Date();
    // Explicitly cast getTime results to number for arithmetic safety
    const daysDiff = Math.max(1, Math.ceil((Number(lastDay.getTime()) - Number(firstDay.getTime())) / (1000 * 60 * 60 * 24)));
    
    return {
      avg: (total / daysDiff).toFixed(1),
      common: mostCommon,
      status: health.status
    };
  }, [records, health]);

  const handleAddPoop = (data: Omit<PoopRecord, 'id' | 'timestamp'>) => {
    const newRecord: PoopRecord = { ...data, id: Math.random().toString(36).substr(2, 6), timestamp: Date.now() };
    setRecords(prev => [...prev, newRecord]);
    setShowForm(false);
  };

  const NavItems = () => (
    <div className="flex md:flex-col justify-around items-center w-full md:gap-12">
      <button 
        onClick={() => setActiveTab('today')} 
        className={`p-4 transition-all order-1 md:order-2 ${activeTab === 'today' ? 'text-[var(--md-sys-color-primary)] scale-125' : 'text-gray-300 dark:text-gray-700'}`}
      >
        <History size={24}/>
      </button>
      <button 
        onClick={() => setActiveTab('home')} 
        className={`p-4 transition-all order-3 md:order-1 ${activeTab === 'home' ? 'text-[var(--md-sys-color-primary)] scale-125' : 'text-gray-300 dark:text-gray-700'}`}
      >
        <Home size={24}/>
      </button>
      <button 
        onClick={() => setActiveTab('stats')} 
        className={`p-4 transition-all order-2 md:order-3 ${activeTab === 'stats' ? 'text-[var(--md-sys-color-primary)] scale-125' : 'text-gray-300 dark:text-gray-700'}`}
      >
        <BarChart2 size={24}/>
      </button>
      <button 
        onClick={() => setActiveTab('rank')} 
        className={`p-4 transition-all order-4 md:order-4 ${activeTab === 'rank' ? 'text-[var(--md-sys-color-primary)] scale-125' : 'text-gray-300 dark:text-gray-700'}`}
      >
        <Trophy size={24}/>
      </button>
      <button 
        onClick={() => setActiveTab('profile')} 
        className={`p-4 transition-all order-5 md:order-5 ${activeTab === 'profile' ? 'text-[var(--md-sys-color-primary)] scale-125' : 'text-gray-300 dark:text-gray-700'}`}
      >
        <User size={24}/>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-vintage-paper dark:bg-darkBg text-vintage-ink dark:text-gray-100 selection:bg-vintage-border overflow-x-hidden transition-colors duration-500">
      <nav className="hidden md:flex flex-col w-20 bg-white/90 dark:bg-darkSurface/90 border-r border-vintage-border dark:border-gray-800 p-6 fixed left-0 top-0 bottom-0 z-40 items-center justify-between shadow-2xl backdrop-blur-md">
        <div className="w-full flex flex-col items-center">
           <NavItems />
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:ml-20">
        <main className="flex-1 p-6 max-w-2xl mx-auto w-full pb-36 md:pb-16">
          {activeTab === 'today' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="text-center space-y-2 pt-8">
                  <h2 className="text-3xl font-black tracking-tighter lowercase">{t.todayTab}.</h2>
                  <p className="typewriter text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t.todaySubtitle}</p>
               </div>
               <section className="space-y-8">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 px-2">{t.recentSnapshots}</h3>
                  {records.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      {records.slice(-6).reverse().map(record => (
                        <PolaroidRecord key={record.id} record={record} onClick={() => setSelectedRecord(record)} t={t} hidePhoto={true} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      icon={<CameraOff size={48} />}
                      title={t.noRecordsTitle}
                      description={t.noRecordsDesc}
                      onAction={() => setShowForm(true)}
                      action={
                        <button 
                          onClick={() => setShowForm(true)}
                          className="px-6 py-3 bg-vintage-ink dark:bg-gray-100 text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg active:scale-95 transition-all"
                        >
                          {t.pullAPoop}
                        </button>
                      }
                    />
                  )}
               </section>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-500 flex flex-col items-center">
               <div className="text-center space-y-4 pt-16 md:pt-24">
                  <h2 className="text-6xl md:text-7xl font-black tracking-tighter lowercase">
                    {health.status === 'excellent' ? t.excellent : health.status === 'good' ? t.good : health.status === 'fair' ? t.fair : t.poor}
                  </h2>
                  <p className="typewriter text-[11px] text-gray-400 italic lowercase tracking-wider max-w-xs mx-auto">{health.message}</p>
               </div>
               <div className="py-8">
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95, rotate: 0 }}
                    onClick={() => setShowForm(true)}
                    className="relative w-48 h-56 bg-white dark:bg-[#f5f5f5] p-3 pb-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-gray-200 dark:border-gray-800 flex flex-col items-center group transition-colors"
                  >
                    <div className="aspect-square w-full bg-gray-900 dark:bg-black overflow-hidden relative flex items-center justify-center shadow-inner border-[6px] border-gray-100 dark:border-gray-800">
                       <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                       <Camera size={48} className="text-gray-700 dark:text-gray-300 group-hover:scale-110 group-hover:text-[var(--md-sys-color-primary)] transition-all duration-500" />
                    </div>
                    <div className="flex-1 w-full flex flex-col items-center justify-center mt-2 px-1">
                       <Plus size={20} className="text-gray-300 group-hover:text-[var(--md-sys-color-primary)] transition-colors" />
                    </div>
                  </motion.button>
               </div>
               <div className="grid grid-cols-2 gap-8 max-w-sm w-full border-y border-vintage-border dark:border-gray-800/50 py-16">
                  <div className="text-center">
                    <div className="text-4xl font-black tracking-tighter">{health.countThisWeek}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-2">{t.week}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black tracking-tighter">{records.length}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-2">{t.lifeTotal}</div>
                  </div>
               </div>
               <section className="space-y-6 pt-10 w-full">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 px-2 text-center">{t.heatmap}</h3>
                  <div className="polaroid-frame !p-6 !pb-6 shadow-sm w-full overflow-hidden">
                    <GithubCalendar records={records} lang={profile.language} />
                  </div>
               </section>
            </div>
          )}
          
          {activeTab === 'stats' && (
             <div className="space-y-12 animate-in fade-in duration-500 pt-10">
                <div className="text-center space-y-2">
                   <h2 className="text-3xl font-black tracking-tighter lowercase">{t.statsTitle}.</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="polaroid-frame !p-6 !pb-6 space-y-4 border-vintage-border/30">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">{t.summaryTitle}</span>
                      <div className="space-y-3">
                         <div className="flex justify-between items-end border-b border-dashed border-gray-100 dark:border-gray-800 pb-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t.frequency}</span>
                            <span className="text-xs font-black">{statsSummary.avg} <span className="text-[8px] text-gray-300 font-bold uppercase">{t.dayAvg}</span></span>
                         </div>
                         <div className="flex justify-between items-end border-b border-dashed border-gray-100 dark:border-gray-800 pb-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{t.mostType}</span>
                            <span className="text-xs font-black">Type {statsSummary.common}</span>
                         </div>
                      </div>
                   </div>

                   <div className="polaroid-frame !p-6 !pb-6 flex flex-col justify-center items-center gap-2 border-vintage-border/30">
                      <Activity size={24} className="text-[var(--md-sys-color-primary)] opacity-40" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">{t.healthStatus}</span>
                      <div className="text-lg font-black tracking-tighter text-[var(--md-sys-color-primary)]">
                        {health.status === 'excellent' ? t.excellent : health.status === 'good' ? t.good : health.status === 'fair' ? t.fair : t.poor}
                      </div>
                   </div>
                </div>

                <div className="polaroid-frame !p-6 shadow-md overflow-hidden relative">
                   <Tape className="w-20 opacity-40" />
                   <PoopCalendar records={records} t={t} />
                </div>
             </div>
          )}

          {activeTab === 'rank' && (
            <LeaderboardView 
              myRecords={records} 
              myProfile={profile} 
              t={t} 
              onOpenAddModal={() => setShowAddModal(true)}
            />
          )}
          
          {activeTab === 'profile' && (
             <div className="space-y-10 animate-in fade-in duration-500 pt-10">
                {profileSubTab === 'main' && (
                  <>
                    <div className="flex flex-col items-center space-y-8">
                       <div 
                        onClick={() => setProfileSubTab('account')}
                        className="relative polaroid-frame !p-1 !pb-4 w-32 h-32 rotate-1 shadow-2xl cursor-pointer hover:rotate-0 transition-transform group"
                       >
                          <img src={profile.avatar} className="w-full h-full object-cover bg-gray-50" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                             <SettingsIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </div>
                       
                       <div className="text-center space-y-4 w-full flex flex-col items-center">
                          <h2 className="font-black text-3xl tracking-tighter lowercase">{profile.nickname}</h2>
                          
                          {/* Optimized Friend Code Display */}
                          <button 
                            onClick={() => setShowQRCode(true)}
                            className="group flex flex-col items-center gap-2 p-3 px-6 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-95"
                          >
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.biologicalId}</span>
                                <ExternalLink size={10} className="text-gray-300 group-hover:text-[var(--md-sys-color-primary)] transition-colors" />
                             </div>
                             <span className="typewriter text-base font-black text-vintage-ink dark:text-gray-100 tracking-[0.2em]">
                               {profile.friendCode}
                             </span>
                             <div className="w-10 h-0.5 bg-[var(--md-sys-color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                          </button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div onClick={() => setProfileSubTab('account')} className="flex justify-between items-center p-5 polaroid-frame !p-5 !pb-5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-darkSurface/50 transition-all border-vintage-border/40">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-vintage-paper dark:bg-darkBg border border-vintage-border dark:border-gray-800 rounded shadow-inner"><UserCircle size={14}/></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-vintage-ink transition-colors">{t.accountInfo}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-200"/>
                       </div>
                       <div onClick={() => setProfileSubTab('appearance')} className="flex justify-between items-center p-5 polaroid-frame !p-5 !pb-5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-darkSurface/50 transition-all border-vintage-border/40">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-vintage-paper dark:bg-darkBg border border-vintage-border dark:border-gray-800 rounded shadow-inner"><Palette size={14}/></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-vintage-ink transition-colors">{t.appearance}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-200"/>
                       </div>
                       <div onClick={() => setProfileSubTab('privacy')} className="flex justify-between items-center p-5 polaroid-frame !p-5 !pb-5 group cursor-pointer hover:bg-gray-50 dark:hover:bg-darkSurface/50 transition-all border-vintage-border/40">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-vintage-paper dark:bg-darkBg border border-vintage-border dark:border-gray-800 rounded shadow-inner"><ShieldCheck size={14}/></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-vintage-ink transition-colors">{t.privacy}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-200"/>
                       </div>
                    </div>
                  </>
                )}

                {/* Account Settings Sub-page */}
                {profileSubTab === 'account' && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-300">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setProfileSubTab('main')} className="p-3 bg-white dark:bg-darkSurface border border-vintage-border dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 text-gray-400 hover:text-vintage-ink">
                          <ArrowLeft size={20}/>
                       </button>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">{t.archives}</span>
                          <h3 className="text-lg font-black tracking-tight">{t.accountInfo}</h3>
                       </div>
                    </div>
                    
                    <div className="space-y-10 polaroid-frame !p-8 !pb-10">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">{t.nickname}</label>
                        <input 
                          type="text" 
                          value={profile.nickname}
                          onChange={(e) => setProfile(p => ({ ...p, nickname: e.target.value }))}
                          className="w-full bg-gray-50 dark:bg-gray-800 p-4 border border-vintage-border dark:border-gray-800 outline-none focus:ring-1 ring-[var(--md-sys-color-primary)] transition-all font-bold text-sm"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">{t.avatar}</label>
                        <div className="grid grid-cols-4 gap-4">
                          {builtInAvatars.map(seed => {
                            const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                            return (
                              <button 
                                key={seed}
                                onClick={() => setProfile(p => ({ ...p, avatar: url }))}
                                className={`aspect-square rounded-full overflow-hidden border-2 transition-all ${profile.avatar === url ? 'border-[var(--md-sys-color-primary)] scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                              >
                                <img src={url} alt={seed} className="w-full h-full object-cover" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings Sub-page */}
                {profileSubTab === 'appearance' && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-300">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setProfileSubTab('main')} className="p-3 bg-white dark:bg-darkSurface border border-vintage-border dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 text-gray-400 hover:text-vintage-ink">
                          <ArrowLeft size={20}/>
                       </button>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">{t.archives}</span>
                          <h3 className="text-lg font-black tracking-tight">{t.appearance}</h3>
                       </div>
                    </div>

                    <div className="space-y-10 polaroid-frame !p-8 !pb-10">
                      <div className="space-y-6">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">{t.primaryColor}</label>
                        <div className="flex flex-wrap gap-4">
                          {themeColors.map(color => (
                            <button 
                              key={color}
                              onClick={() => setPrimaryColor(color)}
                              className={`w-10 h-10 rounded-full border-2 transition-all ${primaryColor === color ? 'ring-2 ring-offset-2 ring-vintage-ink dark:ring-white scale-110' : 'border-transparent opacity-60'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">{t.themeMode}</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { mode: 'light', icon: <Sun size={14}/>, label: t.light },
                            { mode: 'dark', icon: <Moon size={14}/>, label: t.dark },
                            { mode: 'system', icon: <Monitor size={14}/>, label: t.system }
                          ].map(({ mode, icon, label }) => (
                            <button 
                              key={mode}
                              onClick={() => setThemeMode(mode as ThemeMode)}
                              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${themeMode === mode ? 'border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary)]/5' : 'border-gray-50 dark:border-gray-800'}`}
                            >
                               <div className={themeMode === mode ? 'text-[var(--md-sys-color-primary)]' : 'text-gray-300'}>{icon}</div>
                               <span className={`text-[10px] font-black uppercase tracking-widest ${themeMode === mode ? 'text-vintage-ink dark:text-gray-100' : 'text-gray-400'}`}>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6 pt-4 border-t border-vintage-border dark:border-gray-800">
                         <div className="flex justify-between items-center">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black uppercase tracking-widest">{t.language}</label>
                               <p className="text-[8px] text-gray-400 uppercase font-bold">{profile.language === 'zh' ? '当前：简体中文' : 'Current: English'}</p>
                            </div>
                            <button 
                              onClick={() => setProfile(p => ({ ...p, language: p.language === 'zh' ? 'en' : 'zh' }))}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                               <Languages size={18}/>
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings Sub-page */}
                {profileSubTab === 'privacy' && (
                  <div className="space-y-8 animate-in slide-in-from-right-10 duration-300">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setProfileSubTab('main')} className="p-3 bg-white dark:bg-darkSurface border border-vintage-border dark:border-gray-800 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 text-gray-400 hover:text-vintage-ink">
                          <ArrowLeft size={20}/>
                       </button>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">{t.archives}</span>
                          <h3 className="text-lg font-black tracking-tight">{t.privacy}</h3>
                       </div>
                    </div>

                    <div className="polaroid-frame !p-8 !pb-10">
                       <div className="flex justify-between items-start gap-10">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest">{t.privacy}</label>
                             <p className="text-[9px] text-gray-400 uppercase font-bold leading-relaxed">{t.privacyDesc}</p>
                          </div>
                          <button 
                            onClick={() => setGlobalShared(!isGlobalShared)}
                            className="w-14 h-7 rounded-full transition-all relative p-1 bg-gray-200 dark:bg-gray-800"
                            style={isGlobalShared ? { backgroundColor: 'var(--md-sys-color-primary)' } : {}}
                          >
                             <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isGlobalShared ? 'translate-x-7' : 'translate-x-0'}`} />
                          </button>
                       </div>
                    </div>
                  </div>
                )}
             </div>
          )}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/95 dark:bg-darkSurface/95 backdrop-blur-xl border border-vintage-border dark:border-gray-800 px-4 py-2 rounded-full flex justify-around items-center z-40 shadow-2xl">
        <NavItems />
      </nav>

      {showForm && <PoopForm onSave={handleAddPoop} onClose={() => setShowForm(false)} t={t} />}
      <AnimatePresence>
        {selectedRecord && <RecordDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} t={t} />}
        {showQRCode && <QRCodeModal profile={profile} onClose={() => setShowQRCode(false)} t={t} />}
        {showAddModal && <AddFriendModal onAdd={(c) => setProfile(p => ({...p, friends: [...p.friends, c]}))} onClose={() => setShowAddModal(false)} t={t} />}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
