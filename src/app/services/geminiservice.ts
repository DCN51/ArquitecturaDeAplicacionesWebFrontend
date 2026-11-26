import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { gemini } from '../../environments/gemini';
import { MensajeChatDTO } from '../models/MensajeChatDTO';

@Injectable({
  providedIn: 'root',
})
export class Geminiservice {
  private apiURL = `https://generativelanguage.googleapis.com/v1beta/models/${gemini.model}:generateContent`;

  private instrucciones = `Eres el asistente de acompañamiento emocional de Mind Health, una aplicación de salud mental.
Respondes siempre en español, con calidez, empatía y sin juzgar.
Escucha a la persona, valida lo que siente y haz preguntas abiertas para entenderla mejor.
Puedes sugerir actividades sencillas de bienestar (respiración, caminar, escribir lo que siente, hablar con alguien de confianza).
No eres psicólogo ni médico: no diagnosticas enfermedades ni recomiendas medicamentos.
Si la persona menciona querer hacerse daño, quitarse la vida o estar en peligro, responde con calma, anímala a buscar ayuda inmediata con alguien cercano y a llamar a la Línea 113 (opción 5) o al SAMU 106 en Perú, y dile que un psicólogo de Mind Health puede acompañarla.
Responde de forma breve: máximo 120 palabras.`;

  constructor(private http: HttpClient) { }

  enviarMensaje(historial: MensajeChatDTO[], mensaje: string): Observable<any> {
    const contenidos = [...historial.slice(-20), { rol: 'paciente', texto: mensaje }]
      .map(m => ({
        role: m.rol === 'ia' ? 'model' : 'user',
        parts: [{ text: m.texto }]
      }));

    const cuerpo = {
      system_instruction: { parts: [{ text: this.instrucciones }] },
      contents: contenidos
    };

    const headers = new HttpHeaders({ 'x-goog-api-key': gemini.apiKey });
    return this.http.post(this.apiURL, cuerpo, { headers });
  }
}
