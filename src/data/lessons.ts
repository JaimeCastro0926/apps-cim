import { LessonSlide, ClassifiableItem, InteractiveElement } from '../types';

export const LESSONS: LessonSlide[] = [
  {
    id: 'intro',
    title: '¡Misión Geométrica en el Reino Champiñón!',
    subtitle: 'Semana 1: Geometría en el Espacio',
    content: '¡Oh no! El malvado Bowser ha usado su cañón de distorsión dimensional para desestabilizar el castillo de la Princesa Peach. Todo en el universo está hecho de tres elementos fundamentales: Puntos, Rectas y Planos. ¡Ayuda a Mario y Luigi a comprender estos conceptos geométricos para reconstruir el Reino!',
    character: 'mario',
    characterDialogue: '¡Mamma mia! Necesitamos entender la geometría espacial para detener a Bowser. ¡Vamos a investigar juntos los bloques de construcción del espacio!',
    visualType: 'intro'
  },
  {
    id: 'point',
    title: 'El Punto en el Espacio',
    subtitle: 'El bloque de construcción más pequeño',
    content: 'Un punto es la unidad más simple de la geometría. No tiene tamaño, ni largo, ni ancho, ni alto: solo indica una posición exacta en el espacio. Siempre se representa con un círculo pequeño y se nombra con una letra MAYÚSCULA (por ejemplo, el Punto A).',
    character: 'toad',
    characterDialogue: '¡Hola! Piensa en una Moneda Dorada en el mapa, o en la punta de la bandera del castillo. ¡Esos representan puntos exactos!',
    visualType: 'point',
    conceptDetails: {
      definition: 'Un elemento geométrico adimensional (sin dimensiones) que describe una posición en el espacio.',
      notation: 'Se representa con una marca de cruz o punto y se nombra con una letra mayúscula: A, B, C...',
      marioExample: 'La punta de la corona de la Princesa Peach, una estrella brillante (Punto S), o la esquina de un bloque de interrogación.',
      realExample: 'La marca que deja un lápiz sobre un papel, la esquina de tu pupitre, o un grano de arena en la playa.'
    }
  },
  {
    id: 'line',
    title: 'La Recta en el Espacio',
    subtitle: 'Un camino infinito sin fin',
    content: 'Una recta es una sucesión infinita de puntos alineados en una misma dirección. No tiene curvas, tiene una sola dimensión (largo) y no tiene fin en ninguna de las dos direcciones. Se nombra con una letra minúscula (recta r) o por dos puntos que pertenezcan a ella (recta AB).',
    character: 'luigi',
    characterDialogue: '¡Mira esa tubería de metal recta! O el rayo láser verde que dispara el barco de Bowser... ¡Se extienden rectos hacia el infinito!',
    visualType: 'line',
    conceptDetails: {
      definition: 'Una línea continua que se extiende en una dimensión, sin curvas, compuesta por infinitos puntos.',
      notation: 'Se dibuja con flechas en ambos extremos (indica que no tiene fin) y se nombra con una letra minúscula (r, s, t) o mediante dos puntos: ↔AB.',
      marioExample: 'El cable infinitamente largo del teleférico de Donkey Kong, el mástil de la bandera de meta, o la trayectoria de un Bill Bala (Bullet Bill).',
      realExample: 'Un hilo tenso, el borde de una regla de medir, o las líneas pintadas en una carretera recta.'
    }
  },
  {
    id: 'plane',
    title: 'El Plano en el Espacio',
    subtitle: 'Superficies lisas sin límites',
    content: 'Un plano es una superficie lisa de dos dimensiones (largo y ancho) que se extiende infinitamente en todas las direcciones. No tiene grosor. Para definir un plano se necesitan al menos 3 puntos que no estén alineados. Se nombra con letras griegas como alfa (α), beta (β) o pi (π).',
    character: 'peach',
    characterDialogue: '¡Mi castillo tiene pisos muy lisos! La superficie del lago helado donde patinan los pingüinos es un gran ejemplo de plano.',
    visualType: 'plane',
    conceptDetails: {
      definition: 'Un objeto bidimensional (largo y ancho) infinito y perfectamente liso que contiene infinitos puntos y rectas.',
      notation: 'Se dibuja como un paralelogramo inclinado para dar perspectiva y se nombra con una letra griega (α, β, γ...) o mediante tres de sus puntos (Plano ABC).',
      marioExample: 'La superficie del mapa flotante del Reino, el piso de ladrillo de la pista de karts, o el cristal transparente del muro dimensional.',
      realExample: 'La pantalla de tu tableta, la superficie de una mesa de comedor, o una pared de tu aula.'
    }
  },
  {
    id: 'space_3d',
    title: 'Ubicación Espacial',
    subtitle: '¿Cómo nos movemos en el mundo 3D?',
    content: 'En un juego 2D clásico de Mario, solo te mueves a la izquierda o derecha (eje X) y saltas arriba o abajo (eje Y). ¡Pero en Mario Bros La Película, el mundo es 3D! Esto significa que se agrega una tercera dimensión: la profundidad (eje Z) que te permite ir hacia adelante y hacia atrás. ¡El espacio tridimensional une puntos, rectas y planos en el aire!',
    character: 'mario',
    characterDialogue: '¡Exacto! Cuando salto desde el puente (plano) hacia una tubería, me muevo en tres direcciones en el espacio. ¡Eso es ubicación tridimensional!',
    visualType: 'space'
  },
  {
    id: 'examples',
    title: 'Del Aula al Reino Champiñón',
    subtitle: '¡Reconociendo la Geometría a nuestro alrededor!',
    content: 'La geometría espacial no está solo en los videojuegos, ¡está en todas partes! Aprendamos a identificar los elementos en nuestro entorno cotidiano comparándolos con el Reino de Mario. ¡Esto nos servirá para completar las misiones del taller!',
    character: 'toad',
    characterDialogue: '¡Hemos preparado una tabla comparativa genial para que entrenes tus ojos geométricos antes del gran taller!',
    visualType: 'examples'
  },
  {
    id: 'summary',
    title: '¡Resumen de Conceptos clave!',
    subtitle: '¡Listo para el desafío!',
    content: 'Ya has aprendido la teoría fundamental. Vamos a repasar rápidamente antes de entrar a las misiones interactivas para salvar el castillo de la Princesa Peach. ¡Consigue monedas doradas respondiendo correctamente!',
    character: 'mario',
    characterDialogue: '¡Excelente trabajo! Recuerda: un punto es una ubicación (A), una recta es una dirección infinita (r), y un plano es un suelo o pared infinito (α). ¡Es hora de jugar!',
    visualType: 'summary'
  }
];

