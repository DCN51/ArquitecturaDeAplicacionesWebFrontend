import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError, timeout, timer } from 'rxjs';
import { gemini } from '../../environments/gemini';
import { MensajeChatDTO } from '../models/MensajeChatDTO';

@Injectable({
  providedIn: 'root',
})
export class Geminiservice {
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';

  // Modelo de respaldo: si el modelo principal está saturado (503), responde este.
  // Flash-Lite es el más liviano y el que menos se satura.
  private modeloRespaldo = 'gemini-3.5-flash-lite';

  // Instrucciones fijas para la IA: cómo debe comportarse en Mind Health
  private instrucciones = `Eres el asistente de acompañamiento emocional de Mind Health, una aplicación de salud mental.
Respondes siempre en español, con calidez, empatía y sin juzgar.
Escucha a la persona, valida lo que siente y haz preguntas abiertas para entenderla mejor.
Puedes sugerir actividades sencillas de bienestar (respiración, caminar, escribir lo que siente, hablar con alguien de confianza).
No eres psicólogo ni médico: no diagnosticas enfermedades ni recomiendas medicamentos.
Si la persona menciona querer hacerse daño, quitarse la vida o estar en peligro, responde con calma, anímala a buscar ayuda inmediata con alguien cercano y a llamar a la Línea 113 (opción 5) o al SAMU 106 en Perú, y dile que un psicólogo de Mind Health puede acompañarla.
Responde de forma breve: máximo 120 palabras.`;

  constructor(private http: HttpClient) { }

  // Manda la conversación (anterior + mensaje nuevo) y devuelve la respuesta de Gemini
  enviarMensaje(historial: MensajeChatDTO[], mensaje: string): Observable<any> {
    const contenidos = [...historial.slice(-20), { rol: 'paciente', texto: mensaje }]
      .map(m => ({
        role: m.rol === 'ia' ? 'model' : 'user',   // Gemini usa "user" y "model"
        parts: [{ text: m.texto }]
      }));

    const cuerpo = {
      system_instruction: { parts: [{ text: this.instrucciones }] },
      contents: contenidos
    };

    // 1) Se intenta con el modelo principal; 2) si está saturado, no responde o llegó a su
    //    límite (429: el límite es por modelo), se intenta con el de respaldo
    return this.llamarModelo(gemini.model, cuerpo).pipe(
      catchError(err => (this.estaSaturado(err) || err.status === 429) && gemini.model !== this.modeloRespaldo
        ? this.llamarModelo(this.modeloRespaldo, cuerpo)
        : throwError(() => err))
    );
  }

  // Llama a un modelo de Gemini.
  // - Si no responde en 15 segundos, se corta (a veces se queda colgado cuando está saturado).
  // - Si responde 503/500 o falla la conexión (0), reintenta 1 vez a los 2 segundos.
  // - Los demás errores (429 límite, 400/403 key o modelo) no se reintentan.
  private llamarModelo(modelo: string, cuerpo: any): Observable<any> {
    const headers = new HttpHeaders({ 'x-goog-api-key': gemini.apiKey });
    return this.http.post(`${this.baseURL}/${modelo}:generateContent`, cuerpo, { headers }).pipe(
      timeout(15000),
      retry({
        count: 1,
        delay: (err) => [0, 500, 503].includes(err.status)
          ? timer(2000)
          : throwError(() => err)
      })
    );
  }

  // Saturado = 503/500, sin conexión (0) o se pasó el tiempo de espera
  estaSaturado(err: any): boolean {
    return [0, 500, 503].includes(err.status) || err.name === 'TimeoutError';
  }
}
