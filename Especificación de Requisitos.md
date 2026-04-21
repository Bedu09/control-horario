# Especificación de Requisitos de Software (ERS): Sistema de Control de Horarios y Liquidación Semanal

## 1\. Introducción

El objetivo de este documento es definir los requisitos funcionales y no funcionales para el desarrollo de una aplicación web dedicada a la gestión de tiempos de trabajo. La aplicación permitirá el registro preciso de la jornada laboral, incluyendo pausas y salidas, para realizar un cálculo automatizado de haberes basado en un valor por hora, considerando horas extras y jornadas incompletas.

## 2\. Descripción General del Sistema

El sistema permitirá a un usuario registrar sus eventos diarios (inicio, fin, pausas) y configurar parámetros financieros (valor hora). Al finalizar la semana, el sistema generará un resumen de horas trabajadas y el monto total a cobrar.

## 3\. Requisitos Funcionales (RF)

### RF-01: Gestión de Jornada Diaria

El sistema debe permitir el registro de los siguientes eventos con marca de tiempo (timestamp):

* **Entrada:** Inicio de la jornada laboral.  
* **Salida Almuerzo:** Inicio del tiempo de descanso para comida.  
* **Regreso Almuerzo:** Fin del tiempo de descanso.  
* **Otras Salidas:** Registro de pausas breves o salidas por trámites.  
* **Regreso de Pausas:** Reincorporación a la tarea.  
* **Salida Final:** Fin de la jornada laboral.

### RF-02: Configuración de Parámetros

* El usuario podrá definir una **jornada base** (por defecto: 6 horas).  
* El usuario podrá ingresar y actualizar el **valor de la hora laboral**.

### RF-03: Lógica de Cálculo de Horas

El sistema debe calcular automáticamente: | Concepto | Lógica de Cálculo | | :--- | :--- | | **Horas Netas** | Tiempo total entre Entrada y Salida Final, restando las pausas (comida y otras). | | **Horas Extras** | Diferencia positiva cuando las Horas Netas superan la jornada base (6h). | | **Horas Faltantes** | Diferencia negativa cuando las Horas Netas son menores a la jornada base. |

### RF-04: Liquidación Semanal

* Cálculo del total de horas trabajadas en la semana (lunes a domingo o rango personalizado).  
* Multiplicación de horas totales por el valor hora configurado.  
* Visualización del monto final a cobrar.

### RF-05: Histórico y Reportes

* Visualización de un historial de jornadas anteriores.  
* Capacidad de editar registros manuales en caso de olvido de marcación.

## 4\. Requisitos No Funcionales (RNF)

### RNF-01: Usabilidad y Diseño (UI/UX)

* **Interfaz Responsiva:** La aplicación debe ser accesible y funcional tanto en computadoras de escritorio como en dispositivos móviles.  
* **Simplicidad:** Botones de acción rápida para las marcaciones de tiempo (Check-in/Check-out).

### RNF-02: Tecnología Sugerida

* **Frontend:** React con Vite para asegurar un entorno de desarrollo rápido y eficiente.  
* **Almacenamiento:** Uso de LocalStorage para persistencia de datos local o una base de datos liviana (Firebase/Supabase) para acceso multidispositivo.

### RNF-03: Rendimiento

* La carga de la aplicación y el registro de eventos deben ser instantáneos (latencia inferior a 200ms).

## 5\. Estructura de Datos (Propuesta)

{

  "jornada": {

    "fecha": "2026-04-16",

    "eventos": \[

      {"tipo": "entrada", "hora": "08:00"},

      {"tipo": "pausa\_comida", "hora": "12:00"},

      {"tipo": "regreso\_comida", "hora": "12:45"},

      {"tipo": "salida", "hora": "14:45"}

    \],

    "total\_horas": 6.0,

    "extras": 0.0

  }

}

## 6\. Próximos Pasos

1. Definir el diseño de la interfaz (Mockups).  
2. Configurar el entorno de desarrollo con React y Vite.  
3. Implementar el módulo de lógica de tiempo (Date-fns o Day.js).  
4. Desarrollar la vista de resumen de liquidación.

