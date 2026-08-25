*Reestructura la secuencia del simulador.* 

Hagamos una interface limpia, donde se muestre una linea de tiempo bidireccional. La primera pantalla mostrara el inicio de la simulacion con una breve descripcion de lo que hara y dos botones para comenzar con la simulacion, uno para modelo lineal y otro para Lotka-Volterra.

En seguida mostrara la eleccion de los escenarios preestablecidos. A continuacion la seleccion de los parametros del modelo y un boton para comenzar con la simulacion. Durante todas las etapas se mostrara la linea de tiempo en la parte superior de la pantalla con dos flechas para avanzar y retroceder. En la linea de tiempo se ira mostrando el nombre de la etapa actual y una breve descripcion de lo que se mostrara en ella.

En la parte derecha se mostrara un resumen de la simulacion con la siguiente informacion:
- Nombre del modelo
- Estado actual de la simulacion
- Estado actual de los parametros
- Estado actual de los resultados

despues de los parametros se mostrara el cta para iniciar la simulacion, mostrando una animacion simple previa a la muestra de los resultados y graficos, que sera la simulacion propiamente dicha. Tambien en esta etapa se mostrara un resumen de los resultados de la simulacion, los graficos y un cta para descargar los resultados en formato csv y pdf.

finalmente se mostrara un resumen de la simulacion con la siguiente informacion:
- Nombre del modelo
- Estado actual de la simulacion
- Estado actual de los parametros
- Estado actual de los resultados
con dos opciones de repetir la simulacion cambiando los parametros o volver al inicio para elegir otro modelo.

puedes ver como funciona la simulacion aqui:
