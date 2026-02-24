interface FilterPanelProps {
    chartType: string;
    minLevel: number;
    maxLevel: number;
    chartCount: number;
    onTypeChange: (type: string) => void;
    onMinLevelChange: (level: number) => void;
    onMaxLevelChange: (level: number) => void;
    onCountChange: (count: number) => void;
    onApply: () => void;
}

export default function FilterPanel({
    chartType,
    minLevel,
    maxLevel,
    chartCount,
    onTypeChange,
    onMinLevelChange,
    onMaxLevelChange,
    onCountChange,
    onApply
}: FilterPanelProps) {
    
    const getLevelLimits = () => {
        if (chartType === 'Single') return { min: 1, max: 26 };
        if (chartType === 'Double') return { min: 5, max: 28 };
        return { min: 1, max: 28 };
    };

    const limits = getLevelLimits();

    return (
        <div className="filter-panel">
            {/* Type Buttons */}
            <div className="filter-group">
                <label>Type of chart:</label>
                <div className="button-group">
                    <button 
                        className={`filter-btn ${chartType === 'All' ? 'active' : ''}`}
                        onClick={() => onTypeChange('All')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${chartType === 'Single' ? 'active' : ''}`}
                        onClick={() => onTypeChange('Single')}
                    >
                        Single
                    </button>
                    <button 
                        className={`filter-btn ${chartType === 'Double' ? 'active' : ''}`}
                        onClick={() => onTypeChange('Double')}
                    >
                        Double
                    </button>
                </div>
            </div>

            {/* Level Range */}
            <div className="filter-group">
                <label>Level interval: {minLevel} - {maxLevel}</label>
                <div className="range-container">
                    <div className="range-input">
                        <label>Min:</label>
                        <input 
                            type="range" 
                            min={limits.min} 
                            max={limits.max} 
                            value={minLevel}
                            onChange={(e) => onMinLevelChange(Number(e.target.value))}
                        />
                        <span className="range-value">{minLevel}</span>
                    </div>
                    <div className="range-input">
                        <label>Max:</label>
                        <input 
                            type="range" 
                            min={limits.min} 
                            max={limits.max} 
                            value={maxLevel}
                            onChange={(e) => onMaxLevelChange(Number(e.target.value))}
                        />
                        <span className="range-value">{maxLevel}</span>
                    </div>
                </div>
            </div>

            {/* Count Input */}
            <div className="filter-group">
                <label>How many songs? (1-40)</label>
                <div className="count-input-container">
                    <button 
                        className="count-btn"
                        onClick={() => onCountChange(chartCount - 1)}
                        disabled={chartCount <= 1}
                    >
                        -
                    </button>
                    <input 
                        type="number" 
                        min="1" 
                        max="40" 
                        value={chartCount}
                        onChange={(e) => onCountChange(Number(e.target.value))}
                        className="count-input"
                    />
                    <button 
                        className="count-btn"
                        onClick={() => onCountChange(chartCount + 1)}
                        disabled={chartCount >= 40}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Apply Button */}
            <button onClick={onApply} className="apply-btn">
                Randomize {chartCount} chart{chartCount !== 1 ? 's' : ''}!
            </button>
        </div>
    );
}