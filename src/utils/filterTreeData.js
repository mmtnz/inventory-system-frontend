const filterTreeData = (node) => {
    // If the node's name is empty, return null
    if (node.name === '') {
        return null;
    }

    // Filter the children recursively
    const filteredChildren = node.children
        .map(filterTreeData) // Apply the filtering to each child
        .filter((child) => child !== null); // Remove null results

    // Return a new node with filtered children
    return {
        ...node,
        children: filteredChildren,
    };
};
export default filterTreeData;