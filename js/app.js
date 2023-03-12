//Variables

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')

//Eventos
eventListener();

function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);

}

//classes
class Presupuesto{
    constructor(presupuesto){

        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gatos = [];
    }

    nuevoGasto(gasto){
        this.gatos = [...this.gatos, gasto]
        this.calcularRestante(this.gatos)
    }
    calcularRestante(){
        const gastado = this.gatos.reduce((total, gasto) => total + gasto.cantidad, 0 );
        console.log(gastado)
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gatos = this.gatos.filter(gastos => gastos.id != id)
        this.calcularRestante(this.gatos);
    }
}

class UI {

    //Metodo de la clase
    insertarPresupuesto(cantidad){

        // Extraer el valor
        const {presupuesto, restante} = cantidad;

        //Agregar al html

        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
        
        
    }

    // Metodo de la clase ui
    imprimirAlerta(mensaje, tipo){

        //crear un div

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }

        // mensaje error

        divMensaje.textContent = mensaje;
        
        // insertar en el html5
        
        document.querySelector('.primario').insertBefore(divMensaje, formulario)
        
        //quitar htndaje

        setTimeout(() => {
            divMensaje.remove();
        },3000)

    }


    mostrarGastos(gatos){
       // limpiar html

       this.limpiarHtnl()
       
       //Iteramos sobre los gastos
       gatos.forEach( gasto => {
           const {cantidad, nombre, id} = gasto;

        //crear el li
        const nuevoGasto = document.createElement('li');
        nuevoGasto.className = 'list-group-item d-flex justify-content-between aling-items-center';
        nuevoGasto.dataset.id = id;

        // Agreagr el html del gasto
        nuevoGasto.innerHTML = `${nombre}: $<span class="badge badge-primary badge-pill "> ${cantidad} </span>
        `;
        //Boton paea borrar el gasto

        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
        btnBorrar.innerHTML = 'Borrar &times;'
        btnBorrar.onclick = () => {
            eliminarGasto(id)
        }
        nuevoGasto.appendChild(btnBorrar);

        //Agregar al html

        gastoListado.appendChild(nuevoGasto)

       } )
    }

    //eliminar html
    limpiarHtnl(){

        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    //Actualizar Restante

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    //Comprobar presupiuesto

    comprobarPresupuesto(presupuestoOBJ){
        const {presupuesto, restante} = presupuestoOBJ;
        const restanteDiv = document.querySelector('.restante')

        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto / 2) >= restante){
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');

        }

        // comprobar si el presupuesto se ha goto
        if(restante <=0 ){
            ui.imprimirAlerta('el presupueto se es insufisiente','error')
           formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }   
    
}
//instanciar

const ui = new UI();

// iniciamos una variable, sin valor para despues pasarle el valor ya que al instanciar devemos pasar el valor 

let presupuesto;

//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('cual es tu presupuesrto');
 //  console.log(Number(presupuestoUsuario))

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){

        // recarga la ventana actual
        window.location.reload();

    }


    presupuesto = new Presupuesto(presupuestoUsuario)
    ui.insertarPresupuesto(presupuesto)
}

//Añade el gasto

function agregarGasto(e){
   // e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // validar

    if (nombre === '' || cantidad === '') {
        
        ui.imprimirAlerta('Anbos campos son obligatorios', 'error')
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error')
        return;
    }

    // Generar un objeto con el gasto
    const gasto = {
        nombre, 
        cantidad,
        id: Date.now(),
    }

    presupuesto.nuevoGasto(gasto)

    //Alerta al agregar un gasto
    ui.imprimirAlerta('Gasto agregado correctamente')

    //Impriri gastos
    const {gatos, restante} = presupuesto
    
    ui.mostrarGastos(gatos)

    //
    ui.actualizarRestante(restante)

    // Resetear el formulario
    formulario.reset();

    // comprobar presupuesto

    ui.comprobarPresupuesto(presupuesto)
    // eliminar gasto

    
}
function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    const {gatos, restante} = presupuesto;
    ui.mostrarGastos(gatos)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}