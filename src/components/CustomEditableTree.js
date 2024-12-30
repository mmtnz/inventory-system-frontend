import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';



// TreeNode Component
const TreeNode = ({ node, onAdd, onEditComplete, onDelete, depth }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = node.children && node.children.length > 0;
    const { t } = useTranslation('shared');

    return (
        <div className="custom-tree-node">
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
                        <span className="material-symbols-outlined" onClick={() => onDelete(node)}>close</span>
                    </div>
                    
            </div>

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
                    style={{
                        cursor: 'pointer',
                        marginLeft: '20px',
                        color: 'blue',
                        fontStyle: 'italic',
                    }}
                    onClick={() => onAdd(node)}
                >
                    + {t('addLocation')}
                </div>
            )}
        </div>
    );
};

// EditableTreeNode Component
const EditableTreeNode = ({ node, onAdd, onEditComplete, onDelete, depth}) => {
    const [isEditing, setIsEditing] = useState(node.isEditing || false);
    const [tempName, setTempName] = useState(node.name || '');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (tempName !== '' && !node?.children?.some(child => child.name === tempName)){
                onEditComplete(node, tempName);
                setIsEditing(false);
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

  return (
        <div>
            {isEditing ? (
                <div className='custom-tree-node'>
                    <input
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setIsEditing(false);
                        }}
                        // style={{ marginLeft: '20px' }}
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
        if (e.key === 'Enter' && tempName !== '') {
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
        <div>
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
            <div>
                {isEditing && (
                    <input
                        autoFocus
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            setIsEditing(false);
                            setTempName('')
                        }}
                        // style={{ marginLeft: '20px' }}
                    />
                )}
            </div>
            <div
                style={{
                    cursor: 'pointer',
                    marginLeft: '20px',
                    color: 'blue',
                    fontStyle: 'italic',
                }}
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
