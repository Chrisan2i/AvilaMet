import React, { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePostById } from '../../api/posts';
import { getUserById } from '../../api/users';
import axios from 'axios';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ text: '', image: null });
    const [user, setUser] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const defaultProfilePhoto = "https://res.cloudinary.com/do9dtxrvh/image/upload/v1742413057/Untitled_design_1_hvuwau.png";

    useEffect(() => {
        const fetchUser = async () => {
            const id = localStorage.getItem("userId");
            if (id) {
                const userData = await getUserById(id);
                setUser({ ...userData, uid: id }); // simula estructura de Firebase auth
            }
        };

        const fetchPosts = async () => {
            const postList = await getPosts();
            const sorted = postList.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(sorted);
        };

        fetchUser();
        fetchPosts();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) setNewPost({ ...newPost, image: file });
    };

    const handlePostSubmit = async () => {
        if (!user) return alert("Debes iniciar sesión para publicar.");

        let imageUrl = '';
        if (newPost.image) {
            const formData = new FormData();
            formData.append("file", newPost.image);
            formData.append("upload_preset", "mi_preset");

            try {
                const response = await axios.post("https://api.cloudinary.com/v1_1/dhlyuaknz/image/upload", formData);
                imageUrl = response.data.secure_url;
            } catch (error) {
                console.error("Error subiendo imagen:", error);
            }
        }

        const postData = {
            text: newPost.text,
            image: imageUrl,
            date: new Date().toISOString(),
            user: user.nombre_usuario || user.nombre || "Usuario",
            userPhoto: user.fotoPerfil || defaultProfilePhoto,
            userId: user.uid,
            comments: [],
            likes: 0,
            likedBy: [],
        };

        await createPost(postData);
        const updated = await getPosts();
        setPosts(updated.reverse());
        setNewPost({ text: '', image: null });
    };

    const handleAddComment = async (index, comment) => {
        if (!user) return alert("Debes iniciar sesión para comentar.");
        if (!comment.trim()) return;

        const updatedPosts = [...posts];
        const post = updatedPosts[index];

        const newComment = {
            text: comment,
            user: user.nombre_usuario || user.nombre,
            userId: user.uid,
            date: new Date().toLocaleString(),
        };

        post.comments.push(newComment);
        setPosts(updatedPosts);
        await updatePost(post._id || post.id, { comments: post.comments });
    };

    const handleDeleteComment = async (postIndex, commentIndex) => {
        const post = posts[postIndex];
        const comment = post.comments[commentIndex];

        if (!user || comment.userId !== user.uid) {
            return alert("Solo puedes borrar tus propios comentarios.");
        }

        post.comments.splice(commentIndex, 1);
        setPosts([...posts]);
        await updatePost(post._id || post.id, { comments: post.comments });
    };

    const handleLike = async (index) => {
        if (!user) return alert("Debes iniciar sesión para dar like.");

        const updatedPosts = [...posts];
        const post = updatedPosts[index];
        const userLiked = post.likedBy.includes(user.uid);

        if (userLiked) {
            post.likes -= 1;
            post.likedBy = post.likedBy.filter(id => id !== user.uid);
        } else {
            post.likes += 1;
            post.likedBy.push(user.uid);
        }

        setPosts(updatedPosts);
        await updatePost(post._id || post.id, {
            likes: post.likes,
            likedBy: post.likedBy
        });
    };

    const handleShare = (index) => {
        const postUrl = `${window.location.href}#post-${index}`;
        navigator.clipboard.writeText(postUrl);
        alert("¡Enlace copiado!");
    };

    const handleDeletePost = async (postId) => {
        const post = posts.find(p => p._id === postId || p.id === postId);
        if (!user || post.userId !== user.uid) return alert("Solo puedes borrar tus propias publicaciones.");

        if (window.confirm("¿Eliminar publicación?")) {
            await deletePostById(postId);
            setPosts(posts.filter(p => p._id !== postId && p.id !== postId));
        }
    };

    const handleEditPost = (postId, currentText) => {
        setEditingPostId(postId);
        setEditedText(currentText);
    };

    const handleSaveEdit = async (postId) => {
        const post = posts.find(p => p._id === postId || p.id === postId);
        if (!user || post.userId !== user.uid) return alert("Solo puedes editar tus publicaciones.");
        if (!editedText.trim()) return alert("Texto vacío.");

        await updatePost(postId, { text: editedText });
        const updated = posts.map(p => p._id === postId || p.id === postId ? { ...p, text: editedText } : p);
        setPosts(updated);
        setEditingPostId(null);
        setEditedText('');
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditedText('');
    };

    return (
        <div style={{ backgroundColor: '#fbfada', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif', padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '900px', width: '100%', display: 'flex' }}>
                <div style={{ flex: '3' }}>
                    <h1 style={{ textAlign: 'center', color: '#2e3b4e', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
                        Bienvenido al foro de AVILAMET
                    </h1>

                    <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#fbfada', padding: '16px', borderRadius: '8px', border: '2px solid #2e4e1e' }}>
                        <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/685/685655.png" alt="Cámara" style={{ width: '40px', height: '40px' }} />
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <textarea
                            placeholder="Comparte tu experiencia en la montaña..."
                            value={newPost.text}
                            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                        />
                        {newPost.image && <img src={URL.createObjectURL(newPost.image)} alt="Vista previa" style={{ borderRadius: '8px', width: '100%' }} />}
                        <button onClick={handlePostSubmit} style={{ padding: '8px 16px', backgroundColor: '#2e4e1e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Publicar</button>
                    </div>

                    {posts.map((post, index) => (
                        <div key={index} id={`post-${index}`} style={{ maxWidth: '640px', margin: '16px auto', backgroundColor: '#fbfada', padding: '16px', borderRadius: '8px', border: '2px solid #2e4e1e' }}>
                            {post.image && <img src={post.image} alt="Imagen del post" style={{ borderRadius: '8px', width: '100%' }} />}
                            <p>
                                <img
                                    src={post.userPhoto || defaultProfilePhoto} // Mostrar la foto de perfil
                                    alt="Foto de perfil"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }}
                                />
                                <strong>{post.user}</strong> publicó:
                            </p>
                            {editingPostId === post.id ? (
                                <div>
                                    <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
                                    />
                                    <button onClick={() => handleSaveEdit(post.id)} style={{ padding: '4px 8px', backgroundColor: '#2e4e1e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                                        Guardar
                                    </button>
                                    <button onClick={handleCancelEdit} style={{ padding: '4px 8px', backgroundColor: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <p>{post.text}</p>
                            )}
                            <p style={{ fontSize: '12px', color: '#888' }}>Publicado el: {post.date}</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button onClick={() => handleLike(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    ❤️ {post.likes}
                                </button>
                                <button onClick={() => handleShare(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    📤 Compartir
                                </button>
                                <span>🗨 {post.comments.length}</span>
                                {user && post.userId === user.uid && (
                                    <>
                                        <button
                                            onClick={() => handleEditPost(post.id, post.text)}
                                            style={{ background: 'none', border: 'none', color: '#2e4e1e', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </div>

                            {post.comments.length > 0 && <hr style={{ margin: '8px 0', border: '1px solid #2e4e1e' }} />}

                            <div style={{ marginTop: '8px' }}>
                                {post.comments.map((comment, idx) => (
                                    <div key={idx} style={{ fontSize: '14px', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>
                                            🗨 <strong>{comment.user}</strong>: {comment.text} <span style={{ fontSize: '12px' }}>({comment.date})</span>
                                        </span>
                                        {user && comment.userId === user.uid && (
                                            <button
                                                onClick={() => handleDeleteComment(index, idx)}
                                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '12px' }}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <textarea
                                    placeholder="Agrega un comentario..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(index, e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    style={{ width: '100%', padding: '8px', marginTop: '8px' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ flex: '1', padding: '16px' }}>
                    <h2 style={{ textAlign: 'center', color: '#2e3b4e', fontWeight: 'bold' }}>Promociones</h2>
                    <p style={{ textAlign: 'center' }}>¡Ofertas exclusivas para montañistas!</p>
                </div>
            </div>
        </div>
    );
};

export default Forum;