export const COMPARISON_EXAMPLES = [
  {
    element: 'Punto',
    classroom: 'La esquina de tu pupitre, la punta del lápiz, el punto de la letra "i" en el tablero.',
    marioWorld: 'La esquina de un bloque de interrogación, una moneda en el aire, el centro de un champiñón.',
    feature: 'Sin tamaño, 0 dimensiones. Indica posición.'
  },
  {
    element: 'Recta',
    classroom: 'El borde de la pizarra, la varilla metálica de la cortina, la línea del suelo entre baldosas.',
    marioWorld: 'El mástil metálico de la bandera, el rayo láser de Bowser, un cable tensor de puente.',
    feature: 'Infinita, 1 dimensión (largo). Sin curvas.'
  },
  {
    element: 'Plano',
    classroom: 'La superficie lisa del tablero, la pared del salón, la superficie de tu cuaderno.',
    marioWorld: 'La plataforma flotante de ladrillos, el mapa digital del Reino, el lago helado de los pingüinos.',
    feature: 'Infinita, 2 dimensiones (largo y ancho). Superficie lisa.'
  }
];

export const CLASSIFICATION_ITEMS: ClassifiableItem[] = [
  { id: 'c1', name: 'Moneda Dorada Flotante', type: 'point', icon: '🪙', description: 'Representa una coordenada exacta en el aire.' },
  { id: 'c2', name: 'Plataforma de Ladrillos', type: 'plane', icon: '🧱', description: 'Una superficie plana sobre la cual puedes pararte y correr.' },
  { id: 'c3', name: 'Mástil de Bandera Metálico', type: 'line', icon: '🏁', description: 'Una barra rígida derecha que sube y baja verticalmente.' },
  { id: 'c4', name: 'Rayo Láser de Nave de Bowser', type: 'line', icon: '⚡', description: 'Un haz de luz destructor infinitamente recto.' },
  { id: 'c5', name: 'Superficie de Lava del Volcán', type: 'plane', icon: '🔥', description: 'Una superficie caliente tridimensional plana en la que flota el castillo.' },
  { id: 'c6', name: 'Estrella de Poder (Centro)', type: 'point', icon: '⭐', description: 'El centro geométrico donde brilla la super estrella.' },
  { id: 'c7', name: 'Esquina de Caja Sorpresa', type: 'point', icon: '❓', description: 'La intersección donde se juntan tres bordes del cubo.' },
  { id: 'c8', name: 'Borde Perfecto de Tubería Verde', type: 'line', icon: '🧪', description: 'El borde cilíndrico o el tramo largo vertical de la tubería.' },
  { id: 'c9', name: 'Pantalla de Navegación de la Nave', type: 'plane', icon: '🖥️', description: 'Muestra el mapa del mundo en una cara plana de cristal.' }
];

export const SEARCH_ITEMS: InteractiveElement[] = [
  {
    id: 's1',
    name: 'Estrella del Castillo',
    type: 'point',
    x: 48,
    y: 12,
    description: 'La punta superior de la estrella gigante en el techo representa un PUNTO exacto.',
    marioRef: 'Punto P (Peach)'
  },
  {
    id: 's2',
    name: 'Mástil de la Bandera',
    type: 'line',
    x: 85,
    y: 35,
    description: 'La barra del asta de la bandera representa una RECTA vertical continua.',
    marioRef: 'Recta m (Mástil)'
  },
  {
    id: 's3',
    name: 'Piso del Puente Flotante',
    type: 'plane',
    x: 50,
    y: 80,
    description: 'La superficie transitable del puente de piedra representa un PLANO horizontal.',
    marioRef: 'Plano π (Puente)'
  },
  {
    id: 's4',
    name: 'Viga de Soporte de Madera',
    type: 'line',
    x: 18,
    y: 65,
    description: 'Los troncos rectos que sostienen las plataformas representan RECTAS inclinadas.',
    marioRef: 'Recta s (Soporte)'
  },
  {
    id: 's5',
    name: 'Esquina del Bloque "? "',
    type: 'point',
    x: 35,
    y: 45,
    description: 'La esquina donde se encuentran las caras del Bloque Sorpresa representa un PUNTO en el aire.',
    marioRef: 'Punto B (Bloque)'
  },
  {
    id: 's6',
    name: 'Muro del Castillo de Peach',
    type: 'plane',
    x: 62,
    y: 40,
    description: 'La fachada frontal plana del castillo representa un PLANO vertical.',
    marioRef: 'Plano α (Fachada)'
  }
];
