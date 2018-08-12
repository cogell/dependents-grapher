import React from 'react';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkHorizontal } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';
import rawDependents from './data/raw-dependents.json';
// import getRawDependents from './get-raw-dependents';

const input = {
  filename: './example/src/App.js',
  directory: './example/src/',
}

// const rawDependents = getRawDependents(input);

const rawDependentsOld = {
  name: "App.js",
  children: [{
    name: "App.test.js"
  },{
    name: "index.js"
  }]
}

const raw = {
  "name": "T",
  "children": [{
    "name": "A",
    "children": [
      { "name": "A1" },
      { "name": "A2" },
      { "name": "A3" },
      { "name": "C",
        "children": [{
          "name": "C1",
        }, {
          "name": "D",
          "children": [{
            "name": "D1"
          },{
            "name": "D2"
          },{
            "name": "D3"
          }]
        }]
      },
    ]},
    { "name": "Z" },
    {
      "name": "B",
      "children": [
        { "name": "B1"},
        { "name": "B2"},
        { "name": "B3"},
      ]},
  ],
};

function Node({ node, events }) {
  const width = 40;
  const height = 20;
  return (
    <Group top={node.x} left={node.y}>
      {node.depth === 0 &&
      <circle
        r={12}
        fill={"#00aa00"}
      />
      }
      {node.depth !== 0 &&
      <rect
        height={height}
        width={width}
        y={-height / 2}
        x={-width / 2}
        fill={"#272b4d"}
        stroke={node.children ? "#03c0dc" : "#26deb0"}
        strokeWidth={1}
        strokeDasharray={!node.children ? "2,2" : "0"}
        strokeOpacity={!node.children ? .6 : 1}
        rx={!node.children ? 10 : 0}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`)
        }}
      />
      }
      <text
        dy={".33em"}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={"middle"}
        style={{ pointerEvents: "none" }}
        fill={node.depth === 0 ? "#71248e" : node.children ? "white" : "#26deb0"}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function Link({ link }) {
  return (
    <LinkHorizontal
      data={link}
      stroke="#374469"
      strokeWidth="1"
      fill="none"
    />
  );
}

export default ({
                  width,
                  height,
                  events = false,
                  margin = {
                    top: 10,
                    left: 30,
                    right: 40,
                    bottom: 80,
                  }
                }) => {
  const data = hierarchy(rawDependents);
  return (
    <svg width={width} height={height}>
      <rect
        width={width}
        height={height}
        rx={14}
        fill="#272b4d"
      />
      <Tree
        top={margin.top}
        left={margin.left}
        root={data}
        size={[
          height - margin.top - margin.bottom,
          width - margin.left - margin.right
        ]}
        nodeComponent={Node}
        linkComponent={Link}
      />
    </svg>
  );
}
