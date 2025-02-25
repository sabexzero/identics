import React from 'react';
import './document-table.css';

const DocumentTable = ({ documents }) => {
    return (
        <table className="document-table">
            <thead>
            <tr>
                <th>Дата проверки</th>
                <th>Название документа</th>
                <th>Содержание ИИ текста</th>
                <th>Оригинальность</th>
                <th>Отчет</th>
            </tr>
            </thead>
            <tbody>
            {documents.map((doc, index) => (
                <tr key={index}>
                    <td>{doc.date}</td>
                    <td>{doc.name}</td>
                    <td>{doc.content}</td>
                    <td className={doc.originality < 50 ? 'low' : doc.originality < 75 ? 'medium' : 'high'}>
                        {doc.originality}%
                    </td>
                    <td>
                        <button className="download-btn">Скачать</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DocumentTable;
