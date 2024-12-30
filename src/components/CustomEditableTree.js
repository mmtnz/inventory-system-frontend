import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';



// TreeNode Component
const TreeNode = ({ node, onAdd, onEditComplete, onDelete, depth }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const { t } = useTranslation('shared');

    return (
        <div>
            <div
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
                className="custom-tree-node-name"
            >
                {depth <=2 && (expanded ? (
                    <span className="material-symbols-outlined">expand_more</span>
                    ) : (
                    <span className="material-symbols-outlined">chevron_right</span>
                    ))}
                    <div className='custom-tree-node-name'>
                        {node.name}
                        <div className="small-icon" onClick={() => onDelete(node)}>x</div>
                    </div>
                    
            </div>
            
            <div className='custom-editable-tree-children-container'>
            {/* Render Children */}
            {hasChildren && expanded && (
            <div>
            {node.children.map((child, index) => (
                <EditableTreeNode
                    key={index}
                    node={child}
                    onAdd={onAdd}
                    onEditComplete={onEditComplete}
                    onDelete={onDelete}
                    depth={depth+1}
                />
            ))}
            </div>
            )}

            {/* Add Child Button */}
            {(expanded && (depth<=2)) && (
                <div
                    className='custom-tree-add-location'
                    onClick={() => onAdd(node)}
                >
                    + {t('addLocation')}
                </div>
            )}
            </div>
        </div>
    );
};

// EditableTreeNode Component
const EditableTreeNode = ({ node, onAdd, onEditComplete, onDelete, depth}) => {
    const [isEditing, setIsEditing] = useState(node.isEditing || false);
    const [tempName, setTempName] = useState(node.name || '');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default behavior of the Enter key
            if (tempName !== '' && !node?.children?.some(child => child.name === tempName)){
                onEditComplete(node, tempName);
                setIsEditing(false);
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

  return (
        <div className='custom-tree-node'>
            {isEditing ? (
                <div className='custom-tree-input-container'>
                    <input
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setIsEditing(false);
                        }}
                    />
                </div>
            ) : (
                <>
                {node.name && (
                    <TreeNode node={node} onAdd={onAdd} onEditComplete={onEditComplete} onDelete={onDelete} depth={depth}/>
                )}
                </>
            )}
        </div>
  );
};

// CustomTree Component
const CustomEditableTree = ({ treeData, setTreeData }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState('');
    const depth = 0;
    const { t } = useTranslation('shared');

    // Function to Add a Child Node
    const handleAddNode = (parentNode) => {
        const addNodeRecursive = (node) => {
            if (node === parentNode) {
                if (!node.children) {
                    node.children = [];
                }
                node.children.push({ name: '', isEditing: true, children: [] });
            } else if (node.children) {
                node.children.forEach((child) => addNodeRecursive(child));
            }
        };  

        setTreeData((prevTree) => {
            const newTree = { ...prevTree };
            addNodeRecursive(newTree);
            return newTree;
        });
    };

  
  // Function to Complete Editing Node
    const handleEditComplete = (node, newName) => {
        const updateNodeName = (treeNode) => {
            if (treeNode === node) {
                treeNode.name = newName;
                treeNode.isEditing = false;
            } else if (treeNode.children) {
                treeNode.children.forEach((child) => updateNodeName(child));
            }
        };

        setTreeData((prevTree) => {
            const newTree = { ...prevTree };
            updateNodeName(newTree);
            return newTree;
        });
    };

    // Function to Delete a Node
    const handleDeleteNode = (targetNode) => {
        const deleteNodeRecursive = (node) => {
            if (node.children) {
                node.children = node.children.filter((child) => child !== targetNode);
                node.children.forEach((child) => deleteNodeRecursive(child));
            }
        };

        setTreeData((prevTree) => {
            const newTree = {...prevTree}; // Deep copy to avoid mutation
            deleteNodeRecursive(newTree);
            return newTree;
        });
    };



    const handleKeyDown = (e) => {        
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default behavior of the Enter key
            if (tempName !== '' && !treeData.children.some(child => child.name === tempName)){
                setTreeData({...treeData, children: [...treeData.children, {name: tempName, children: []}]})
                setIsEditing(false);
                setTempName('')
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setTempName('')
        }

    };

    return (
        <div className='custom-editable-tree'>
            {treeData.children.map((child, index) => (
                <EditableTreeNode
                    key={index}
                    node={child}
                    onAdd={handleAddNode}
                    onEditComplete={handleEditComplete}
                    onDelete={handleDeleteNode}
                    depth={depth + 1}
                />
            ))}
            <div className='custom-tree-input-container'>
                {isEditing && (
                    <input
                        className='custom-tree-input'
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setIsEditing(false);
                            setTempName('')
                        }}
                    />
                )}
            </div>
            <div
                className='custom-tree-add-location'
                onClick={() => {
                    handleAddNode(treeData);
                    setIsEditing(true);
                }}
            >
                + {t('addLocation')}
            </div>
        </div>
    );
};

export default CustomEditableTree;
