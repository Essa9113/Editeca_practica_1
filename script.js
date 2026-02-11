// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Resaltar página actual en navegación
    resaltarPaginaActual();
    
    // 2. Validación de formulario (solo en página contacto)
    const formulario = document.getElementById('formulario-contacto');
    if (formulario) {
        formulario.addEventListener('submit', validarFormulario);
    }
    
    // 3. Filtro de proyectos (solo en página proyectos)
    if (window.location.pathname.includes('proyectos')) {
        crearFiltroProyectos();
    }
    
    // 4. Animación de entrada para elementos
    animarElementos();
    
    // 5. Botón volver arriba
    crearBotonVolverArriba();
    
    // 6. Efecto hover suave en tarjetas de servicios
    aplicarEfectosHover();
});

/* ===== FUNCIÓN 1: RESALTAR PÁGINA ACTUAL ===== */
function resaltarPaginaActual() {
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    const enlaces = document.querySelectorAll('nav a');
    
    enlaces.forEach(enlace => {
        if (enlace.getAttribute('href') === paginaActual) {
            enlace.style.backgroundColor = '#34495e';
        }
    });
}

/* ===== FUNCIÓN 2: VALIDAR FORMULARIO DE CONTACTO ===== */
function validarFormulario(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    // Validaciones
    if (nombre.length < 3) {
        mostrarMensaje('El nombre debe tener al menos 3 caracteres', 'error');
        return false;
    }
    
    if (!validarEmail(email)) {
        mostrarMensaje('Por favor, introduce un email válido', 'error');
        return false;
    }
    
    if (mensaje.length < 10) {
        mostrarMensaje('El mensaje debe tener al menos 10 caracteres', 'error');
        return false;
    }
    
    // Si todo es válido
    mostrarMensaje('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'exito');
    document.getElementById('formulario-contacto').reset();
    
    return false;
}

// Validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Mostrar mensaje al usuario
function mostrarMensaje(texto, tipo) {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-usuario');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-usuario';
    mensaje.textContent = texto;
    mensaje.style.padding = '1.5rem';
    mensaje.style.marginTop = '1.5rem';
    mensaje.style.borderRadius = '8px';
    mensaje.style.fontWeight = '600';
    mensaje.style.textAlign = 'center';
    mensaje.style.fontSize = '1.1rem';
    mensaje.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    
    if (tipo === 'error') {
        mensaje.style.backgroundColor = '#ff6b6b';
        mensaje.style.color = '#fff';
    } else {
        mensaje.style.backgroundColor = '#51cf66';
        mensaje.style.color = '#fff';
    }
    
    const formulario = document.getElementById('formulario-contacto');
    formulario.parentNode.insertBefore(mensaje, formulario.nextSibling);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        mensaje.style.transition = 'opacity 0.5s';
        mensaje.style.opacity = '0';
        setTimeout(() => mensaje.remove(), 500);
    }, 5000);
}

/* ===== FUNCIÓN 3: CREAR FILTRO DE PROYECTOS ===== */
function crearFiltroProyectos() {
    const main = document.querySelector('main');
    const primerSeccion = main.querySelector('section');
    
    // Crear contenedor de filtros
    const filtroDiv = document.createElement('div');
    filtroDiv.className = 'filtro-proyectos';
    filtroDiv.style.marginBottom = '2rem';
    filtroDiv.style.textAlign = 'center';
    filtroDiv.style.padding = '1.5rem';
    filtroDiv.style.backgroundColor = '#f9f9f9';
    filtroDiv.style.borderRadius = '8px';
    
    filtroDiv.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #2c3e50;">Filtrar por año:</h3>
        <button class="filtro-btn" data-año="todos">Todos</button>
        <button class="filtro-btn" data-año="2024">2024</button>
        <button class="filtro-btn" data-año="2023">2023</button>
        <button class="filtro-btn" data-año="2022">2022</button>
    `;
    
    primerSeccion.insertBefore(filtroDiv, primerSeccion.firstChild);
    
    // Estilos para botones de filtro
    const botonesEstilo = document.createElement('style');
    botonesEstilo.textContent = `
        .filtro-btn {
            background-color: #95a5a6;
            color: white;
            padding: 0.7rem 1.5rem;
            margin: 0.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .filtro-btn:hover {
            background-color: #7f8c8d;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .filtro-btn.activo {
            background-color: #667eea;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(botonesEstilo);
    
    // Añadir eventos a botones
    const botonesFiltro = document.querySelectorAll('.filtro-btn');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            // Actualizar botón activo
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            
            const añoSeleccionado = this.getAttribute('data-año');
            filtrarProyectosPorAño(añoSeleccionado);
        });
    });
    
    // Marcar "Todos" como activo por defecto
    botonesFiltro[0].classList.add('activo');
}

