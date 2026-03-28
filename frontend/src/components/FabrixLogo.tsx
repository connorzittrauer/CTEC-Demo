import { useMemo } from "react";

/**
 * FabrixLogo
 *
 * Renders a geometric, node-based house logo using SVG.
 * Nodes are animated in a randomized sequence using CSS keyframes,
 * creating a single “pulse” that traverses the structure.
 *
 * The traversal order is generated once on mount via a shuffled index map,
 * ensuring visual variation without runtime overhead.
 */
function FabrixLogo() {
    const nodes = [
        // roof
        { x: 50, y: 15 },

        // upper frame
        { x: 30, y: 35 },
        { x: 70, y: 35 },

        // mid frame
        { x: 25, y: 55 },
        { x: 50, y: 55 },
        { x: 75, y: 55 },

        // base
        { x: 30, y: 75 },
        { x: 70, y: 75 },
    ];

    const connections = [
        // roof to top
        [0, 1], [0, 2],

        // top frame
        [1, 2],

        // verticals
        [1, 3], [2, 5],

        // mid frame
        [3, 4], [4, 5],

        // base supports
        [3, 6], [5, 7],

        // bottom
        [6, 7],
    ];

    const STEP = 0.6;
    const totalDuration = nodes.length * STEP;

    const orderMap = useMemo(() => {
        const arr = [...nodes.keys()];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        const map: Record<number, number> = {};
        arr.forEach((nodeIndex, position) => {
            map[nodeIndex] = position;
        });

        return map;
    }, []);

    return (
        <svg width="200" height="200" viewBox="0 0 100 100">

            {/* CONNECTION LINES */}
            {connections.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#C0C0C0"
                    strokeWidth="1.5"
                />
            ))}

            {/* NODES */}
            {nodes.map((node, i) => {
                const orderIndex = orderMap[i];

                return (
                    <circle
                        key={i}
                        cx={node.x}
                        cy={node.y}
                        r="3.5"
                        className="node-wave"
                        style={{
                            animationDelay: `${orderIndex * STEP}s`,
                            animationDuration: `${totalDuration}s`,
                        }}
                    />
                );
            })}

        </svg>
    );
}

export default FabrixLogo;