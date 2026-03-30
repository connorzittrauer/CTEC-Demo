/** Renders the animated Fabrix house logo. */

const nodes = [
    { x: 50, y: 15 },
    { x: 30, y: 35 },
    { x: 70, y: 35 },
    { x: 25, y: 55 },
    { x: 50, y: 55 },
    { x: 75, y: 55 },
    { x: 30, y: 75 },
    { x: 70, y: 75 },
];

const connections = [
    [0, 1], [0, 2],
    [1, 2],
    [1, 3], [2, 5],
    [3, 4], [4, 5],
    [3, 6], [5, 7],
    [6, 7],
] as const;

// Keep the pulse order fixed so the logo animation is deterministic across renders.
const orderMap: Record<number, number> = {
    0: 0,
    1: 1,
    2: 2,
    4: 3,
    3: 4,
    5: 5,
    6: 6,
    7: 7,
};

function FabrixLogo() {
    const STEP = 0.6;
    const totalDuration = nodes.length * STEP;

    return (
        <svg className="block" width="200" height="200" viewBox="0 0 100 100">

            {connections.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#C0C0C0"
                    strokeWidth="1"
                />
            ))}

            {nodes.map((node, i) => {
                const orderIndex = orderMap[i];

                return (
                    <circle
                        key={i}
                        cx={node.x}
                        cy={node.y}
                        r="4"
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
