import type { Chart } from '../types';

interface ChartCardProps {
    chart: Chart;
    onClick: (chart: Chart) => void;
}

export default function ChartCard({ chart, onClick }: ChartCardProps) {
    return (
        <div 
            className="chart-card"
            onClick={() => onClick(chart)}
            title={`Click for YouTube: ${chart.song.name}`}
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
    );
}