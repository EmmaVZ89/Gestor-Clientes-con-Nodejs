"use strict";

const express = require("express");

const app = express();

app.set("puerto", 2022);

// app.get('/', (request:any, response:any)=>{
//     response.send('GET - servidor NodeJS');
// });

//AGREGO FILE SYSTEM
const fs = require("fs");

//AGREGO JSON
app.use(express.json());

//AGREGO JWT
const jwt = require("jsonwebtoken");

//SE ESTABLECE LA CLAVE SECRETA PARA EL TOKEN
app.set("key", "cl@ve_secreta");
app.use(express.urlencoded({ extended: false }));

//AGREGO MULTER
const multer = require("multer");

//AGREGO MIME-TYPES
const mime = require("mime-types");

//AGREGO STORAGE
const storage = multer.diskStorage({
    destination: "public/fotos/",
});
const upload = multer({
    storage: storage,
});

//AGREGO CORS (por default aplica a http://localhost)
const cors = require("cors");

//AGREGO MW
app.use(cors());

//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));

//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require("mysql");
const myconn = require("express-myconnection");
const db_options = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "clientes_bd",
};
app.use(myconn(mysql, db_options, "single"));

//##############################################################################################//
//RUTAS Y MIDDLEWATE PARA EL SERVIDOR DE AUTENTICACIÓN DE USUARIO Y JWT
//##############################################################################################//
const verificar_usuario = express.Router();
const verificar_jwt = express.Router();

verificar_usuario.use((request, response, next) => {
    let obj = request.body;
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("SELECT * FROM usuarios WHERE correo = ? and clave = ? ", [obj.correo, obj.clave], (err, rows) => {
            if (err)
                throw "Error en consulta de base de datos.";
            if (rows.length == 1) {
                response.obj_usuario = rows[0];
                //SE INVOCA AL PRÓXIMO CALLEABLE
                next();
            }
            else {
                response.status(401).json({
                    exito: false,
                    mensaje: "Correo y/o Clave incorrectos.",
                    jwt: null,
                });
            }
        });
    });
});

app.post("/login", verificar_usuario, (request, response, obj) => {
    //SE RECUPERA EL USUARIO DEL OBJETO DE LA RESPUESTA
    const user = response.obj_usuario;
    //SE CREA EL PAYLOAD CON LOS ATRIBUTOS QUE NECESITAMOS
    const payload = {
        usuario: {
            id: user.id,
            correo: user.correo,
            nombre: user.nombre,
            apellido: user.apellido,
            foto: user.foto,
            perfil: user.perfil,
        },
        administrador: {
            nombre: "Soledad",
            apellido: "Quiroz",
        },
        parcial: "Gestor de Clientes",
    };
    //SE FIRMA EL TOKEN CON EL PAYLOAD Y LA CLAVE SECRETA
    const token = jwt.sign(payload, app.get("key"), {
        expiresIn: "4m",
    });
    response.json({
        exito: true,
        mensaje: "JWT creado!!!",
        jwt: token,
    });
});

verificar_jwt.use((request, response, next) => {
    //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
    let token = request.headers["x-access-token"] || request.headers["authorization"];
    if (!token) {
        response.status(401).send({
            error: "El JWT es requerido!!!",
        });
        return;
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        //SE VERIFICA EL TOKEN CON LA CLAVE SECRETA
        jwt.verify(token, app.get("key"), (error, decoded) => {
            if (error) {
                return response.json({
                    exito: false,
                    mensaje: "El JWT NO es válido!!!",
                });
            }
            else {
                console.log("middleware verificar_jwt");
                //SE AGREGA EL TOKEN AL OBJETO DE LA RESPUESTA
                response.jwt = decoded;
                //SE INVOCA AL PRÓXIMO CALLEABLE
                next();
            }
        });
    }
});

