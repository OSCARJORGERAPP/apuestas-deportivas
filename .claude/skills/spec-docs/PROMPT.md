Desarrollar un proyecto de apuestas deportivas con dos roles: administrador y participantes.
El administrador define las apuestas: equipo 1 vs equipo 2 ... equipo n-1 vs equipo n.
El administrador define también el valor de cada apuesta: valor apuesta 1 a valor apuesta n.
Los participantes apuestan a que gana uno de los dos equipos o hay empate y pueden participar en las apuestas que deseen.
El dinero recaudado en cada apuesta se repartirá proporcionalmente entre los participantes ganadores de cada apuesta.
Se usará la pasarela de pago REDSYS con la configuración de datos de prueba para pagar.
Los participantes se autenticarán con magic.
Para el envío de correos se usará mailhog.
Como base de datos se utilizará MongoDB nativa.
Los conjuntos a almacenar en MongoDB tendrán como mínimo los atributos que se fijan a continuación, pudiendo agregarse atributos adicionales que sean necesarios para cumplir los objetivos del proyecto:
    1. apuestas (equipo 1 vs equipo 2, valor ... equipo n-1 vs equipo n, cada apuesta con su valor, recaudación total de la apuesta, e índice de apuesta)
    2. participantes (indice, nombre, mail)
    3. valores apostados (id de participante,id de la apuesta, y valor apostado)
    4. Ganadores (id de la apuesta, id del participante ganador, valor ganado)
Se podrá consultar participantes y valores apostados a cada apuesta, apuestas con el valor individual de la apuesta, la recaudación total alcanzada, cantidad de ganadores y el valor para cada ganador.
El front end será con diseño profesional en tonos de grises y negros con fonts blancos y menú de navegación desde la landing page.
El menú de administrador contará además con opciones para reseteo de cada colección de datos.
El proyecto deberá contar con seed de datos para probar.
Para testear el proyecto se usará e2e con Playwright.
