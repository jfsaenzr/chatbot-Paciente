/* 
    en el vídeo usamos "https://esm.run/@mlc-ai/web-llm"
    el problema es que eso siempre es la versión más reciente
    en el código usamos https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm
    para fijar la versión */

//import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm"
import { CreateWebWorkerMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.78/+esm"

const $ = el => document.querySelector(el)

// pongo delante de la variable un símbolo de $
// para indicar que es un elemento del DOM
const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')
const $info = $('small')
const $loading = $('.loading')

let messages = []
let end = false
let pregunta = "1"

const SELECTED_MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';// vram_required_MB: 879.04
//const SELECTED_MODEL = 'Llama-3-8B-Instruct-q4f32_1-MLC-1k' // vram_required_MB: 5295.7
//const SELECTED_MODEL = 'Llama-3-8B-Instruct-q4f32_1-MLC';// 

const engine = await CreateWebWorkerMLCEngine(
    new Worker('./worker.js', { type: 'module' }),
    SELECTED_MODEL,
    {
        initProgressCallback: (info) => {
            $info.textContent = info.text
            if (info.progress === 1 && !end) {
                end = true
                $loading?.parentNode?.removeChild($loading)
                $button.removeAttribute('disabled')
                addMessage("¡Hola!, soy HeonCare tu asistente Virtual. Estoy aquí para ayudarte con tu historia clinica y brindar la mejor atención posible. ¿Puedo hacerte unas preguntas rápidas para comenzar?", 'bot')
                $input.focus()
            }
        }
    }
)

$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const messageText = $input.value.trim()

    if (messageText !== '') {
        // añadimos el mensaje en el DOM
        $input.value = ''
    }

    addMessage(messageText, 'user')
    $button.setAttribute('disabled', '')

    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage)

    const chunks = await engine.chat.completions.create({
        messages,
        stream: true
    })

    let reply = ""

    const $botMessage = addMessage("", 'bot')

    /*for await (const chunk of chunks) {
        const choice = chunk.choices[0]
        const content = choice?.delta?.content ?? ""
        reply += content

        $botMessage.textContent = reply

    }*/

    if (pregunta == "1") {
        for await (const chunk of chunks) {
            $botMessage.textContent = "Perfecto, gracias por tu disposición. Ahora para empezar, por favor selecciona el número del tipo de documento con el que te identificas o del paciente a consultar: 1.Cédula Ciudadanía 2.Cédula Extranjería 3.Registro Civil de Nacimiento 4.Tarjeta Identidad 5.Pasaporte 6.Menor Sin Identificación"
            reply = "Perfecto, gracias por tu disposición. Ahora para empezar, por favor selecciona el número del tipo de documento con el que te identificas o del paciente a consultar: 1.Cédula Ciudadanía 2.Cédula Extranjería 3.Registro Civil de Nacimiento 4.Tarjeta Identidad 5.Pasaporte 6.Menor Sin Identificación"
        }
        pregunta = "2";

    } else if (pregunta == "2") {
        for await (const chunk of chunks) {
            $botMessage.textContent = "Por favor, indícanos el número de documento de tu tipo de documento seleccionado:"
            reply = "Por favor, indícanos el número de documento de tu tipo de documento seleccionado:"
        }
        pregunta = "3";

    } else if (pregunta == "3") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "Por favor, digita el código de cita que fue asignado:"
            reply = "Por favor, digita el código de cita que fue asignado:"
        }
        pregunta = "4";
    } else if (pregunta == "4") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "Paciente a validar: Pepito Perez, Documento entregado: 12345678, Cita agendada: Medicina General - Digita SI para confirmar datos."
            reply = "Paciente a validar: Pepito Perez, Documento entregado: 12345678, Cita agendada: Medicina General - Digita SI para confirmar datos."
        }
        pregunta = "5";
    } else if (pregunta == "5") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "Para empezar, voy a confirmar algunos datos básicos. Por favor indícame si la información que tengo es correcta o si necesitas actualizar algo. Nombre completo del paciente: Pepito Andres Perez Peláez Documento de identidad:C.C. 12345678 Fecha de nacimiento: 01 Enero 1984 Dirección de residencia: Calle 10 # 80 – 54 Bogotá Cundinamarca Numero de contacto: 3003010101 Persona de contacto en caso de emergencia: Maria Jose móvil. 3003020202 Digita SI, si la información es correcta, NO para actualizar información."
            reply = "Para empezar, voy a confirmar algunos datos básicos. Por favor indícame si la información que tengo es correcta o si necesitas actualizar algo. Nombre completo del paciente: Pepito Andres Perez Peláez Documento de identidad:C.C. 12345678 Fecha de nacimiento: 01 Enero 1984 Dirección de residencia: Calle 10 # 80 – 54 Bogotá Cundinamarca Numero de contacto: 3003010101 Persona de contacto en caso de emergencia: Maria Jose móvil. 3003020202 Digita SI, si la información es correcta, NO para actualizar información."
        }
        pregunta = "6";
    } else if (pregunta == "6") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Has sido diagnosticado con alguna enfermedad en el pasado o en la actualidad? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Has sido diagnosticado con alguna enfermedad en el pasado o en la actualidad? Si tu respuesta es sí, por favor especifica cuál."
        }
        pregunta = "7";
    } else if (pregunta == "7") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Has recibido tratamiento médico por alguna condición especifica en los últimos meses? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Has recibido tratamiento médico por alguna condición especifica en los últimos meses? Si tu respuesta es sí, por favor especifica cuál."
        }
        pregunta = "8";
    } else if (pregunta == "8") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Has tenido alguna cirugía importante? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Has tenido alguna cirugía importante?"
        }
        pregunta = "9";
    } else if (pregunta == "9") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Estas tomando algún medicamento actualmente? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Estas tomando algún medicamento actualmente?"
        }
        pregunta = "10";
    } else if (pregunta == "10") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Fumas o consumes alcohol con frecuencia? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Fumas o consumes alcohol con frecuencia? Si tu respuesta es sí, por favor especifica cuál."
        }
        pregunta = "11";
    } else if (pregunta == "11") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Realizas actividad física regularmente?"
            reply = "¿Realizas actividad física regularmente?"
        }
        pregunta = "12";
    } else if (pregunta == "12") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Tus abuelos, padres o hermanos han tenido alguna enfermedad? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Tus abuelos, padres o hermanos han tenido alguna enfermedad? Si tu respuesta es sí, por favor especifica cuál."
        }
        pregunta = "13";
    } else if (pregunta == "13") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Has presentado algún tipo de alergia a algún medicamento, alimento o sustancia en particular? Si tu respuesta es sí, por favor especifica cuál."
            reply = "¿Has presentado algún tipo de alergia a algún medicamento, alimento o sustancia en particular? Si tu respuesta es sí, por favor especifica cuál."
        }
        pregunta = "14";
    } else if (pregunta == "14") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Has experimentado estrés significativo recientemente?"
            reply = "¿Has experimentado estrés significativo recientemente?"
        }
        pregunta = "15";
    } else if (pregunta == "15") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Tienes apoyo familiar o social en momentos difíciles?"
            reply = "¿Tienes apoyo familiar o social en momentos difíciles?"
        }
        pregunta = "16";
    } else if (pregunta == "16") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "Cuéntame, ¿en que puedo ayudarte hoy, cuál es tú motivo de consulta para esta cita médica? IA"
            reply = "Cuéntame, ¿en que puedo ayudarte hoy, cuál es tú motivo de consulta para esta cita médica? IA"
        }
        pregunta = "17";
    } else if (pregunta == "17") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Desde cuándo has estado sintiéndote así? IA"
            reply = ""
        }
        pregunta = "18";
    } else if (pregunta == "18") {

        for await (const chunk of chunks) {
            $botMessage.textContent = "¿Ha cambiado algo recientemente en tú vida que pueda estar afectándote? IA"
            reply = "¿Ha cambiado algo recientemente en tú vida que pueda estar afectándote? IA"
        }
        pregunta = "";
    }

    else if (pregunta == "") {
        for await (const chunk of chunks) {
            const choice = chunk.choices[0]
            const content = choice?.delta?.content ?? ""
            reply += content

            $botMessage.textContent = reply
        }

    }

    console.log(messages);

    $button.removeAttribute('disabled')

    messages.push({
        role: 'assistant',
        content: reply,
    })

    $container.scrollTop = $container.scrollHeight

})



function addMessage(text, sender) {
    // clonar el template
    const clonedTemplate = $template.content.cloneNode(true)
    const $newMessage = clonedTemplate.querySelector('.message')

    const $who = $newMessage.querySelector('span')
    const $text = $newMessage.querySelector('p')

    $text.textContent = text
    $who.textContent = sender === 'bot' ? 'HeonCare' : 'Tú'
    $newMessage.classList.add(sender)

    $messages.appendChild($newMessage)

    $container.scrollTop = $container.scrollHeight

    return $text
}
