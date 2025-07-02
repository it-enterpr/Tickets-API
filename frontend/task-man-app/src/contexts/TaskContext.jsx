import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [activeTask, setActiveTask] = useState(null); // { id, name }
    const [taskTime, setTaskTime] = useState(0); // vteřiny
    const timerRef = useRef(null);

    // Funkce, která se zavolá, když uživatel klikne na úkol
    const startTask = (task) => {
        // Pokud už běží časovač pro jiný úkol, zastavíme ho
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        console.log(`Spouštím sledování pro úkol: ${task.name}`);
        setActiveTask(task);
        setTaskTime(0); // Vynulujeme čas
    };

    // Tento efekt se stará o samotné tikání časovače
    useEffect(() => {
        if (activeTask) {
            timerRef.current = setInterval(() => {
                setTaskTime(prevTime => prevTime + 1);
            }, 1000);
        }
        // Uklidíme po sobě, když se komponenta odpojí nebo se změní úkol
        return () => clearInterval(timerRef.current);
    }, [activeTask]);

    const value = { activeTask, taskTime, startTask };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => useContext(TaskContext);