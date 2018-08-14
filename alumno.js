


'use strict'
const colors = require('colors')
const read = require('readline-sync')
const moment = require('moment')
const mongoose = require('mongoose')

const dbURI = 'mongodb://localhost:27017/control-escolar'
mongoose.Promise = global.Promise

const Schema = mongoose.Schema
let alumnoSchema = new Schema({
  matricula: Number,
  curp: String,
  nombre: String,
  apellidoPaterno: String,
  apellidoMaterno: String,
  genero: String,
  fechaNacimiento: String,
  edad: Number
})

class alumno {

  constructor () {
    this.matricula = 0
    this.curp = ''
    this.nombre = ''
    this.apellidoPaterno = ''
    this.apellidoMaterno = ''
    this.genero = ''
    this.fechaNacimiento = ''
    this.estatus = ''
  }
  getEdad () {
    let nacimiento = moment(this.fechaNacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD')
    let hoy = moment()
    let anios = hoy.diff(nacimiento, 'years')

    // return `${anios.toString()} Años`
    return anios
  }
  getNombreCompleto () {
    return `${this.nombre} ${this.apellidoPaterno} ${this.apellidoMaterno}`
  }
  getDatos () {
    let objAlumno = {}
    // Matricula
    console.log(`${colors.gray.bold('Matricula: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.matricula) : ''}`)
    objAlumno.matricula = read.question()
    this.matricula = objAlumno.matricula !== '' ? objAlumno.matricula : this.matricula
    // CURP
    console.log(`${colors.gray.bold('CURP: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.curp) : ''}`)
    objAlumno.curp = read.question()
    this.curp = objAlumno.curp !== '' ? objAlumno.curp : this.curp
    // Nombre
    console.log(`${colors.gray.bold('Nombre(s): ')} ${this.estatus === 'Editar' ? colors.white.bold(this.nombre) : ''}`)
    objAlumno.nombre = read.question()
    this.nombre = objAlumno.nombre !== '' ? objAlumno.nombre : this.nombre
    // Apellido Paterno
    console.log(`${colors.gray.bold('Apellido Paterno: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.apellidoPaterno) : ''}`)
    objAlumno.apellidoPaterno = read.question()
    this.apellidoPaterno = objAlumno.apellidoPaterno !== '' ? objAlumno.apellidoPaterno : this.apellidoPaterno
    // Apellido Materno
    console.log(`${colors.gray.bold('Apellido Materno: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.apellidoMaterno) : ''}`)
    objAlumno.apellidoMaterno = read.question()
    this.apellidoMaterno = objAlumno.apellidoMaterno !== '' ? objAlumno.apellidoMaterno : this.apellidoMaterno
    // Genero
    console.log(`${colors.gray.bold('Genero: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.genero) : ''}`)
    objAlumno.genero = read.question()
    this.genero = objAlumno.genero !== '' ? objAlumno.genero : this.genero
    // Fecha de Nacimiento
    console.log(`${colors.gray.bold('Fecha de Nacimiento: ')} ${this.estatus === 'Editar' ? colors.white.bold(this.fechaNacimiento) : ''}`)
    objAlumno.fechaNacimiento = read.question()
    this.fechaNacimiento = objAlumno.fechaNacimiento !== '' ? objAlumno.fechaNacimiento : this.fechaNacimiento
    // Abrir Conexión a Base de datos
    mongoose.connect(dbURI, { useNewUrlParser: true })
    // Control de Eventos de la Base de Datos
    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection is open to ', dbURI)
    })
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection is disconnected')
    })
    mongoose.connection.on('error', function (err) {
      console.error('Mongoose default connection has occured ' + err + ' error')

    })

  }
  consultar () {
   console.log(`Accediste al Metodo ${colors.yellow.bold('Consultar')}`)
    // Abrir Conexión a Base de datos
    mongoose.connect(dbURI, { useNewUrlParser: true })
    // Control de Eventos de la Base de Datos
    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection is open to ', dbURI)
    })
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection is disconnected')
    })
    mongoose.connection.on('error', function (err) {
      console.error('Mongoose default connection has occured ' + err + ' error')
    })
    // Buscar en la Base de Datos
    let AlumnoModel = mongoose.model('alumno', alumnoSchema)
    let mat = read.question('Matricula:')
    AlumnoModel.findOne({
      'matricula': parseInt(mat)
    }, (err, result) => {
      this.matricula = result.matricula
      this.curp = result.curp
      this.nombre = result.nombre
      this.apellidoPaterno = result.apellidoPaterno
      this.apellidoMaterno = result.apellidoMaterno
      this.genero = result.genero
      this.fechaNacimiento = result.fechaNacimiento
      console.log(`${colors.gray.bold('Matrícula:')} ${colors.white.bold(this.matricula)}`)
      console.log(`${colors.gray.bold('CURP:')} ${colors.white.bold(this.curp)}`)
      console.log(`${colors.gray.bold('Nombre Completo:')} ${colors.white.bold(this.getNombreCompleto())}`)
      console.log(`${colors.gray.bold('Genero:')} ${colors.white.bold(this.genero)}`)
      console.log(`${colors.gray.bold('Edad:')} ${colors.white.bold(this.getEdad())}`)
      mongoose.connection.close()
    })
  }
  agregar () {
    console.log(`Accediste al Metodo ${colors.yellow.bold('Agregar')}`)
    let yesNot = read.question(`¿ Esta seguro de ${colors.green.bold('Guardar los datos')} capturados [${colors.green.bold('Y')}/${colors.red.bold('N')}]?`)
    if (yesNot.toUpperCase() === 'Y') {
      // Agregar Alumno a la Base de Datos
      let edad = this.getEdad()
      let AlumnoModel = mongoose.model('alumno', alumnoSchema)
      let model = new AlumnoModel({
        matricula: this.matricula,
        curp: this.curp,
        nombre: this.nombre,
        apellidoPaterno: this.apellidoPaterno,
        apellidoMaterno: this.apellidoMaterno,
        genero: this.genero,
        fechaNacimiento: this.fechaNacimiento,
        edad: edad
      })
      model.save((err, resp) => {
        if (err) {
          console.error('Error al insertar', err)
          return
        }
        console.log('Registro Insertado Correctamente')
        console.log(`Los datos se han ${colors.green.bold('Guardado Correctamente !!!')}`)
        mongoose.connection.close()
      })
    } else {
      console.log(`Se ha ${colors.red.bold('Cancelado')} la captura del ${colors.yellow.bold('Alumno')}`)
    }
    read.question(`${colors.yellow.bold('Presiona cualquier tecla para regresar al Menu Principal !!!')}`)
  }
  Eliminar () {

    mongoose.connect(dbURI, { useNewUrlParser: true})

    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection is open to ', dbURI)
    })
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection is disconnected')
    })
    mongoose.connection.on('error', function (err) {
      console.error('Mongoose default connection has occured', +err + ' error')
    })
    console.log('entraste a la funcion eliminar')
    let AlumnoModel = mongoose.model('Alumno', alumnoSchema)
    let mat = read.question('Matricula:')
    AlumnoModel.findOneAndDelete({
      'matricula': parseInt(mat)
    }, (err, result) => {
      this.matricula = result.matricula
      this.curp = result.curp
      this.nombre = result.nombre
      this.apellidoPaterno = result.apellidoPaterno
      this.apellidoMaterno = result.apellidoMaterno
      this.genero = result.genero
      this.fechaNacimiento = result.fechaNacimiento

      console.log(`Accediste al Metodo ${colors.yellow.bold('Eliminar')}`)
      console.log(`${colors.yellow.bold('Matricula')}  ${this.matricula}`)





    })
  }
  modificar () {
    console.log('Estas en Modificar')
    // Abrir Conexión a Base de datos
    mongoose.connect(dbURI, { useNewUrlParser: true })
    // Control de Eventos de la Base de Datos
    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection is open to ', dbURI)
    })
    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection is disconnected')
    })
    mongoose.connection.on('error', function (err) {
      console.error('Mongoose default connection has occured ' + err + ' error')
    })
    // Buscar en la Base de Datos
    let AlumnoModel = mongoose.model('alumno', alumnoSchema)
    let mat = read.question('Matricula:')
    AlumnoModel.findOne({
      'matricula': parseInt(mat)
    }, (err, result) => {
      this.matricula = result.matricula
      this.curp = result.curp
      this.nombre = result.nombre
      this.apellidoPaterno = result.apellidoPaterno
      this.apellidoMaterno = result.apellidoMaterno
      this.genero = result.genero
      this.fechaNacimiento = result.fechaNacimiento
      console.log(`${colors.gray.bold('Matrícula:')} ${colors.white.bold(this.matricula)}`)
      console.log(`${colors.gray.bold('CURP:')} ${colors.white.bold(this.curp)}`)
      console.log(`${colors.gray.bold('Nombre Completo:')} ${colors.white.bold(this.getNombreCompleto())}`)
      console.log(`${colors.gray.bold('Genero:')} ${colors.white.bold(this.genero)}`)
      console.log(`${colors.gray.bold('Edad:')} ${colors.white.bold(this.getEdad())}`)

          let yesNot = read.question(`¿ Esta seguro de ${colors.green.bold('Editar los datos')} capturados [${colors.green.bold('Y')}/${colors.red.bold('N')}]?`)
        if (yesNot.toUpperCase() === 'Y') {
          this.estatus === `Editar`
          this.getDatos()
          let objAlumno= {
          matricula : this.matricula,
          curp : this.curp,
          nombre : this.nombre,
          apellidoPaterno : this.apellidoPaterno,
          apellidoMaterno : this.apellidoMaterno,
          genero :this.genero,
          fechaNacimiento : this.fechaNacimiento,
          edad: this.getEdad()

          }
          AlumnoModel.findOneAndUpdate({'matricula': objAlumno.matricula},
          {$set:objAlumno}, function(err,result){
            console.log(result);
          });

  mongoose.connection.close()
    }
})

  }



}

module.exports = alumno
