import { useEffect, useState } from "react";
import './Demo.css';

interface Song {
    name: string;
    type: string;
    imagePath: string;
}

interface Chart {
    id: string;
    type: string;
    shorthand: string;
    level: number;
    song: Song;
}

export default function Randomizer() {
    const [charts, setCharts] = useState<Chart[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    
    // Filtry
    const [chartType, setChartType] = useState<string>('All');
    const [minLevel, setMinLevel] = useState<number>(20);
    const [maxLevel, setMaxLevel] = useState<number>(25);
        // const [coop, setCoopLevel] = useState<number>();

    const [chartCount, setChartCount] = useState<number>(12);

    const getLevelLimits = () => {
        if (chartType === 'Single') return { min: 1, max: 26 };
        if (chartType === 'Double') return { min: 5, max: 28 };
        // if (chartType === 'Coop') return { min: 5, max: 28 };
        return { min: 1, max: 28 };
    };

    // Funkce pro YouTube searching
    const handleCardClick = (chart: Chart) => {

        const searchQuery = encodeURIComponent(`${chart.song.name} Pump It Up ${chart.shorthand}`);
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
        
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
        
        console.log(`Otevírám YouTube: ${chart.song.name} (${chart.shorthand})`);
    };


    // API handler
    const fetchRandomCharts = async () => {
        setIsLoading(true);
        setError("");

        try {
            const username = 'api';
            const apiToken = import.meta.env.VITE_API_TOKEN;
            const credentials = btoa(`${username}:${apiToken}`);

            let allCharts: Chart[] = [];

            const strategies = [
                async () => {
                    const response = await fetch(`/api/charts?Count=5000`, {
                        headers: {
                            'Authorization': `Basic ${credentials}`,
                            'Accept': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        return data.results || data;
                    }
                    return null;
                },
                
                async () => {
                    const allData: Chart[] = [];
                    for (let page = 1; page <= 10; page++) {
                        try {
                            const response = await fetch(`/api/charts?Page=${page}&PageSize=500`, {
                                headers: {
                                    'Authorization': `Basic ${credentials}`,
                                    'Accept': 'application/json',
                                },
                            });
                            if (response.ok) {
                                const data = await response.json();
                                const pageResults = data.results || data;
                                allData.push(...pageResults);
                                
                                if (pageResults.length < 500) break;
                            }
                        } catch (e) {
                            break;
                        }
                    }
                    return allData.length > 0 ? allData : null;
                },

                async () => {
                    const response = await fetch(`/api/charts`, {
                        headers: {
                            'Authorization': `Basic ${credentials}`,
                            'Accept': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        return data.results || data;
                    }
                    return null;
                },
            ];

            for (const strategy of strategies) {
                const result = await strategy();
                if (result && result.length > allCharts.length) {
                    allCharts = result;
                    console.log(`Načteno ${allCharts.length} chartů`);
                }
            }

            if (allCharts.length === 0) {
                throw new Error('Nepodařilo se načíst žádná data');
            }

            console.log(`Celkem načteno: ${allCharts.length} chartů`);

            const filtered = allCharts.filter((chart: Chart) => {
                const levelMatch = chart.level >= minLevel && chart.level <= maxLevel;
                const typeMatch = chartType === 'All' || chart.type === chartType;
                return levelMatch && typeMatch;
            });

            console.log(`Po filtrování: ${filtered.length} chartů`);
            console.log(`Unikátní songy: ${new Set(filtered.map(c => c.song.name)).size}`);

            if (filtered.length === 0) {
                setError('Žádné charty nevyhovují zvoleným filtrům');
                setCharts([]);
                setIsLoading(false);
                return;
            }

            let shuffled = [...filtered];
            
            for (let round = 0; round < 3; round++) {
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
            }
            
            const randomCharts = shuffled.slice(0, Math.min(chartCount, filtered.length));
            
            setCharts(randomCharts);

        } catch (e: any) {
            console.error("Chyba:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomCharts();
    }, []);

    const handleApplyFilters = () => {
        fetchRandomCharts();
    };

    const handleChartTypeChange = (newType: string) => {
        setChartType(newType);
        const limits = newType === 'Single' 
            ? { min: 1, max: 26 } 

            : newType === 'Double' 
            ? { min: 5, max: 28 } 
            : { min: 1, max: 28 }

            
           // const limitsCoop = newType === 'Coop'
        setMinLevel(limits.min);
        setMaxLevel(limits.max);
    };

    const handleCountChange = (value: number) => {
        const clampedValue = Math.max(1, Math.min(40, value));
        setChartCount(clampedValue);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Choosing your faith...</p>
            </div>
        );
    }

    return (
        <div className='container'>
            <header className="header">
                <h1>PIU Randomizer</h1>
                {/* <p className="subtitle">{charts.length} chartů • Klikni na kartu pro YouTube 🎥</p> */}
                 {<p className="subtitle">Pump it up Phoenix</p>}

            </header>

            {/* FILTR PANEL */}
            <div className="filter-panel">
                <div className="filter-group">
                    <label>Type of chart:</label>
                    <div className="button-group">
                        <button 
                            className={`filter-btn ${chartType === 'All' ? 'active' : ''}`}
                            onClick={() => handleChartTypeChange('All')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-btn ${chartType === 'Single' ? 'active' : ''}`}
                            onClick={() => handleChartTypeChange('Single')}
                        >
                            Single
                        </button>
                        <button 
                            className={`filter-btn ${chartType === 'Double' ? 'active' : ''}`}
                            onClick={() => handleChartTypeChange('Double')}
                        >
                            Double
                        </button>

                          {/* <button 
                            className={`filter-btn ${chartType === 'Coop' ? 'active' : ''}`}
                            onClick={() => handleChartTypeChange('All')}
                        >
                            Co-op
                        </button> */}
                    </div>


                </div>

                <div className="filter-group">
                    <label>
                        Level interval: {minLevel} - {maxLevel}
                        <span className="limit-info">
                            ({chartType === 'Single' ? '1-26' : chartType === 'Double' ? '5-28' : '1-28'})
                        </span>
                    </label>
                    <div className="range-container">
                        <div className="range-input">
                            <label>Min:</label>
                            <input 
                                type="range" 
                                min={getLevelLimits().min} 
                                max={getLevelLimits().max} 
                                value={minLevel}
                                onChange={(e) => setMinLevel(Number(e.target.value))}
                            />
                            <span className="range-value">{minLevel}</span>
                        </div>
                        <div className="range-input">
                            <label>Max:</label>
                            <input 
                                type="range" 
                                min={getLevelLimits().min} 
                                max={getLevelLimits().max} 
                                value={maxLevel}
                                onChange={(e) => setMaxLevel(Number(e.target.value))}
                            />
                            <span className="range-value">{maxLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="filter-group">
                    <label>How many songs to randomize? (1-40)</label>
                    <div className="count-input-container">
                        <button 
                            className="count-btn"
                            onClick={() => handleCountChange(chartCount - 1)}
                            disabled={chartCount <= 1}>
                                -
                        </button>
                        
                        <input 
                            type="number" 
                            min="1" 
                            max="40" 
                            value={chartCount}
                            onChange={(e) => handleCountChange(Number(e.target.value))}
                            className="count-input"
                        />
                        
                        <button 
                            className="count-btn"
                            onClick={() => handleCountChange(chartCount + 1)}
                            disabled={chartCount >= 40}
                        >
                            +
                        </button>
                        <input 
                            type="range" 
                            min="1" 
                            max="40" 
                            value={chartCount}
                            onChange={(e) => handleCountChange(Number(e.target.value))}
                            className="count-slider"
                        />
                    </div>
                </div>

                <button onClick={handleApplyFilters} className="apply-btn">
                    Randomize {chartCount} {chartCount === 1 ? 'chart!' : chartCount > 2 ? 'charts!' : 'charts!'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* CHARTS GRID */}
            <div className="charts-grid">
                {charts.map((chart) => (
                    <div 
                        key={chart.id} 
                        className="chart-card"
                        onClick={() => handleCardClick(chart)}
                        title={`Klikni pro YouTube vyhledávání: ${chart.song.name}`}
                    >
                        <div className="card-image">
                            <img 
                                src={chart.song.imagePath} 
                                alt={chart.song.name}
                                loading="lazy"
                            />
                            <div className={`chart-type ${chart.type.toLowerCase()}`}>
                                {chart.type}
                            </div>
                        </div>
                        
                        <div className="card-content">
                            <h3 className="song-name">{chart.song.name}</h3>
                            
                            <div className="chart-info">
                                <div className="info-row">
                                    <span className="label">Level:</span>
                                    <span className={`level level-${chart.level}`}>
                                        {chart.level}
                                    </span>
                                </div>
                                
                                <div className="info-row">
                                    <span className="label">Difficulty:</span>
                                    <span className="shorthand">{chart.shorthand}</span>
                                </div>
                                
                                <div className="info-row">
                                    <span className="label">Song Type:</span>
                                    <span className="song-type">{chart.song.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}