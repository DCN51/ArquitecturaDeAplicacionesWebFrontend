import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { Geminiservice } from '../../../services/geminiservice';
import { MensajeChatDTO } from '../../../models/MensajeChatDTO';

@Component({
  selector: 'app-sesionclinicachatcomponent',
  imports: [FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './sesionclinicachatcomponent.html',
  styleUrl: './sesionclinicachatcomponent.css',
})
export class Sesionclinicachatcomponent implements OnInit {
  @ViewChild('conversacion') conversacion?: ElementRef<HTMLDivElement>;

  idSesion: number = 0;
  mensajes: MensajeChatDTO[] = [];   // la conversación vive solo en la pantalla
  texto: string = '';                // lo que el paciente está escribiendo
  escribiendo: boolean = false;      // la IA está respondiendo
  bloqueado: boolean = false;        // la sesión no existe o ya terminó
  mensaje: string = '';

  constructor(
    private scS: Sesionclinicaservice,
    private gS: Geminiservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.idSesion = Number(this.route.snapshot.paramMap.get('id'));

    // Revisar que la sesión exista y siga en curso
    this.scS.listId(this.idSesion).subscribe({
      next: (data) => {
        if (data.estado !== 'en_curso') {
          this.bloquear('Esta sesión ya fue finalizada');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.bloquear(err.status === 404 ? 'No existe la sesión' : 'Ocurrió un error al cargar la sesión');
        this.cdr.detectChanges();
      }
    });
  }

  // Chat con la IA: el front llama directo a la API de Gemini (como el ejemplo de la profesora)
  enviarMensaje(): void {
    const texto = this.texto.trim();
    if (!texto || this.escribiendo || this.bloqueado) {
      return;
    }

    const historial = [...this.mensajes];   // la conversación anterior, sin el mensaje nuevo
    this.mensajes.push({ rol: 'paciente', texto: texto });
    this.texto = '';
    this.mensaje = '';
    this.escribiendo = true;
    this.bajarConversacion();

    this.gS.enviarMensaje(historial, texto).subscribe({
      next: (data) => {
        const respuesta = this.leerRespuesta(data);
        this.escribiendo = false;
        if (respuesta) {
          this.mensajes.push({ rol: 'ia', texto: respuesta });
        } else {
          this.devolverMensaje(texto);
          this.mensaje = 'La IA no pudo responder ese mensaje. Intenta escribirlo de otra forma.';
        }
        this.bajarConversacion();
      },
      error: (err) => {
        console.log(err);
        this.escribiendo = false;
        this.devolverMensaje(texto);
        if (err.status === 429) {
          this.mensaje = 'Se alcanzó el límite de mensajes de la IA. Intenta más tarde.';
        } else if (err.status === 400 || err.status === 403) {
          this.mensaje = 'La API key o el modelo de Gemini no son válidos.';
        } else if (err.status === 404) {
          this.mensaje = 'El modelo de Gemini configurado no existe. Revisa el nombre del modelo.';
        } else if (this.gS.estaSaturado(err)) {
          this.mensaje = 'La IA está ocupada en este momento. Intenta de nuevo en unos segundos.';
        } else {
          // se muestra el código para saber qué pasó (0 = sin conexión)
          this.mensaje = `El asistente no está disponible en este momento (error ${err.status})`;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Gemini devuelve el texto en candidates[0].content.parts
  private leerRespuesta(data: any): string {
    const partes: any[] = data?.candidates?.[0]?.content?.parts ?? [];
    return partes
      .filter(p => p.text && !p.thought)
      .map(p => p.text)
      .join('')
      .trim();
  }

  // Si falla, se quita el mensaje sin respuesta y se devuelve al campo para reintentar
  private devolverMensaje(texto: string): void {
    this.mensajes.pop();
    this.texto = texto;
  }

  // Enter envía; Shift + Enter hace salto de línea
  alPresionarEnter(evento: Event): void {
    const tecla = evento as KeyboardEvent;
    if (!tecla.shiftKey) {
      tecla.preventDefault();
      this.enviarMensaje();
    }
  }

  private bloquear(texto: string): void {
    this.bloqueado = true;
    this.mensaje = texto;
  }

  private bajarConversacion(): void {
    this.cdr.detectChanges();
    const caja = this.conversacion?.nativeElement;
    if (caja) {
      caja.scrollTop = caja.scrollHeight;
    }
  }
}
