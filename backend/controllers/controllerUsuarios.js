function guardarUsuario(usuario) {
  try {
    const sheetUsuarios = obtenerSheet(env_().SH_REGISTRO_USUARIOS);
    Insert(JSON.parse(usuario), sheetUsuarios);
    return {
      titulo: "Registro exitoso",
      descripcion: "El usuario ha sido 💾 guardado en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function guardarContrato(contrato) {
  try {
    const sheetDataBase = obtenerSheet(env_().SH_REGISTRO_CONTRATO);
    Insert(JSON.parse(contrato), sheetDataBase);
    return {
      titulo: "Registro exitoso",
      descripcion: "El contrato ha sido 💾 guardado en la base de datos.",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function actualizarClave(username, password, fullName, tipoDoc, doc, tp, reg, imageUrl) {
  try {
    const sheetCredenciales = obtenerSheet(env_().SH_CREDENTIALS);
    const data = sheetCredenciales.getDataRange().getValues();
    let found = false;
    let rowToUpdate = -1; 

    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'username') {
        rowToUpdate = i + 2; 
        found = true;
        break;
      }
    }

    if (!found) {
      return {
        titulo: "Error",
        descripcion: "Usuario no encontrado en la base de datos.",
      };
    }

    if (username) sheetCredenciales.getRange(rowToUpdate, 1).setValue(username);
    if (password) sheetCredenciales.getRange(rowToUpdate, 2).setValue(password);
    if (fullName) sheetCredenciales.getRange(rowToUpdate, 3).setValue(fullName);
    if (tipoDoc) sheetCredenciales.getRange(rowToUpdate, 4).setValue(tipoDoc);
    if (doc) sheetCredenciales.getRange(rowToUpdate, 5).setValue(doc);
    if (tp) sheetCredenciales.getRange(rowToUpdate, 6).setValue(tp);
    if (reg) sheetCredenciales.getRange(rowToUpdate, 7).setValue(reg);
    if (imageUrl) sheetCredenciales.getRange(rowToUpdate, 8).setValue(imageUrl);

    return {
      titulo: "Actualización exitosa",
      descripcion: "Los datos han sido actualizados correctamente.",
    };
  } catch (error) {
    return {
      titulo: "Error",
      descripcion: "Hubo un problema al actualizar la información: " + error.message,
    };
  }
}

function obtenerSheet(sheetName) {
  return SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(sheetName);
}

function guardarSesionesSeguimiento(usuario) {
  try {
    const sheetUsuarios = obtenerSheet(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
    Insert(JSON.parse(usuario), sheetUsuarios);
    console.log('Datos insertados correctamente'); 
    return {
      titulo: "Registro exitoso",
      descripcion: "El usuario ha sido 💾 guardado en la base de datos.",
    };
  } catch (error) {
    console.error('Error al guardar usuario:', error); 
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function listarUsuarios(id = undefined) {
  // return obtenerDatos(env_().SH_REGISTRO_USUARIOS);
  return JSON.stringify(_read(obtenerSheet(env_().SH_REGISTRO_USUARIOS), id));
}

function listarUsuariosSeguimientos(id = undefined) {
  // return obtenerDatos(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
  return JSON.stringify(_read(obtenerSheet(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO), id));
}

function mostrarDatosTerapeuta(id = undefined) {
  // return obtenerDatos(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
  return JSON.stringify(_read(obtenerSheet(env_().SH_CREDENTIALS_ADMIN), id));
}

function actualizarUsuario(id, datos) {
  try {
    console.log(datos);
    const sheetUsuarios = obtenerSheet(env_().SH_REGISTRO_USUARIOS);
    Update(id, datos, sheetUsuarios);
    return {
      titulo: "Usuario/a actualizado correctamente",
      descripcion:
        "Actualización exitosa y almacenada en la base de datos",
    };
  } catch (error) {
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function eliminarPostDescargaDocumento(docId) {
  try {
    DriveApp.getFileById(docId).setTrashed(true);
    console.log("Doc eliminado", docId);
  } catch (error) {
    console.error("Error al eliminar", error);
    throw new Error('Error al eliminar el documento: ' + error.message);
  }
}

function actualizarUsuarioSesionesSeguimiento(id, datos) {
  try {
    console.log(datos); 
    const sheetUsuarios = obtenerSheet(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
    Update(id, datos, sheetUsuarios);
    console.log('Usuario/a actualizado correctamente'); 
    return {
      titulo: "Usuario/a actualizado correctamente",
      descripcion:
        "Actualización exitosa y almacenada en la base de datos",
    };
  } catch (error) {
    console.error('Error al actualizar usuario:', error); // Maneja errores
    return {
      titulo: "Ops ha ocurrido un error! " + error,
      descripcion: "Por favor contacte a soporte.",
    };
  }
}

function waitForDataRetrieval(conditionFunction, maxAttempts, delay) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    if (conditionFunction()) {
      return true;
    }
    Utilities.sleep(delay);
    attempts++;
  }
  return false;
}

function verificarCredenciales(usuario, contraseña) {
  console.log("Verificando credenciales...");
  try {
    const sheetCredenciales = obtenerSheet(env_().SH_CREDENTIALS_ADMIN);
    if (!sheetCredenciales) {
      console.error("No se pudo obtener la hoja de cálculo de credenciales.");
      return { success: false, error: "noSheet" };
    }
    const data = sheetCredenciales.getDataRange().getValues();
    if (!data || data.length === 0) {
      console.error("No se encontraron datos en la hoja de cálculo de credenciales.");
      return { success: false, error: "noData" };
    }
    
    for (let i = 0; i < data.length; i++) {
      const [storedUsername, storedPassword] = [data[i][0], data[i][1]];  // Columnas A y B
      console.log("Stored username:", storedUsername);
      if (storedUsername === usuario) {
        console.log("Usuario encontrado:", usuario);
        if (storedPassword === contraseña) {
          console.log("Contraseña correcta.");
          
          // Invalidar todos los tokens de sesión previos del usuario
          const userTokens = PropertiesService.getScriptProperties().getProperty(usuario + "_tokens");
          if (userTokens) {
            const tokensArray = JSON.parse(userTokens);
            tokensArray.forEach(token => {
              PropertiesService.getScriptProperties().deleteProperty(token);
              console.log("Sesión cerrada para el token:", token);
            });
          }
          
          // Generar un nuevo token de sesión
          const newSessionToken = Utilities.getUuid();
          console.log("Nuevo token de sesión:", newSessionToken);
          
          // Almacenar el nuevo token de sesión en la columna I de la hoja
          sheetCredenciales.getRange(i + 1, 9).setValue(newSessionToken);
          console.log("Token de sesión almacenado en la hoja para el usuario:", usuario);
          
          // Almacenar el nuevo token de sesión asociado con el nombre de usuario
          PropertiesService.getScriptProperties().setProperty(newSessionToken, usuario);
          
          // Guardar el nuevo token en la lista de tokens del usuario
          let updatedTokens = [];
          if (userTokens) {
            updatedTokens = JSON.parse(userTokens);
          }
          updatedTokens.push(newSessionToken);
          PropertiesService.getScriptProperties().setProperty(usuario + "_tokens", JSON.stringify(updatedTokens));
          
          console.log("Token de sesión asociado con el usuario:", usuario);
          
          return { success: true, sessionToken: newSessionToken };
        } else {
          console.log("Contraseña incorrecta.");
          return { success: false, error: "wrongPassword" };
        }
      }
    }
    console.log("Usuario no encontrado.");
    return { success: false, error: "wrongUsername" };
  } catch (error) {
    console.error('Error al verificar las credenciales:', error.message);
    throw new Error('Error al verificar las credenciales: ' + error.message);
  }
}

function checkAuth(sessionToken) {
  const usuario = PropertiesService.getScriptProperties().getProperty(sessionToken);
  console.log("Verificando token de sesión:", sessionToken, "Usuario:", usuario);
  return !!usuario; 
}

function generarInformeWordSeg(id) {
  console.log("id", id);
  const nombreCompleto = 1;
  const tipoDocumento = 2;
  const numeroDocumento = 3;
  const correo = 4;
  const telefono = 5;
  const fechaNacimiento = 6;
  const fechaSesion = 7;
  const objetivoSeguimiento = 8;
  const dlloSesion = 9;
  const tareasProximaSesion = 10;
  const proximaSesionFecha = 11;
  const proximaSesionHora = 12;
  const agregarACalendar = 13;
  const agregarAMeets = 14;
  const uniqueId = 15;

  const templateDocId = env_().INFORME_SEG_DOC; 
  const folderTempId = env_().ID_FOLDER_TEMP_SEG; 

  const templateDoc = DriveApp.getFileById(templateDocId);
  const folderTemp = DriveApp.getFolderById(folderTempId);

  // Datos de la base de datos
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();

  // Buscar el registro correspondiente al ID proporcionado
  const registro = datosValues.find(fila => fila[uniqueId] === id);
  console.log("Registro encontrado:", registro[uniqueId], registro[nombreCompleto], registro[fechaSesion]);

  if (!registro) {
    throw new Error('No se encontró ningún registro con el ID proporcionado');
  }

 // Obtener datos del terapeuta
 let datosTerapeuta = JSON.parse(mostrarDatosTerapeuta(id = undefined));

 datosTerapeuta = datosTerapeuta[0];

 if (!datosTerapeuta) {
   console.log("datos completos", datosTerapeuta);
   throw new Error('No se pudieron obtener los datos completos del terapeuta.');
 }

 console.log("Datos del terapeuta:", datosTerapeuta);
 console.log("Tipo de datosTerapeuta:", typeof datosTerapeuta);

 // Mostrar propiedades del objeto datosTerapeuta
 console.log("Propiedades de datosTerapeuta:", Object.keys(datosTerapeuta));


  // Realizar la copia del documento
  const nuevoDocumento = templateDoc.makeCopy(folderTemp);
  const nuevoDocId = nuevoDocumento.getId();
  const nuevoDoc = DocumentApp.openById(nuevoDocId);
  const cuerpoDocumento = nuevoDoc.getBody();

  // Reemplazar los marcadores de posición en el documento con los datos del registro
  const placeholders = {
  '{{id}}': registro[id] ?? '',
  '{{nombreCompleto}}': registro[nombreCompleto] ?? '',
  '{{tipoDocumento}}': registro[tipoDocumento] ?? '',
  '{{numeroDocumento}}': registro[numeroDocumento] ?? '',
  '{{correo}}': registro[correo] ?? '',
  '{{telefono}}': registro[telefono] ?? '',
  '{{fechaNacimiento}}': registro[fechaNacimiento] ?? '',
  '{{fechaSesion}}': registro[fechaSesion] ?? '',
  '{{objetivoSeguimiento}}': registro[objetivoSeguimiento] ?? '',
  '{{dlloSesion}}': registro[dlloSesion] ?? '',
  '{{tareasProximaSesion}}': registro[tareasProximaSesion] ?? '',
  '{{proximaSesionFecha}}': registro[proximaSesionFecha] ?? '',
  '{{proximaSesionHora}}': registro[proximaSesionHora] ?? '',
  '{{agregarACalendar}}': registro[agregarACalendar] ?? '',
  '{{agregarAMeets}}': registro[agregarAMeets] ?? '',
  '{{uniqueId}}': registro[uniqueId] ?? '',
    '{{fullName}}': datosTerapeuta.fullName || '',
    '{{tipoDoc}}': datosTerapeuta.tipoDoc || '',
    '{{doc}}': datosTerapeuta.doc || '',
    '{{tp}}': datosTerapeuta.tp || '',
    '{{reg}}': datosTerapeuta.reg || '',
    '{{imageUrl}}': ''
  };

  Object.keys(placeholders).forEach(placeholder => {
    console.log(`Reemplazando ${placeholder} con ${placeholders[placeholder]}`);
    cuerpoDocumento.replaceText(placeholder, placeholders[placeholder]);
  });


  // Guardar el documento generado en la carpeta temporal con el nombre deseado
  const nombreDocumento = ` sesion-${registro[nombreCompleto]}-${registro[fechaSesion]}`;
  nuevoDocumento.setName(nombreDocumento);
  
  nuevoDoc.saveAndClose();

  const enlaceGoogleDocs = nuevoDocumento.getUrl();

  const enlaceDescarga = enlaceGoogleDocs.replace('/edit?usp=drivesdk', '/export?format=docx');

  console.log(enlaceGoogleDocs)
  console.log(enlaceDescarga)

  return {enlaceDescarga: enlaceDescarga, nuevoDocId: nuevoDocId}; 
} 

function generarInformePdfSeg(id) {
  console.log("id", id);
  const nombreCompleto = 1;
  const tipoDocumento = 2;
  const numeroDocumento = 3;
  const correo = 4;
  const telefono = 5;
  const fechaNacimiento = 6;
  const fechaSesion = 7;
  const objetivoSeguimiento = 8;
  const dlloSesion = 9;
  const tareasProximaSesion = 10;
  const proximaSesionFecha = 11;
  const proximaSesionHora = 12;
  const agregarACalendar = 13;
  const agregarAMeets = 14;
  const uniqueId = 15;

  const templateDocId = env_().INFORME_SEG_DOC_MAIL; 
  const folderTempId = env_().ID_FOLDER_TEMP_SEG; 

  const templateDoc = DriveApp.getFileById(templateDocId);
  const folderTemp = DriveApp.getFolderById(folderTempId);

  // Datos de la base de datos
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();

  // Buscar el registro correspondiente al ID proporcionado
  const registro = datosValues.find(fila => fila[uniqueId] === id);
  console.log("Registro encontrado:", registro[uniqueId], registro[nombreCompleto], registro[fechaSesion]);

  if (!registro) {
    throw new Error('No se encontró ningún registro con el ID proporcionado');
  }

    // Obtener datos del terapeuta
    let datosTerapeuta = JSON.parse(mostrarDatosTerapeuta(id = undefined));

    datosTerapeuta = datosTerapeuta[0];
  
    if (!datosTerapeuta) {
      console.log("datos completos", datosTerapeuta);
      throw new Error('No se pudieron obtener los datos completos del terapeuta.');
    }
  
    console.log("Datos del terapeuta:", datosTerapeuta);
    console.log("Tipo de datosTerapeuta:", typeof datosTerapeuta);
  
    // Mostrar propiedades del objeto datosTerapeuta
    console.log("Propiedades de datosTerapeuta:", Object.keys(datosTerapeuta));

  // Realizar la copia del documento
  const nuevoDocumento = templateDoc.makeCopy(folderTemp);
  const nuevoDocId = nuevoDocumento.getId();
  const nuevoDoc = DocumentApp.openById(nuevoDocId);
  const cuerpoDocumento = nuevoDoc.getBody();

  // Reemplazar los marcadores de posición en el documento con los datos del registro
  const placeholders = {
    '{{nombreCompleto}}': registro[nombreCompleto] ?? '',
    '{{tipoDocumento}}': registro[tipoDocumento] ?? '',
    '{{numeroDocumento}}': registro[numeroDocumento] ?? '',
    '{{correo}}': registro[correo] ?? '',
    '{{telefono}}': registro[telefono] ?? '',
    '{{fechaNacimiento}}': registro[fechaNacimiento] ?? '',
    '{{fechaSesion}}': registro[fechaSesion] ?? '',
    '{{objetivoSeguimiento}}': registro[objetivoSeguimiento] ?? '',
    '{{dlloSesion}}': registro[dlloSesion] ?? '',
    '{{tareasProximaSesion}}': registro[tareasProximaSesion] ?? '',
    '{{proximaSesionFecha}}': registro[proximaSesionFecha] ?? '',
    '{{proximaSesionHora}}': registro[proximaSesionHora] ?? '',
    '{{agregarACalendar}}': registro[agregarACalendar] ?? '',
    '{{agregarAMeets}}': registro[agregarAMeets] ?? '',
    '{{uniqueId}}': registro[uniqueId] ?? '',
    '{{fullName}}': datosTerapeuta.fullName || '',
    '{{tipoDoc}}': datosTerapeuta.tipoDoc || '',
    '{{doc}}': datosTerapeuta.doc || '',
    '{{tp}}': datosTerapeuta.tp || '',
    '{{reg}}': datosTerapeuta.reg || '',
    '{{imageUrl}}': datosTerapeuta.imageUrl || ''
  };

  Object.keys(placeholders).forEach(placeholder => {
    console.log(`Reemplazando ${placeholder} con ${placeholders[placeholder]}`);
    cuerpoDocumento.replaceText(placeholder, placeholders[placeholder]);
  });



  nuevoDoc.saveAndClose();

  // Convertir el documento a PDF
  const pdfBlob = nuevoDocumento.getAs('application/pdf');

  // Eliminar el archivo temporal de Google Docs después de la conversión a PDF
  nuevoDocumento.setTrashed(true);

  return pdfBlob;
} 

function generarInformeWordHC(id) {
  console.log("id", id);
  const IDX_ID = 0;
  const nombre1 = 1;
  const nombre2 = 2;
  const apellido1 = 3;
  const apellido2 = 4;
  const fechaNacimiento = 5;
  const tipoDocumento = 6;
  const numeroDocumento = 7;
  const sexo = 8;
  const correo = 9;
  const telefono = 10;
  const fechaCreacion = 11;
  const autorizarEnvioCorreos = 12;
  const nombreCompleto = 13;
  const motivoConsulta = 14;
  const porteYApariencia = 15;
  const orientacion = 16;
  const inteligencia = 17;
  const lenguaje = 18;
  const afecto = 19;
  const sensorPercepcion = 20;
  const actividadPsicomotora = 21;
  const aprendizajeAtencion = 22;
  const memoria = 23;
  const actitudValoracion = 24;
  const abusoSexual = 25;
  const ideasMuerte = 26;
  const planSuicida = 27;
  const actoSuicida = 28;
  const consumoProblematico = 29;
  const cicloSueno = 30;
  const afectividadSexualidad = 31;
  const cicloAlimentacion = 32;
  const actividadFisica = 33;
  const personalesEnSaludMental = 34;
  const familiaresEnSaludMental = 35;
  const educacionTrabajo = 36;
  const relacionesFamiliares = 37;
  const observacionesTerapeuta = 38;
  const diagnosticoPrincipal = 39;
  const tipoDiagnostico = 40;
  const diagnosticoRelacionadoUno = 41;
  const diagnosticoRelacionadoDos = 42;
  const diagnosticoRelacionadoTres = 43;
  const modeloIntervencion = 44;
  const objetivoGeneral = 45;
  const objetivosEspecificosUno = 46;
  const objetivosEspecificosDos = 47;
  const objetivosEspecificosTres = 48;
  const proximaSesionFecha = 49;
  const proximaSesionHora = 50;
  const agregarAMeets = 51;
  const createDataHC = 52;

  const templateDocId = env_().INFORME_HC_DOC; 
  const folderTempId = env_().ID_FOLDER_TEMP_HC; 

  const templateDoc = DriveApp.getFileById(templateDocId);
  const folderTemp = DriveApp.getFolderById(folderTempId);

  // Datos de la base de datos
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_USUARIOS);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();

  // Buscar el registro correspondiente al ID proporcionado
  const registroHistCli = datosValues.find(fila => fila[IDX_ID] === id);
  console.log("RegistroHistCli encontrado:", registroHistCli[IDX_ID], registroHistCli[nombreCompleto], registroHistCli[createDataHC]);

  if (!registroHistCli) {
    throw new Error('No se encontró ningún registroHistCli con el ID proporcionado');
  }

    // Obtener datos del terapeuta
    let datosTerapeuta = JSON.parse(mostrarDatosTerapeuta(id = undefined));

    datosTerapeuta = datosTerapeuta[0];
  
    if (!datosTerapeuta) {
      console.log("datos completos", datosTerapeuta);
      throw new Error('No se pudieron obtener los datos completos del terapeuta.');
    }
  
    console.log("Datos del terapeuta:", datosTerapeuta);
    console.log("Tipo de datosTerapeuta:", typeof datosTerapeuta);
  
    // Mostrar propiedades del objeto datosTerapeuta
    console.log("Propiedades de datosTerapeuta:", Object.keys(datosTerapeuta));

  // Realizar la copia del documento
  const nuevoDocumento = templateDoc.makeCopy(folderTemp);
  const nuevoDocId = nuevoDocumento.getId();
  const nuevoDoc = DocumentApp.openById(nuevoDocId);
  const cuerpoDocumento = nuevoDoc.getBody();

  // Reemplazar los marcadores de posición en el documento con los datos del registroHistCli
  const placeholders = {
    '{{nombreCompleto}}': registroHistCli[nombreCompleto] ?? '',
    '{{apellido1}}': registroHistCli[apellido1] ?? '',
    '{{apellido2}}': registroHistCli[apellido2] ?? '',
    '{{fechaNacimiento}}': registroHistCli[fechaNacimiento] ?? '',
    '{{tipoDocumento}}': registroHistCli[tipoDocumento] ?? '',
    '{{numeroDocumento}}': registroHistCli[numeroDocumento] ?? '',
    '{{sexo}}': registroHistCli[sexo] ?? '',
    '{{correo}}': registroHistCli[correo] ?? '',
    '{{telefono}}': registroHistCli[telefono] ?? '',
    '{{fechaCreacion}}': registroHistCli[fechaCreacion] ?? '',
    '{{autorizarEnvioCorreos}}': registroHistCli[autorizarEnvioCorreos] ?? '',
    '{{motivoConsulta}}': registroHistCli[motivoConsulta] ?? '',
    '{{porteYApariencia}}': registroHistCli[porteYApariencia] ?? '',
    '{{orientacion}}': registroHistCli[orientacion] ?? '',
    '{{inteligencia}}': registroHistCli[inteligencia] ?? '',
    '{{lenguaje}}': registroHistCli[lenguaje] ?? '',
    '{{afecto}}': registroHistCli[afecto] ?? '',
    '{{sensorPercepcion}}': registroHistCli[sensorPercepcion] ?? '',
    '{{actividadPsicomotora}}': registroHistCli[actividadPsicomotora] ?? '',
    '{{aprendizajeAtencion}}': registroHistCli[aprendizajeAtencion] ?? '',
    '{{memoria}}': registroHistCli[memoria] ?? '',
    '{{actitudValoracion}}': registroHistCli[actitudValoracion] ?? '',
    '{{abusoSexual}}': registroHistCli[abusoSexual] ?? '',
    '{{ideasMuerte}}': registroHistCli[ideasMuerte] ?? '',
    '{{planSuicida}}': registroHistCli[planSuicida] ?? '',
    '{{actoSuicida}}': registroHistCli[actoSuicida] ?? '',
    '{{consumoProblematico}}': registroHistCli[consumoProblematico] ?? '',
    '{{cicloSueno}}': registroHistCli[cicloSueno] ?? '',
    '{{afectividadSexualidad}}': registroHistCli[afectividadSexualidad] ?? '',
    '{{cicloAlimentacion}}': registroHistCli[cicloAlimentacion] ?? '',
    '{{actividadFisica}}': registroHistCli[actividadFisica] ?? '',
    '{{personalesEnSaludMental}}': registroHistCli[personalesEnSaludMental] ?? '',
    '{{familiaresEnSaludMental}}': registroHistCli[familiaresEnSaludMental] ?? '',
    '{{educacionTrabajo}}': registroHistCli[educacionTrabajo] ?? '',
    '{{relacionesFamiliares}}': registroHistCli[relacionesFamiliares] ?? '',
    '{{observacionesTerapeuta}}': registroHistCli[observacionesTerapeuta] ?? '',
    '{{diagnosticoPrincipal}}': registroHistCli[diagnosticoPrincipal] ?? '',
    '{{tipoDiagnostico}}': registroHistCli[tipoDiagnostico] ?? '',
    '{{diagnosticoRelacionadoUno}}': registroHistCli[diagnosticoRelacionadoUno] ?? '',
    '{{diagnosticoRelacionadoDos}}': registroHistCli[diagnosticoRelacionadoDos] ?? '',
    '{{diagnosticoRelacionadoTres}}': registroHistCli[diagnosticoRelacionadoTres] ?? '',
    '{{modeloIntervencion}}': registroHistCli[modeloIntervencion] ?? '',
    '{{objetivoGeneral}}': registroHistCli[objetivoGeneral] ?? '',
    '{{objetivosEspecificosUno}}': registroHistCli[objetivosEspecificosUno] ?? '',
    '{{objetivosEspecificosDos}}': registroHistCli[objetivosEspecificosDos] ?? '',
    '{{objetivosEspecificosTres}}': registroHistCli[objetivosEspecificosTres] ?? '',
    '{{proximaSesionFecha}}': registroHistCli[proximaSesionFecha] ?? '',
    '{{proximaSesionHora}}': registroHistCli[proximaSesionHora] ?? '',
    '{{agregarAMeets}}': registroHistCli[agregarAMeets] ?? '',
    '{{createDataHC}}': registroHistCli[createDataHC] ?? '',
    '{{fullName}}': datosTerapeuta.fullName || '',
    '{{tipoDoc}}': datosTerapeuta.tipoDoc || '',
    '{{doc}}': datosTerapeuta.doc || '',
    '{{tp}}': datosTerapeuta.tp || '',
    '{{reg}}': datosTerapeuta.reg || '',
    '{{imageUrl}}': ''
  };

  Object.keys(placeholders).forEach(placeholder => {
    console.log(`Reemplazando ${placeholder} con ${placeholders[placeholder]}`);
    cuerpoDocumento.replaceText(placeholder, placeholders[placeholder]);
  });

  // Guardar el documento generado en la carpeta temporal con el nombre deseado
  const nombreDocumento = ` HC - ${registroHistCli[nombreCompleto]}-${registroHistCli[createDataHC]}`;
  nuevoDocumento.setName(nombreDocumento);
  
  nuevoDoc.saveAndClose();
  const enlaceGoogleDocs = nuevoDocumento.getUrl();

  const enlaceDescarga = enlaceGoogleDocs.replace('/edit?usp=drivesdk', '/export?format=docx');

  console.log(enlaceGoogleDocs)
  console.log(enlaceDescarga)

  return {enlaceDescarga: enlaceDescarga, nuevoDocId: nuevoDocId}; 
}

function generarInformePdfHC(id) {
  console.log("id", id);
  const IDX_ID = 0;
  const nombre1 = 1;
  const nombre2 = 2;
  const apellido1 = 3;
  const apellido2 = 4;
  const fechaNacimiento = 5;
  const tipoDocumento = 6;
  const numeroDocumento = 7;
  const sexo = 8;
  const correo = 9;
  const telefono = 10;
  const fechaCreacion = 11;
  const autorizarEnvioCorreos = 12;
  const nombreCompleto = 13;
  const motivoConsulta = 14;
  const porteYApariencia = 15;
  const orientacion = 16;
  const inteligencia = 17;
  const lenguaje = 18;
  const afecto = 19;
  const sensorPercepcion = 20;
  const actividadPsicomotora = 21;
  const aprendizajeAtencion = 22;
  const memoria = 23;
  const actitudValoracion = 24;
  const abusoSexual = 25;
  const ideasMuerte = 26;
  const planSuicida = 27;
  const actoSuicida = 28;
  const consumoProblematico = 29;
  const cicloSueno = 30;
  const afectividadSexualidad = 31;
  const cicloAlimentacion = 32;
  const actividadFisica = 33;
  const personalesEnSaludMental = 34;
  const familiaresEnSaludMental = 35;
  const educacionTrabajo = 36;
  const relacionesFamiliares = 37;
  const observacionesTerapeuta = 38;
  const diagnosticoPrincipal = 39;
  const tipoDiagnostico = 40;
  const diagnosticoRelacionadoUno = 41;
  const diagnosticoRelacionadoDos = 42;
  const diagnosticoRelacionadoTres = 43;
  const modeloIntervencion = 44;
  const objetivoGeneral = 45;
  const objetivosEspecificosUno = 46;
  const objetivosEspecificosDos = 47;
  const objetivosEspecificosTres = 48;
  const proximaSesionFecha = 49;
  const proximaSesionHora = 50;
  const agregarAMeets = 51;
  const createDataHC = 52;

  const templateDocId = env_().INFORME_HC_DOC_MAIL; 
  const folderTempId = env_().ID_FOLDER_TEMP_HC; 

  const templateDoc = DriveApp.getFileById(templateDocId);
  const folderTemp = DriveApp.getFolderById(folderTempId);

  // Datos de la base de datos
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_USUARIOS);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();

  // Buscar el registro correspondiente al ID proporcionado
  const registroHistCli = datosValues.find(fila => fila[IDX_ID] === id);
  console.log("RegistroHistCli encontrado:", registroHistCli[IDX_ID], registroHistCli[nombreCompleto], registroHistCli[createDataHC]);

  if (!registroHistCli) {
    throw new Error('No se encontró ningún registroHistCli con el ID proporcionado');
  }

  // Obtener datos del terapeuta
  let datosTerapeuta = JSON.parse(mostrarDatosTerapeuta(id = undefined));

  datosTerapeuta = datosTerapeuta[0];

  if (!datosTerapeuta) {
    console.log("datos completos", datosTerapeuta);
    throw new Error('No se pudieron obtener los datos completos del terapeuta.');
  }

  console.log("Datos del terapeuta:", datosTerapeuta);
  console.log("Tipo de datosTerapeuta:", typeof datosTerapeuta);

  // Mostrar propiedades del objeto datosTerapeuta
  console.log("Propiedades de datosTerapeuta:", Object.keys(datosTerapeuta));

  // Realizar la copia del documento
  const nuevoDocumento = templateDoc.makeCopy(folderTemp);
  const nuevoDocId = nuevoDocumento.getId();
  const nuevoDoc = DocumentApp.openById(nuevoDocId);
  const cuerpoDocumento = nuevoDoc.getBody();

  // Reemplazar los marcadores de posición en el documento con los datos del registroHistCli
  const placeholders = {
    '{{nombreCompleto}}': registroHistCli[nombreCompleto] ?? '',
    '{{apellido1}}': registroHistCli[apellido1] ?? '',
    '{{apellido2}}': registroHistCli[apellido2] ?? '',
    '{{fechaNacimiento}}': registroHistCli[fechaNacimiento] ?? '',
    '{{tipoDocumento}}': registroHistCli[tipoDocumento] ?? '',
    '{{numeroDocumento}}': registroHistCli[numeroDocumento] ?? '',
    '{{sexo}}': registroHistCli[sexo] ?? '',
    '{{correo}}': registroHistCli[correo] ?? '',
    '{{telefono}}': registroHistCli[telefono] ?? '',
    '{{fechaCreacion}}': registroHistCli[fechaCreacion] ?? '',
    '{{autorizarEnvioCorreos}}': registroHistCli[autorizarEnvioCorreos] ?? '',
    '{{motivoConsulta}}': registroHistCli[motivoConsulta] ?? '',
    '{{porteYApariencia}}': registroHistCli[porteYApariencia] ?? '',
    '{{orientacion}}': registroHistCli[orientacion] ?? '',
    '{{inteligencia}}': registroHistCli[inteligencia] ?? '',
    '{{lenguaje}}': registroHistCli[lenguaje] ?? '',
    '{{afecto}}': registroHistCli[afecto] ?? '',
    '{{sensorPercepcion}}': registroHistCli[sensorPercepcion] ?? '',
    '{{actividadPsicomotora}}': registroHistCli[actividadPsicomotora] ?? '',
    '{{aprendizajeAtencion}}': registroHistCli[aprendizajeAtencion] ?? '',
    '{{memoria}}': registroHistCli[memoria] ?? '',
    '{{actitudValoracion}}': registroHistCli[actitudValoracion] ?? '',
    '{{abusoSexual}}': registroHistCli[abusoSexual] ?? '',
    '{{ideasMuerte}}': registroHistCli[ideasMuerte] ?? '',
    '{{planSuicida}}': registroHistCli[planSuicida] ?? '',
    '{{actoSuicida}}': registroHistCli[actoSuicida] ?? '',
    '{{consumoProblematico}}': registroHistCli[consumoProblematico] ?? '',
    '{{cicloSueno}}': registroHistCli[cicloSueno] ?? '',
    '{{afectividadSexualidad}}': registroHistCli[afectividadSexualidad] ?? '',
    '{{cicloAlimentacion}}': registroHistCli[cicloAlimentacion] ?? '',
    '{{actividadFisica}}': registroHistCli[actividadFisica] ?? '',
    '{{personalesEnSaludMental}}': registroHistCli[personalesEnSaludMental] ?? '',
    '{{familiaresEnSaludMental}}': registroHistCli[familiaresEnSaludMental] ?? '',
    '{{educacionTrabajo}}': registroHistCli[educacionTrabajo] ?? '',
    '{{relacionesFamiliares}}': registroHistCli[relacionesFamiliares] ?? '',
    '{{observacionesTerapeuta}}': registroHistCli[observacionesTerapeuta] ?? '',
    '{{diagnosticoPrincipal}}': registroHistCli[diagnosticoPrincipal] ?? '',
    '{{tipoDiagnostico}}': registroHistCli[tipoDiagnostico] ?? '',
    '{{diagnosticoRelacionadoUno}}': registroHistCli[diagnosticoRelacionadoUno] ?? '',
    '{{diagnosticoRelacionadoDos}}': registroHistCli[diagnosticoRelacionadoDos] ?? '',
    '{{diagnosticoRelacionadoTres}}': registroHistCli[diagnosticoRelacionadoTres] ?? '',
    '{{modeloIntervencion}}': registroHistCli[modeloIntervencion] ?? '',
    '{{objetivoGeneral}}': registroHistCli[objetivoGeneral] ?? '',
    '{{objetivosEspecificosUno}}': registroHistCli[objetivosEspecificosUno] ?? '',
    '{{objetivosEspecificosDos}}': registroHistCli[objetivosEspecificosDos] ?? '',
    '{{objetivosEspecificosTres}}': registroHistCli[objetivosEspecificosTres] ?? '',
    '{{proximaSesionFecha}}': registroHistCli[proximaSesionFecha] ?? '',
    '{{proximaSesionHora}}': registroHistCli[proximaSesionHora] ?? '',
    '{{agregarAMeets}}': registroHistCli[agregarAMeets] ?? '',
    '{{createDataHC}}': registroHistCli[createDataHC] ?? '',
    '{{fullName}}': datosTerapeuta.fullName || '',
    '{{tipoDoc}}': datosTerapeuta.tipoDoc || '',
    '{{doc}}': datosTerapeuta.doc || '',
    '{{tp}}': datosTerapeuta.tp || '',
    '{{reg}}': datosTerapeuta.reg || '',
    '{{imageUrl}}': ''
  };

  Object.keys(placeholders).forEach(placeholder => {
    console.log(`Reemplazando ${placeholder} con ${placeholders[placeholder]}`);
    cuerpoDocumento.replaceText(placeholder, placeholders[placeholder]);
  });

  nuevoDoc.saveAndClose();

  // Convertir el documento a PDF
  const pdfBlob = nuevoDocumento.getAs('application/pdf');

  // Eliminar el archivo temporal de Google Docs después de la conversión a PDF
  nuevoDocumento.setTrashed(true);

  return pdfBlob;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatDate(date) {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('es-ES', options);
}

function enviarCorreoConHTMLTemplateHistClinic(id) {
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_USUARIOS);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();
  const record = datosValues.find(row => row[0] === id);

  console.log("ID del Paciente:", id);

  if (!record) {
    throw new Error('Registro no encontrado');
  }

  const para = record[9];
  const asunto = "Informe de Historia Clínica " + record[52];

  const pdfBlob = generarInformePdfHC(id);

  const datosTerapeutaArray = JSON.parse(mostrarDatosTerapeuta(id = undefined));
  const datosTerapeuta = datosTerapeutaArray[0];

  const emailData = {
    nombreCompleto:  `${capitalize(record[1])} ${capitalize(record[3])}`,
    proximaSesionFecha: formatDate(record[49]),
    proximaSesionHora: record[50],
    createDataHC: formatDate(record[52]),
    terapeutaNombre: datosTerapeuta.fullName,
    terapeutaReg: datosTerapeuta.reg,
    terapeutaTp: datosTerapeuta.tp,
    terapeutaImageUrl: datosTerapeuta.imageUrl
  };

  const template = HtmlService.createTemplateFromFile('templateEmailHC');
  template.data = emailData;
  const htmlBody = template.evaluate().getContent();

  console.log("template.data",template.data);
  console.log("htmlBody",htmlBody);

  GmailApp.sendEmail(para, asunto, '', {
    htmlBody: htmlBody,
    attachments: [{
      fileName: `Informe_HC_${record[13]}.pdf`,
      content: pdfBlob.getBytes(),
      mimeType: MimeType.PDF
    }]
  });

}

function enviarCorreoConHTMLTemplateSesionSeg(id) {
  const datosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
  const datosRange = datosSheet.getDataRange();
  const datosValues = datosRange.getValues();
  const record = datosValues.find(row => row[15] === id);

  console.log("ID del Paciente:", id);

  if (!record) {
    throw new Error('Registro no encontrado');
  }

  const para = record[4];
  const asunto = "Informe de seguimiento " + record[7];

  const pdfBlob = generarInformePdfSeg(id);


   const datosTerapeutaArray = JSON.parse(mostrarDatosTerapeuta(id = undefined));
   const datosTerapeuta = datosTerapeutaArray[0];

   console.log(datosTerapeuta);

   const emailData = {
    nombreCompleto: `${capitalize(record[1])}`,
    terapeutaNombre: capitalize(datosTerapeuta.fullName),
     terapeutaReg: datosTerapeuta.reg,
     terapeutaTp: datosTerapeuta.tp,
     terapeutaImageUrl: datosTerapeuta.imageUrl
   };

  const template = HtmlService.createTemplateFromFile('templateEmailSegui');
  template.data = emailData;
  const htmlBody = template.evaluate().getContent();

  console.log("template.data",template.data);
  console.log("htmlBody",htmlBody);

  GmailApp.sendEmail(para, asunto, '', {
    htmlBody: htmlBody,
    attachments: [{
      fileName: `Informe_Seg_${record[4]}.pdf`,
      content: pdfBlob.getBytes(),
      mimeType: MimeType.PDF
    }]
  });

}

function crearEventoGoogleCalendarHC(id) {
  try {
    // ID calendario
    const calendarId = env_().CALENDAR_ID;
    // Vars globales
    const usuariosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_USUARIOS);
    const data = usuariosSheet.getDataRange().getValues();
    const usuario = data.find(fila => fila[0] == id);
// valida encuentro
    if (!usuario) {
      console.error('No se encontró ningún usuario con el ID proporcionado');
      return;
    }
    console.log('Usuario:', usuario);
    // Parsear la fecha y hora desde Google Sheets
    const fechaYHoraSesion = usuario[49]; 
    console.log('Fecha de sesión en formato string:', fechaYHoraSesion);
    // Inicio + 5 horas x UTC
    const startDate = new Date(fechaYHoraSesion);
    startDate.setHours(startDate.getHours() + 5);
    // Crear fecha fin 1 hora dsp
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // Duración de 1 hora
    // Crear el meet
    const event = {
      summary: `Sesión con ${usuario[13]} psicología 😀`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Bogota'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota'
      }
    };
    const calendar = CalendarApp.getCalendarById(calendarId);
    const createdEvent = calendar.createEvent(
      event.summary,
      startDate,
      endDate,
      {
        description: 'Sesión de seguimiento',
        guests: usuario[9]
      }
    );
    createdEvent.setColor(CalendarApp.EventColor.PALE_BLUE)
    console.log('Evento creado en Google Calendar:', createdEvent);
    return {
      titulo: 'Evento creado exitosamente',
      descripcion: 'La sesión ha sido creada exitosamente'
    };
  } catch (error) {
    console.error('Error al crear el evento en Google Calendar:', error);
    throw new Error('Ocurrió un error al crear el evento en Google Calendar');
  }
}

function crearEventoGoogleCalendarSeg(id) {
  console.log("el id aportado", id)
  try {
    // ID calendario
    const calendarId = env_().CALENDAR_ID;
    // Vars globales
    const usuariosSheet = SpreadsheetApp.openById(env_().ID_DATABASE).getSheetByName(env_().SH_REGISTRO_SESIONES_SEGUIMIENTO);
    const data = usuariosSheet.getDataRange().getValues();
    const usuario = data.find(fila => fila[15] == id);
    // Validar encuentrodel usario
    if (!usuario) {
      console.error('No se encontró ningún usuario con el ID proporcionado');
      return;
    }
    console.log('Usuario:', usuario);
    // Parsear la fecha y hora desde Google Sheets
    const fechaYHoraSesion = usuario[11]; 
    console.log('Fecha de sesión en formato string:', fechaYHoraSesion);
    // Inicio + 5 horas x UTC
    const startDate = new Date(fechaYHoraSesion);
    startDate.setHours(startDate.getHours() + 5);
    // Crear fecha fin 1 hora después
    const endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // 1 hora
    // Crear el meet
    const actividadesProximaSesion = usuario[10];
    const event = {
      summary: `Seguimiento por Ψ con ${usuario[1]} 🙂`,
      description: `Sesión de seguimiento\n\nLas actividades para la próxima sesión son: ${actividadesProximaSesion}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Bogota'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Bogota'
      }
    };
    const calendar = CalendarApp.getCalendarById(calendarId);
    const createdEvent = calendar.createEvent(
      event.summary,
      startDate,
      endDate,
      {
        description: event.description,
        guests: usuario[4]
      }
    );
    createdEvent.setColor(CalendarApp.EventColor.MAUVE);
    console.log('Evento creado en Google Calendar:', createdEvent);
    return {
      titulo: 'Evento creado exitosamente',
      descripcion: 'La sesión ha sido creada exitosamente'
    };
  } catch (error) {
    console.error('Error al crear el evento en Google Calendar:', error);
    throw new Error('Ocurrió un error al crear el evento en Google Calendar');
  }
}






