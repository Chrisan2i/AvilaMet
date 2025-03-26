import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserById } from "../../api/users";

const defaultProfilePhoto = "https://res.cloudinary.com/do9dtxrvh/image/upload/v1742413057/Untitled_design_1_hvuwau.png";

export const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState(null);
	const [userRole, setUserRole] = useState("Excursionista");
	const [profilePhoto, setProfilePhoto] = useState(null);

	const isLoginView = location.pathname === "/login";
	const isAdmin = user && userRole === "Admin";

	useEffect(() => {
		const id = localStorage.getItem("userId");

		if (id) {
			loadUser(id);
		} else {
			setUser(null);
			setUserRole("Excursionista");
			setProfilePhoto(null);
		}
	}, []);

	const loadUser = async (id) => {
		try {
			const data = await getUserById(id);
			if (!data) {
				console.warn("Usuario no encontrado con ID:", id);
				setUser(null);
				return;
			}
			setUser(data);
			setUserRole(data.rol || "Excursionista");
			setProfilePhoto(data.fotoPerfil || defaultProfilePhoto);
		} catch (err) {
			console.error("Error cargando usuario:", err);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("userId");
		setUser(null);
		navigate("/login");
	};

	return (
		<nav className="py-3 bg-custom-yellow" style={{ height: "100px" }}>
			<div className="container d-flex justify-content-between align-items-center">
				{/* Contenedor para los logos */}
				<div className="d-flex align-items-center">
					<img
						alt="Logo de la Universidad Metropolitana"
						className="logo-universidad pb-1"
						style={{
							marginTop: "-25px",
							marginLeft: "-70px",
						}}
						src="https://res.cloudinary.com/dntc8trob/image/upload/v1740263475/Logo-unimet-6-removebg-preview_x7gf7b.png"
					/>
					<Link to="/">
						<img
							alt="Logo de ÁvilaMet"
							className="logo-universidad pb-1"
							src="https://res.cloudinary.com/dntc8trob/image/upload/v1740263488/avilamet-removebg-preview_z9fhqx.png"
							style={{ marginTop: "-25px", width: "140px", height: "140px" }}
						/>
					</Link>
				</div>

				{/* Contenedor para los enlaces de navegación */}
				<nav
					className="d-none d-md-flex align-items-center gap-5 fw-bold"
					style={{ marginLeft: "30px", marginRight: "50px", marginTop: "-25px", fontSize: "1.7rem" }}
				>
					<Link to="/destination" className="text-custom-paragraph text-decoration-none link-hover">
						Destino
					</Link>

					{user && (
						<Link
							to={isAdmin ? "/manage_reservations" : "/reservation"}
							className="text-custom-paragraph text-decoration-none link-hover"
						>
							{isAdmin ? "Reservas" : "Reservación"}
						</Link>
					)}

					{isAdmin && (
						<Link to="/management" className="text-custom-paragraph text-decoration-none link-hover">
							Gestionar
						</Link>
					)}

					<Link to="/forum" className="text-custom-paragraph text-decoration-none link-hover">
						Foro
					</Link>
					<Link to="/info" className="text-custom-paragraph text-decoration-none link-hover">
						Información
					</Link>
					<Link to="/gallery" className="text-custom-paragraph text-decoration-none link-hover">
						Galería
					</Link>
				</nav>

				{/* Sección de botones */}
				{!isLoginView && (
					<div
						className="d-flex mb-4 align-items-center gap-4"
						style={{ marginLeft: "5px", marginRight: "-50px", marginTop: "-10px" }}
					>
						{user ? (
							<>
								<Link to="/profile">
									<img
										src={profilePhoto}
										alt="Foto de perfil"
										className="rounded-circle"
										style={{
											width: "60px",
											height: "60px",
											objectFit: "cover",
											border: "2px solid #2e4e1e",
										}}
									/>
								</Link>
								<button
									onClick={handleLogout}
									className="btn-logout"
									style={{ background: "none", border: "none", padding: 0 }}
								>
									<img
										src="https://res.cloudinary.com/do9dtxrvh/image/upload/v1742317260/Untitled_design_1_rhkoqu.png"
										alt="Cerrar sesión"
										className="logout-icon"
										style={{ background: "none", border: "none", padding: 0, width: "111px", height: "111px" }}
									/>
								</button>
							</>
						) : (
							<div className="d-flex align-items-center mb-4 gap-4">
								<Link to="/login">
									<button
										className="btn btn-success bg-custom-green text-white text-custom-paragraph2"
										style={{ fontSize: "1rem" }}
									>
										Iniciar sesión
									</button>
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
