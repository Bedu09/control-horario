import { useState, useEffect } from 'react';
import { differenceInSeconds, parseISO, format } from 'date-fns';

export function useTimeTracker() {
  const [status, setStatus] = useState('idle'); // idle, running, paused
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [historicalEvents, setHistoricalEvents] = useState([]);
  const [dailyHistory, setDailyHistory] = useState([]);
  const [historicalBalance, setHistoricalBalanceState] = useState(0);

  const setHistoricalBalance = (val) => {
    setHistoricalBalanceState(val);
    localStorage.setItem('historicalBalance', val);
  };

  // Load from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timeTrackerState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setStatus(parsed.status);
      setStartTime(parsed.startTime ? new Date(parsed.startTime) : null);
      setElapsedSeconds(parsed.elapsedSeconds || 0);
      setHistoricalEvents(parsed.historicalEvents || []);
    }
    setDailyHistory(JSON.parse(localStorage.getItem('dailyHistory') || '[]'));
    setHistoricalBalanceState(Number(localStorage.getItem('historicalBalance') || 0));
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('timeTrackerState', JSON.stringify({
      status,
      startTime: startTime ? startTime.toISOString() : null,
      elapsedSeconds,
      historicalEvents
    }));
  }, [status, startTime, elapsedSeconds, historicalEvents]);

  // Timer tick
  useEffect(() => {
    let interval = null;
    if (status === 'running' && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = differenceInSeconds(now, startTime);
        setElapsedSeconds(elapsedSeconds + diff);
        setStartTime(now);
      }, 1000);
    } else if (status !== 'running') {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status, startTime, elapsedSeconds]);

  const startTimer = () => {
    if (status === 'idle') {
      setHistoricalEvents(prev => [...prev, { type: 'entrada', time: new Date().toISOString() }]);
    } else if (status === 'paused') {
      setHistoricalEvents(prev => [...prev, { type: 'regreso_pausa', time: new Date().toISOString() }]);
    }
    setStatus('running');
    setStartTime(new Date());
  };

  const pauseTimer = (type = 'pausa_break') => { // Updated based on user feedback
    setStatus('paused');
    setStartTime(null);
    setHistoricalEvents(prev => [...prev, { type, time: new Date().toISOString() }]);
  };

  const stopTimer = (recordingDate, hourlyRate) => {
    setStatus('idle');
    setStartTime(null);
    
    const finalTime = new Date().toISOString();
    const finalEvents = [...historicalEvents, { type: 'salida_final', time: finalTime }];
    
    let totalPauseMs = 0;
    let pauseStart = null;
    
    finalEvents.forEach(evt => {
      if (evt.type === 'pausa_break') {
        pauseStart = new Date(evt.time);
      } else if ((evt.type === 'regreso_pausa' || evt.type === 'salida_final') && pauseStart) {
        totalPauseMs += new Date(evt.time) - pauseStart;
        pauseStart = null;
      }
    });

    const pauseHours = Math.floor(totalPauseMs / 3600000);
    const pauseMinutes = Math.round((totalPauseMs % 3600000) / 60000);
    let pauseString = '';
    if (pauseHours > 0) pauseString += `${pauseHours}h `;
    pauseString += `${pauseMinutes}m`;
    if (pauseHours === 0 && pauseMinutes === 0) pauseString = 'No hubo';

    const hoursStr = Math.floor(elapsedSeconds / 3600);
    const minutesStr = Math.floor((elapsedSeconds % 3600) / 60);
    const earned = ((elapsedSeconds / 3600) * (hourlyRate || 0)).toFixed(2);

    const newRecord = {
      date: recordingDate || finalTime.substring(0, 10),
      totalTime: `${hoursStr}h ${minutesStr}m`,
      pauseDuration: pauseString,
      earnings: earned
    };

    const newHistory = [...dailyHistory, newRecord];
    setDailyHistory(newHistory);
    localStorage.setItem('dailyHistory', JSON.stringify(newHistory));

    // Auto-update historical balance
    const WORKDAY_HOURS = 6;
    const workedHoursDelta = (elapsedSeconds / 3600) - WORKDAY_HOURS;
    const newBalance = Math.round((historicalBalance + workedHoursDelta) * 100) / 100;
    setHistoricalBalance(newBalance);

    setHistoricalEvents([]);
    setElapsedSeconds(0);
  };

  const addManualRecord = (recordingDate, manualHours, manualMinutes, hourlyRate) => {
    const totalDecimalHours = manualHours + (manualMinutes / 60);
    const earned = (totalDecimalHours * (hourlyRate || 0)).toFixed(2);

    const newRecord = {
      date: recordingDate || new Date().toISOString().substring(0, 10),
      totalTime: `${manualHours}h ${manualMinutes}m`,
      pauseDuration: 'No hubo (Carga Manual)',
      earnings: earned
    };

    const newHistory = [...dailyHistory, newRecord];
    setDailyHistory(newHistory);
    localStorage.setItem('dailyHistory', JSON.stringify(newHistory));

    const WORKDAY_HOURS = 6;
    const workedHoursDelta = totalDecimalHours - WORKDAY_HOURS;
    const newBalance = Math.round((historicalBalance + workedHoursDelta) * 100) / 100;
    setHistoricalBalance(newBalance);
  };

  const addNonWorkingDay = (recordingDate) => {
    const newRecord = {
      date: recordingDate || new Date().toISOString().substring(0, 10),
      totalTime: 'No se trabaja',
      pauseDuration: '-',
      earnings: '0.00'
    };

    const newHistory = [...dailyHistory, newRecord];
    setDailyHistory(newHistory);
    localStorage.setItem('dailyHistory', JSON.stringify(newHistory));
  };

  const deleteRecord = (index) => {
    const recordToDelete = dailyHistory[index];
    if (!recordToDelete) return;

    if (recordToDelete.totalTime !== 'No se trabaja') {
      const match = String(recordToDelete.totalTime).match(/(\d+)h\s*(\d+)m/);
      if (match) {
        const h = parseInt(match[1], 10) || 0;
        const m = parseInt(match[2], 10) || 0;
        const totalDecimalHours = h + (m / 60);
        const WORKDAY_HOURS = 6;
        const workedHoursDelta = totalDecimalHours - WORKDAY_HOURS;
        const newBalance = Math.round((historicalBalance - workedHoursDelta) * 100) / 100;
        setHistoricalBalance(newBalance);
      }
    }

    const newHistory = dailyHistory.filter((_, i) => i !== index);
    setDailyHistory(newHistory);
    localStorage.setItem('dailyHistory', JSON.stringify(newHistory));
  };

  const resetTimer = () => {
    setStatus('idle');
    setStartTime(null);
    setElapsedSeconds(0);
    setHistoricalEvents([]);
  }

  // Format helper for HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  return {
    status,
    elapsedSeconds,
    historicalEvents,
    dailyHistory,
    historicalBalance,
    setHistoricalBalance,
    formattedTime: formatTime(elapsedSeconds),
    startTimer,
    pauseTimer,
    stopTimer,
    addManualRecord,
    addNonWorkingDay,
    deleteRecord,
    resetTimer
  };
}
