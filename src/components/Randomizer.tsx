import { useEffect, useState } from "react";
import  type{ Chart } from '../types';
import { fetchAllCharts } from '../utils/api';
import { shuffleArray } from '../utils/shuffle';
import FilterPanel from './FilterPanel';
import ChartCard from './ChartCard';
import '../styles/Demo.css'

export default function Randomizer() {
    // State
    const [charts, setCharts] = useState<Chart[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [chartType, setChartType] = useState('All');
    const [minLevel, setMinLevel] = useState(20);
    const [maxLevel, setMaxLevel] = useState(25);
    const [chartCount, setChartCount] = useState(12);

    // Načti a filtruj charty
    async function loadCharts() {
        setIsLoading(true);
        setError("");

        try {
            const apiToken = import.meta.env.VITE_API_TOKEN;
            
            // 1. Načti všechna data
            const allCharts = await fetchAllCharts(apiToken);
            console.log(`Loaded ${allCharts.length} charts`);

            // 2. Filtruj podle typu a levelu
            const filtered = allCharts.filter(chart => {
                const levelOk = chart.level >= minLevel && chart.level <= maxLevel;
                const typeOk = chartType === 'All' || chart.type === chartType;
                return levelOk && typeOk;
            });

            console.log(`Filtered to ${filtered.length} charts`);

            if (filtered.length === 0) {
                setError('No charts match your filters');
                setCharts([]);
                return;
            }

            // 3. Zamíchej
            const shuffled = shuffleArray(filtered);

            // 4. Vyberu jen potřebný počet
            const selected = shuffled.slice(0, chartCount);
            
            setCharts(selected);

        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Načti při prvním renderu
    useEffect(() => {
        loadCharts();
    }, []);

    // Otevři YouTube
    function openYouTube(chart: Chart) {
        const query = `${chart.song.name} Pump It Up ${chart.shorthand}`;
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Změna typu chartu
    function handleTypeChange(newType: string) {
        setChartType(newType);
        
        // Nastav správné limity levelů
        if (newType === 'Single') {
            setMinLevel(1);
            setMaxLevel(26);
        } else if (newType === 'Double') {
            setMinLevel(5);
            setMaxLevel(28);
        }
    }

    // Změna počtu chartů
    function handleCountChange(value: number) {
        // Omeз na 1-40
        const clamped = Math.max(1, Math.min(40, value));
        setChartCount(clamped);
    }

    // Loading spinner
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Choosing your faith...</p>
            </div>
        );
    }

    // Hlavní render
    return (
        <div className='container'>
            <header className="header">
                <h1>PIU Randomizer</h1>
                <p className="subtitle">Pump it up Phoenix</p>
            </header>

            <FilterPanel
                chartType={chartType}
                minLevel={minLevel}
                maxLevel={maxLevel}
                chartCount={chartCount}
                onTypeChange={handleTypeChange}
                onMinLevelChange={setMinLevel}
                onMaxLevelChange={setMaxLevel}
                onCountChange={handleCountChange}
                onApply={loadCharts}
            />

            {error && <div className="error-message">{error}</div>}

            <div className="charts-grid">
                {charts.map(chart => (
                    <ChartCard 
                        key={chart.id} 
                        chart={chart} 
                        onClick={openYouTube}
                    />
                ))}
            </div>
        </div>
    );
}