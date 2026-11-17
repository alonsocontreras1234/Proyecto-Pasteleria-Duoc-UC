//Funciones de ayuda compartidas por los archivos de datos (data/db.js, data/pedidosDB.js y data/productosDB.js)
//Pastelería Mil Sabores

//Deja el correo sin espacios y en minúsculas (" Ana@Gmail.com " → "ana@gmail.com")
export const normalizarEmail = (email) => (email || '').trim().toLowerCase();

//Deja el RUT sin puntos ni guion (22.163.627-9 → 221636279)
export const limpiarRut = (rut) => (rut || '').replace(/[^0-9kK]/g, '').toUpperCase();

// Valor que identifica a un dato (ej: el correo de un usuario), sin espacios ni mayúsculas
const idDe = (dato, campoId) => String(dato?.[campoId] ?? '').trim().toLowerCase();

//Agrega a la lista guardada los datos iniciales que todavía no se han cargado
//(por ejemplo, una cuenta demo que se agregó al código después)
//Cada dato inicial se agrega una sola vez: si después se elimina, no vuelve a aparecer
const agregarIniciales = (clave, lista, listaInicial, campoId) => {
  const claveCargados = `${clave}_iniciales`;
  const yaCargados = JSON.parse(localStorage.getItem(claveCargados)) || [];
  const idsEnLista = lista.map((dato) => idDe(dato, campoId));

  const faltantes = listaInicial.filter((dato) => {
    const id = idDe(dato, campoId);
    return !yaCargados.includes(id) && !idsEnLista.includes(id);
  });

  const idsIniciales = listaInicial.map((dato) => idDe(dato, campoId));
  const todosCargados = [...new Set([...yaCargados, ...idsIniciales])];

  if (faltantes.length > 0) guardarLista(clave, [...lista, ...faltantes]);
  if (todosCargados.length !== yaCargados.length) guardarLista(claveCargados, todosCargados);

  return [...lista, ...faltantes];
};

//Lee una lista guardada en localStorage
//Si todavía no existe, guarda la lista inicial y devuelve una copia de ella
//Si se indica "campoId" (ej: 'email'), también agrega los datos iniciales que falten
export const leerLista = (clave, listaInicial = [], campoId = null) => {
  try {
    const raw = localStorage.getItem(clave);
    if (!raw) {
      guardarLista(clave, listaInicial);
      if (campoId) guardarLista(`${clave}_iniciales`, listaInicial.map((dato) => idDe(dato, campoId)));
      return [...listaInicial];
    }

    const lista = JSON.parse(raw);
    return campoId ? agregarIniciales(clave, lista, listaInicial, campoId) : lista;
  } catch (err) {
    console.error(`Error al leer "${clave}" de localStorage:`, err);
    return [...listaInicial];
  }
};

//Guarda una lista en localStorage
//Devuelve true si se guardó, o false si hubo un error (por ejemplo, almacenamiento lleno)
export const guardarLista = (clave, lista) => {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
    return true;
  } catch (err) {
    console.error(`Error al guardar "${clave}" en localStorage:`, err);
    return false;
  }
};
