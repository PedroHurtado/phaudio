#!/bin/bash

# Configuración
directorio_paquetes="./packages"
directorio_salida="./npm_packages"

# Crear directorio de salida si no existe
if [ ! -d "$directorio_salida" ]; then
  mkdir -p "$directorio_salida"
  echo "📁 Creado el directorio de salida: $directorio_salida"
fi

# Verificar que el directorio de paquetes existe
if [ ! -d "$directorio_paquetes" ]; then
  echo "❌ El directorio de paquetes no existe: $directorio_paquetes"
  exit 1
fi

# Iterar sobre los subdirectorios dentro del directorio de paquetes
for paquete in "$directorio_paquetes"/*; do
  if [ -d "$paquete" ] && [ -f "$paquete/package.json" ]; then
    paquete_nombre=$(basename "$paquete")
    echo "📦 Empaquetando: $paquete_nombre"

    # Ejecutar npm pack
    tarball=$(cd "$paquete" && npm pack 2>&1 | tail -n 1)

    if [ $? -eq 0 ] && [ -f "$paquete/$tarball" ]; then
      # Mover el archivo .tgz al directorio de salida
      mv "$paquete/$tarball" "$directorio_salida/"
      echo "✅ Empaquetado guardado en: $directorio_salida/$tarball"
    elif [ -f "$tarball" ]; then
      # Mover el archivo .tgz si se generó en el directorio actual
      mv "$tarball" "$directorio_salida/"
      echo "✅ Empaquetado guardado en: $directorio_salida/$tarball"
    else
      echo "❌ Error empaquetando $paquete_nombre: $tarball"
    fi
  else
    echo "⚠️  $paquete no contiene un package.json, omitiendo."
  fi

done

echo "🎉 Todos los paquetes han sido procesados."
