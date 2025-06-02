import { useState } from "react";

export default function EditableTable() {
    const [rows, setRows] = useState([
        { id: 1, year: 2020, milestone: "GPT-3 megjelenése", impact: "NLP fejlődés", value: 100 },
        { id: 2, year: 2023, milestone: "GPT-4 fejlesztése", impact: "Fejlettebb AI", value: 200 },
        { id: 3, year: 2025, milestone: "AI által generált filmek", impact: "Média forradalom", value: 300 },
        { id: 4, year: 2027, milestone: "Önvezető autók", impact: "Közlekedési reform", value: 400 },
        { id: 5, year: 2030, milestone: "Teljes AI integráció", impact: "Okos társadalom", value: 500 }
    ]);

    const [newRow, setNewRow] = useState({ year: "", milestone: "", impact: "", value: "" });
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = (id) => {
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleInputChange = (e, id, field) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: e.target.value } : row));
    };

    const handleNewRowChange = (e, field) => {
        setNewRow({ ...newRow, [field]: e.target.value });
    };

    const handleAddRow = () => {
        if (isNaN(newRow.value) || newRow.value === "") {
            alert("A szam mezo szamot kell tartalmaznia!");
            return;
        }
        setRows([...rows, { id: rows.length + 1, ...newRow }]);
        setNewRow({ year: "", milestone: "", impact: "", value: "" });
    };

    const sumColumn = rows.reduce((sum, row) => sum + Number(row.value), 0);

    return (
        <div>
            <table border="1">
                <thead>
                    <tr>
                        <th>Év</th>
                        <th>Fejlődési mérföldkő</th>
                        <th>Hatás</th>
                        <th>Érték</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            <td>{editingId === row.id ? <input value={row.year} onChange={(e) => handleInputChange(e, row.id, 'year')} /> : row.year}</td>
                            <td>{editingId === row.id ? <input value={row.milestone} onChange={(e) => handleInputChange(e, row.id, 'milestone')} /> : row.milestone}</td>
                            <td>{editingId === row.id ? <input value={row.impact} onChange={(e) => handleInputChange(e, row.id, 'impact')} /> : row.impact}</td>
                            <td>{editingId === row.id ? <input value={row.value} onChange={(e) => handleInputChange(e, row.id, 'value')} /> : row.value}</td>
                            <td>
                                {editingId === row.id ? (
                                    <button onClick={() => handleSave(row.id)}>💾 Mentes</button>
                                ) : (
                                    <button onClick={() => handleEdit(row.id)}>✏️ Szerkesztes</button>
                                )}
                                <button onClick={() => handleDelete(row.id)}>❌ Torles</button>
                            </td>
                        </tr>
                    ))}
                    <tr id="final_row">
                        <td colSpan="3"><strong>Összeg:</strong></td>
                        <td id = "SUM" colSpan="2"><strong>{sumColumn}</strong></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div>
                <h3>Új sor hozzáadása</h3>
                <input placeholder="Ev" value={newRow.year} onChange={(e) => handleNewRowChange(e, 'year')} />
                <input placeholder="Fejlodesi merfoldko" value={newRow.milestone} onChange={(e) => handleNewRowChange(e, 'milestone')} />
                <input placeholder="Hatas" value={newRow.impact} onChange={(e) => handleNewRowChange(e, 'impact')} />
                <input placeholder="Ertek" value={newRow.value} onChange={(e) => handleNewRowChange(e, 'value')} />
                <button onClick={handleAddRow}>➕ Hozzáadás</button>
            </div>
        </div>
    );
}

