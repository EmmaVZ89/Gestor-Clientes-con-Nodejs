class Cliente {
  constructor(id, nombre, dni, edad, altura, telefono, facebook, instagram, direccion, control, estado) {
    this.id = id;
    this.nombre = nombre;
    this.dni = dni;
    this.edad = edad;
    this.altura = altura;
    this.telefono = telefono;
    this.facebook = facebook;
    this.instagram = instagram;
    this.direccion = direccion;
    this.control = control;
    this.estado = estado;
  }
}

class Control {
  constructor(fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslos, objetivo) {
    this.fecha = fecha;
    this.peso = peso;
    this.pecho = pecho;
    this.cintura = cintura;
    this.ombligo = ombligo;
    this.cadera = cadera;
    this.biceps = biceps;
    this.muslos = muslos;
    this.objetivo = objetivo;
  }
}

class Ficha {
  constructor(id, cliente, control) {
    this.id = id;
    this.cliente = cliente;
    this.control.push(control);
  }
}
export { Cliente, Control, Ficha };
