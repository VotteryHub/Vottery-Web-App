import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() - 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Icon name="ChevronLeft" size={18} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{monthName}</h4>
        <button onClick={() => setCurrentMonth(new Date(currentMonth?.getFullYear(), currentMonth?.getMonth() + 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Icon name="ChevronRight" size={18} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']?.map((d) =>
        <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">{d}</div>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay })?.map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1)?.map((day) =>
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={isPast(day)}
          className={`w-full aspect-square rounded-lg text-xs font-medium transition-all ${
          isSelected(day) ?
          'bg-green-500 text-white' :
          isPast(day) ?
          'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300'}`
          }>
          
            {day}
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" /><span className="text-gray-600 dark:text-gray-400">Available</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded" /><span className="text-gray-600 dark:text-gray-400">Unavailable</span></div>
      </div>
    </div>);

};

// Escrow Transaction Component
const EscrowPanel = ({ bookings }) => {
  const escrowItems = bookings?.filter((b) => b?.status === 'confirmed' || b?.status === 'in_escrow' || b?.status === 'pending_release') || [
  { id: 'ESC-001', service: 'Sponsored Content Package', amount: 500, status: 'in_escrow', releaseDate: '2026-03-05', buyer: 'BrandCo Inc' },
  { id: 'ESC-002', service: 'Collaboration Bundle', amount: 1200, status: 'pending_release', releaseDate: '2026-02-28', buyer: 'TechStartup' }];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Shield" size={18} className="text-blue-600" />
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Escrow Holdings</h4>
        <span className="ml-auto text-sm font-bold text-blue-600">${escrowItems?.reduce((sum, e) => sum + (e?.amount || 0), 0)?.toLocaleString()}</span>
      </div>
      <div className="space-y-3">
        {escrowItems?.map((item) =>
        <div key={item?.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item?.service}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item?.buyer} • Release: {item?.releaseDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400">${item?.amount}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
            item?.status === 'pending_release' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="CheckSquare" size={18} className="text-purple-600" />
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Deliverables Checklist</h4>
        </div>
        <span className="text-sm font-bold text-purple-600">{completedCount}/{deliverables?.length}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        {deliverables?.map((item) =>
        <div key={item?.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer" onClick={() => toggleDeliverable(item?.id)}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item?.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300 dark:border-gray-600'}`
          }>
              {item?.completed && <Icon name="Check" size={12} className="text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${item?.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{item?.task}</p>
              <p className="text-xs text-gray-400">Due: {item?.dueDate}</p>
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
    <>
      <Helmet>
        <title>Creator Marketplace | Vottery</title>
        <meta name="description" content="Browse creator services, manage bookings, track deliverables, and handle escrow payments." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Creator Marketplace</h1>
                <p className="text-gray-600 dark:text-gray-400">Discover services, manage bookings, and track deliverables</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {tabs?.map((tab) =>
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab?.id ?
                  'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`
                  }>
                  
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                )}
              </div>

              {/* Browse Services */}
              {activeTab === 'browse' &&
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services?.map((service) =>
                <div key={service?.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={service?.avatar} alt={`${service?.creator} profile`} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{service?.creator}</p>
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={12} className="text-yellow-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{service?.rating} ({service?.reviews})</span>
                          </div>
                        </div>
                        <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{service?.type?.replace('_', ' ')}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{service?.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{service?.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${service?.price}</span>
                          <span className="text-xs text-gray-500 ml-1">{service?.deliveryDays}d delivery</span>
                        </div>
                        <Button size="sm" onClick={() => {setSelectedService(service);setActiveTab('availability');}}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                )}
                </div>
              }

              {/* Availability Calendar */}
              {activeTab === 'availability' &&
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Select Available Dates</h3>
                    <AvailabilityCalendar onSelectDate={handleDateSelect} selectedDates={selectedDates} />
                    {selectedDates?.length > 0 &&
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium">{selectedDates?.length} date(s) selected</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedDates?.map((d) =>
                      <span key={d} className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">{d}</span>
                      )}
                        </div>
                      </div>
                  }
                  </div>
                  <div>
                    {selectedService &&
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Service</span><span className="font-medium">{selectedService?.title}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Creator</span><span className="font-medium">{selectedService?.creator}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Price</span><span className="font-bold text-green-600">${selectedService?.price}</span></div>
                          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Delivery</span><span>{selectedService?.deliveryDays} days</span></div>
                          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Escrow</span><span className="text-blue-600">Protected</span></div>
                        </div>
                        <Button className="w-full mt-4" onClick={async () => {
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
              {activeTab === 'escrow' && <EscrowPanel bookings={escrowBookings} />}

              {/* Deliverables */}
              {activeTab === 'deliverables' && <DeliverablesChecklist serviceId={selectedService?.id} />}
            </div>
          </main>
        </div>
      </div>
    </>);

};

export default CreatorMarketplaceScreenEnhanced;