app.get("/login", (request, response) => {
    // response.json({exito:true, payload: response.jwt});
    let obj_respuesta = {
        exito: false,
        mensaje: "El JWT es requerido!!!",
        payload: null,
        status: 403,
    };
    //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
    let token = request.headers["x-access-token"] || request.headers["authorization"];
    if (!token) {
        response.status(obj_respuesta.status).json({
            obj_respuesta,
        });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        //SE VERIFICA EL TOKEN CON LA CLAVE SECRETA
        jwt.verify(token, app.get("key"), (error, decoded) => {
            if (error) {
                obj_respuesta.mensaje = "El JWT NO es válido!!!";
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
            else {
                obj_respuesta.exito = true;
                obj_respuesta.mensaje = "El JWT es valido";
                obj_respuesta.payload = decoded;
                obj_respuesta.status = 200;
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
        });
    }
});


// CRUD USUARIOS **************************************************************************************
// Listar usuarios OK
app.get("/listarUsuariosBD", verificar_jwt, (request, response) => {
    let obj_respuesta = {
        exito: false,
        mensaje: "No se encontraron usuarios",
        dato: {},
        status: 424,
    };
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("SELECT * FROM usuarios", (err, rows) => {
            if (err)
                throw "Error en consulta de base de datos.";
            if (rows.length == 0) {
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
            else {
                obj_respuesta.exito = true;
                obj_respuesta.mensaje = "Usuarios encontrados!";
                obj_respuesta.dato = rows;
                obj_respuesta.status = 200;
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
        });
    });
});

// CRUD CLIENTES **************************************************************************************
// Agregar cliente
app.post("/agregarCliente", (request, response) => {
    let obj_respuesta = {
        exito: false,
        mensaje: "No se pudo agregar el cliente",
        status: 418,
    };

    let cliente_json = {};
    cliente_json.id = request.body.id;
    cliente_json.nombre = request.body.nombre;
    cliente_json.dni = request.body.dni;
    cliente_json.edad = request.body.edad;
    cliente_json.altura = request.body.altura;
    cliente_json.telefono = request.body.telefono;
    cliente_json.facebook = request.body.facebook;
    cliente_json.instagram = request.body.instagram;
    cliente_json.direccion = request.body.direccion;
    cliente_json.id_control = request.body.id;
    
    let control = request.body.control[0];
    control.id = cliente_json.id;
    
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("INSERT INTO clientes set ?", [cliente_json], (err, rows) => {
            if (err) {
                console.log(err);
                throw "Error en consulta de base de datos.";
            }
        });
    });

    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("INSERT INTO controles set ?", [control], (err, rows) => {
            if (err) {
                console.log(err);
                throw "Error en consulta de base de datos.";
            }
            obj_respuesta.exito = true;
            obj_respuesta.mensaje = "Cliente agregado!";
            obj_respuesta.status = 200;
            response.status(obj_respuesta.status).json(obj_respuesta);
        });
    });

});

// Listar clientes
app.get("/listarClientes", (request, response) => {
    let obj_respuesta = {
        exito: false,
        mensaje: "No se encontraron clientes",
        dato: {},
        status: 424,
    };
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("SELECT * FROM clientes", (err, rows) => {
            if (err)
                throw "Error en consulta de base de datos.";
            if (rows.length == 0) {
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
            else {
                obj_respuesta.exito = true;
                obj_respuesta.mensaje = "Clientes encontrados!";
                obj_respuesta.dato = rows;
                obj_respuesta.status = 200;
                response.status(obj_respuesta.status).json(rows);
            }
        });
    });
});

// Modificar juguete
app.post("/toys", upload.single("foto"), verificar_jwt, (request, response) => {
    let obj_respuesta = {
        exito: false,
        mensaje: "No se pudo modificar el juguete",
        status: 418,
    };
    let file = request.file;
    let extension = mime.extension(file.mimetype);
    let juguete = JSON.parse(request.body.juguete);
    let path = file.destination + juguete.marca + "_modificacion" + "." + extension;
    fs.renameSync(file.path, path);
    juguete.path_foto = path.split("public/")[1];
    let jueguete_modif = {};
    //para excluir la pk (id)
    jueguete_modif.marca = juguete.marca;
    jueguete_modif.precio = juguete.precio;
    jueguete_modif.path_foto = juguete.path_foto;
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("UPDATE juguetes set ?  WHERE id = ?", [jueguete_modif, juguete.id_juguete], (err, rows) => {
            if (err) {
                console.log(err);
                throw "Error en consulta de base de datos.";
            }
            if (rows.affectedRows == 0) {
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
            else {
                obj_respuesta.exito = true;
                obj_respuesta.mensaje = "Juguete modificado!";
                obj_respuesta.status = 200;
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
        });
    });
});

// Eliminar juguete
app.delete("/toys", verificar_jwt, (request, response) => {
    let obj_respuesta = {
        exito: false,
        mensaje: "No se pudo eliminar el juguete",
        status: 418,
    };
    let id = request.body.id_juguete;
    let obj = {};
    obj.id = id;
    let path_foto = "public/";
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        // obtengo el path de la foto del usuario a ser eliminado
        conn.query("SELECT path_foto FROM juguetes WHERE id = ?", [obj.id], (err, result) => {
            if (err)
                throw "Error en consulta de base de datos.";
            if (result.length != 0) {
                //console.log(result[0].foto);
                path_foto += result[0].path_foto;
            }
        });
    });
    request.getConnection((err, conn) => {
        if (err)
            throw "Error al conectarse a la base de datos.";
        conn.query("DELETE FROM juguetes WHERE id = ?", [obj.id], (err, rows) => {
            if (err) {
                console.log(err);
                throw "Error en consulta de base de datos.";
            }
            if (fs.existsSync(path_foto) && path_foto != "public/") {
                fs.unlink(path_foto, (err) => {
                    if (err)
                        throw err;
                    console.log(path_foto + " fue borrado.");
                });
            }
            if (rows.affectedRows == 0) {
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
            else {
                obj_respuesta.exito = true;
                obj_respuesta.mensaje = "Juguete Eliminado!";
                obj_respuesta.status = 200;
                response.status(obj_respuesta.status).json(obj_respuesta);
            }
        });
    });
});

app.listen(app.get("puerto"), () => {
    console.log("Servidor corriendo sobre puerto:", app.get("puerto"));
});
//# sourceMappingURL=servidor.js.map