import React, { useState } from 'react';



const TreeNode = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={'custom-tree-node'}>
      {node.name && (

      
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
        className='custom-tree-node-name'
      >
        {hasChildren ? (expanded ?
            <span className="material-symbols-outlined" translate="no" aria-hidden="true">expand_more</span> : 
            <span className="material-symbols-outlined" translate="no" aria-hidden="true">chevron_right</span>
        ):(
          <span className="material-symbols-outlined invisible" translate="no" aria-hidden="true">chevron_right</span> //to force alignement
        )} 
        {node.name}
      </div>
      )}

      {hasChildren && expanded && (
        <div className='custom-tree-children-container'>
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
    <div className='custom-tree'>
        {data.children.map((child, index) => (
            <TreeNode key={index} node={child} />
        ))}
    </div>
  );
};

export default CustomTree;
