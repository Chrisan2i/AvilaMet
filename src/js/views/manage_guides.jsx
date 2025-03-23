import React, { useEffect, useState } from "react";
import {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
} from "../../api/users"; // Asegúrate de tener estas funciones

const Manage_Guides = () => {
    const [guides, setGuides] = useState([]);
    const [newGuide, setNewGuide] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        nombre_usuario: "",
        contraseña: "",
        años_experiencia: "",
        idiomas: "",
    });
    const [editingGuide, setEditingGuide] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const users = await getUsers();
            const onlyGuides = users.filter((u) => u.rol === "Guía");
            setGuides(onlyGuides);
        } catch (error) {
            console.error("Error obteniendo guías:", error);
        }
    };

    const validateInputs = () => {
        if (
            !newGuide.nombre ||
            !newGuide.apellido ||
            !newGuide.email ||
            !newGuide.nombre_usuario ||
            !newGuide.contraseña
        ) {
            setError("Todos los campos son obligatorios.");
            return false;
        }
        if (newGuide.contraseña.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        setError("");
        return true;
    };

    const addGuide = async () => {
        if (!validateInputs()) return;

        try {
            const guideData = {
                nombre: newGuide.nombre,
                apellido: newGuide.apellido,
                email: newGuide.email,
                telefono: newGuide.telefono,
                nombre_usuario: newGuide.nombre_usuario,
                contraseña: newGuide.contraseña,
                rol: "Guía",
                años_experiencia: Number(newGuide.años_experiencia),
                idiomas: newGuide.idiomas.split(",").map((i) => i.trim()),
                fecha_creacion: new Date().toISOString(),
            };

            const created = await createUser(guideData);
            setGuides([...guides, created]);

            setNewGuide({
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                nombre_usuario: "",
                contraseña: "",
                años_experiencia: "",
                idiomas: "",
            });

            setShowForm(false);
            alert("✅ Guía agregado correctamente.");
        } catch (error) {
            console.error("Error agregando guía:", error);
            alert("❌ Error al registrar el guía.");
        }
    };

    const updateGuide = async () => {
        if (
            !editingGuide.nombre ||
            !editingGuide.apellido ||
            !editingGuide.email ||
            !editingGuide.telefono
        ) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            const updated = {
                nombre: editingGuide.nombre,
                apellido: editingGuide.apellido,
                email: editingGuide.email,
                telefono: editingGuide.telefono,
                años_experiencia: Number(editingGuide.años_experiencia),
                idiomas: editingGuide.idiomas.split(",").map((i) => i.trim()),
            };

            await updateUser(editingGuide._id || editingGuide.id, updated);

            setGuides(
                guides.map((guide) =>
                    guide._id === editingGuide._id || guide.id === editingGuide.id
                        ? { ...guide, ...updated }
                        : guide
                )
            );
            setEditingGuide(null);
            alert("Guía actualizado correctamente.");
        } catch (error) {
            console.error("Error actualizando guía:", error);
        }
    };

    const deleteGuide = async (id) => {
        console.log("Eliminando guía con ID:", id); // <-- Verifica que sea correcto

        try {
            await deleteUser(id);
            setGuides(guides.filter((g) => g._id !== id));
        } catch (error) {
            console.error("Error eliminando guía:", error);
        }
    };


    return (
        <div style={{ width: "100%", backgroundColor: "#fef9c3", padding: "30px", textAlign: "center" }}>
            <div style={{ backgroundColor: "#31470b", padding: "20px", borderRadius: "10px", display: "inline-block", width: "80%", margin: "auto" }}>
                <h2 className="display-4 fw-bold text-custom-green2"
                    style={{ fontSize: "3rem", letterSpacing: '2px', color: "#fef9c3" }}>
                    Gestión de Guías
                </h2>

                <button onClick={() => setShowForm(!showForm)}
                    style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "15px" }}>
                    {showForm ? "Cancelar" : "➕ Agregar Guía"}
                </button>

                {showForm && (
                    <form onSubmit={(e) => { e.preventDefault(); addGuide(); }}
                        style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", maxWidth: "400px", margin: "auto" }}>

                        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

                        <input type="text" placeholder="Nombre" value={newGuide.nombre}
                            onChange={(e) => setNewGuide({ ...newGuide, nombre: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="text" placeholder="Apellido" value={newGuide.apellido}
                            onChange={(e) => setNewGuide({ ...newGuide, apellido: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="email" placeholder="Correo" value={newGuide.email}
                            onChange={(e) => setNewGuide({ ...newGuide, email: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="text" placeholder="Teléfono" value={newGuide.telefono}
                            onChange={(e) => setNewGuide({ ...newGuide, telefono: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="text" placeholder="Nombre de Usuario" value={newGuide.nombre_usuario}
                            onChange={(e) => setNewGuide({ ...newGuide, nombre_usuario: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={newGuide.contraseña}
                            onChange={(e) => setNewGuide({ ...newGuide, contraseña: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="number" placeholder="Años de Experiencia" value={newGuide.años_experiencia}
                            onChange={(e) => setNewGuide({ ...newGuide, años_experiencia: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <input type="text" placeholder="Idiomas (separados por coma)" value={newGuide.idiomas}
                            onChange={(e) => setNewGuide({ ...newGuide, idiomas: e.target.value })} required
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />

                        <button type="submit" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
                            Guardar Guía
                        </button>
                    </form>
                )}

                <div style={{ fontSize: "1rem", letterSpacing: '2px', marginTop: "20px" }}>
                    <h3 style={{ color: "#fef9c3", marginLeft: "10px" }}>Lista de Guías</h3>
                    {guides.map(guide => (
                        <div key={guide._id || guide.id} style={{ border: "1px solid #ddd", padding: "15px", margin: "10px auto", backgroundColor: "#fff", borderRadius: "8px", width: "300px" }}>
                            <p><strong>{guide.nombre} {guide.apellido}</strong></p>
                            <p><strong>Email:</strong> {guide.email}</p>
                            <p><strong>Teléfono:</strong> {guide.telefono}</p>
                            <p><strong>Años Experiencia:</strong> {guide.años_experiencia}</p>
                            <p><strong>Idiomas:</strong> {(guide.idiomas || []).join(", ")}</p>

                            <button onClick={() => setEditingGuide(guide)}
                                style={{ backgroundColor: "orange", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>
                                ✏️ Editar
                            </button>
                            <button onClick={() => deleteGuide(guide._id || guide.id)}
                                style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>
                                ❌ Eliminar
                            </button>
                        </div>
                    ))}
                </div>

                {editingGuide && (
                    <form onSubmit={(e) => { e.preventDefault(); updateGuide(); }}
                        style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", maxWidth: "400px", margin: "20px auto" }}>
                        <h4>Editar Guía</h4>
                        <input type="text" placeholder="Nombre" value={editingGuide.nombre}
                            onChange={(e) => setEditingGuide({ ...editingGuide, nombre: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="text" placeholder="Apellido" value={editingGuide.apellido}
                            onChange={(e) => setEditingGuide({ ...editingGuide, apellido: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="email" placeholder="Correo" value={editingGuide.email}
                            onChange={(e) => setEditingGuide({ ...editingGuide, email: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="text" placeholder="Teléfono" value={editingGuide.telefono}
                            onChange={(e) => setEditingGuide({ ...editingGuide, telefono: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="number" placeholder="Años de Experiencia" value={editingGuide.años_experiencia}
                            onChange={(e) => setEditingGuide({ ...editingGuide, años_experiencia: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <input type="text" placeholder="Idiomas (separados por coma)" value={editingGuide.idiomas}
                            onChange={(e) => setEditingGuide({ ...editingGuide, idiomas: e.target.value })}
                            style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "100%" }} />
                        <button type="submit"
                            style={{ marginTop: "10px", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
                            Guardar Cambios
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Manage_Guides;