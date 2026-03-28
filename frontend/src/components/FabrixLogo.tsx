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

    return (
        <svg width="180" height="180" viewBox="0 0 100 100">

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
            {nodes.map((node, i) => (
                <circle
                    key={i}
                    cx={node.x}
                    cy={node.y}
                    r="3.5"
                    className="node"
                    style={{
                        animationDelay: `${i * 0.2}s`, // controls wave speed/direction
                    }}
                />
            ))}

        </svg>
    );
}

export default FabrixLogo;