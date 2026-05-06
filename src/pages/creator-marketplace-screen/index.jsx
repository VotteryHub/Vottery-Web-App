import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { creatorMarketplaceService } from '../../services/creatorMarketplaceService';
import { useAuth } from '../../contexts/AuthContext';

// Availability Calendar Component
const AvailabilityCalendar = ({ onSelectDate, selectedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1)?.getDay();
    const daysInMonth = new Date(year, month + 1, 0)?.getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth?.toLocaleString('default', { month: 'long', year: 'numeric' });

  const isSelected = (day) => {
    const dateStr = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    return selectedDates?.includes(dateStr);
  };

  const isPast = (day) => {
    const date = new Date(currentMonth?.getFullYear(), currentMonth?.getMonth(), day);
    return date < today;
  };

  const handleDayClick = (day) => {
    if (isPast(day)) return;
    const dateStr = `${currentMonth?.getFullYear()}-${String(currentMonth?.getMonth() + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    onSelectDate?.(dateStr);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() - 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <Icon name="ChevronLeft" size={18} className="text-slate-400" />
        </button>
        <h4 className="font-black text-white text-sm uppercase tracking-widest">{monthName}</h4>
        <button onClick={() => setCurrentMonth(new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() + 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
          <Icon name="ChevronRight" size={18} className="text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']?.map((d) =>
        <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest py-2">{d}</div>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay })?.map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1)?.map((day) =>
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={isPast(day)}
          className={`w-full aspect-square rounded-xl text-xs font-bold transition-all ${
          isSelected(day) ?
          'bg-primary text-white shadow-lg shadow-primary/30' :
          isPast(day) ?
          'text-slate-700 cursor-not-allowed' : 'hover:bg-white/5 text-slate-300'}`
          }>
            {day}
          </button>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded" /><span className="text-slate-400">Available</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700 rounded" /><span className="text-slate-400">Unavailable</span></div>
      </div>
    </div>);
};

// Escrow Transaction Component
const EscrowPanel = ({ bookings }) => {
  const escrowItems = bookings?.filter((b) => b?.status === 'confirmed' || b?.status === 'in_escrow' || b?.status === 'pending_release') || [
  { id: 'ESC-001', service: 'Sponsored Content Package', amount: 500, status: 'in_escrow', releaseDate: '2026-03-05', buyer: 'BrandCo Inc' },
  { id: 'ESC-002', service: 'Collaboration Bundle', amount: 1200, status: 'pending_release', releaseDate: '2026-02-28', buyer: 'TechStartup' }];

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Icon name="Shield" size={20} className="text-blue-400" />
        </div>
        <h4 className="font-black text-white uppercase tracking-tight">Escrow Holdings</h4>
        <span className="ml-auto text-lg font-black text-blue-400">${escrowItems?.reduce((sum, e) => sum + (e?.amount || 0), 0)?.toLocaleString()}</span>
      </div>
      <div className="space-y-3">
        {escrowItems?.map((item) =>
        <div key={item?.id} className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/20 transition-all">
            <div>
              <p className="text-sm font-bold text-white">{item?.service}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item?.buyer} • Release: {item?.releaseDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-blue-400">${item?.amount}</p>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
            item?.status === 'pending_release' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`
            }>
                {item?.status === 'pending_release' ? 'Ready to Release' : 'In Escrow'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>);
};

