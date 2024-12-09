import React, { useState } from 'react';



const TreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={'custom-tree-node'}>
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
        className='custom-tree-node-name'
      >
        {hasChildren && (expanded ?
            <span className="material-symbols-outlined">expand_more</span> : 
            <span className="material-symbols-outlined">chevron_right</span>)} {node.name}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const CustomTree = ({data}) => {
  return (
    <div>
        {data.children.map((child, index) => (
            <TreeNode key={index} node={child} />
        ))}
    </div>
  );
};

export default CustomTree;