// Filtrar proyectos por año
function filtrarProyectosPorAño(año) {
    const articulos = document.querySelectorAll('article');
    
    articulos.forEach(articulo => {
        const textoArticulo = articulo.textContent;
        
        if (año === 'todos') {
            articulo.style.display = 'block';
            articulo.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            if (textoArticulo.includes('Año: ' + año)) {
                articulo.style.display = 'block';
                articulo.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                articulo.style.display = 'none';
            }
        }
    });
}

/* ===== FUNCIÓN 4: ANIMAR ELEMENTOS AL CARGAR ===== */
function animarElementos() {
    const articulos = document.querySelectorAll('article');
    const servicios = document.querySelectorAll('.servicio-card');
    const infoItems = document.querySelectorAll('.info-item');
    
    // Animar artículos
    articulos.forEach((articulo, index) => {
        articulo.style.opacity = '0';
        articulo.style.transform = 'translateY(30px)';
        articulo.style.transition = 'opacity 0.6s, transform 0.6s';
        
        setTimeout(() => {
            articulo.style.opacity = '1';
            articulo.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animar servicios
    servicios.forEach((servicio, index) => {
        servicio.style.opacity = '0';
        servicio.style.transform = 'translateY(30px)';
        servicio.style.transition = 'opacity 0.6s, transform 0.6s';
        
        setTimeout(() => {
            servicio.style.opacity = '1';
            servicio.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animar items de información
    infoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = 'opacity 0.6s, transform 0.6s';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, index * 150);
    });
}

/* ===== FUNCIÓN 5: CREAR BOTÓN VOLVER ARRIBA ===== */
function crearBotonVolverArriba() {
    const boton = document.createElement('button');
    boton.innerHTML = '↑';
    boton.className = 'boton-arriba';
    boton.setAttribute('aria-label', 'Volver arriba');
    boton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 55px;
        height: 55px;
        font-size: 28px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    `;
    
    document.body.appendChild(boton);
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            boton.style.display = 'block';
            setTimeout(() => {
                boton.style.opacity = '1';
            }, 10);
        } else {
            boton.style.opacity = '0';
            setTimeout(() => {
                boton.style.display = 'none';
            }, 300);
        }
    });
    
    // Funcionalidad del botón
    boton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Efectos hover
    boton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#5568d3';
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
    });
    
    boton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#667eea';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
}

/* ===== FUNCIÓN 6: APLICAR EFECTOS HOVER ===== */
function aplicarEfectosHover() {
    // Efecto en tarjetas de servicio
    const servicios = document.querySelectorAll('.servicio-card');
    servicios.forEach(servicio => {
        servicio.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.querySelector('h3').style.color = '#fff';
            this.querySelector('p').style.color = '#fff';
        });
        
        servicio.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            this.querySelector('h3').style.color = '#667eea';
            this.querySelector('p').style.color = '#333';
        });
    });
    
    // Efecto en items de información de contacto
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.querySelector('h3').style.color = '#fff';
            this.querySelector('p').style.color = '#fff';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            this.querySelector('h3').style.color = '#667eea';
            this.querySelector('p').style.color = '#333';
        });
    });
}

/* ===== FUNCIÓN EXTRA: SMOOTH SCROLL PARA NAVEGACIÓN ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===== CONSOLA: MENSAJE DE BIENVENIDA ===== */
console.log('%c¡Bienvenido al Portfolio de Arquitectura! 🏗️', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cSitio desarrollado con HTML, CSS y JavaScript', 'color: #764ba2; font-size: 14px;');
