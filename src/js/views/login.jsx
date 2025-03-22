import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { getUsers, createUser } from "../../api/users"; // 👈 API que conecta con Mongo
import "../../styles/login.css";

const Login = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [resetPasswordEmail, setResetPasswordEmail] = useState("");

    const handleClose = () => navigate("/");

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@correo\.unimet\.edu\.ve$/.test(email);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword || !name || !lastName || !phone || !username) {
            return setError("Todos los campos son obligatorios.");
        }

        if (!validateEmail(email)) {
            return setError("El correo debe ser de dominio @correo.unimet.edu.ve.");
        }

        if (password.length < 6) {
            return setError("La contraseña debe tener al menos 6 caracteres.");
        }

        if (password !== confirmPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        try {
            const newUser = {
                nombre: name,
                apellido: lastName,
                email,
                telefono: phone,
                nombre_usuario: username,
                contraseña: password,
                rol: "Excursionista",
                fecha_creacion: new Date().toISOString(),
                fotoPerfil: ""
            };

            const userCreated = await createUser(newUser);
            localStorage.setItem("userId", userCreated.id || userCreated._id);
            actions.setUser(userCreated);
            navigate("/");
        } catch (error) {
            console.error("Error al registrar:", error);
            setError("Hubo un error al registrar. Intenta más tarde.");
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            return setError("El correo y la contraseña son obligatorios.");
        }

        try {
            const users = await getUsers();
            const foundUser = users.find((u) => u.email === email && u.contraseña === password);

            if (!foundUser) {
                return setError("Credenciales incorrectas.");
            }

            localStorage.setItem("userId", foundUser.id || foundUser._id);
            actions.setUser(foundUser);
            navigate("/");
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError("Error de servidor al iniciar sesión.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("Funcionalidad de recuperación aún no implementada en Mongo.");
    };

    const handleGoogleLogin = () => {
        setError("Inicio con Google no disponible sin Firebase.");
    };

    const handleFacebookLogin = () => {
        setError("Inicio con Facebook no disponible sin Firebase.");
    };

    // ⛔ NO TOCAMOS TU HTML ⛔
    // ... (todo el return JSX lo dejas exactamente igual como ya lo tienes)

    return (
        <div className="w-100 bg-custom-yellow">
            {/* Bienvenida e imagen */}
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-5 d-flex flex-column align-items-center mt-5">
                        <h2 className="text-center text-custom-paragraph" style={{ fontSize: '2rem' }}>
                            ¡Bienvenido a esta nueva aventura!
                        </h2>
                        <img
                            className="logo-login"
                            src="https://res.cloudinary.com/dntc8trob/image/upload/v1740263488/avilamet-removebg-preview_z9fhqx.png"
                            alt="logo avilamet"
                            style={{ height: '400px', width: '400px' }}
                        />
                    </div>
                    {/* Formulario de inicio de sesión */}
                    <div className="col-12 col-md-7 mt-5">
                        <div className="container bg-inputs borde container-width">
                            <nav className="fs-3 d-flex justify-content-center borde p-3" style={{ backgroundColor: '#fef9c3' }}>
                                <div className="nav nav-tabs bg-inputs" id="nav-tab" role="tablist">
                                    <button
                                        className="nav-link text-custom-green2"
                                        onClick={handleClose}
                                        style={{
                                            letterSpacing: '3px',
                                            fontSize: '1.5rem',
                                            position: 'relative',
                                            padding: '5px 10px',
                                            backgroundColor: 'transparent',
                                            border: '2px solid black',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '20px',
                                            width: '50px',
                                            height: '40px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        X
                                    </button>
                                    <div className="d-flex">
                                        <button
                                            className={`nav-link ${isLogin ? "active" : ""} border-end text-custom-green2`}
                                            onClick={() => setIsLogin(true)}
                                        >
                                            INICIAR SESIÓN
                                        </button>
                                        <button
                                            className={`nav-link ${!isLogin ? "active" : ""} border-end text-custom-green2`}
                                            onClick={() => setIsLogin(false)}
                                        >
                                            REGISTRATE
                                        </button>
                                    </div>
                                </div>
                            </nav>

                            <div className="tab-content mt-2" id="nav-tabContent">
                                {isResettingPassword && (
                                    <div>
                                        <form onSubmit={handleResetPassword} className="d-flex flex-column align-items-center">
                                            <input
                                                className="form-control form-control-lg inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="email"
                                                placeholder="Introduce tu correo"
                                                value={resetPasswordEmail}
                                                onChange={(e) => setResetPasswordEmail(e.target.value)}
                                            />
                                            {error && <p className="text-danger">{error}</p>}

                                            <button
                                                className="btn bg-custom-green button-width mt-3 text-custom-green2 placeholder-custom btn-hover"
                                                type="submit"
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                Restablecer Contraseña
                                            </button>

                                            <button
                                                className="btn btn-link"
                                                style={{ textDecoration: 'none', color: '#007bff', marginTop: '10px' }}
                                                onClick={() => setIsResettingPassword(false)} // Volver al inicio de sesión
                                            >
                                                Volver al inicio de sesión
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {!isResettingPassword && isLogin && (
                                    <div>
                                        <form onSubmit={handleLogin} className="d-flex flex-column align-items-center">
                                            <input
                                                className="form-control form-control-lg inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="email"
                                                placeholder="Correo"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg text-dark inputs-width borde-input mt-3 text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="password"
                                                placeholder="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {error && <p className="text-danger">{error}</p>}

                                            <button
                                                className="btn bg-custom-green button-width mt-3 text-custom-green2 placeholder-custom btn-hover"
                                                type="submit"
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                Iniciar sesión
                                            </button>

                                            {/* Botón de continuar con Google y Facebook */}
                                            <div className="container d-flex flex-column align-items-center mb-4 mt-3 text-custom-green"
                                                style={{
                                                    letterSpacing: '1px',
                                                    fontSize: '1rem',
                                                }}>
                                                <h5>--CONTINUAR CON--</h5>
                                                <div className="iconos d-flex justify-content-center">
                                                    <button onClick={handleGoogleLogin}
                                                        className="btn-social"
                                                        style={{ background: 'transparent', border: 'none', marginRight: '10px' }}>
                                                        <img
                                                            className="icono-login"
                                                            src="https://res.cloudinary.com/dntc8trob/image/upload/v1740431278/pngwing.com_5_xlprpf.png"
                                                            alt="Google login"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    </button>
                                                    <button onClick={handleFacebookLogin}
                                                        className="btn-social"
                                                        style={{ background: 'transparent', border: 'none' }}>
                                                        <img
                                                            className="icono-login2"
                                                            src="https://res.cloudinary.com/dntc8trob/image/upload/v1740431488/pngwing.com_6_jgwllf.png"
                                                            alt="Facebook login"
                                                            style={{ width: '50px', height: '50px' }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </form>

                                        {/* Enlace para restablecer la contraseña */}
                                        <div className="text-center mt-3">
                                            <button
                                                className="btn btn-link"
                                                style={{ textDecoration: 'none', color: '#007bff' }}
                                                onClick={() => setIsResettingPassword(true)} // Cambiar el estado para mostrar el formulario de restablecimiento
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {/* Validación, input, correo y contraseña - registro */}
                                {!isLogin && !isResettingPassword && (
                                    <div className="tab-pane fade show active" id="nav-profile">
                                        <form onSubmit={handleRegister} className="d-flex flex-column align-items-center">
                                            <input
                                                className="form-control form-control-lg mb-2 inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="text"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Nombre"
                                                aria-label="Nombre"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg mb-2 text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="text"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Apellido"
                                                aria-label="Apellido"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg mb-2 text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="email"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Correo"
                                                aria-label="Correo"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg mb-2 text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="tel"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Teléfono"
                                                aria-label="Teléfono"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg mb-2 text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="text"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Nombre de usuario"
                                                aria-label="Nombre de usuario"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg mb-2 text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="password"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Contraseña"
                                                aria-label="Contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <input
                                                className="form-control form-control-lg text-dark inputs-width borde-input text-custom-paragraph2 placeholder-custom input-yellow"
                                                type="password"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1rem',
                                                }}
                                                placeholder="Confirma contraseña"
                                                aria-label="Confirma contraseña"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            {error && <p className="text-danger">{error}</p>}
                                            <button className="btn bg-custom-green button-width mt-3 text-custom-green2 placeholder-custom btn-hover"
                                                type="submit"
                                                style={{
                                                    letterSpacing: '2px',
                                                    fontSize: '1.2rem',
                                                }}>
                                                Crear cuenta
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="my-5"></div>
                </div>
            </div>
        </div>
    );

};

export default Login;
