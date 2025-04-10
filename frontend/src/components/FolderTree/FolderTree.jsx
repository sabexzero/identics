import React, { useState } from 'react';
import './folder-tree.css';

const FolderTree = ({ folders }) => {
    const [openFolders, setOpenFolders] = useState({});

    const toggleFolder = (folderName) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folderName]: !prev[folderName],
        }));
    };

    const renderFolder = (folder) => {
        const isOpen = openFolders[folder.name];
        return (
            <div key={folder.name} className="folder">
                <div className="folder-header" onClick={() => toggleFolder(folder.name)}>
                    <span>{isOpen ? '▼' : '▶'}</span>
                    <span>{folder.name}</span>
                </div>
                {isOpen && (
                    <div className="folder-content">
                        {folder.documents.map((doc) => (
                            <div key={doc} className="document">
                                {doc}
                            </div>
                        ))}
                        {folder.subFolders && folder.subFolders.map(renderFolder)}
                    </div>
                )}
            </div>
        );
    };

    return <div className="folder-tree">{folders.map(renderFolder)}</div>;
};

export default FolderTree;
