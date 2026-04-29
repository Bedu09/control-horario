import { Play, Square, Pause, Activity, FileText, Pencil } from 'lucide-react';
import { useTimeTracker } from '../hooks/useTimeTracker';
import './Dashboard.css';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { es as esLocale, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const { status, formattedTime, elapsedSeconds, startTimer, pauseTimer, stopTimer, dailyHistory, historicalBalance, setHistoricalBalance, addManualRecord, addNonWorkingDay, deleteRecord, editRecordNote } = useTimeTracker();
  const { t, lang, toggleLang } = useLanguage();

  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [sessionNote, setSessionNote] = useState('');

  const handleAddNote = () => {
    const text = window.prompt(t.addNotePrompt, sessionNote);
    if (text !== null) {
      setSessionNote(text);
    }
  };

  const handleManualSave = () => {
    const h = parseInt(manualHours) || 0;
    const m = parseInt(manualMinutes) || 0;
    if (h === 0 && m === 0) return;

    const note = window.prompt(t.addNotePrompt, '');
    addManualRecord(selectedDate, h, m, hourlyRate, note !== null ? note : '');
    setManualHours('');
    setManualMinutes('');
  };

  const handleNonWorkingDay = () => {
    const note = window.prompt(t.addNotePrompt, '');
    addNonWorkingDay(selectedDate, note !== null ? note : '');
  };
  
  // Rate config
  const [hourlyRate, setHourlyRate] = useState(1000);
  
  // Date config
  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('selectedDate') || format(new Date(), 'yyyy-MM-dd');
  });

  const handleDateChange = (e) => {
    const val = e.target.value;
    setSelectedDate(val);
    localStorage.setItem('selectedDate', val);
  };

  const formattedChosenDate = (() => {
    try {
      return format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy', { locale: lang === 'es' ? esLocale : enUS });
    } catch(e) {
      return selectedDate;
    }
  })();
  
  useEffect(() => {
    const savedRate = localStorage.getItem('hourlyRate');
    if (savedRate) {
      setHourlyRate(Number(savedRate));
    }
  }, []);
  
  const handleRateChange = (e) => {
    const val = Number(e.target.value);
    setHourlyRate(val);
    localStorage.setItem('hourlyRate', val);
  };

  const handleBalanceChange = (e) => {
    const val = Number(e.target.value);
    setHistoricalBalance(val);
  };
  
  const [viewLimit, setViewLimit] = useState(7);
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [calculatedTotal, setCalculatedTotal] = useState(null);

  const toggleRecordSelection = (index) => {
    setSelectedRecords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    setCalculatedTotal(null);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedRecords.forEach(index => {
      const record = dailyHistory[index];
      if (record && record.earnings) {
        total += parseFloat(record.earnings);
      }
    });
    setCalculatedTotal(Number(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };
  const toggleHistoryView = (e) => {
    e.preventDefault();
    setViewLimit(prev => prev === 7 ? 30 : 7);
  };
  
  // Daily goals computation
  const WORKDAY_HOURS = 6;
  const baseTargetSeconds = WORKDAY_HOURS * 3600;
  
  const effectiveProgressSeconds = elapsedSeconds + (historicalBalance * 3600);
  const progressPercent = Math.max(0, Math.min(((effectiveProgressSeconds / baseTargetSeconds) * 100), 100)).toFixed(0);
    
  // Calculamos lo que netamente le falta trabajar hoy para mostrarlo en el texto superior
  const adjustedTargetHours = Math.max(WORKDAY_HOURS - historicalBalance, 0); 
  const adjustedTargetH = Math.floor(adjustedTargetHours);
  const adjustedTargetM = Math.round((adjustedTargetHours - adjustedTargetH) * 60);
  
  // Format record dates using active locale
  const formatRecordDate = (dateStr) => {
    try {
      // Solo re-formatear si luce como fecha ISO (yyyy-MM-dd)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy', { locale: lang === 'es' ? esLocale : enUS });
      }
      return dateStr; // fechas viejas guardadas ya formateadas
    } catch(e) {
      return dateStr;
    }
  };

  // Earnings computation
  const hoursWorked = elapsedSeconds / 3600;
  const earningsRaw = hoursWorked * hourlyRate;
  const formatMoney = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const earnings = formatMoney(earningsRaw);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="text-h1">{t.greeting}</h1>
        </div>
        <div className="goal-badge">
          <Activity size={16} className="brand-icon" />
          <div className="goal-text">
            <span>{t.todayTarget}</span>
            <strong>{formattedTime.hours}h {formattedTime.minutes}m / {adjustedTargetH}h {adjustedTargetM > 0 ? `${adjustedTargetM}m` : ''}</strong>
          </div>
        </div>
      </div>

      <div className="timer-card">
        <div className="timer-content">
          <div className="status-tag">
            <span className={`status-dot ${status}`}></span>
            {status === 'running' ? t.statusRunning : status === 'paused' ? t.statusPaused : ''}
            <button
              onClick={toggleLang}
              className="lang-toggle-inline"
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <span className={lang === 'es' ? 'lang-active' : ''}> ES</span>
              <span className="lang-divider"> / </span>
              <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
            </button>
          </div>
          
          <h2 className="text-h2" style={{marginBottom: '4px'}}>{t.projectTitle}</h2>
          <p className="text-body" style={{marginBottom: '32px'}}>{t.projectSubtitle}</p>
          
          <div className="time-display">
            <span className="time-big">{formattedTime.hours}:{formattedTime.minutes}</span>
            <span className="time-small">:{formattedTime.seconds}</span>
          </div>

          <div className="timer-controls">
            {status === 'running' ? (
              <>
                <button className="control-btn pause-btn" onClick={() => pauseTimer('pausa_break')}>
                  <Pause size={24} />
                </button>
                <button className="control-btn stop-btn" onClick={() => {
                  stopTimer(selectedDate, hourlyRate, sessionNote);
                  setSessionNote('');
                }}>
                  <Square size={24} />
                </button>
              </>
            ) : (
              <button className="control-btn play-btn" onClick={startTimer}>
                <Play size={24} fill="currentColor" />
              </button>
            )}
            <button className="add-note-btn" onClick={handleAddNote}>
              {t.addNote} {sessionNote ? '✓' : ''}
            </button>
          </div>
        </div>
        
        <div className="timer-progress">
          <div className="circular-progress" style={{"--progress": progressPercent}}>
            <div className="inner-circle">
              <span className="progress-value">{progressPercent}%</span>
              <span className="progress-label">{t.taskProgress}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stats-card">
          <div className="stats-header">
            <h3>{t.dailyProgress}</h3>
            <span className="icon-calendar">📅</span>
          </div>
          <p className="stats-desc">{t.dailyProgressDesc}</p>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '8px' }}>
              {formattedChosenDate}
            </p>
            {status === 'idle' && (
              <>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={handleDateChange} 
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    display: 'block'
                  }}
                />
                
                <div style={{background: 'var(--bg-color)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
                  <p style={{fontSize: '12px', fontWeight: 'bold', marginBottom:'8px'}}>{t.manualLoad}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <input type="number" placeholder="Hr" value={manualHours} onChange={e => setManualHours(e.target.value)} style={{width: '46px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent'}} /> <span style={{fontSize:'12px'}}>h</span>
                      <input type="number" placeholder="Min" value={manualMinutes} onChange={e => setManualMinutes(e.target.value)} style={{width: '46px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', marginLeft: '2px'}} /> <span style={{fontSize:'12px'}}>m</span>
                    </div>
                    <button onClick={handleManualSave} style={{background: 'var(--primary-blue)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', flexGrow: 1, minWidth: '70px'}}>{t.loadBtn}</button>
                  </div>
                  <button onClick={handleNonWorkingDay} style={{width: '100%', background: 'transparent', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s'}}>
                    {t.registerNonWorking}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="stats-values">
          <div className="stat-item">
            <span className="stat-label">{t.totalTime}</span>
            <span className="stat-value">{formattedTime.hours}h {formattedTime.minutes}m</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t.earnings}</span>
            <span className="stat-value earnings-val">${earnings}</span>
            <div className="rate-config">
              <label>{t.rateLabel} </label>
              <input type="number" value={hourlyRate} onChange={handleRateChange} className="rate-input" />
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">{t.historicalBal}</span>
            <span className="stat-value" style={{color: historicalBalance >= 0 ? 'var(--primary-blue)' : 'var(--accent-red)'}}>
              {historicalBalance > 0 ? `+${historicalBalance}` : historicalBalance}h
            </span>
            <div className="rate-config">
              <label>{t.extraLabel} </label>
              <input type="number" step="0.5" value={historicalBalance} onChange={handleBalanceChange} className="rate-input" />
            </div>
          </div>
          
          <button className="full-report-btn" onClick={calculateTotal}>
            {calculatedTotal !== null ? `Total $ ${calculatedTotal}` : t.totalBtn}
          </button>
        </div>
      </div>

      <div className="recent-activities">
        <div className="section-header">
          <h2>{t.recentActivities}</h2>
          <a href="#" onClick={toggleHistoryView} className="view-history">
            {viewLimit === 7 ? t.viewHistory : t.viewLess}
          </a>
        </div>
        
        <div className="activity-list">
          {dailyHistory.length > 0 ? dailyHistory.map((rec, i) => ({...rec, originalIndex: i})).reverse().slice(0, viewLimit).map((record) => (
            <div className="activity-item" key={record.originalIndex}>
              <input 
                type="checkbox" 
                checked={selectedRecords.has(record.originalIndex)}
                onChange={() => toggleRecordSelection(record.originalIndex)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', marginRight: '16px', accentColor: 'var(--primary-blue)', flexShrink: 0 }}
              />
              <div className="activity-details" style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <span className="activity-company" style={{fontSize: '12px', color: 'var(--primary-blue)'}}>{formatRecordDate(record.date)}</span>
                  <button onClick={() => deleteRecord(record.originalIndex)} style={{background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '0 4px', fontSize: '14px', lineHeight:'1'}} title={t.deleteTitle}>✕</button>
                </div>
                <div style={{marginTop:'4px', lineHeight: '1.5', color:'var(--text-primary)', fontSize:'14px', fontWeight:'600'}}>
                  <span style={{marginRight: '6px'}}>{t.activityLabel(record)}</span>
                  {record.note && (
                    <button 
                      onClick={() => window.alert(record.note)}
                      style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-yellow)', display: 'inline-flex', alignItems: 'center', padding: 0, verticalAlign: 'middle', marginRight: '6px'}}
                      title={t.viewNoteTitle}
                    >
                      <FileText size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const newNote = window.prompt(t.addNotePrompt, record.note || '');
                      if (newNote !== null) {
                        editRecordNote(record.originalIndex, newNote);
                      }
                    }}
                    style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', padding: 0, verticalAlign: 'middle'}}
                    title="Editar nota"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="activity-item">
              <p className="text-body">{t.noActivity}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