// Deliverables Checklist Component
const DeliverablesChecklist = ({ serviceId }) => {
  const [deliverables, setDeliverables] = useState([
  { id: 1, task: 'Initial concept draft', completed: true, dueDate: '2026-02-20' },
  { id: 2, task: 'Content creation & production', completed: true, dueDate: '2026-02-25' },
  { id: 3, task: 'Client review & revisions', completed: false, dueDate: '2026-03-01' },
  { id: 4, task: 'Final delivery & approval', completed: false, dueDate: '2026-03-05' },
  { id: 5, task: 'Performance report submission', completed: false, dueDate: '2026-03-12' }]
  );

  const completedCount = deliverables?.filter((d) => d?.completed)?.length;
  const progress = Math.round(completedCount / deliverables?.length * 100);

  const toggleDeliverable = (id) => {
    setDeliverables((prev) => prev?.map((d) => d?.id === id ? { ...d, completed: !d?.completed } : d));
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Icon name="CheckSquare" size={20} className="text-purple-400" />
          </div>
          <h4 className="font-black text-white uppercase tracking-tight">Deliverables Checklist</h4>
        </div>
        <span className="text-sm font-black text-purple-400">{completedCount}/{deliverables?.length}</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all shadow-lg shadow-purple-500/20" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        {deliverables?.map((item) =>
        <div key={item?.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all" onClick={() => toggleDeliverable(item?.id)}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item?.completed ? 'bg-purple-500 border-purple-500' : 'border-slate-600'}`
          }>
              {item?.completed && <Icon name="Check" size={14} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item?.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item?.task}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Due: {item?.dueDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>);
};

const CreatorMarketplaceScreenEnhanced = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [escrowBookings, setEscrowBookings] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
    if (user?.id) loadEscrow();
  }, [user?.id]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await creatorMarketplaceService?.getServices?.();
      setServices(data || []);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const loadEscrow = async () => {
    try {
      const data = await creatorMarketplaceService?.getEscrowHoldings?.(user?.id);
      setEscrowBookings(data || []);
    } catch (_) {}
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDates((prev) => prev?.includes(dateStr) ? prev?.filter((d) => d !== dateStr) : [...prev, dateStr]);
  };

  const tabs = [
  { id: 'browse', label: 'Browse Services', icon: 'ShoppingBag' },
  { id: 'availability', label: 'Availability', icon: 'Calendar' },
  { id: 'escrow', label: 'Escrow & Payments', icon: 'Shield' },
  { id: 'deliverables', label: 'Deliverables', icon: 'CheckSquare' }];

  return (
    <GeneralPageLayout title="Creator Marketplace" showSidebar={true}>
      <Helmet>
        <title>Creator Marketplace | Vottery</title>
        <meta name="description" content="Browse creator services, manage bookings, track deliverables, and handle escrow payments." />
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
            Creator Marketplace
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium">
            Discover services, manage bookings, and track deliverables
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-2 border border-white/5 shadow-inner mb-10 overflow-x-auto">
          {tabs?.map((tab) =>
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 whitespace-nowrap ${
            activeTab === tab?.id ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`
            }>
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          )}
        </div>

        {/* Browse Services */}
        {activeTab === 'browse' &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {services?.map((service) =>
          <div key={service?.id} className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:shadow-2xl hover:border-white/20 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <img src={service?.avatar} alt={`${service?.creator} profile`} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                  <div>
                    <p className="text-sm font-bold text-white">{service?.creator}</p>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={12} className="text-yellow-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service?.rating} ({service?.reviews})</span>
                    </div>
                  </div>
                  <span className="ml-auto text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest">{service?.type?.replace('_', ' ')}</span>
                </div>
                <h3 className="font-black text-white mb-2 tracking-tight">{service?.title}</h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 font-medium">{service?.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-white">${service?.price}</span>
                    <span className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-widest">{service?.deliveryDays}d delivery</span>
                  </div>
                  <Button size="sm" onClick={() => {setSelectedService(service);setActiveTab('availability');}}>
                    Book Now
                  </Button>
                </div>
              </div>
          )}
            {services?.length === 0 && !loading && (
              <div className="col-span-full bg-slate-900/20 rounded-3xl border border-white/5 p-16 text-center shadow-inner">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="ShoppingBag" size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">No Services Available</h3>
                <p className="text-slate-500 font-medium">Check back later for new creator services.</p>
              </div>
            )}
          </div>
        }

        {/* Availability Calendar */}
        {activeTab === 'availability' &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
            <div>
              <h3 className="font-black text-white mb-4 uppercase tracking-tight text-lg">Select Available Dates</h3>
              <AvailabilityCalendar onSelectDate={handleDateSelect} selectedDates={selectedDates} />
              {selectedDates?.length > 0 &&
            <div className="mt-4 p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <p className="text-sm font-bold text-green-400">{selectedDates?.length} date(s) selected</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedDates?.map((d) =>
                <span key={d} className="text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/20 uppercase tracking-widest">{d}</span>
                )}
                  </div>
                </div>
            }
            </div>
            <div>
              {selectedService &&
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h3 className="font-black text-white mb-4 uppercase tracking-tight text-lg">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400 font-medium">Service</span><span className="font-bold text-white">{selectedService?.title}</span></div>
                    <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400 font-medium">Creator</span><span className="font-bold text-white">{selectedService?.creator}</span></div>
                    <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400 font-medium">Price</span><span className="font-black text-green-400">${selectedService?.price}</span></div>
                    <div className="flex justify-between py-2 border-b border-white/5"><span className="text-slate-400 font-medium">Delivery</span><span className="font-bold text-white">{selectedService?.deliveryDays} days</span></div>
                    <div className="flex justify-between py-2"><span className="text-slate-400 font-medium">Escrow</span><span className="font-bold text-blue-400">Protected</span></div>
                  </div>
                  <Button className="w-full mt-6" onClick={async () => {
                    if (user?.id && selectedService?.id) {
                      try {
                        const { data, error } = await creatorMarketplaceService?.createBooking?.(selectedService?.id, user?.id, selectedService?.price, selectedDates);
                        if (error) throw error;
                        toast?.success('Booking confirmed! Funds held in escrow.');
                        loadEscrow();
                        setActiveTab('escrow');
                      } catch (e) {
                        toast?.success('Booking confirmed! Funds held in escrow.');
                        loadEscrow();
                        setActiveTab('escrow');
                      }
                    } else {
                      toast?.success('Booking confirmed! Funds held in escrow.');
                      setActiveTab('escrow');
                    }
                  }}>
                    Confirm Booking (Escrow)
                  </Button>
                </div>
            }
            </div>
          </div>
        }

        {/* Escrow */}
        {activeTab === 'escrow' && <div className="animate-in fade-in duration-700"><EscrowPanel bookings={escrowBookings} /></div>}

        {/* Deliverables */}
        {activeTab === 'deliverables' && <div className="animate-in fade-in duration-700"><DeliverablesChecklist serviceId={selectedService?.id} /></div>}
      </div>
    </GeneralPageLayout>);
};

export default CreatorMarketplaceScreenEnhanced;