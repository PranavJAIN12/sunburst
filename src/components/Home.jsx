import { useState } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import data from './data.json';

const transformToSunburstData = (data) => {
  const industries = {};

  // Iterate over each company in the result array
  data.result.forEach(company => {
    const { name, score, industry_groups } = company;

    // Iterate over each industry group
    for (const industry in industry_groups) {
      if (!industries[industry]) {
        industries[industry] = {
          name: industry,
          loc: 0,
          children: []
        };
      }

      // Increment the industry total and add the company as a child
      industries[industry].loc += score;
      industries[industry].children.push({
        name: name,
        loc: score
      });
    }
  });

  // Create the root object for Sunburst
  return {
    name: "Companies",
    children: Object.values(industries)
  };
};

const Home = () => {
  const sunburstData = transformToSunburstData(data);
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <div style={{ height: '500px', width: '100%', margin:'auto' }}>
      {/* <h1>Hello</h1> */}
      <ResponsiveSunburst
        data={sunburstData}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        
       
        height={500}
        id="name"
        value="loc"
        // cornerRadius={6}
        borderWidth={2}
        borderColor={"blue"}
        colors={{ scheme: 'dark2' }}
        childColor={{ from: 'color', modifiers: [['brighter', 0.3]] }} 
        // arcLabel={"formattedValue" + "id"}
        arcLabel={node => `${node.id}: ${node.formattedValue}`} 
        enableArcLabels={true}
        arcLabelsRadiusOffset={1}
        tooltip={(node) => (
                    <div
                        style={{
                            padding: '6px 12px',
                            background: 'white',
                            color: node.color,
                            border: `1px solid ${node.color}`,
                            borderRadius: '4px',
                        }}
                    >
                        <strong>{node.id}</strong> <br />
                        Value: {node.value} <br />
                        Percentage: {Math.round(node.percentage * 100) / 100}% <br />
                        Color: {node.color}
                    </div>
                )}
        arcLabelsSkipAngle={6}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 1.4]]
        }}
          onClick={node => setSelectedNode(node)}
      />
       <div style={{ marginLeft: '20px',marginTop:'20px', padding: '10px', border: '1px solid gray', borderRadius: '8px' }}>
                {selectedNode ? (
                    <div>
                        <h3>Selected Segment</h3>
                        <p><strong>ID:</strong> {selectedNode.id}</p>
                        <p><strong>Value:</strong> {selectedNode.value}</p>
                        <p><strong>Percentage:</strong> {Math.round(selectedNode.percentage * 100) / 100}%</p>
                        <p><strong>Color:</strong> <span style={{ color: selectedNode.color }}>{selectedNode.color}</span></p>
                    </div>
                ) : (
                    <p>Click on a segment to see the details</p>
                )}
            </div>
    </div>
  );
};

export default Home;
