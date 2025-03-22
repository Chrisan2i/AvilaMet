import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserById, updateUser } from "../../api/users";
import { getPostsByUserId, updatePost } from "../../api/posts";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editedData, setEditedData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fotoPerfil: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            try {
                const user = await getUserById(userId);
                setUserData(user);
                setEditedData({
                    nombre: user.nombre || "",
                    apellido: user.apellido || "",
                    email: user.email || "",
                    telefono: user.telefono || "",
                    fotoPerfil: user.fotoPerfil || ""
                });
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        };

        fetchUser();
    }, []);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            const updated = await updateUser(userId, editedData);
            setUserData((prev) => ({ ...prev, ...editedData }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar datos:", error);
        }
    };

    const updateUserPhotoInPosts = async (userId, newPhotoUrl) => {
        try {
            const posts = await getPostsByUserId(userId);
            await Promise.all(posts.map((post) =>
                updatePost(post._id || post.id, { userPhoto: newPhotoUrl })
            ));
        } catch (error) {
            console.error("Error al actualizar foto en los posts:", error);
        }
    };

    const handleChangePhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "mi_preset"); // <-- tu preset de Cloudinary

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dhlyuaknz/image/upload", // <-- tu Cloud name
                formData
            );

            const imageUrl = response.data.secure_url;
            const userId = localStorage.getItem("userId");

            await updateUser(userId, { fotoPerfil: imageUrl });
            setUserData((prev) => ({ ...prev, fotoPerfil: imageUrl }));
            setEditedData((prev) => ({ ...prev, fotoPerfil: imageUrl }));

            await updateUserPhotoInPosts(userId, imageUrl);
        } catch (error) {
            console.error("Error al subir imagen:", error);
        }

        setUploading(false);
    };


    return (
        <div className="profile d-flex flex-column align-items-center"
            style={{ backgroundColor: "#fef9c3", padding: "20px", minHeight: "70vh" }}>
            <div className="d-flex flex-column align-items-center justify-content-center text-custom-green"
                style={{
                    maxWidth: "70%",
                    width: "60%",
                    backgroundColor: "#f1f6aa",
                    borderRadius: "15px",
                    padding: "20px",
                    border: "3px solid #31470b",
                    position: "relative"
                }}>
                <button
                    onClick={() => window.location.href = "/"}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#31470b"
                    }}>✖</button>

                <h2 style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "2rem",
                    color: "#31470b",
                }}>CONFIGURACIÓN DE PERFIL</h2>

                <hr style={{ width: "100%", borderTop: "3px solid #31470b", marginTop: "40px", marginBottom: "20px" }} />

                <div className="d-flex align-items-center justify-content-center">
                    <div className="d-flex flex-column" style={{ marginRight: "20px" }}>
                        <input className="inputs-width input-yellow" style={inputStyle}
                            name="nombre" value={editedData.nombre} onChange={handleChange} disabled={!isEditing} placeholder="Nombre" />
                        <input className="inputs-width input-yellow" style={inputStyle}
                            name="apellido" value={editedData.apellido} onChange={handleChange} disabled={!isEditing} placeholder="Apellido" />
                        <input className="inputs-width input-yellow" style={inputStyle}
                            name="email" value={editedData.email} onChange={handleChange} disabled={!isEditing} placeholder="Correo" />
                        <input className="inputs-width input-yellow" style={inputStyle}
                            name="telefono" value={editedData.telefono} onChange={handleChange} disabled={!isEditing} placeholder="Teléfono" />

                        <button className="btn button-width btn-hover"
                            onClick={isEditing ? handleSaveChanges : handleEditToggle} style={buttonStyle}>
                            {isEditing ? "Guardar Cambios" : "Editar"}
                        </button>
                    </div>

                    <div className="d-flex flex-column align-items-center">
                        <div className="ellipse-6"
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                backgroundColor: "#31470b",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            {editedData.fotoPerfil ? (
                                <img src={editedData.fotoPerfil} alt="Perfil"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <i className="fas fa-user"
                                    style={{ fontSize: "80px", color: "#fef9c3" }} aria-hidden="true"></i>
                            )}
                        </div>

                        <input type="file" accept="image/*" onChange={handleChangePhoto} style={{ display: "none" }} id="fileInput" />
                        <button className="btn btn-hover button-width"
                            onClick={() => document.getElementById("fileInput").click()} style={buttonStyle}>
                            {uploading ? "Subiendo..." : "Cambiar Foto"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = { backgroundColor: "#a2a87b", borderRadius: "5px", paddingLeft: "10px" };
const buttonStyle = { backgroundColor: "#31470b", color: "#fef9c3", borderRadius: "5px" };

export default Profile;