import React, {useContext} from 'react';
import ButterflyDagContext from './contexts/ButterflyDagContext';

interface BackgroundProps {
    type: 'line' | 'circle';
    size?: number;
    spacing?: number;
    color?: string;
    style?: React.CSSProperties;
}

export const Background = ({size = 1, spacing = 40, color = '#000', ...grid}: BackgroundProps) => {
    const {position, zoom, realPosition} = useContext(ButterflyDagContext);

    return (
        <div
            className="butterfly-dag-background"
            style={{
                backgroundSize: `${spacing * zoom}px ${spacing * zoom}px`,
                backgroundImage:
                    grid.type === 'circle'
                        ? `radial-gradient(circle, ${color} ${size}px, transparent ${size}px)`
                        : `linear-gradient(to right, transparent calc(50% - ${
                              size / 2
                          }px), ${color} calc(50% - ${size / 2}px) calc(50% + ${
                              size / 2
                          }px), transparent calc(50% + ${size / 2}px)),
                                linear-gradient(to bottom, transparent calc(50% - ${
                                    size / 2
                                }px), ${color} calc(50% - ${size / 2}px) calc(50% + ${
                              size / 2
                          }px), transparent calc(50% + ${size / 2}px))`,
                backgroundPosition: `${realPosition[0]}px ${realPosition[1]}px`,
                ...grid.style,
            }}
        >
            {position.toString()}
        </div>
    );
};
