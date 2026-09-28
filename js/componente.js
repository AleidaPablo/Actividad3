class Notificador {
    constructor() {
        this.contenedor = document.querySelector('.contenedor-avisos');
        if (!this.contenedor) {
            this.contenedor = document.createElement('div');
            this.contenedor.className = 'contenedor-avisos';
            document.body.appendChild(this.contenedor);
        }
    }
    mostrar({ mensaje = 'Aviso del Sistema', tipo = 'info', duracion = 3000 }) {
        const elementoAviso = document.createElement('div');
        elementoAviso.className = `aviso aviso-${tipo}`;
        elementoAviso.innerHTML = `<span>${mensaje}</span><button class="boton-cerrar-aviso">&times;</button>`;
        
        const botonCerrar = elementoAviso.querySelector('.boton-cerrar-aviso');
        botonCerrar.addEventListener('click', () => this.eliminarAviso(elementoAviso));
        
        this.contenedor.appendChild(elementoAviso);
        if (duracion > 0) {
            setTimeout(() => {
                this.eliminarAviso(elementoAviso);
            }, duracion);
        }
    }
    eliminarAviso(elementoAviso) {
        if (!elementoAviso || !elementoAviso.parentNode) return;
        elementoAviso.classList.add('aviso-oculto');
        setTimeout(() => {
            if (elementoAviso.parentNode) {
                elementoAviso.remove();
            }
        }, 300);
    }
}
class VentanaModal {
    constructor() {
        this.capaFondo = null;
        this.listaImagenes = [];
        this.posicionActual = 0;
    }
    abrir({ titulo = 'Galería', mensaje = '', imagenes = [], alConfirmar = null }) {
        if (this.capaFondo) this.capaFondo.remove();
        this.listaImagenes = imagenes;
        this.posicionActual = 0;
        this.capaFondo = document.createElement('div');
        this.capaFondo.className = 'fondo-modal';
        let htmlCarrusel = '';
        if (this.listaImagenes.length > 0) {
            htmlCarrusel = `
                <div class="contenedor-carrusel">
                    ${this.listaImagenes.length > 1 ? '<button class="flecha-carrusel anterior" id="botonAnterior">&lsaquo;</button>' : ''}
                    <img src="${this.listaImagenes[0]}" id="fotoGaleria" class="imagen-carrusel" alt="Foto del carrusel">
                    ${this.listaImagenes.length > 1 ? '<button class="flecha-carrusel siguiente" id="botonSiguiente">&rsaquo;</button>' : ''}
                </div>
                <div class="indicadores-carrusel" id="contenedorPuntos">
                    ${this.listaImagenes.map((_, indice) => `<span class="punto-indicador ${indice === 0 ? 'activo' : ''}"></span>`).join('')}
                </div>
            `;
        }
        this.capaFondo.innerHTML = `
            <div class="caja-modal">
                <div class="titulo-modal">${titulo}</div>
                ${htmlCarrusel}
                ${mensaje ? `<div class="mensaje-modal">${mensaje}</div>` : ''}
                <div class="acciones-modal">
                    <button class="boton-interactivo boton-cancelar-modal" id="botonCancelarModal">Cerrar</button>
                    ${alConfirmar ? `<button class="boton-interactivo boton-confirmar-modal" id="botonConfirmarModal">Aceptar</button>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(this.capaFondo);
        setTimeout(() => this.capaFondo.classList.add('visible'), 10);
        this.capaFondo.querySelector('#botonCancelarModal').addEventListener('click', () => this.cerrar());
        const botonConfirmar = this.capaFondo.querySelector('#botonConfirmarModal');
        if (botonConfirmar) {
            botonConfirmar.addEventListener('click', () => {
                if (typeof alConfirmar === 'function') alConfirmar();
                this.cerrar();
            });
        }
        if (this.listaImagenes.length > 1) {
            this.capaFondo.querySelector('#botonAnterior').addEventListener('click', () => this.cambiarImagen(-1));
            this.capaFondo.querySelector('#botonSiguiente').addEventListener('click', () => this.cambiarImagen(1));
        }
    }
    cambiarImagen(direccion) {
        this.posicionActual += direccion;
        if (this.posicionActual < 0) this.posicionActual = this.listaImagenes.length - 1;
        if (this.posicionActual >= this.listaImagenes.length) this.posicionActual = 0;

        const elementoImagen = this.capaFondo.querySelector('#fotoGaleria');
        elementoImagen.src = this.listaImagenes[this.posicionActual];

        const puntos = this.capaFondo.querySelectorAll('.punto-indicador');
        puntos.forEach((punto, indice) => {
            punto.classList.toggle('activo', indice === this.posicionActual);
        });
    }
    cerrar() {
        if (this.capaFondo) {
            this.capaFondo.classList.remove('visible');
            setTimeout(() => {
                if (this.capaFondo) this.capaFondo.remove();
            }, 300);
        }
    }
}
const notificador = new Notificador();
const modal = new VentanaModal();